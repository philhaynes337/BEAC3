const express = require('express');
const path = require('path');
const jwtAuthService = require('./jwtAuth-Service');

const jwtRouter = express.Router();
const jsonParser = express.json();


jwtRouter
    .route('/:user_name')
    .all((req, res, next) => {
        const { user_name } = req.params
        
        jwtAuthService.getByUserName(
            req.app.get('db'),
            user_name
            
        )
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: { message: `User Not Found`}
                })
            }
            res.user = user
            next()
        })
        .catch(next)
    })
    .get((req, res) => {
        res.json(res.user)
    })

jwtRouter
    .route('/:user_name/editobs')
    .get((req, res, next) => {
        res.send('Nothing to see here')
    })
    .patch(jsonParser, (req, res, next) => {
        const { id, user, obs_date_time, icao, wind, vis, clouds, wx, tmp, dp, remarks } = req.body;
        
        const updateID = { id }
        const updateUser = { user }

        const updateData = { obs_date_time, icao, wind, vis, clouds, wx, tmp, dp, remarks }

        jwtAuthService.updateObs(
            req.app.get('db'),
            updateID,
            updateUser,
            updateData
        )
        .then(res.send('Observation Updated'))
        .catch(error => {
            console.log(error)
            res
                .status(404)
                .send({message: `Error while updating Observation code 101`})
        })
    })

jwtRouter
    .route('/:user_name/deleteobs')
    .get((req, res, next) => {
        res.send('Nothing to see here')
    })
        .delete(jsonParser, (req, res, next) => {
            const { id, user, user_email} = req.body;
            const delObs = { id }            

            jwtAuthService.delObs(
                req.app.get('db'),
                delObs,
                user
            )
            .then(res.send('Observation Deleted'))
            .catch(error => {
                console.log(error)
                res
                    .status(404)
                    .send({message: `Error while Logged-In Code 116`})
            })
        })


jwtRouter
    .route('/:user_name/addobs')
        .post(jsonParser, (req, res, next) => {

            const { user_email, obs_date_time, icao, user, wind, vis, clouds, wx, tmp, dp, remarks } = req.body;
            const newObs = { user_email, obs_date_time, icao, wind, vis, clouds, wx, tmp, dp, remarks }

            jwtAuthService.addObsData(
                req.app.get('db'),
                newObs,
                user
            )
            .then(res.send('Observation Sent'))
            .catch(error => {
                console.log(error)
                res
                .status(404)
                .send({message: `Error while Logged-In Code 138`})
            })
        }) 
        .get((req, res, next) => {
            res.send('Nothing to see here')
        })   

jwtRouter
    .route('/')
    .get((req, res, next) => {
        jwtAuthService.getLoggedInUserInfo(
        req.app.get('db')
        )
    .then(loggedInUser => {
        res.json(loggedInUser)
        console.log(loggedInUser)

    })
    .catch(next)
    })



module.exports = jwtRouter