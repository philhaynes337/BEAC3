const bcrypt = require("bcryptjs");

const jwtAuthService = {
    updateObs(knex, updateID, updateUser, updateData) {
        return knex(updateUser)
        .where(updateID)
        .update(updateData)
    },
    delObs(knex, delObs, user) {
        return knex(user)
        .where(delObs)
        .delete();
    },
    addObsData(knex, newObs, user) {
        
        return knex(user)
        .insert(newObs)
        .returning('*')
        .then(rows => rows[0])
    },
    getJwtUsers(knex) {
        return knex.select('*').from('users')
    },
    addJwtUsers(knex, newUser) {
        return knex
            .insert(newUser)
            .into('users')
    },
    addJwtUserData(knex, user_name, user_email) {
        return Promise.all([
            knex
            .schema
            .createTable(user_name, userData => {
                userData.increments('id', { primaryKey: true })
                userData.string('icao')
                userData.string('obs_date_time')
                userData.string('wind')
                userData.string('vis')
                userData.string('clouds')
                userData.string('wx')
                userData.string('tmp')
                userData.string('dp')
                userData.string('remarks')
                userData.string('user_email')
            
            })
             .then(function(){
                 return knex(user_name)
                    .insert({
                        'user_email': user_email,
                        'icao': 'KATL',
                        'obs_date_time': '161855Z',
                        'wind': '10015G25KT',
                        'vis': '2SM',
                        'clouds': 'SKC FEW001 SCT050 BKN100 OVC200',
                        'wx': '+TSRA FG',
                        'tmp': '10',
                        'dp': '09',
                        'remarks': 'This is ONLY an example!'
                    })
                .catch(err => {
                    console.log(err)
                })
             })
        ])
            
    },
    checkUsersName(knex, user_name) {
        return knex
            .select('*')
            .from('users')
            .where({user_name})
            .first()
            .then(name => !!name)
            
    },
    hashedPassword(user_password) {

        return bcrypt.hash(user_password, 12);

    },
    checkUsersName(knex, user_name) {
        return knex
            .select('*')
            .from('users')
            .where({user_name})
            .first()
            .then(user => !!user)

    },
    setLoggedInUser(knex, logged_user) {
        const userId = knex.select('*').from('users').innerJoin('users_info', 'users.user_id', 'users_info.user_id')

        return knex
        .select('*')
        .from('users')
        .innerJoin('users_info', 'users.user_id', 'users_info.user_id')
        .where({'users_info.user_email': logged_user.user_email})
        .insert(logged_user)
        .into('session_logged_in')

    },

    getuserId(knex, user_email) {
        const getUserEmail = user_email;
        console.log('jwtAuth(52) Made it to the Service: ' + user_email)
         return knex
             .select('*')
             .from('users')
             .innerJoin('session_logged_in', 'users.user_id', 'session_logged_in.user_id')
             .innerJoin('users_info', 'users.user_id', 'users_info.user_id')
             .where('user_email', user_email)
                  
    },
    getByUserName(knex, user_name) {
        
        return knex
            .from(user_name)
            .select('*')
            .innerJoin('users', 'users.user_email', `${user_name}.user_email`)
            .then(rows => {
                return rows
            })
    }
}

module.exports = jwtAuthService