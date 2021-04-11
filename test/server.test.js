const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const jwt = require('jsonwebtoken')

describe('Test BEAC3 Endpoints', function () {
    let db;

    let token = process.env.API_TOKEN

    let data = [
        {"icao": "KDFW", "obs_date_time": "04/10/2021 04:30PM CST", "wind": "18005G20KT", "vis": "05SM", "clouds": "OVC001", "tmp": "10", "dp": "09", "remarks": "Test Remarks!", "user_email": "test@test.com"}
    ]

    before('Knex Instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    });
    //console.log(process.env.TEST_DATABASE_URL);

    before('Sweep', () => db.raw('TRUNCATE TABLE testme RESTART IDENTITY;'));

    afterEach('Sweep again', () => db.raw('TRUNCATE TABLE testme RESTART IDENTITY;'));

    after('Disconnect from test', () => db.destroy());

    describe('Test Bearer Token', () => {
        it('No Bearer Token', () => {
            return supertest(app)
                .get('/loggedin/testme')
                .expect(401)
        })
        it('With Bearer Token', () => {
            return supertest(app)
                .get('/loggedin/testme')
                .set({"Authorization": `Bearer ${token}`})
                .expect(200)
        })
    })

    describe('GET User Data', () => {
        beforeEach('insert test data', () => {
            return db('testme').insert(data);           
        })

        it('Get the test user data and status 200', function () {
            return supertest(app)
                .get('/loggedin/testme')
                .set({"Authorization": `Bearer ${token}`})
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.a('array');
                    //expect(res.body).to.have.length(data.length);
                    res.body.forEach((item) => {
                        expect(item).to.be.a('object');
                        expect(item).to.include.keys('id', 'icao', 'obs_date_time', 'wind', 'vis', 'clouds', 'tmp', 'dp', 'remarks')
                    })
                    
                })
        })

        it('Return 404 with bad User Name', () => {
            return supertest(app)
                .get('/loggedin/testmeeeeeee')
                .set({"Authorization": `Bearer ${token}`})
                .expect(404)
        })

    })

        describe('Test Post of Data', function () {
            it('Create new data entry', function () {
                const newData = {
                    "icao": "RJTY", "obs_date_time": "04/03/2021 04:30PM CST", "wind": "18012G20KT", "vis": "05SM", "clouds": "OVC001", "tmp": "10", "dp": "09", "remarks": "Test Remarks!", "user_email": "test@test.com"
                };

                return supertest(app)
                    .post('/loggedin/testme')
                    .set({"Authorization": `Bearer ${token}`})
                    .send(newData)
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.be.a('array');
                    })
            })
            it('Respond 400 with bad data', function () {
                const badData = {
                    "icoa": "RKSO"
                };
                return supertest(app)
                    .post('/loggedin/testme/addobs')
                    .set({"Authorization": `Bearer ${token}`})
                    .send(badData)
                    .expect(400);
            })

        })

    describe('Update / Patch Data', function () {

        beforeEach('insert data', function () {
            return db('testme').into('testme').insert(data)
        })

        it('Should update user data', function () {
            const updateData = {
                "user": "testme", "id": "1", "icao": "RKSO", "obs_date_time": "04/03/2021 04:30PM CST", "wind": "18012G20KT", "vis": "05SM", "clouds": "OVC001", "tmp": "10", "dp": "09", "remarks": "Test Remarks!", "user_email": "test@test.com"
            };


            return supertest(app)
                .patch('/loggedin/testme/editobs')
                .set({"Authorization": `Bearer ${token}`})
                .send(updateData)
                .expect(200)
                .then(res => {                   
                    supertest(app)
                        .get('/loggedin/testme/editobs')
                        .set({"Authorization": `Bearer ${token}`})
                        .expect(updateData)
                })
                


        })
    })

    describe('Delete Data', function () {
        beforeEach('insert data', function () {
            return db('testme').insert(data)
        })

        it('Should delete user data', function () {
            const toDeleteData = {
                "id": "1",
                "user": "testme",
            };

            return supertest(app)
                .delete('/loggedin/testme/deleteobs')
                .set({"Authorization": `Bearer ${token}`})
                .send(toDeleteData)
                .expect(204)
        })
    })

    describe('Add User', () => {
        beforeEach('Delete Test Table', () => db.raw('DROP TABLE IF EXISTS testme123;'));
        it('Should add new user', () => {
            const newUser = {
                "user_name": "testme123",
                "user_email": "test@test123.com",
                "user_password": "test1234",
            }
            return supertest(app)
                .post('/register')
                .set({"Authorization": `Bearer ${token}`})
                .send(newUser)
                .expect(201)
        })
    }) 

    describe('Logged In User', () => {
        beforeEach('Add Auth User', () => db.raw(`INSERT INTO users (user_name, user_password, user_email) VALUES ('testme', 'testme123', 'test123@test123.com');`))
        afterEach('Delete Auth User', () => db.raw(`DELETE FROM users WHERE user_name='testme';`))


        it('Should not log in user. Should return 401', () => {

            const loggedInBadUser = {
                "user_name": "testme",
                "user_password": "testme123456789"
            }

            return supertest(app)
                .post('/login')
                .set({"Authorization": `Bearer ${token}`})
                .send(loggedInBadUser)
                .expect(401)
        })
  
        it('Should log in user.', () => {
        const loggedInUser = {
            "user_name": "TestName",
            "user_password": "password"
        }

        const expectedToken = jwt.sign(
            { user_name: "TestName" },
            process.env.JWT_SECRET,
            {
                subject: "TestName",
                algorithm: 'HS256',
            }
        )
        console.log(expectedToken)

        return supertest(app)
            .post('/login')
            .set({"Authorization": `Bearer ${token}`})
            .send(loggedInUser)
            .expect(200, {
                authToken: expectedToken,
            })
        })
    })





})