"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const errors_1 = require("../utils/errors");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const validationOptions = {
                abortEarly: false,
                stripUnknown: true,
                errors: {
                    wrap: {
                        label: '',
                    },
                },
            };
            if (schema.body) {
                const { error, value } = schema.body.validate(req.body, validationOptions);
                if (error) {
                    const messages = error.details.map(detail => detail.message).join(', ');
                    throw new errors_1.ValidationError(messages);
                }
                req.body = value;
            }
            if (schema.params) {
                const { error, value } = schema.params.validate(req.params, validationOptions);
                if (error) {
                    const messages = error.details.map(detail => detail.message).join(', ');
                    throw new errors_1.ValidationError(messages);
                }
                req.params = value;
            }
            if (schema.query) {
                const { error, value } = schema.query.validate(req.query, validationOptions);
                if (error) {
                    const messages = error.details.map(detail => detail.message).join(', ');
                    throw new errors_1.ValidationError(messages);
                }
                req.query = value;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map