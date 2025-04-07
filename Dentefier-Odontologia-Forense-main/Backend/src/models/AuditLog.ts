import { Schema, model, Document } from 'mongoose';

interface AuditLogDocument extends Document {
  user: string;
  action: string;
  details: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>({
  user: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AuditLog = model<AuditLogDocument>('AuditLog', auditLogSchema);

export default AuditLog;
