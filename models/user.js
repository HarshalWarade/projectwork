const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    conpassword: {
        type: String
    },
    jobType: {
        type: String,
        required: true
    },
    address2: {
        type: String
    },
    nagar: {
        type: String,
        required: true
    },
    workerID: {
        type: String
    },
    approvedStatus: {
        type: String
    },
    opprtunities: [String],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }
    ]
}, {
    timestamps: true
});

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
})


userSchema.methods.generateAuthToken = async function ()
{
    try
    {
        let token = jwt.sign({ _id: this._id }, process.env.SECRETKEY)
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err)
    {
        console.log(err);
    }
}

const User = mongoose.model('USER', userSchema);
module.exports = User;