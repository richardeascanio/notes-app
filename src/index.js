const express = require('express');
const path = require('path'); 
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Initializations
const app = express();
require('./database');
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 3000);  //hacer que el puerto de mi app corra en el 3000 o en el que tenga la nube por defecto
app.set('views', path.join(__dirname, 'views')) //__dirname devuelve el entorno donde se encuentra el archivo (en este caso src) y lo concatenamos con la carpeta view haciendo que node sepa donde se encuentran nuestras vistas
app.engine('.hbs', exphbs({  //configurando nuestros archivos de vistas (en este caso no son html sino hbs de handlebars)
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({entended: false}));
app.use(methodOverride('_method')); //el metodo methodOverride sirve para que los formularios puedan utilizar otros metodos a parte de post y get sino put y delete
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listening
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})