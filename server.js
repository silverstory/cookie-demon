const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//setup express app
const app = express();

// app.set("trust proxy", 1);

// app.use(cors());

app.use(
  cors({
    origin: ['https://recipe-chef.vercel.app', 'https://events-menu.vercel.app', 'http://127.0.0.1:5173', 'http://localhost:5173'],
    default: "https://recipe-auth.cyclic.app",
    credentials: true,
  })
);

app.use((req, res, next) => {
  const allowedOrigins = ['https://recipe-chef.vercel.app', 'https://events-menu.vercel.app', 'http://127.0.0.1:5173', 'http://localhost:5173'];
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : 'https://recipe-auth.cyclic.app');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  console.log(req.path, req.method);
  next();
})


// // from cors mismo
// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// app.get('/products/:id', cors(corsOptions), function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
// })

// sa stackovertake
// cors: {
//   origin: ["www.one.com","www.two.com","www.three.com"],
//   default: "www.one.com"
// }
// app.all('*', function(req, res, next) {
//   const origin = cors.origin.includes(req.header('origin').toLowerCase()) ? req.headers.origin : cors.default;
//   res.header("Access-Control-Allow-Origin", origin);
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// let’s you use the cookieParser in your application
app.use(cookieParser());

//set a simple for homepage route
app.get("/", (req, res) => {
  res.send("welcome to a simple HTTP cookie server");
});

//a get route for adding a cookie
app.post("/setcookie", (req, res) => {
  res.cookie(`cookietokenname`, `encrypted cookie string Value`, {
    path: '/',
    domain: 'http://localhost:5173',
    maxAge: 900000, // 15 minutes
    // expires works the same as the maxAge
    // expires: new Date(Date.now() + 900000),
    secure: false, // must be true in prod - cookies in https only
    httpOnly: false, // cookies must not be accessed by JavaScript
    sameSite: "lax",
  });

  // sameSite can also be set to Strict (sameSite = Strict).
  // This will restrict cross-site sharing even between different
  // domains that the same publisher owns.

  res.send("Cookie have been saved successfully");
});

// get the cookie incoming request
app.get("/getcookie", (req, res) => {
  // show the saved cookies
  console.log(req.cookies);
  res.send(req.cookies);
});

// delete the saved cookie
app.get("/deletecookie", (req, res) => {
  //show the saved cookies
  res.clearCookie(`cookietokenname`);
  res.send("Cookie has been deleted successfully");
});

//server listening to port 8000
app.listen(8000, () => console.log("The server is running port 8000..."));
