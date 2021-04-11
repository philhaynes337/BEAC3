const express = require('express');
const path = require('path');
const xss = require('xss');
const { checkUsersEmail } = require('./jwtAuth-Service');
const jwtAuthService = require('./jwtAuth-Service');


const jwtRouter = express.Router();
const jsonParser = express.json();



jwtRouter
    .route('/')
    .get((req, res, next) => {
         jwtAuthService.getJwtUsers(
             req.app.get('db')
             )
         .then(users => {
             res.json(users)
            
         })
         .catch(next)
       
    })
    .post(jsonParser, (req, res, next) => {
        const { user_name, user_email, user_password } = req.body;
 
        for (const field of ['user_name', 'user_email', 'user_password']) {
            
            if (!req.body[field]) {
                return res.status(400).send({
                    error: { message: `'${field}' is required`}
                })
            }
        


        }

        jwtAuthService.checkUsersName(
            req.app.get('db'),
            user_name
        )
            .then(checkUsersName => {
                
                if (checkUsersName)
                    return res.status(400).json({ error: `User Name is already taken` })
            
                    return jwtAuthService.hashedPassword(user_password).then(hashedPassword => {
                        const newUser = {
                            user_name,
                            user_password: hashedPassword,
                            user_email,
                        };
                        return jwtAuthService.addJwtUsers(
                            req.app.get('db'), newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl))
                                    .send('User Added')
                                    .json(user)
                                    

                                }
                               
                            );

                    });

              
            })
            

        jwtAuthService.addJwtUserData(
            req.app.get('db'),
            user_name,
            user_email
        )
        .then(user => {
            res.status(201).json(user)
        })
        .catch(next)

    
    });


    module.exports = jwtRouter
