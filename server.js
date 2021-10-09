const express = require('express')
const app = express()
const mongoose= require('mongoose')
const dotenv= require('dotenv')
const connectDB = require('./config/db')
const path = require('path')
const bodyParser = require("body-parser");
const  addData = require('./createData')
// const MongoStore = require('connect-mongo')
const Customer= require('./models/customer')
const Transaction= require('./models/transaction')


//load config dotenv .env path 
dotenv.config({path: './config/config.env'})
app.use(express.static(path.join(__dirname, "/public")));
const port = process.env.PORT;

//register view-engine
app.set("view engine", "ejs");
// app.set('views','myfolder')
app.use(express.urlencoded({extended:false}))

//connect using env or default
connectDB()

//adding hardcoded data to db
// addData();

const del=()=>{
    console.log("In del fuc");
    Customer.deleteMany({});
}
//for wrapping a function to ach
// function wrapAsync(fn) {
//     return function(req, res, next) {
//         fn(req, res, next).catch(e => next(e));
//     }
// };





//Routes
app.get('/',async (req,res) => {
    addData();
    res.render('index');
})

app.get('/customers',async(req, res,next) => {
    try{
        const cust = await Customer.find({});
        // console.log(customers);
        res.render("customers", { cust });
        next();
    }
    catch(err){
        console.log(err);
    }
});

app.get('/transactions',async (req,res) => {
    const all_trans = await Transaction.find({}).sort({date:-1})
    res.render('transactions',{"trans":all_trans})

})

app.get('/pay/:id',async(req,res,next)=>{

    //pass by id coz names could be same
    const cust_id=req.params.id;
    const cur = await Customer.findById(cust_id);
    const cname = cur.name; 
    const balance = cur.balance;
    const cust = await Customer.find({});
    const cur_cust = cust.filter(function(c) {
        return c.id!==cust_id
    })
    //passing cur(the payee) & cusr(all) coz we dont want self transaction
    res.render("pay",{"id":cust_id,"from":cname,"customers":cur_cust,cur,balance});

})

app.post('/pay',async(req,res)=>{
    console.log(req.body);
    const {from, to, amount} = req.body;
    const from_cust = await Customer.findOne({name:from});
    const to_cust = await Customer.findOne({name:to});

    //Check if it is possible to transfer
    if(from_cust.balance >0 && amount <= from_cust){

        const newTrans ={from:from,to:to, amount:amount,Date:Date()};
        await Transaction.create(newTrans);
        
        await Customer.findOneAndUpdate({ name:from},{balance: parseInt(from_cust.balance)-parseInt(amount)})
        await Customer.findOneAndUpdate({ name:to},{balance: parseInt(to_cust.balance)+parseInt(amount)})
        console.log("Success transfer");
        res.redirect('/customers');
    }
    else{
        const message="Amount should be within limits";
        res.render('error',{message})
    }

    
    //1st deduct from sender
})

app.listen(port, () => {
    console.log(`Server at ${port}`);
    
})