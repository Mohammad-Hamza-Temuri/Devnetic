import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    headline: String,
    bio: String,
    location: String,
    yearsOfExperience: Number,
    skills: [String],
    githubUrl: String,
    portfolioUrl: String,
    linkedInUrl: String,
    availability: String
})

const Profile = mongoose.model("DeveloperProfile", profileSchema);

export default Profile;