import Joi from 'joi';
export declare const createStudentSchema: {
    body: Joi.ObjectSchema<any>;
};
export declare const updateStudentSchema: {
    params: Joi.ObjectSchema<any>;
    body: Joi.ObjectSchema<any>;
};
export declare const getStudentByIdSchema: {
    params: Joi.ObjectSchema<any>;
};
export declare const getStudentByMatriculaSchema: {
    params: Joi.ObjectSchema<any>;
};
export declare const searchStudentsSchema: {
    query: Joi.ObjectSchema<any>;
};
export declare const paginationSchema: {
    query: Joi.ObjectSchema<any>;
};
//# sourceMappingURL=student.validators.d.ts.map