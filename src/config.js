module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN || 'testtoken',
    DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/jwtauthdb',
    JWT_SECRET: process.env.JWT_SECRET || 'test',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
}