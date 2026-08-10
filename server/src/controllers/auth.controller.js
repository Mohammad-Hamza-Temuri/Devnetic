import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";


///////////////////////////////////////////////////

//                  LOGIN CONTROLLER             //

///////////////////////////////////////////////////


export async function login(req, res, next){
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return next(new AppError("Email and password are required"), 400)
        }

        const user = await User.findOne({ email });

        if(!user){
            return next(new AppError("Invalid email or password", 401));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return next(new AppError("Invalid email or password", 401));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.json({
            token,user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }
    catch(error){
        next(error);
    }
}



///////////////////////////////////////////////////

//                  SIGNUP CONTROLLER             //

///////////////////////////////////////////////////

export async function signup(req, res, next){
    try{
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return next(new AppError("Name, email, and password are required", 400));
        }

        const newUser = await User.create({ name, email, password });

        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        });

    }
    catch(error){
        next(error);
    }
}