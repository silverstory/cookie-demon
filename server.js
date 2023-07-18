const express = require('express')
const cookieParser = require('cookie-parser')

//setup express app
const app = express()

// let’s you use the cookieParser in your application
app.use(cookieParser());

//set a simple for homepage route
app.get('/', (req, res) => {
    res.send('welcome to a simple HTTP cookie server');
});

//a get route for adding a cookie
app.get('/setcookie', (req, res) => {
    res.cookie(`cookietokenname`,`encrypted cookie string Value`,{
        maxAge: 900000, // 15 minutes
        // expires works the same as the maxAge
        // expires: new Date(Date.now() + 900000),
        secure: false, // must be true in prod - cookies in https only
        httpOnly: true, // cookies must not be accessed by JavaScript
        sameSite: 'lax'
    });

    // sameSite can also be set to Strict (sameSite = Strict).
    // This will restrict cross-site sharing even between different
    // domains that the same publisher owns.

    res.send('Cookie have been saved successfully');
});

// get the cookie incoming request
app.get('/getcookie', (req, res) => {
    // show the saved cookies
    console.log(req.cookies)
    res.send(req.cookies);
});

// delete the saved cookie
app.get('/deletecookie', (req, res) => {
    //show the saved cookies
    res.clearCookie(`cookietokenname`);
    res.send('Cookie has been deleted successfully');
});

//server listening to port 8000
app.listen(8000, () => console.log('The server is running port 8000...'));