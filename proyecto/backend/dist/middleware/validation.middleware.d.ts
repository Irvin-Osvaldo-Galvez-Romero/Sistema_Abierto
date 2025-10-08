import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export interface ValidationSchema {
    body?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
}
export declare const validate: (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validation.middleware.d.ts.map