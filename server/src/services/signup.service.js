import User from "../models/User.js";
import { AppError } from "../utils/AppError.js"

export const signupService = async (name, email, password) => {

    try {
        const newUser = await User.create({ name, email, password });
        return newUser;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError("Email already in use", 400)
        }
        throw (error);
    }

};