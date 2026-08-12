import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    invitedUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    invitedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
});

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;