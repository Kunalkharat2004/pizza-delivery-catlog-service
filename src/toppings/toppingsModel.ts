import mongoose from "mongoose";

const toppingsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
   image:{
    type: String,
    required: true
   },
    price:{
        type: Number,
        required: true
    },
    tenantId:{
        type: String,
        required: true
    },
    isPublished:{
        type: Boolean,
        default: false
    }
},{timestamps: true});

const toppingsModel = mongoose.model("Toppings",toppingsSchema);
export default toppingsModel;