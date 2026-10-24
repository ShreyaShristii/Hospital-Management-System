import assert from 'node:assert/strict'
import { test } from 'node:test'
import axios from 'axios'
import { setupAxios } from '../src/utils/setupAxios.js'

const values = new Map([['token', 'abc']])
globalThis.localStorage = {
  getItem: (k) => values.get(k) ?? null,
  setItem: (k, v) => values.set(k, v),
  removeItem: (k) => values.delete(k),
}

const dispatched = []
const store = { getState: () => ({ auth: { token: 'abc' } }), dispatch: (a) => dispatched.push(a) }
setupAxios(store, () => ({ type: 'auth/logout' }))

test('attaches the bearer token to outgoing requests', async () => {
  let seen
  await axios.get('http://x.test/api/ping', {
    adapter: async (config) => { seen = config.headers.Authorization; return { data: {}, status: 200, config, headers: {} } },
  })
  assert.equal(seen, 'Bearer abc')
})

test('dispatches logout on a 401 from a protected call', async () => {
  dispatched.length = 0
  await assert.rejects(axios.get('http://x.test/api/patients', {
    adapter: async (config) => { throw { config, response: { status: 401 } } },
  }))
  assert.deepEqual(dispatched, [{ type: 'auth/logout' }])
})

test('does not log out on a failed login attempt', async () => {
  dispatched.length = 0
  await assert.rejects(axios.post('http://x.test/api/auth/login', {}, {
    adapter: async (config) => { throw { config, response: { status: 401 } } },
  }))
  assert.equal(dispatched.length, 0)
})
