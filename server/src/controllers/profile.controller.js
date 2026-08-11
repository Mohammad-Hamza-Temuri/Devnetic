import Profile from "../models/DeveloperProfile.js";
import { AppError } from "../utils/AppError.js";


export async function createProfile(req, res, next){

    try{
        const user = req.userId;
        const { headline, bio, location, yearsOfExperience, skills, githubUrl, portfolioUrl, linkedinUrl, availability } = req.body;

        const devProfile = await Profile.create({ user,headline, bio, location, yearsOfExperience, skills, githubUrl, portfolioUrl, linkedinUrl, availability });
        res.status(201).json(devProfile);
    }
    catch(error){
        next(error)
    }
};

export async function getProfileByUserId(req, res, next){

    try{

        const userId = req.params.id;
        const user = await Profile.findOne({ user: userId });

        if(!user){
            return next(new AppError("User not found", 404));
        }

        res.json(user);
    }
    catch(error){
        next(error)
    }

};

export async function updateProfile(req, res, next){

    try{
        const userId = req.userId;
        const user = await Profile.findOne({user: userId});

        if(!user){
            return next(new AppError("User not found", 404));
        }

        const { headline, bio, location, yearsOfExperience, skills, githubUrl, portfolioUrl, linkedinUrl, availability } = req.body;

        user.headline = headline;
        user.bio = bio;
        user.location = location;
        user.yearsOfExperience = yearsOfExperience;
        user.skills = skills;
        user.githubUrl = githubUrl;
        user.linkedinUrl = linkedinUrl;
        user.availability = availability;

        await user.save();
        res.json(user);
    }
    catch(error){
        next(error)
    }

};


export async function getAllProfiles(req, res, next){
    try{
        const filter = {};
    
        if(req.query.search){
            filter.headline = { $regex: req.query.search, $options: "i" };
        }

        if(req.query.skills){
            filter.skills = req.query.skills
        }

        if(req.query.availability){
            filter.availability = req.query.availability;
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) *limit;

        const profiles = await Profile.find(filter).skip(skip).limit(limit);

        res.json(profiles);

    }
    catch(error){
        next(error);
    }
}