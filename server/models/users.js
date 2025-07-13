import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{type: String, requireed: true, unique: true},
    fullName:{type: String, requireed: true,},
    password:{type: String, requireed: true, minLength: 6},
    profilePic:{type: String, default:""},
    bio:{type: String},

},{timestamps: true})

const Users=mongoose.model("User",userSchema);

export default Users;