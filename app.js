require('dotenv').config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const flash = require('connect-flash')
const app = express();

// store session with sqllite3
var SQLiteStore = require('connect-sqlite3')(session);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: ['https://recipe-chef.vercel.app', 'https://events-menu.vercel.app', 'http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
  })
);

// var whitelist = ['https://recipe-chef.vercel.app', 'https://events-menu.vercel.app', 'http://127.0.0.1:5173', 'http://localhost:5173']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   default: "https://recipe-auth.cyclic.app",
//   credentials: true,
// }

const PORT = 8000;

// app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  // const allowedOrigins = ['https://recipe-chef.vercel.app', 'https://events-menu.vercel.app', 'http://127.0.0.1:5173', 'http://localhost:5173'];
  // const origin = req.headers.origin;
  // res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : 'https://recipe-auth.cyclic.app');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  console.log(req.path, req.method);
  next();
})

// app.use((req, res, next) => {
//   const allowedOrigins = ['https://recipe-chef.vercel.app', 'https://events-menu.vercel.app', 'http://127.0.0.1:5173', 'http://localhost:5173'];
//   const origin = req.headers.origin;
//   res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : 'https://recipe-auth.cyclic.app');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
//   res.header('Access-Control-Allow-Credentials', true);
//   console.log(req.path, req.method);
//   next();
// })

app.use(
  session({
    store: new SQLiteStore,
    resave: false, // dating true
    saveUninitialized: false, // dating true
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: "lax",
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(flash());

// Middleware of parsing URL-encoded form data, for getting username and password
app.use(express.urlencoded({ extended: true }))



// // orig dito
// // let’s you use the cookieParser in your application
// // app.use(cookieParser());

// app.post("/new", async (req, res) => {
//   try {
//     console.log('set ', req.body.name);
//     req.session.name = req.body.name;
//     // res.send({ message: "saved" }).status(201);
//     res.json({ id: 1 })
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//     res.send(error);
//   }
// });

// app.get("/name", async (req, res) => {
//   try {
//     // console.log('get ', req.session.name);
//     console.log('get ', req.session.name);
//     // res.send({ message: req.session.name });
//     res.json({ id: req.session.name })
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//     res.send(error);
//   }
// });


// // end orig dito

// Middleware functions

// simple middleware to test if authenticated
// function isAuthenticated (req, res, next) {
//   if (req.session.user) next()
//   else next('/') // or '/login'
// }

// middleware to test if authenticated and add timestamp
const checkIsAuthAndAddTimestamp = (req, res, next) => {
  if (req.session.isAuth) {
    req.session.timestamps.push(new Date().getTime())
    next()
  } else {
    // res.status(403);
    res.json({ middlewaremessage: 'unauthorized access'});
  }
}

// orig

app.post("/new", async (req, res) => {
  try {
    // Use this for Wrong username or password
    // if (!targetUser) {
    //   req.flash('showInputError', true)
    //   return res.json('MALI!')
    // }

    // res.clearCookie('connect.sid');

    req.session.isAuth = true;
    // in prod use data from mongo user.username value
    req.session.userName = req.body.name;
    req.session.timestamps = [];
    // in prod use data from mongo user object except -password
    req.session.user = {email: 'a@a.com', username: req.body.name, role: 'Chef'};

    const response = {
      isAuth: req.session.isAuth,
      userName : req.session.user.username,
      user: req.session.user
    };

      // Setting cookie (key-value)
    res.cookie('title', 'geeksforgeeks');

    console.log('get ', response);
    res.send(response);
  } catch (error) {
    console.log(error);
    // res.status(404);
    res.send(error);
  }
});

app.get("/name", checkIsAuthAndAddTimestamp, async (req, res) => {
  try {
    const { isAuth, user, userName, timestamps } = req.session;
    const response = {
      isAuth: isAuth,
      userName : userName,
      user: user,
      timestamps: timestamps
    };
    console.log('get ', response);
    res.send(response);
  } catch (error) {
    console.log(error);
    // res.status(403);
    res.send(error);
  }
});

// end orig

// app.post('/logout', async (req, res)  => {

//   // // req.session.destroy();

//   // // delete req.session;
//   // req.session.isAuth = null;
//   // // in prod use data from mongo user.username value
//   // req.session.userName = null;
//   // req.session.timestamps = null;
//   // // in prod use data from mongo user object except -password
//   // req.session.user = null;


//   // req.session.destroy((err) => {
//   //   if (err) {
//   //     // res.status(404);
//   //     return res.send({ logout_error : err });
//   //   }
//   //   req.session = null;
//   // })

//   // // Default name of cookie set by express-session
//   // res.clearCookie('connect.sid', { path: '/' });
//   // // res.cookie('connect.sid', '', {maxAge: 0, domain:'localhost', path:'/'});
//   // res.cookie = '';
//   // req.cookies = '';

//   req.session.destroy();

//   res.clearCookie('connect.sid', { path: '/' });
//   res.send({logout: 'success'});

//   // res.end();
// });


// gumana ayup!!!!!!!!!! get lang ang katapat
// dapat wag mo na pala i destroy ang session
// cookie lang okay na!!!!!!
app.get('/logout', function (req, res) {

  // Clearing the cookie
  res.clearCookie('title');
  res.clearCookie('connect.sid');

  console.log("Cookie cleared");
  res.send('logout success!');
  res.end();
});

// app.post('/logout', async function (req, res, next) {
//   // logout logic

//   // clear the user from the session object and save.
//   // this will ensure that re-using the old session id
//   // does not have a logged in user
//   req.session.user = null
//   res.clearCookie('connect.sid', { path: '/' });
//   req.session.save(function (err) {
//     if (err) next(err)

//     // regenerate the session, which is good practice to help
//     // guard against forms of session fixation
//     req.session.regenerate(function (err) {
//       if (err) next(err)
//       // res.redirect('/')
//       res.send('tae')
//     })
//   })
// })




// end from source


app.listen(PORT, () => console.log(`SERVER IS RUNNING ON ${PORT}`));