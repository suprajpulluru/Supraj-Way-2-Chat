const jwt = require('jsonwebtoken');
const User = require('../Models/userModel.js');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async function(request,response,next) {
    let token;

    if(request.headers.authorization && request.headers.authorization.startsWith("Bearer")){
        try{ 
            token = request.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            request.user = await User.findById(decoded.id).select("-password");
            next();
        }catch(error){
            response.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if(!token){
        response.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = {protect};