import Profile from "../models/DeveloperProfile.js";
import { AppError } from "../utils/AppError.js";

// Canonical availability values are "available", "busy" and "not-available".
// Older profiles may hold "Available" or "unavailable", so values are compared
// case-insensitively and "unavailable" is treated as "not-available".
const LEGACY_AVAILABILITY = { unavailable: "not-available" };

const normalizeAvailability = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  const normalized = value.trim().toLowerCase();
  return LEGACY_AVAILABILITY[normalized] || normalized;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const availabilityMatchers = (value) => {
  const normalized = normalizeAvailability(value);
  const legacy = Object.keys(LEGACY_AVAILABILITY).filter(
    (key) => LEGACY_AVAILABILITY[key] === normalized,
  );

  return [normalized, ...legacy].map(
    (option) => new RegExp(`^${escapeRegex(option)}$`, "i"),
  );
};

export const createProfileService = async (profileData) => {
  const existingProfile = await Profile.findOne({ user: profileData.user });

  if (existingProfile) {
    throw new AppError("Profile already exists, update it instead", 409);
  }

  const devProfile = await Profile.create({
    ...profileData,
    availability: normalizeAvailability(profileData.availability),
  });

  return devProfile;
};

export const getProfileByUserIdService = async (userId) => {
  const profile = await Profile.findOne({ user: userId }).populate(
    "user",
    "name email",
  );

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }
  return profile;
};

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
  user.linkedInUrl = profileData.linkedInUrl;
  user.availability = normalizeAvailability(profileData.availability);

  await user.save();

  return user;
};

export const getAllProfilesService = async (queryData) => {
  const { search, skills, availability, page, limit } = queryData;
  const filter = {};

  if (search) {
    filter.headline = { $regex: search, $options: "i" };
  }
  if (skills) {
    const skillsArray = Array.isArray(skills) ? skills : [skills];
    filter.skills = { $in: skillsArray };
  }
  if (availability) {
    filter.availability = { $in: availabilityMatchers(availability) };
  }

  const skip = (page - 1) * limit;

  const profiles = await Profile.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("user", "name email");

  return profiles;
};
