import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const loginService = async(email, password) => {

    const user = await User.findOne({ email });

    if(!user){
        throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: "7d"});


    return {
         user,
         token
    }
}

