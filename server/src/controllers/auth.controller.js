import { signupService } from "../services/signup.service.js";
import { loginService } from "../services/login.service.js";
import { AppError } from "../utils/AppError.js";

///////////////////////////////////////////////////

//                  LOGIN CONTROLLER             //

///////////////////////////////////////////////////

export async function login(req, res, next){
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return next(new AppError("Email and password are required", 400))
        }

        const {token, user} = await loginService(email, password);

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

        const newUser = await signupService(name, email, password);

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