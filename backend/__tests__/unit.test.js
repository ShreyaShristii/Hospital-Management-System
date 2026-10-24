const escapeRegex = require('../utils/escapeRegex');
const AppError = require('../utils/AppError');
const { errorHandler } = require('../middlewares/errorMiddleware');

process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-123';
const { signToken, verifyToken } = require('../services/tokenService');
const jwt = require('jsonwebtoken');

describe('escapeRegex', () => {
  it('neutralizes regex metacharacters', () => {
    expect(escapeRegex('a.*(b)+')).toBe('a\\.\\*\\(b\\)\\+');
  });
  it('caps input length', () => {
    expect(escapeRegex('x'.repeat(500))).toHaveLength(100);
  });
});

describe('tokenService', () => {
  it('round-trips id and role', () => {
    const decoded = verifyToken(signToken({ _id: 'abc', role: 'doctor' }));
    expect(decoded).toMatchObject({ id: 'abc', role: 'doctor' });
  });
  it('rejects tokens signed with a different algorithm', () => {
    const forged = jwt.sign({ id: 'abc', role: 'admin' }, process.env.JWT_SECRET, { algorithm: 'HS512' });
    expect(() => verifyToken(forged)).toThrow();
  });
});

describe('errorHandler', () => {
  const run = (err) => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    errorHandler(err, { log: { error: jest.fn() } }, res, jest.fn());
    return res;
  };

  it('honours AppError status codes', () => {
    const res = run(new AppError('nope', 403));
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it('maps Mongoose CastError to 400', () => {
    const res = run(Object.assign(new Error('x'), { name: 'CastError', path: '_id' }));
    expect(res.status).toHaveBeenCalledWith(400);
  });
  it('hides internal messages in production', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const res = run(new Error('db password leaked'));
    process.env.NODE_ENV = prev;
    expect(res.json.mock.calls[0][0].message).toBe('Internal server error');
  });
});
