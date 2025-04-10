import User from "../models/User.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({success: false, message: "User Not Found"});
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                isVerified: user.isVerified
            }
        })



    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};