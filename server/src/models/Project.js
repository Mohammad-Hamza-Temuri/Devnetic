import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

        title: String,
        description: String,
        category: String,
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

});

const Project = mongoose.model("Project", projectSchema);

export default Project;