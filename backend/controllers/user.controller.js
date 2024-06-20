import User from "../models/user.model.js";
export const getUsersForSidebar =  async (req,res) =>{

    try {
        const loggedInUserId = req.body._id;
        const filterUser = await User.find({_id: {$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filterUser);
    } catch (error) {
        console.log("Error in sidebar controller",error.message);
        res.status(500).json({error:"Internal server error"})
        
    }

}