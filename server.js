const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Script } = require("vm");
const port = process.env.port || 3000;
const app = express();
const ejs = require("ejs");

app.set("view engine","ejs");

mongoose.set('strictQuery',false);

let initialPath = path.join(__dirname,'public');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(initialPath));

mongoose.connect('mongodb://0.0.0.0:27017/LoginNRegistration',{
    useNewUrlParser: true  
})

const db = mongoose.connection;
db.on("error",()=>{
    console.log("not connected");
})
db.once('open',()=>{
    console.log("connected");
})

app.get('/',(req,res)=>{
    res.render("index");
})
    
app.get('/login',(req,res)=>{
    res.render("login");
})
app.get('/register',(req,res)=>{
    res.render("register");
})



//for register
const schema = mongoose.Schema;
const registerschema = new schema({
    name: {
        type: String,
        required : true
    },
        email: {
            type : String,
            required: true,
            unique : true
        },
        password: {
            type : String,
            required : true
        },
        cpassword: {
            type : String,
            required : true
        }
})
const Registeruser = mongoose.model("Registeruser",registerschema );
app.post("/register",async(req,res)=>{
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if(password === cpassword){

        const register = new Registeruser({
            name: req.body.name,
            email: req.body.email,
           password : req.body.password,
           cpassword : req.body.cpassword,
         
        });
        register.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              res.render('login');
            }  
        });

    }else{
        res.render('register');
    }

})

app.post("/login",async(req,res)=>{
    try{
        const email = req.body.emailL;
        const password = req.body.passwordL;
       const useremail = await Registeruser.findOne({email: email})
       if(useremail.password===password){
        res.render('index');
       } else{
        res.render('login')
       
       }
    }catch(error){
        res.render('register')
    }
})



app.listen((port),()=>{
    console.log("listening at port 3000....");
})