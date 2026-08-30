import { createProfileService, getProfileByUserIdService, updateProfileService, getAllProfilesService } from "../services/profile.service.js";
import { AppError } from "../utils/AppError.js";

export async function createProfile(req, res, next) {

    try {
        const user = req.userId;

        const { headline,
            bio,
            location,
            yearsOfExperience,
            skills,
            githubUrl,
            portfolioUrl,
            linkedInUrl,
            availability } = req.body;

        const profileData = {
            user,
            headline,
            bio,
            location,
            yearsOfExperience,
            skills,
            githubUrl,
            portfolioUrl,
            linkedInUrl,
            availability
        };

        const devProfile = await createProfileService(profileData);
        res.status(201).json(devProfile);
    }
    catch (error) {
        next(error)
    }
};

export async function getProfileByUserId(req, res, next) {
    try {
        const userId = req.params.id;

        const profile = await getProfileByUserIdService(userId);

        res.json(profile);
    }
    catch (error) {
        next(error);
    }
}

export async function updateProfile(req, res, next) {

    try {
        const userId = req.userId;
        const { headline, bio, location, yearsOfExperience, skills, githubUrl, portfolioUrl, linkedInUrl, availability } = req.body;
        const profileData = {
            headline,
            bio,
            location,
            yearsOfExperience,
            skills,
            githubUrl,
            portfolioUrl,
            linkedInUrl,
            availability
        };
        const user = await updateProfileService(userId, profileData);

        res.json(user);
    }
    catch (error) {
        next(error)
    }

};


export async function getAllProfiles(req, res, next) {
    try {

        const { search, skills, availability } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const queryData = {
            search,
            skills,
            availability,
            page,
            limit
        };

        const profiles = await getAllProfilesService(queryData);

        res.json(profiles);

    }
    catch (error) {
        next(error);
    }
}