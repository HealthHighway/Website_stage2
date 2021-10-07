require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const session = require('express-session');
const axios = require("axios");
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");
const fetch = require('node-fetch');
const qs = require("qs");
const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server);

const baseUrl = "http://192.168.29.48:5000"

app.use(express.static(__dirname+"/public"));
app.set('view engine', "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'Healthhighway2020Secretforthisyear',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly : false, path : "/", maxAge : 12342424 }
}))

io.on('connection', (socket) => {
    socket.on('givedata', async(msg) => {
        console.log(msg);
        var options = {
            "amount": msg.private_session.PRICE*100 ,
            "currency": "INR",
            "receipt": "Health Highway",
            "payment_capture": 1
        };
        try{
            const {data} = await axios({
                method : 'post',
                url : 'https://api.razorpay.com/v1/orders',
                timeout : 6000,
                headers : {
                    "Authorization" : "Basic cnpwX3Rlc3RfZ3hJV2plbjhPeHh6blM6SGxKVUdHVmI1MHBRRnFhdkIzaFV1WmFY",
                    "Content-Type" : "application/json"
                },
                data : {
                    ...options
                }
            });
            console.log(data);
            socket.emit('welcome', {paymentData : data, sessionInfo : msg});
        }catch(err){
            console.log(err);
        }
       
    })
})

app.get("/", (req, res) => {
    console.log(req.session);
    if(req.session.HH_user)
    {
        if(req.session.HH_user._id)
        {
            res.render("index-dup", { _id : req.session.HH_user._id });
            console.log("Hey you are logged in");
        }
        else
        {
            res.render("index-dup", { _id : "" });
            console.log("You are not logged in");
        }
    }
    else
    {
        res.render("index-dup", { _id : "" });
        console.log("You are not logged in");
    }
})

app.get("/checkout", (req, res) => {
    res.render("checkout");
})

app.get("/calendar", (req, res) => {
    res.render("calendar");
})


app.get("/Group-Yoga-Classes", (req, res) => {
    fetch(baseUrl+"/admin/get-all-group-sessions", {
        method : "GET"
    }).then(async (response) => {
        console.log(response.status)
        const data = await response.json();
        console.log(data);
        if(req.session.HH_user)
        {
            if(req.session.HH_user._id)
            {
                res.render("group_sessions-landing", {sessions : data, _id : req.session.HH_user._id });
            }
            else
            {
                res.render("group_sessions-landing", { _id : "", sessions : data });
            }
        }
        else
        {
            res.render("group_sessions-landing", { _id : "", sessions : data });
        }
    })
    .catch(err => {
        res.redirect("/")
        console.log(err);
    })
})

app.get("/Group-Yoga-Classes/:id", (req, res) => {
    fetch(baseUrl+"/admin/get-particular-group/"+req.params.id, {
        method : "GET"
    }).then(async (response) => {
        console.log(response.status)
        const data = await response.json();
        // console.log(data);
        if(req.session.HH_user)
        {
            if(req.session.HH_user._id)
            {
                res.render("detailed_sessions", {session : data, _id : req.session.HH_user._id, GROUP : req.session.HH_user.GROUP });
            }
            else
            {
                res.render("detailed_sessions", { _id : "", session : data, GROUP : [] });
            }
        }
        else
        {
            res.render("detailed_sessions", { _id : "", session : data, GROUP : []});
        }
    })
    .catch(err => {
        res.redirect("/");
        console.log(err);
    })
})

app.get("/1-on-1-Pricing-Plan", (req, res) => {
    fetch(baseUrl+"/admin/get-all-group-sessions", {
        method : "GET"
    }).then(async (response) => {
        console.log(response.status)
        const data = await response.json();
        console.log(data);
        if(req.session.HH_user)
        {
            if(req.session.HH_user._id)
            {
                res.render("pricing", {sessions : data, _id : req.session.HH_user._id});
            }
            else
            {
                res.render("pricing", { _id : "", sessions : data });
            }
        }
        else
        {
            res.render("pricing", { _id : "", sessions : data});
        }
    })
    .catch(err => {
        res.redirect("/")
        console.log(err);
    })
})

app.post("/phoneauth", async (req, res) => {
    console.log(req.body);
    var resp;
    console.log(req.body);
    await fetch(baseUrl+"/user/create-user-with-phone-auth", {
            method: "POST",
            body: qs.stringify({
                PHONE_NUMBER : req.body.phoneNumber
            }),
            headers: { 
                "Content-type": "application/x-www-form-urlencoded"
            } 
    }).then(async (response) => {
        console.log(response.status);
        if(response.status == 200)
        {
            const r1 = await response.json();
            console.log(r1);
            resp={"verified" : true, "name_present" : r1.user.NAME?(r1.user.NAME.length>0?true:false):false};
            if(r1.user.NAME && r1.user.NAME.length>0){
                req.session.HH_user = {
                    PHONE_NUMBER : req.body.phoneNumber,
                    NAME : r1.user.NAME,
                    _id : r1.user._id,
                    GROUP : [...r1.user.GROUP]
                }
            }
            else
            {
                req.session.HH_user = {
                    PHONE_NUMBER : req.body.phoneNumber
                }
            }
        }
        else
        {
            console.log("nulling at /phoneauth");
            req.session.HH_user = null;
            resp={"verified" : false, "name_present" : r1.user.name?(r1.user.name.length>0?true:false):false};
        }
    }).catch(err => {
        console.log("nulling at /phoenauth catch");
        req.session.HH_user = null;
        resp={"verified" : false, "name_present" : r1.user.name?(r1.user.name.length>0?true:false):false};
        console.log(err);
    })
    res.contentType = "application/json; charset=utf-8";
    res.send(resp);
})

