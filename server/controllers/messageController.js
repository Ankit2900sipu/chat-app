import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import { io, userSocketMap } from "../server.js";
import Users from "../models/users.js"
// get all users except the logged in user
export const getUsersForSidebar= async (req,res)=>{
    try {
        const userId=req.user._id;
        const filteredUsers= await Users.find({_id:{$ne: userId}}).select("-password")

        // count number of unseen messages
        const unseenMessages= {};
        const promises= filteredUsers.map(async (user,index)=>{
            const messages = await Message.find({senderId:user._id,receiverId:userId,seen:false})
            if(messages.length>0){
                unseenMessages[user._id]=messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true,users:filteredUsers,unseenMessages})
    } catch (error) {
        console.log(error.message)
        res.json({success: false,message: error.message})
    }
};


// get all messages for selected user
export const getMessages= async (req,res)=>{
    try {
        const {id: selectedUserId}=req.params;
        const myId=req.user._id;

        const messages= await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {receiverId: myId, senderId: selectedUserId},
            ]
        });

        await Message.updateMany({receiverId: myId, senderId: selectedUserId}, {seen: true});

        res.json({success: true, messages})
    } catch (error) {
        console.log(error.message)
        res.json({success: false,message: error.message})
    }
};

// api to mark seen to messages as seen usind message id
export const markMessageAsSeen= async (req,res)=>{
    try {
        const{ id }=req.params;

        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message)
        res.json({success: false,message: error.message})
    }
}


// send message to selected user
export const sendMessage= async (req,res)=>{
    try {
        const {text, image}=req.body
        const receiverId=req.params.id
        const senderId=req.user._id
        let imageUrl;
        if(image){
            const uplodeResponse= await cloudinary.uploader.upload(image)
            imageUrl=uplodeResponse.secure_url
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        // emit new message to the recievers socket id
        const recieverSocketId= userSocketMap[receiverId]
        if(recieverSocketId) io.to(recieverSocketId).emit("newMessage",newMessage)
        res.json({success: true,newMessage})
    } catch (error) {
        console.log(error.message)
        res.json({success: false,message: error.message})
    }
}