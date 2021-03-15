require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const validateBearerToken = require('./validate-bearer-token');
// put require routers here const router = require('pathtorouter');
const jwtAuthRoute = require('./routers/jwtAuth');
const jwtLoginRoute = require('./auth/auth-router');
const LoggedIn = require('./routers/loggedin');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
}))

app.use(cors());
app.use(helmet());
app.use(validateBearerToken);

//start app.use routers app.use('/path/website', const=here)
app.use('/register', jwtAuthRoute);
app.use('/login', jwtLoginRoute);
app.use('/loggedin', LoggedIn);


app.get('/', (req, res) => {
    res.send('Backend Auth Server Connected')
})

module.exports = app