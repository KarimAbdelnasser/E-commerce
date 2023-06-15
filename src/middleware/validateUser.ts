import { Request, Response, NextFunction } from "express";
import { userValidator } from "../models/user";

export const validateUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = userValidator.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
