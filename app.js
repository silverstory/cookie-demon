const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();


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
    resave: true,
    saveUninitialized: true,
    secret: "123456",
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: "lax",
      httpOnly: true,
      secure: false,
    },
  })
);

// let’s you use the cookieParser in your application
// app.use(cookieParser());

app.post("/new", async (req, res) => {
  try {
    console.log('set ', req.body.name);
    req.session.name = req.body.name;
    // res.send({ message: "saved" }).status(201);
    res.json({ id: 1 })
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
});

app.get("/name", async (req, res) => {
  try {
    // console.log('get ', req.session.name);
    console.log('get ', req.session.name);
    // res.send({ message: req.session.name });
    res.json({ id: req.session.name })
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
});
app.listen(PORT, () => console.log(`SERVER IS RUNNING ON ${PORT}`));