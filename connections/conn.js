const mongoose = require('mongoose');
const db = process.env.DATABASE;
mongoose.connect(db).then(()=>{
    console.log('connection was established');
}).catch((error)=>{
    console.log(`There was an error while connecting to the database: ${error}`);
});