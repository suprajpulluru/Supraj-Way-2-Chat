const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {type: String,required: true},
        email: {type: String,required: true,unique: true},
        password: {type: String,required: true},
        pic: {
            type: String,
            default: "https://icon-library.com/images/user-icon-jpg/user-icon-jpg-25.jpg",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.pre('save', async function(next){
    if(!this.isModified)next();
    else{
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }
});//Before saving user to database, this function will run and this wil encrypt the password.

const User = mongoose.model("User",userSchema);
module.exports = User;