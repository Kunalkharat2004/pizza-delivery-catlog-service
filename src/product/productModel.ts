import mongoose from "mongoose";

const priceConfigurationSchema = new mongoose.Schema({
    priceType:{
        type: String,
        enum:["base","additional"],
    },
    availableOptions: {
        type: Map,
        of: Number
    }
})

const attributeConfigurationSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    value:{
        type: mongoose.Schema.Types.Mixed
    }
})

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    priceConfiguration:{
        type: Map,
        of: priceConfigurationSchema
    },
    attributeConfiguration:{
        type: [attributeConfigurationSchema]
    },

    tenantId:{
        type: String,
        required: true
    },

    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    isPublished:{
        type: Boolean,
        default: false
    }
},{timestamps: true});

export default mongoose.model("Product",productSchema);