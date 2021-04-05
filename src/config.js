module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN || 'testtoken',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/jwtauthdb',
    // DATABASE: {
    //     type: "postgres",
    //     host: process.env.HOST,
    //     port: 5432,
    //     username: process.env.USERNAME,
    //     password: process.env.PASSWORD,
    //     database: process.env.DATABASE,
    //     ssl: true,
    //     extra: {
    //         ssl: {
    //             rejectUnauthorized: false,
    //         }
    //     }
    // },
    JWT_SECRET: process.env.JWT_SECRET || 'test',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
}