import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { Socket } from "dgram";
import { log } from "console";
import { disconnect } from "process";

const app=express();
const server=http.createServer(app);

//inaitialize socket.io server
export const io= new Server( server,{
    cors: {origin:"*"}
})

// store online users
export const userSocketMap= {};// {userId: socketId}

// socket.io connection handler
io.on("connection", (socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("user connected", userId)

    if(userId) userSocketMap[userId]=socket.id;

    //emit online users to all connected users
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", ()=>{
        console.log("user disconnected", userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

// Middleware
app.use(express.json({limit: "4mb"}));
app.use(cors());

// routes setup
app.use('/api/status',(req,res)=> res.send("server is live"));
app.use('/api/auth',userRouter)
app.use('/api/messages',messageRouter)

await connectDB();

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5011;
    server.listen(PORT, ()=> console.log(`server is running on port: ${PORT}`));
}

export default server;