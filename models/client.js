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
    address2: {
        type: String
    },
    clientID: {
        type: String
    },
    compareList: [String],
    hireList: [String],
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


userSchema.methods.generateClientToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.CLIENTKEY)
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

const User = mongoose.model('CLIENT', userSchema);
module.exports = User;