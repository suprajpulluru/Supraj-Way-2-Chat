const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const {notFound,errorHandler} = require('./middleware/errorMiddleware.js');
const path = require('path');

dotenv.config();

const app = express();
connectDB();

app.use(express.json());//to accept JSON data.

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

// ---------------------------Deployment----------------------------

const __dirname1 = path.resolve();//this variable signifies the current working directory.
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1,'/frontend/build')));

    app.get('*',(request,response) => {
        response.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    });

}else{
    app.get("/",(request,response) => {
        response.send("API is running successfully");
    });
}


// ---------------------------Deployment----------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}!`);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        // origin: "http://localhost:3000",    
        origin: "https://supraj-way-2-chat.onrender.com",
    },
});

io.on("connection",(socket) => {
    console.log("Connected to Socket.IO");
    socket.on('setup',(userData) => {
        // console.log(userData._id);
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat',(room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on('typing',(room) => {
        socket.in(room).emit("typing");
    });

    socket.on("stop typing",(room) => {
        socket.in(room).emit("stop typing");
    });
    
    socket.on('new message',(newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if(!chat.users)return console.log('chat.users not defined');
        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id)return;
            socket.in(user._id).emit("message received",newMessageReceived);
        });
    });

    socket.off("setup",() => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    });
});
