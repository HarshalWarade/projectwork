const jwt = require('jsonwebtoken');
const Client = require('../models/client');
const cookieParser = require('cookie-parser');
var genArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
let generateUsableLocalToken = `${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}${genArray[Math.floor(Math.random() * genArray.length)]}`;
const Authenticate = async (req, res, next) =>
{

    try
    {
        const token = req.cookies.jwtokenclient;
        const verifyToken = jwt.verify(token, process.env.CLIENTKEY);
        const rootUser = await Client.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser)
        {
            throw new Error('User not found');
        }
        req.token = token;
        // rootUser will get all the document of the specific user.
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();
    } catch (err)
    {
        res.status(401).send(`Invalid or illegal entry. Token is not valid. LogIn again to continue. ${generateUsableLocalToken}`);
    }
}

module.exports = Authenticate;