app.post("/add-name-with-phone-number", async (req, res) => {
    console.log(req.body);
    var resp;
    await fetch(baseUrl+"/user/add-name-with-phone-number", {
            method: "POST",
            body: qs.stringify({
                PHONE_NUMBER : req.session.HH_user.PHONE_NUMBER, 
                NAME : req.body.name,
            }),
            headers: { 
                "Content-type": "application/x-www-form-urlencoded"
            } 
    }).then(async (response) => {
        console.log(response.status);
        if(response.status == 200)
        {
            const r1 = await response.json();
            console.log(r1);
            resp={"verified" : true};
            req.session.HH_user = {
                PHONE_NUMBER : req.session.HH_user.PHONE_NUMBER,
                NAME : req.body.name,
                _id : r1.user._id,
                GROUP : [...r1.user.GROUP]
            }
        }
        else
        {
            console.log("nulling at /phoneauth");
            resp={"verified" : false};
            req.session.HH_user = null;
        }
    }).catch(err => {
        console.log("nulling at /phoenauth catch");
        req.session.HH_user = null;
        resp={"verified" : false};
        console.log(err);
    })
    res.contentType = "application/json; charset=utf-8";
    res.send(resp);
})

app.post("/oauth", async (req, res) => {
    console.log(req.body);
    var resp;
    console.log(req.body);
    await fetch(baseUrl+"/user/create-user-with-oauth", {
            method: "POST",
            body: qs.stringify({
                EMAIL : req.body.email,
                NAME : req.body.name,
            }),
            headers: { 
                "Content-type": "application/x-www-form-urlencoded"
            } 
    }).then(async (response) => {
        console.log(response.status);
        if(response.status == 200)
        {
            const r1 = await response.json();
            console.log(r1);
            resp={"verified" : true};
            req.session.HH_user = {
                _id : r1.user._id,
                GROUP : [...r1.user.GROUP]
            }
        }
        else
        {
            console.log("nulling at /phoneauth");
            resp={"verified" : false};
        }
    }).catch(err => {
        console.log("nulling at /phoenauth catch");
        req.session.HH_user = null;
        resp={"verified" : false};
        console.log(err);
    })
    res.contentType = "application/json; charset=utf-8";
    res.send(resp);
})

app.post("/create-group", async (req, res) => {
    console.log(req.body);
    var resp;
    console.log(req.body);
    await fetch(baseUrl+"/data/create-group", {
            method: "POST",
            body: qs.stringify({
                GRPID : req.body.GRPID,
                STARTING_DATE : req.body.STARTING_DATE,
                USERID : req.body.USERID
            }),
            headers: { 
                "Content-type": "application/x-www-form-urlencoded"
            } 
    }).then(async (response) => {
        console.log(response.status);
        if(response.status == 200)
        {
            const r1 = await response.json();
            console.log(r1);
            resp={"verified" : true};
            req.session.HH_user = {
                _id : r1.user._id,
                GROUP : [...r1.user.GROUP]
            }
        }
        else
        {
            console.log("nulling at /phoneauth");
            req.session.HH_user = null;
            resp={"verified" : false};
        }
    }).catch(err => {
        console.log("nulling at /phoenauth catch");
        req.session.HH_user = null;
        resp={"verified" : false};
        console.log(err);
    })
    res.contentType = "application/json; charset=utf-8";
    res.send(resp);
})

app.get("/my-profile", async (req, res) => {
    if(req.session.HH_user)
    {
        if(req.session.HH_user._id)
        {
            await fetch(baseUrl+"/data/flood-sessions/", {
                method: "POST",
                body: qs.stringify({
                    USERID : req.session.HH_user._id
                }),
                headers: { 
                    "Content-type": "application/x-www-form-urlencoded"
                } 
            })
            .then(async (response) => {
                console.log(response.status);
                if(response.status == 200)
                {
                    const r1 = await response.json();
                    console.log(r1);
                    res.render("dashboard", {PRIVATE : r1.PRIVATE, GROUP : r1.expanded_group, PHONE_NUMBER : r1.PHONE_NUMBER, NAME : r1.NAME, EMAIL : r1.EMAIL, _id : req.session.HH_user._id});
                }
                else
                {
                    req.session.HH_user = null;
                    res.redirect("/")
                }
            })
        }
        else
        {
            req.session.HH_user = null;
            res.redirect("/")
        }
    }
    else
    {
        req.session.HH_user = null;
        res.redirect("/")
    }
})

app.get("/payment-success", (req, res) => {
    res.render("payment-success");
})

app.get("/terms-and-conditions", (req, res) => {
    res.render("tnc");
})

app.get("/privacy-policy", (req, res) => {
    res.render("policy")
})

app.get("/live-class/:VIDEO_CHANNEL", (req,res) => {
    if(req.session.HH_user)
    {
        if(req.session.HH_user._id)
        {
            res.render("video", {room : req.params.VIDEO_CHANNEL});
        }
        else
        {
            req.session.HH_user = null;
            res.redirect("/")
        }
    }
    else
    {
        req.session.HH_user = null;
        res.redirect("/")
    }
})

app.get("/logout", (req,res) => {
    req.session.HH_user = null;
    res.redirect("/");
})

app.get("*", (req,res) => {
    res.redirect("/");
})



var port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`listening at ${port}`)
});

