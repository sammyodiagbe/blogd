'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const db = 'mongodb://localhost/blogdatabase';
const session = require('express-session');
const passport = require('passport');

require('./auth/passport')(passport)


mongoose.connect(db, { useNewUrlParser: true });

mongoose.connection.once('open', () => {
    console.log('connection has been made');
})

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
    secret: 'hfhadfhuhdfuufauifui7iuouo9389r8yhiugusafuyihasugui',
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('./routes/api'));
app.use(require('./routes/mainRoutes')(passport));



app.set('view engine', 'ejs');


// temporary routes

app.get('/', (req, res) => {
    res.render('index');
})

app.use((req, res) => {
    res.render('404');
})

app.listen(3000, () => {
    console.log('now listening on port 4000')
})