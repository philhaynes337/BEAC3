Weather Vision API
==================
[Click Here](https://weather-vision.vercel.app/ "Weather Vision") to visit the live app!
------------------
Information
------------------
The app requires a beaer token to access the API data. Database is hosted with heroku's dev hobby plan.
------------------
END POINTS
-
/register
This endpoint uses 2 methods (GET, and POST). When you register as a new user it will check the database for a user with the same e-mail address 
then it will POST the new user data into the database. The endpoint will also create the first observation for the user as a reference.
-
/login
This endpoint uses the POST method. It allows the user to login and give the user a JWT token.
-
/loggedin
takes the user name IE. loggedin/:user_name and allows the user to access their information. There are more end points here use POST, GET, PATCH, and DELETE methods.
/loggedin/:user_name/editobs lets the user update current observations.
/loggedin/:user_name/addobs allows the user to added observations.
/loggedin/:user_name/deleteobs allows the user to delete a observation.
-
Technology Used
--------------------
This app was created using JavaScript, knex, express, jsonwebtoken, bcryptjs, and postgres.
