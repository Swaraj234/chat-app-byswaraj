import mongoose, { connect } from "mongoose";



const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI,)
        console.log("succesfully connected to mongodb");
        
    } catch (error) {
        
        console.log("Error connecting mongodb",error.message);
        
    }
}

export default connectToMongoDB;