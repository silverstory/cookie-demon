const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

// app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: ['https://recipe-chef.vercel.app', 'https://events-menu.vercel.app', 'http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
  })
);

app.post('/set-cookie', (req, res) => {
  // Set a cookie
  res.cookie('myCookie', 'hello from cookie', { maxAge: 900000, httpOnly: true });
  res.send('Cookie has been set!');
});

app.listen(5000, () => {
  console.log('Express server listening on port 5000.');
});

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

// const PORT = 8000;

// app.set("trust proxy", 1);

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

// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: "sessionss",
//     cookie: {
//       maxAge: 1000 * 60 * 60,
//       sameSite: "lax",
//       httpOnly: false,
//       secure: false,
//     },
//   })
// );