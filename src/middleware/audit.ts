import express, { Response } from "express";
import AuditLog from "../models/audit.model";

function auditMiddleware(
    req: express.Request & { user?: any },
    res: express.Response,
    next: express.NextFunction
) {
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
