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
var generateUsableforClient = `${genArrayalapha[Math.floor(Math.random() * genArrayalapha.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}`;

var compareList = [];
var hireList = [];
var opprtunities = [];
var approvedStatus = "Not verified yet!";
app.get('/', async function (req, res)
{
    return res.status(200).render('main');
});

app.get('/pushtoform', async function (req, res)
{
    return res.status(200).render('register');
});

app.post('/registerWorker', async function (req, res) {
    const { name, email, address1, password, conpassword, phone, address2, nagar, jobType } = req.body;
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
            const user = new User({ name, email, phone, address1, password, conpassword , address2, workerID ,nagar, salary, approvedStatus, jobType });
            await user.save();
            const appendWorkerID = await User.findOne({name: name});
            const grabID = appendWorkerID._id;
            const action = await User.findOneAndUpdate({_id: grabID}, {workerID: `${genArrayalapha[Math.floor(Math.random() * genArrayalapha.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}`});
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
            const user = new Client({ name, email, phone, address1, password, conpassword , address2, compareList, hireList });
            await user.save();
            const appendWorkerID = await Client.findOne({name: name});
            const grabID = appendWorkerID._id;
            const action = await Client.findOneAndUpdate({_id: grabID}, {clientID: `${genArrayalapha[Math.floor(Math.random() * genArrayalapha.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}`});
            console.log(action.clientID);
            return res.status(200).redirect('userLogin');
        }
    } catch (error) {
        console.log(error);
    }
})

app.get('/loginInit', async function (req, res) {
    return res.status(200).render('loginWorker');
})

app.get('/getID', authenticate, async function(req, res) {
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
    const thisWorker = await User.findOne({name: req.rootUser.name});
    return res.status(200).render('dashboardWorker', {
        workerID: req.rootUser.workerID,
        workerName: req.rootUser.name,
        workerEmail: req.rootUser.email,
        workerJoined: req.rootUser.createdAt,
        currentStatus: req.rootUser.approvedStatus,
        workerAdded: thisWorker,
        workType: req.rootUser.jobType
    })
});
app.get('/alow', authenticate, async function(req, res) {
    return res.send('asdha8sd6jh');
});

app.get('/userRegistration', async function(req, res) {
    return res.status(200).render('userRegister');
});
app.get('/userLogin', async function(req, res) {
    return res.status(200).render('userlogin')
});

app.post('/loginClient', async function(req, res) {
    
    const { name, password } = req.body;
    try {
        const userLogin = await Client.findOne({ name: name });
        if(!userLogin) {
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

app.get('/client', authclient, async function(req, res) {
    return res.send(req.rootUser.clientID);
});
app.get('/clientDashboard', authenticate , authclient, async function(req, res){
    const allWorkers = await User.find();
    var allUsersList = [];
        const getAll = await User.find({});
        const step = getAll.length;
        getAll.forEach((Element) => {
            allUsersList.push(Element);
        })
        for (let i = 0; i < getAll.length; i++)
        {
            var getUserPosts = await req.rootUser.name[i]
        }
        var n = [];var m = [];var pid = [];var names = ["chomu", "zhandu", "ajsd"];
        var func = ["first body", "second body", "third body"];
        var nUpdated = getAll.forEach((e) => {
            n.push(e.postTitle);
        })
        var mUpdated = getAll.forEach((e) => {
            m.push(e.postBody);
        })
        var pidUpdated = getAll.forEach((e)=> {
            pid.push(e._id);
        })
        var allUpdated = n.forEach((num1, index) => {
            const num2 = m[index];
        });
        var arrayOfCompares = [];
        const clientListofCompare = await req.rootClient.compareList;
        const clientListofHire = await req.rootClient.hireList;
        const lengthofCompareList = (JSON.parse(`${clientListofCompare.length}`));
        const lengthofHireList = (JSON.parse(`${clientListofHire.length}`));
    return res.status(200).render('clientDashboard', {
        appendID: req.rootClient.clientID,
        result: allWorkers,
        list: clientListofCompare,
        list2: clientListofHire,
        n:n,
        m:m,
        length: step,
        imagearray: ["https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?cs=srgb&dl=pexels-eberhard-grossgasteiger-1366919.jpg&fm=jpg","https://i.pinimg.com/736x/8c/b5/ee/8cb5ee0a8fc8dd21497f0c2d0ebe1238.jpg","https://cdn.statusqueen.com/mobilewallpaper/thumbnail/mobile_wallpaper257-744.jpg","https://wallpapers.com/images/high/code-vein-game-free-pure-4k-ultra-hd-mobile-wallpaper-uqg4qozrnlbblg3p.jpg"],
        lengthCompare: lengthofCompareList,
        lengthHire: lengthofHireList
    })
});

app.get('/ueoazx84', authenticate, async function(req, res) {
    await User.findOneAndUpdate({name: req.rootUser.name}, {approvedStatus: "Approved,  ready for hiring!"});
    return res.status(200).redirect('/continue')
});

app.get('/revertueoazx84', authenticate, async function(req, res) {
    await User.findOneAndUpdate({name: req.rootUser.name}, {approvedStatus: "Not verified yet!"});
    return res.status(200).redirect('/continue')
});

app.get('/popWorker/', authenticate, authclient, async function(req, res){
    // const clientListofCompare = await req.rootClient.compareList;
    const consider = req.query.v87sdf78sd8fcfshdfgs87d87c;
    await Client.findOneAndUpdate({name: req.rootClient.name}, {$pull: {compareList: consider}});
    return res.redirect('back')
})

app.get('/popHiredWorker/', authenticate, authclient, async function(req, res){
    const checkthis = req.query.df67SDs7d6asdhgGDSJs587w34gywe;
    await Client.findOneAndUpdate({name: req.rootClient.name}, {$pull: {hireList: checkthis}});
    await User.findOneAndUpdate({name: checkthis}, {$pull: {opprtunities: req.rootClient.name}});
    return res.redirect('back')
})

app.get('/getWorker/', authclient, authclient, async function(req, res){
    const queryParam = req.query.cb5ee0a8fc8dd21497f0c2d0ebe1238;
    const findWorker = await User.findOne({workerID: queryParam});
    await Client.findOneAndUpdate({clientID: req.rootClient.clientID}, {$push: {compareList: findWorker.name}});

    const clientListofCompare = await req.rootClient.compareList;
    const lengthofCompareList = (JSON.parse(`${clientListofCompare.length}`) + 1);
    return res.status(200).redirect('back');
});
app.get('/hireWorker/', authenticate, authclient, async function(req, res){
    const considerthis = req.query.kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL;
    const findWorkerthis = await User.findOne({workerID: considerthis});
    await User.findOneAndUpdate({workerID: considerthis}, {$push: {opprtunities: req.rootClient.name}});
    await Client.findOneAndUpdate({name: req.rootClient.name}, {$push: {hireList: findWorkerthis.name}});
    return res.status(200).redirect('back');
})

app.listen(port, (err) => {
    if (err == true) { console.log('error occured at initialisation') } else {
        console.log(`Application on: http://localhost:${port}`);
    };
});