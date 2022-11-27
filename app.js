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
const User = require('./models/user')
require('./connections/conn');

const authenticate = require('./middleware/authenticate');

var rawAmt = 4000;
var salary = 4500 + 9000;
console.log(salary);
var genArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
var generateUsableLocalToken = `${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}`;
console.log(generateUsableLocalToken)
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
app.get('/continue', authenticate ,async function(req, res){
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
app.listen(port, (err) =>
{
    if (err == true) { console.log('error occured at initialisation') } else
    {
        console.log(`Application on: http://localhost:${port}`);
    };
});