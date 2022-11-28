const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config({ path: 'config.env' });
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('assets'));
const User = require('./models/user');
const Client = require('./models/client');
require('./connections/conn');

const authenticate = require('./middleware/authenticate');
const authclient = require('./middleware/clientauth');
var rawAmt = 4000;
var salary = 4500 + 9000;
console.log(salary);
var genArrayalapha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var genArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
var generateUsableLocalToken = `${genArrayalapha[Math.floor(Math.random() * genArrayalapha.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}`;
console.log(generateUsableLocalToken);
var generateUsableforClient = `${genArrayalapha[Math.floor(Math.random() * genArrayalapha.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}`;
console.log(generateUsableforClient);
app.get('/', async function (req, res)
{
    return res.status(200).render('main');
});

app.get('/pushtoform', async function (req, res)
{
    return res.status(200).render('register');
});

app.post('/registerWorker', async function (req, res) {
    const { name, email, address1, password, conpassword, phone, address2, nagar } = req.body;
    var workerID = 'will get soon!';
    try {
        const emailthere = await User.findOne({ email: email });
        const phonethere = await User.findOne({ phone: phone });
        const address1there = await User.findOne({ address1: address1 });
        if (emailthere) {
            return res.status(422).render('errorPage', {
                message: email
            })
        }
        if (phonethere) {
            return res.status(422).render('errorPage', {
                message: phone
            })
        }
        if (address1there) {
            return res.status(422).render('errorPage', {
                message: address1
            })
        }
        if(password != conpassword) {
            return res.status(422).send('Password and confirm passwords are not matching...')
        }
        else {
            const user = new User({ name, email, phone, address1, password, address2, workerID ,nagar, salary });
            await user.save();
            const appendWorkerID = await User.findOne({name: name});
            const grabID = appendWorkerID._id;
            const action = await User.findOneAndUpdate({_id: grabID}, {workerID: generateUsableLocalToken});
            console.log(action.workerID);
            return res.status(200).render('registeredWorkerPage', {
                appendName: name
            });
        }
    } catch (error) {
        console.log(error);
    }
})

app.post('/registerUser', async function(req, res){
    const { name, email, phone, password, address1, conpassword, address2 } = req.body;
    
    try {
        const emailthere = await Client.findOne({ email: email });
        const phonethere = await Client.findOne({ phone: phone });
        const address1there = await Client.findOne({ address1: address1 });
        const nameThere = await Client.findOne({name: name});
        if (emailthere) {
            return res.status(422).render('errorPage', {
                message: email
            })
        }
        if (phonethere) {
            return res.status(422).render('errorPage', {
                message: phone
            })
        }
        if (address1there) {
            return res.status(422).render('errorPage', {
                message: address1
            })
        }
        if(nameThere){
            return res.status(422).send(`Client with same name "<b><u>${name}</u></b>" is already registered! Choose different name, try adding middle name or modifying name.`)
        }
        if(password != conpassword) {
            return res.status(422).send('Password and confirm passwords are not matching...')
        }
        else {
            const user = new Client({ name, email, phone, address1, password, address2 });
            await user.save();
            const appendWorkerID = await Client.findOne({name: name});
            const grabID = appendWorkerID._id;
            const action = await Client.findOneAndUpdate({_id: grabID}, {clientID: generateUsableforClient});
            console.log(action.clientID);
            return res.status(200).redirect('userLogin');
        }
    } catch (error) {
        console.log(error);
    }
})

app.get('/loginInit', async function (req, res)
{
    return res.status(200).render('loginWorker');
})

app.get('/getID', authenticate, async function(req, res){
    return res.send(req.rootUser.workerID);
})

app.post('/loginthisuser', async function (req, res) {
    const { name, password } = req.body;
    try {
        const userLogin = await User.findOne({ name: name });
        if(!userLogin){
            return res.send("Invalid Details");
        }
        const token = await userLogin.generateAuthToken();
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        });
        if (userLogin) {
            const passwordMatch = await bcrypt.compare(password, userLogin.password);
            if (passwordMatch) {
                // firstrender 
                return res.render("confirm");
            } else {
                return res.send("Invalid Details");
            }
        }else {
            console.log('cant login');
        }
    } catch (err) {
        console.log(err);
    }
});

var allworkersList = [];
app.get('/continue', authenticate ,async function(req, res){
    const allWokers = await User.find({});
    allWokers.forEach((e)=>{
        for(let i = 0; i<=allWokers.length; i++){
            if(allworkersList[i] == e.name){
                // console.log('not appended')
                allworkersList.pop(e.name);
            }
        }
        allworkersList.push(e.name);
    })
    console.log(allworkersList);
    return res.status(200).render('dashboardWorker', {
        workerID: req.rootUser.workerID,
        workerName: req.rootUser.name,
        workerEmail: req.rootUser.email,
        workerJoined: req.rootUser.createdAt
    })
})
app.get('/alow', authenticate, async function(req, res){
    return res.send('asdha8sd6jh');
})

app.get('/userRegistration', async function(req, res){
    return res.status(200).render('userRegister');
})
app.get('/userLogin', async function(req, res){
    return res.status(200).render('userlogin')
})

app.post('/loginClient', async function(req, res){
    
    const { name, password } = req.body;
    try {
        const userLogin = await Client.findOne({ name: name });
        if(!userLogin){
            return res.send("Invalid Details");
        }
        const token = await userLogin.generateClientToken();
        res.cookie("jwtokenclient", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        });
        if (userLogin) {
            const passwordMatch = await bcrypt.compare(password, userLogin.password);
            if (passwordMatch) {
                // firstrender 
                return res.render("userLoggedIn");
            } else {
                return res.send("Invalid Details");
            }
        }else {
            console.log('cant login');
        }
    } catch (err) {
        console.log(err);
    }
})

app.get('/client', authclient, async function(req, res){
    return res.send(req.rootUser.clientID);
})




app.get('/clientDashboard', authclient, async function(req, res){
    console.log(allworkersList);    
    return res.status(200).render('clientdashboard', {
        appendID: req.rootUser.clientID
    })
})



app.listen(port, (err) => {
    if (err == true) { console.log('error occured at initialisation') } else {
        console.log(`Application on: http://localhost:${port}`);
    };
});