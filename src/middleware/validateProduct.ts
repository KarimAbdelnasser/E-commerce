import { Request, Response, NextFunction } from "express";
import { productValidationSchema } from "../models/product";

export const validateProduct = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = productValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
