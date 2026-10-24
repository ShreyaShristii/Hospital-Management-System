import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import axios from 'axios'
import { createServer } from 'vite'

const values = new Map()
const previousStorage = globalThis.localStorage
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
}

const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:5000/api'),
  },
  server: { middlewareMode: true, hmr: false },
})
const { loginUser, registerUser, updateUserProfile, default: reducer } =
  await server.ssrLoadModule('/src/features/auth/authSlice.js')
const originalAdapter = axios.defaults.adapter
const credentials = { email: 'demo@example.test', password: 'test-only-password' }
const invoke = async (thunk, data) => {
  const actions = []
  const result = await thunk(data)((action) => actions.push(action), () => ({}), undefined)
  return { result, state: reducer(undefined, result) }
}

after(async () => {
  axios.defaults.adapter = originalAdapter
  if (previousStorage === undefined) delete globalThis.localStorage
  else globalThis.localStorage = previousStorage
  await server.close()
})

test('login reports an unreachable API instead of losing the error', async () => {
  axios.defaults.adapter = async () => { throw new Error('Network Error') }
  const { result, state } = await invoke(loginUser, credentials)
  assert.equal(result.meta.requestStatus, 'rejected')
  assert.match(state.error, /Unable to reach the server/)
  assert.equal(state.isLoading, false)
})

test('login reports timeout failures', async () => {
  axios.defaults.adapter = async () => {
    throw Object.assign(new Error('timeout'), { code: 'ECONNABORTED' })
  }
  const { state } = await invoke(loginUser, credentials)
  assert.match(state.error, /too long to respond/)
})

test('plain-text rate limiting produces a useful error', async () => {
  axios.defaults.adapter = async () => {
    throw { response: { status: 429, data: 'Too many login attempts' } }
  }
  const { state } = await invoke(loginUser, credentials)
  assert.match(state.error, /15 minutes/)
})

test('server validation messages are preserved', async () => {
  axios.defaults.adapter = async () => {
    throw { response: { status: 400, data: { message: 'Invalid password' } } }
  }
  const { state } = await invoke(loginUser, credentials)
  assert.equal(state.error, 'Invalid password')
})

test('registration and profile updates also handle missing responses', async () => {
  axios.defaults.adapter = async () => { throw new Error('Network Error') }
  for (const thunk of [registerUser, updateUserProfile]) {
    const { state } = await invoke(thunk, credentials)
    assert.match(state.error, /Unable to reach the server/)
    assert.equal(state.isLoading, false)
  }
})

test('successful login stores only the token and uses a bounded request', async () => {
  values.clear()
  axios.defaults.adapter = async (config) => {
    assert.equal(config.timeout, 30000)
    assert.equal(config.url, 'http://localhost:5000/api/auth/login')
    return {
      data: { token: 'demo-token', user: { id: 'demo', role: 'patient' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }
  }
  const { result, state } = await invoke(loginUser, credentials)
  assert.equal(result.meta.requestStatus, 'fulfilled')
  assert.equal(state.user.id, 'demo')
  assert.deepEqual([...values], [['token', 'demo-token']])
  assert.equal(JSON.stringify(state).includes(credentials.password), false)
})
