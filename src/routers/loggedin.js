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
                return res.status(404).send('User Not Found')
            }
            res.user = user
            res.json(res.user)

        }) 

        .catch(err => {

            res.status(404).send('error - user not found')
        })
    })
    .get((req, res, next) => {
        console.log('got to the get')
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
        .then(res.status(200).send('Observation Updated'))
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
            .then(res.status(204).send('Observation Deleted'))
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

            for (const [key, value] of Object.entries(newObs))
                if (value == null)
                    return res.status(400).json({
                        error: { message: `Missing ${key}`}
                    })


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
        res.send('End Point').status(201)
    })



module.exports = jwtRouter