require('dotenv').config();
const express = require('express');
const { json } = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require("passport");
const massive = require('massive');
const Auth0Strategy = require('passport-auth0');
const { CONNECTION_STRING, SESSION_SECRET, DOMAIN, CLIENT_SECRET, CLIENT_ID } = process.env;
const port = process.env.PORT || 3002;
const mainCtrl = require("./controllers/mainCtrl");


//initialize express
const app = express();

//for production
app.use(express.static(`${__dirname}/../build`));

// Database Connection //
massive(CONNECTION_STRING)
  .then(db => {
    app.set("db", db);
  })
  .catch(err => {
   
  });

//Top Level Middlewares
//cors
app.use(cors());
//body-parser
app.use(json());
//session
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 100000
    }
  })
);

//auth0Strategy setup
app.use(passport.initialize());
app.use(passport.session());

//passport setup (adding users on login or pulling their credentials if already in table)
passport.use(
    new Auth0Strategy(
        {
            domain: DOMAIN,
            clientSecret: CLIENT_SECRET,
            clientID: CLIENT_ID,
            callbackURL: "/auth",
            scope: 'openid profile'
        },
        (accessToken, refreshToken, extraParams, profile, done) => {
            app.get('db').getUserByAuthId([profile.id]).then(response => {
                if(!response[0]){
                    
                    app.get('db').createUser([profile.id, profile.name.givenName, profile.name.familyName]).then(createdUser => done(null, createdUser[0]));
                } else {
                    
                    return done(null, response[0]);
                }
            });
        }
    )
)

//passport
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


//ENDPOINTS

//auth endpoint
app.get('/auth', passport.authenticate('auth0', {
    successRedirect: "/#/properties",
    failureRedirect: "/auth",
    failureFlash: true
})
);

// property endpoints
app.get('/properties', mainCtrl.getProperties);
app.get('/property/:id', mainCtrl.getProperty);
app.post('/addproperty', mainCtrl.addProperty);
app.delete('/deleteproperty', mainCtrl.deleteProperty);

// work orders endpoints
app.get('/workorders', mainCtrl.getWorkOrders);
app.get('/allworkorders', mainCtrl.getAllWorkOrders);
app.post('/addworkorder', mainCtrl.addWorkOrder);
app.post('/workorders', mainCtrl.getWorkOrders);
app.delete('/deleteworkorders', mainCtrl.deleteWorkOrders);
app.delete('/deleteallwobyprop', mainCtrl.deleteAllWOByProp);

// contractors endpoints
app.get('/contractors', mainCtrl.getContractors);
app.post('/addcontractor', mainCtrl.addContractor);
app.put('/editcontractor', mainCtrl.editContractor);
app.delete('/deletecontractor', mainCtrl.deleteContractor);
app.delete('/deletecontractorsbyprop', mainCtrl.deleteContractorsByProp);

// expenses endpoints
app.post('/expenses', mainCtrl.addExpenses);
app.post("/getexpenses", mainCtrl.getExpensesById);
app.put('/editexpenses', mainCtrl.editExpenses);

// tenant endpoints
app.post("/gettenant", mainCtrl.getTenant);
app.put('/edittenant', mainCtrl.editTenant);


//for hosting
const path = require("path");
app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

//server setup 
app.listen(port, () => {
    console.log(`Hi, ho, hi, ho, it's off to work we go on ${port}`);
});



