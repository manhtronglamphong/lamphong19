const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const numeral = require('numeral');
const bodyParser = require('body-parser');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
require('express-async-errors');
const config = require('./config/default.json');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //     secure: true
  // }
}))

app.use(express.static('public')); 

app.engine('hbs', exphbs({
    defaultLayout : 'main.hbs',
    layoutsDir : 'views/layouts',
    helpers: {
        format: val => numeral(val).format('0,0'),
        section: hbs_sections(),
    }
}));

app.set('view engine','hbs');

app.get('/about', (req , res) => {
    res.render('about');
})

require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

app.use((req, res, next) => {
    res.send('You\'re lost');
})
  
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('View error on console');
})

const PORT = config.host.port;

app.listen(process.env.PORT, () =>{
    console.log(`Server is running at http://localhost:${PORT}`);
})