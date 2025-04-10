import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode?.id) {
            req.user = { id: tokenDecode.id };
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export default userAuth;