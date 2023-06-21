import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    action: String,
    user: String,
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    statusCode: Number,
    responseBody: Object,
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
