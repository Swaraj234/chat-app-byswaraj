import conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js"
import { getRecieversocketId, io } from "../socket/socket.js";


export const sendMessage  = async (req,res) => {

    try {
        const {message} = req.body;
        const {id:recieverId} = req.params;
        const senderId = req.user._id;

       let Conversation = await conversation.findOne({
            participants:{
                $all:[senderId,recieverId]
            },

        });
            if(!Conversation){
                Conversation = await conversation.create({
                    participants: [senderId,recieverId],

                })
            }

            const newMessage = new Message({
                senderId,
                recieverId,
                message
            })

        if(newMessage){
            Conversation.message.push(newMessage._id );   
        }

        // await Conversation.save(); this is not run in parallel so take time
        // await newMessage.save();  this is not run in parallel so take time


            await Promise.all([Conversation.save(),newMessage.save()]);//To run in parrallel

            const receiverSocketId = getRecieversocketId(recieverId);
            if (receiverSocketId) {
                // io.to(<socket_id>).emit() used to send events to specific client
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
    
            res.status(201).json(newMessage);
        
    } catch (error) {
        console.log("error in sendMessage Controller",error.message)
        res.status(500).json({error:"Internal server error"})
        
    };


    
}

export const  getMessages = async (req,res) =>{
    try {

        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const Conversation = await conversation.findOne({
            participants:{$all:[senderId,userToChatId]}
        }).populate("message");

        if(!Conversation) return res.status(200).json([]);

        const message = Conversation.message;

        res.status(200).json(message)
        
    } catch (error) {
        console.log("error in get Messages Controller",error.message)
    res.status(500).json({error:"Internal server error"})
        
    }

   
}