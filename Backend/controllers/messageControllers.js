const asyncHandler = require('express-async-handler');
const Message = require('../Models/messageModel.js');
const User = require('../Models/userModel.js');
const Chat = require('../Models/chatModel.js');
const mongoose = require('mongoose');

const sendMessage = asyncHandler(async function(request,response) {
    const {content, chatId} = request.body;
    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return response.sendStatus(400);
    }

    var newMessage = {
        sender: request.user._id,
        content: content,
        chat: chatId,
    };

    try{
        var message = await Message.create(newMessage);
        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(request.body.chatId, {
            latestMessage: message,
        });

        response.json(message);
    }catch(error){
        response.status(400);
        throw new Error(error.message);
    }
});

const allMessages = asyncHandler(async function(request,response) {
    try{
        const messages = await Message.find({chat: request.params.chatId})
                        .populate("sender","name pic email")
                        .populate("chat");
        
        response.json(messages);
    }catch(error){
        response.status(400);
        throw new Error(error.message);
    }
});

module.exports = {sendMessage,allMessages};