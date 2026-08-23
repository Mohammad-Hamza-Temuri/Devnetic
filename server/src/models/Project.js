import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    requiredSkills: [String],
    techStack: [String],
    startDate: Date,
    endDate: Date,
    repositoryUrl: String,

    status: {
        type: String,
        enum: ["active", "completed", "archived"],
        default: "active"
    },

    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
},{ timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;