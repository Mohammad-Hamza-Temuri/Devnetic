import User from "../models/User.js";

export const signupService = async (name, email, password) => {
    
    const newUser = await User.create({name, email, password});

    return newUser;
};