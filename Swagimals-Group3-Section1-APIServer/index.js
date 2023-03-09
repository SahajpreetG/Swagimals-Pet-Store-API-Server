const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const app = express();
app.use(express.json());

//to read request, else will give {}
app.use(express.urlencoded({ extended: true }));

//import and enable CORS
var cors = require('cors');
app.use(cors());

//Import routes




// Import .env file
require('dotenv').config();
const mongoString = process.env.DATABASE_URL
const myApiPort = process.env.MY_API_PORT;

//Server start

console.log(`My API Port ${myApiPort}`)

app.listen(myApiPort, () => {
    console.log(`****************** Server Started at ${myApiPort} ******************`)
})

// Connnect to mongoDB

mongoose.connect(mongoString, { useNewURLParser: true });
const database = mongoose.connection

// .on() runs if error
database.on('error', (error) => {
    console.log(error)
})

//.once() => it runs only 1 time
database.once('connected', () => {
    console.log('****************** => Swagimals Database Connected <= ******************')
})

const routes = require('./routes/routes');


const { jwtValidator } = require('./utilityFn/tokenVerification');

// app.all('*', jwtValidator);
app.use('/api',routes);
