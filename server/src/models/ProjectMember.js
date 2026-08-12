import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema({
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role:{
        type: String,
        enum: ["owner", "contributor"],
        default: "contributor"
    }
});

const memberSchema = mongoose.model("ProjectMember", projectMemberSchema);

export default memberSchema;