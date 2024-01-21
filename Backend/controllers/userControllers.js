const asyncHandler = require('express-async-handler');//handles all errors automatically.
const User = require('../Models/userModel.js');
const generateToken = require('../config/generateToken.js');

const registerUser = asyncHandler(async function(request,response) {
    const {name,email,password,pic} = request.body;

    if(!name || !email || !password) {
        response.status(400);
        throw new Error("Please Enter All The Fields");
    }

     const userExists = await User.findOne({email: email});

    if(userExists) {
        response.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        pic: pic,
    });
    if(user){
        response.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });//sending a JSON response when user is successfully created.
    }else{
        response.status(400);
        throw new Error("Failed to Create the User");
    }
});

const authUser = asyncHandler(async function(request,response) {
    const {email,password} = request.body;
    const user = await User.findOne({email: email});
    if(user && await user.matchPassword(password)){
        response.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    }else{
        response.status(401);
        throw new Error("Invalid Email or Password");
    }
});

// path -- GET request /api/user?search=supraj.
const allUsers = asyncHandler(async function(request,response) {
    const keyword = request.query.search ? {
        $or: [
            {name: {$regex: request.query.search, $options: "i"}},
            {email: {$regex: request.query.search, $options: "i"}},
        ]
    } : {};

    const users = await User.find(keyword).find({_id: {$ne: request.user._id}});
    response.send(users);
});

module.exports = {registerUser,authUser,allUsers};