// import jwt from "jsonwebtoken"

// export const protect = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization
//         console.log(req.body);
        

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ message: "Not Authorized, No Token" })
//         }

//         const token = authHeader.split(" ")[1]

//         const decoded = jwt.verify(token, process.env.JWT_SECRET)

//         req.user = decoded

//         next()

//     } catch (error) {
//         console.log(error)
//         return res.status(401).json({ message: "Not Authorized, Token failed" })
//     }
// }




// import jwt from "jsonwebtoken"
// import User from "../models/User.js"


// export const protect = async (req, res, next) => {

//     let token = req.headers.authorizaion;

//     try {
//         const decode = jwt.verify(token, process.env.JWT_SECRET)
//         const userId = decode.Id;

//         const user = await User.findById(userId)

//         if(!user){
//             return res.json({success: false, message: "Not authorized,  user not found"})
//         }
//         req.user = user;
//         next()
//     } catch (error) {
//         res.status(401).json({message: "Not authorized, token failed"})
//     }
// }


import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};