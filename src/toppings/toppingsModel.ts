import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const toppingsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

toppingsSchema.plugin(aggregatePaginate);

const toppingsModel = mongoose.model("Toppings", toppingsSchema);
export default toppingsModel;
