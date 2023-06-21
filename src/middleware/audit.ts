import express, { Response } from "express";
import AuditLog from "../models/audit.model";
import { config } from "../config/config";
import jwt, { Secret } from "jsonwebtoken";

function auditMiddleware(
    req: express.Request & { user?: any },
    res: express.Response,
    next: express.NextFunction
) {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).send("Access denied, no token provided!");
    }

    const decoded = jwt.verify(token, config.jwt as Secret);

    req.user = decoded;

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const action = req.method + " " + req.path;
    const ipAddress = req.ip;

    const originalSend = res.send;
    let responseBody: any;
    res.send = function (body?: any): Response<any> {
        responseBody = body;
        return originalSend.apply(res, arguments as any) as Response<any>;
    };

    next();

    const statusCode = res.statusCode;

    const auditLog = new AuditLog({
        action,
        user: userId,
        ipAddress,
        statusCode,
        responseBody,
    });

    auditLog.save().catch((err) => {
        console.error("Error saving audit log:", err);
    });
}

export default auditMiddleware;
