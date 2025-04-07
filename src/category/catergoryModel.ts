import mongoose from "mongoose"

interface IPriceConfiguration {
 [key: string]:{
    priceType: "base" | "additional",
    availableOptions: Array<string>;
 }
}

interface IAttributeConfiguration {
    name: String,
    widgetType: "radio" | "switch",
    defaultValue: string,
    availableOptions: Array<string>
}

interface ICategory {
    name: String,
    priceConfiguration: IPriceConfiguration,
    attributeConfiguration: Array<IAttributeConfiguration>
}

const priceConfigurationSchema = new mongoose.Schema<IPriceConfiguration>({
    priceType: {
        type: String,
        enum: ["base","additional"],
        required: true
    },

    availableOptions: {
        type: [String],
        required: true
    }
})

const attributeConfigurationSchema = new mongoose.Schema<IAttributeConfiguration>({
    name:{
        type: String,
        required: true
    },
    widgetType:{
        type: String,
        enum:["radio","switch"],
        required: true
    },
    defaultValue:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    availableOptions: {
        type: [String],
        required: true
    }
})

const categorySchema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: true
    },
    priceConfiguration: {
        type: Map,
        of: priceConfigurationSchema,
        required: true
    },
    attributeConfiguration: {
        type: [attributeConfigurationSchema],
        required: true
    }
})

export default mongoose.model("Category",categorySchema);