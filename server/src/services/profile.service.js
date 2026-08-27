import Profile from "../models/DeveloperProfile.js";
import { AppError } from "../utils/AppError.js";


export const createProfileService = async (profileData) => {

    const devProfile = await Profile.create(profileData);

    return devProfile;
}



export const getProfileByUserIdService = async (userId) => {

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
        throw new AppError("Profile not found", 404);
    }
    return profile;
}



export const updateProfileService = async (userId, profileData) => {

    const user = await Profile.findOne({ user: userId });

    if (!user) {
        throw new AppError("Profile not found", 404);
    }

    user.headline = profileData.headline;
    user.bio = profileData.bio;
    user.location = profileData.location;
    user.yearsOfExperience = profileData.yearsOfExperience;
    user.skills = profileData.skills;
    user.githubUrl = profileData.githubUrl;
    user.portfolioUrl = profileData.portfolioUrl;
    user.linkedinUrl = profileData.linkedinUrl;
    user.availability = profileData.availability;

    await user.save();

    return user
}



export const getAllProfilesService = async (queryData) => {
    const { search, skills, availability, page, limit } = queryData;
    const filter = {};

    if (search) {
        filter.headline = { $regex: search, $options: "i" };
    }
    if (skills) {
        filter.skills = skills;
    }
    if (availability) {
        filter.availability = availability;
    }

    const skip = (page - 1) * limit;

    const profiles = await Profile
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate("user", "name email");

    return profiles;
};