process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
require('dotenv').config()
const config = require('../src/config');

process.env.TEST_DATABASE_URL = config.TEST_DATABASE_URL
process.env.API_TOKEN = config.API_TOKEN
process.env.JWT_SECRET = 'test'

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest