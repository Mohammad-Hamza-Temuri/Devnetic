import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({

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
    text:{
        type: String,
        required: true
    }
    
});

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;