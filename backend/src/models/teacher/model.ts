import mongoose, {Document, Schema} from "mongoose";

export interface ITeacher extends Document {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
    teacherPhone: string;
    position: string;

}

const TeacherSchema: Schema = new Schema({
    teacherId: { type: String, required: true, unique: true },
    teacherName: { type: String, required: true },
    teacherEmail: { type: String, required: true },
    teacherPhone: { type: String, required: true },
    position: { type: String, required: true },
});

export default mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);