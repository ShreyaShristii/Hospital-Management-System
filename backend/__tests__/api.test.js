process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-123';
process.env.RAZORPAY_KEY_SECRET = 'rzp-secret';

jest.mock('../models/User');
jest.mock('../models/Patient');
jest.mock('../models/Bill');

const request = require('supertest');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Bill = require('../models/Bill');
const crypto = require('crypto');
const app = require('../app');
const { signToken } = require('../services/tokenService');

const mockAuthUser = (role, isActive = true) => {
  const chain = { select: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue({ _id: 'u1', role, isActive }) };
  User.findById.mockReturnValue(chain);
};
const bearer = (role) => `Bearer ${signToken({ _id: 'u1', role })}`;

const validRegistration = {
  name: 'Jane Doe', username: 'jane_doe', email: 'jane@example.com', password: 'Passw0rdOk',
  age: 30, gender: 'Female', contactNumber: '123', emergencyContact: '456',
};

beforeEach(() => jest.clearAllMocks());

describe('platform endpoints', () => {
  it('GET /api/health reports status JSON (503 when the DB is down)', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(503);
    expect(res.body).toMatchObject({ status: 'degraded', db: 'disconnected' });
  });

  it('returns a JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: 'Endpoint not found' });
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send('{bad');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/register', () => {
  it('rejects invalid input with field-level details', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'nope', password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.details.map((d) => d.field)).toEqual(expect.arrayContaining(['email', 'password', 'username']));
  });

  it('never lets a client choose its role (privilege escalation)', async () => {
    User.create.mockResolvedValue({ _id: 'new-user' });
    Patient.create.mockResolvedValue({});
    const res = await request(app).post('/api/auth/register').send({ ...validRegistration, role: 'admin' });
    expect(res.status).toBe(201);
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'patient' }));
  });

  it('maps duplicate keys to 409', async () => {
    User.create.mockRejectedValue(Object.assign(new Error('dup'), { code: 11000, keyPattern: { email: 1 } }));
    const res = await request(app).post('/api/auth/register').send(validRegistration);
    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Duplicate email');
  });
});

describe('POST /api/auth/login', () => {
  it('returns the same 401 for unknown user and wrong password', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com', password: 'whatever1' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});

describe('authentication and authorization', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects a tampered token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer abc.def.ghi');
    expect(res.status).toBe(401);
  });

  it('rejects a valid token for a deactivated user', async () => {
    mockAuthUser('patient', false);
    const res = await request(app).get('/api/auth/me').set('Authorization', bearer('patient'));
    expect(res.status).toBe(401);
  });

  it('blocks non-admins from creating staff accounts', async () => {
    mockAuthUser('patient');
    const res = await request(app).post('/api/auth/staff-accounts').set('Authorization', bearer('patient')).send({});
    expect(res.status).toBe(403);
  });

  it('rejects malformed ObjectId params before reaching the database', async () => {
    mockAuthUser('admin');
    const res = await request(app).get('/api/patients/not-an-id').set('Authorization', bearer('admin'));
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid id');
  });
});

describe('payments', () => {
  it('rejects a bad payment signature without touching bills', async () => {
    mockAuthUser('patient');
    const res = await request(app).post('/api/payments/verify').set('Authorization', bearer('patient'))
      .send({ razorpay_order_id: 'o1', razorpay_payment_id: 'p1', razorpay_signature: 'forged' });
    expect(res.status).toBe(400);
    expect(Bill.findOne).not.toHaveBeenCalled();
  });

  it('resolves the bill from the order id, not a client-supplied billId', async () => {
    mockAuthUser('admin');
    const sig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update('o1|p1').digest('hex');
    const bill = { _id: 'b1', paymentStatus: 'Paid' };
    Bill.findOne.mockResolvedValue(bill);
    Bill.findById.mockReturnValue({ populate: jest.fn().mockReturnThis(), then: (r) => r(bill) });

    const res = await request(app).post('/api/payments/verify').set('Authorization', bearer('admin'))
      .send({ razorpay_order_id: 'o1', razorpay_payment_id: 'p1', razorpay_signature: sig, billId: 'other' });
    expect(res.status).toBe(200);
    expect(Bill.findOne).toHaveBeenCalledWith({ razorpayOrderId: 'o1' });
  });
});
