const required = ['MONGO_URI', 'JWT_SECRET'];

const validateEnv = () => {
  if (process.env.NODE_ENV === 'test') return;
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
};

module.exports = { validateEnv };
