import mongoose, {Document, Schema} from "mongoose";

export interface IAccount extends Document {
    accountId: string;
    username: string;
    password: string;
    role: string;
}

const AccountSchema: Schema = new Schema({
    accountId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['admin', 'teacher', 'student'], // Giới hạn quyền
        default: 'student' 
    },
}, { timestamps: true }); // Thêm thời gian tạo/cập nhật

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);