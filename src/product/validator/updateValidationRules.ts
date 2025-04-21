import { checkSchema, Schema } from "express-validator";

const productSchema: Schema = {
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
    description: {
        in: ["body"],
        exists: {
            errorMessage: "Description is required",
        },
        isString: {
            errorMessage: "Description must be a string",
        },
        notEmpty: {
            errorMessage: "Description cannot be empty",
        },
    },
    priceConfiguration: {
        in: ["body"],
        exists: {
            errorMessage: "priceConfiguration is required",
        },
        custom: {
            options: (raw) => {
                let pc: Record<string, any>;
                try {
                    pc = JSON.parse(raw);
                } catch {
                    throw new Error("priceConfiguration must be valid JSON");
                }
                if (typeof pc !== "object" || Array.isArray(pc)) {
                    throw new Error("priceConfiguration must be an object/map");
                }
                for (const [key, cfg] of Object.entries(pc)) {
                    if (!["base", "additional"].includes(cfg.priceType)) {
                        throw new Error(
                            `priceConfiguration.${key}.priceType must be "base" or "additional"`,
                        );
                    }
                    if (
                        !cfg.availableOptions ||
                        typeof cfg.availableOptions !== "object" ||
                        Array.isArray(cfg.availableOptions)
                    ) {
                        throw new Error(
                            `priceConfiguration.${key}.availableOptions must be an object/map`,
                        );
                    }
                    for (const [optKey, optVal] of Object.entries(
                        cfg.availableOptions,
                    )) {
                        if (typeof optVal !== "number") {
                            throw new Error(
                                `priceConfiguration.${key}.availableOptions.${optKey} must be a number`,
                            );
                        }
                    }
                }
                return true;
            },
        },
        customSanitizer:{
            options: (raw) => {
                try {
                    return JSON.parse(raw);
                } catch {
                    throw new Error("priceConfiguration must be valid JSON");
                }
            },
        }
    },
    attributeConfiguration: {
        in: ["body"],
        optional: true,
        custom: {
            options: (raw) => {
                let arr: any;
                try {
                    arr = JSON.parse(raw);
                } catch {
                    throw new Error(
                        "attributeConfiguration must be valid JSON",
                    );
                }
                if (!Array.isArray(arr)) {
                    throw new Error("attributeConfiguration must be an array");
                }
                arr.forEach((attr, idx) => {
                    if (typeof attr.name !== "string" || !attr.name.trim()) {
                        throw new Error(
                            `attributeConfiguration[${idx}].name must be a non‑empty string`,
                        );
                    }
                    if (attr.value === undefined) {
                        throw new Error(
                            `attributeConfiguration[${idx}].value is required`,
                        );
                    }
                });
                return true;
            },
        },
        customSanitizer:{
            options: (raw) => {
                try {
                    return JSON.parse(raw);
                } catch {
                    throw new Error("attributeConfiguration must be valid JSON");
                }
            },
        }
    },
};

const updateValidationRules = checkSchema(productSchema);

export default updateValidationRules;
