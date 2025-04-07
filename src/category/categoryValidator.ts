import { checkSchema } from "express-validator";

export const categoryValidator = checkSchema({
    name: {
        in: ['body'], // Specify location
        isString: {
            errorMessage: "Name must be a string",
        },
        trim: true,
        notEmpty: {
            errorMessage: "Name cannot be empty",
        },
        isLength: {
            options: {
                min: 1,
                max: 100,
            },
            errorMessage: "Name must be between 1 and 100 characters",
        },
    },

    // --- Price Configuration Validation ---
    priceConfiguration: {
        in: ['body'],
        isObject: {
            errorMessage: "priceConfiguration must be an object"
        },
        // Optional: Check if the object is not empty
        custom: {
            options: (value) => {
                if (typeof value !== 'object' || value === null || Object.keys(value).length === 0) {
                    throw new Error('priceConfiguration cannot be an empty object');
                }
                return true;
            }
        }
    },
    // Validate each key/value pair within priceConfiguration
    'priceConfiguration.*.priceType': { // Use wildcard '*' for dynamic keys
        in: ['body'],
        isString: {
            errorMessage: "priceType must be a string"
        },
        isIn: {
            options: [['base', 'additional']],
            errorMessage: "priceType must be either 'base' or 'additional'"
        },
        notEmpty: {
            errorMessage: "priceType cannot be empty"
        }
    },
    'priceConfiguration.*.availableOptions': {
        in: ['body'],
        isArray: {
            options: { min: 1 }, // Ensure the array is not empty
            errorMessage: "availableOptions must be an array with at least one option"
        },
    },
    // Validate each item within the availableOptions array for priceConfiguration
    'priceConfiguration.*.availableOptions.*': { // Nested wildcard
        in: ['body'],
        isString: {
            errorMessage: "Each option in availableOptions must be a string"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Options in availableOptions cannot be empty strings"
        }
    },

    // --- Attribute Configuration Validation ---
    attributeConfiguration: {
        in: ['body'],
        isArray: {
           // options: { min: 1 }, // Uncomment if at least one attribute is required
           errorMessage: "attributeConfiguration must be an array"
        },
        // Optional: If you require at least one attribute configuration uncomment the options above
        // and potentially add a notEmpty check if the array itself is mandatory.
        // If the array can be empty, just isArray: true is enough.
         custom: { // Ensure it's present, as Mongoose requires it
             options: (value) => {
                 if (!Array.isArray(value)) {
                     // isArray check above handles this, but good for clarity
                     throw new Error('attributeConfiguration is required and must be an array');
                 }
                 // Add this check if the array must NOT be empty
                 // if (value.length === 0) {
                 //    throw new Error('attributeConfiguration cannot be an empty array');
                 // }
                 return true;
             }
         }
    },
    // Validate each object within the attributeConfiguration array
    'attributeConfiguration.*.name': {
        in: ['body'],
        isString: {
            errorMessage: "Attribute name must be a string"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Attribute name cannot be empty"
        },
        isLength: {
             options: { min: 1 },
             errorMessage: "Attribute name must be at least 1 character long"
        }
    },
    'attributeConfiguration.*.widgetType': {
        in: ['body'],
        isString: {
             errorMessage: "Attribute widgetType must be a string"
        },
        isIn: {
            options: [['radio', 'switch']],
            errorMessage: "Attribute widgetType must be either 'radio' or 'switch'"
        },
        notEmpty: {
             errorMessage: "Attribute widgetType cannot be empty"
        }
    },
    'attributeConfiguration.*.defaultValue': {
        in: ['body'],
        // Mongoose `Mixed` is tricky. Common case: default is a string from availableOptions.
        // Adjust if defaultValue can be other types (boolean, number, etc.)
        isString: { // Assuming string default for now
             errorMessage: "Attribute defaultValue must be a string"
        },
        trim: true,
        notEmpty: {
             errorMessage: "Attribute defaultValue cannot be empty"
        },
        // Custom validator to ensure defaultValue is one of the availableOptions
        custom: {
            options: (value, { req, location, path }) => {
                // Path looks like 'attributeConfiguration[index].defaultValue'
                // Extract index
                const match = path.match(/attributeConfiguration\[(\d+)\]/);
                if (!match) {
                    throw new Error('Could not determine attribute index for defaultValue validation');
                }
                const index = parseInt(match[1], 10);
                const attribute = req.body.attributeConfiguration[index];

                if (!attribute || !Array.isArray(attribute.availableOptions)) {
                    // This check depends on availableOptions being validated first
                    // If availableOptions is invalid, this might pass incorrectly or error.
                    // Consider order or alternative validation flow if needed.
                     throw new Error('Cannot validate defaultValue without valid availableOptions for the attribute');
                }

                if (!attribute.availableOptions.includes(value)) {
                    throw new Error(`defaultValue ('${value}') must be one of the availableOptions: [${attribute.availableOptions.join(', ')}]`);
                }
                return true;
            }
        }
    },
    'attributeConfiguration.*.availableOptions': {
        in: ['body'],
        isArray: {
            options: { min: 1 }, // Ensure at least one option
            errorMessage: "Attribute availableOptions must be an array with at least one option"
        }
    },
    // Validate each item within the availableOptions array for attributeConfiguration
    'attributeConfiguration.*.availableOptions.*': {
        in: ['body'],
        isString: {
            errorMessage: "Each option in attribute availableOptions must be a string"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Options in attribute availableOptions cannot be empty strings"
        }
    }
}, ['body']); // Specify 'body' as the default location for all checks
