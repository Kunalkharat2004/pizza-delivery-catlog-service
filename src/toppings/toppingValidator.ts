import { checkSchema } from "express-validator";

const toppingValidator = checkSchema({
    name: {
        in: ["body"],
        exists: {
            errorMessage: "Name is required",
        },
        isString: {
            errorMessage: "Name must be a string",
        },
        notEmpty: {
            errorMessage: "Name cannot be empty",
        },
    },
    price: {
        in: ["body"],
        exists: {
            errorMessage: "Price is required",
        },
        isNumeric: {
            errorMessage: "Price must be a number",
        },
    },
    tenantId: {
        in: ["body"],
        exists: {
            errorMessage: "Tenant ID is required",
        },
        isString: {
            errorMessage: "Tenant ID must be a string",
        },
    },
    isPublished: {
        in: ["body"],
        optional: true,
        isBoolean: {
            errorMessage: "isPublished must be a boolean value",
        },
    },
})

export default toppingValidator;