import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { config } from "../config/config";

export = function (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.status(401).send("Access denied, no token provided!");
        }
        const decoded = jwt.verify(token, config.jwt as Secret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send("Invalid token!");
    }
};
