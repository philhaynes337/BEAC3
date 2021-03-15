const express = require('express');
const AuthService = require('./auth-service.js');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post('/', jsonBodyParser, (req, res, next) => {
    const { user_name, user_password } = req.body;
    const loginUser = { user_name, user_password };

    for (const [key, value] of Object.entries(loginUser))
        if (value == null)
            return res.status(400).json({
                error: `Missing '${key} in request body`
            });

    AuthService.getUserWithUserEmail(req.app.get('db'), loginUser.user_name)
            .then(user => {
                if (!user)
                    return res.status(400).json({
                        error: 'Incorrect User Email or Password'
                    });

                return AuthService.comparePasswords(
                    loginUser.user_password,
                    user.user_password
                )
                    .then(compareMatch => {
                        if (!compareMatch)
                            return res.status(401).json({
                                error: 'Incorrect User Email or Password'
                            });

                        const sub = user.user_name;
                        const payload = { user_id: user.id };

                        res.send({
                            authToken: AuthService.createJwt(sub, payload),
                            userid: user.id
                        });

                    });

            })
            .catch(next)

});

module.exports = authRouter