import StudentModel, { IStudent } from "../../models/student/model.js";
import ClassModel from "../../models/class/model.js";


interface IStudentService {
    getAll(): Promise<IStudent[]>;
    create(data: any): Promise<IStudent>;
}


export class StudentService implements IStudentService {
    
    async getAll(): Promise<IStudent[]> {
        return StudentModel.find().populate('classId');
    }

    async getByClass(classId: string): Promise<IStudent[]> {
        return StudentModel.find({ classId }).populate('classId');
    }

    async getById(id: string): Promise<IStudent | null> {
        return StudentModel.findOne({studentId: id}).populate('classId').exec();
    }

    async create(data: {
        studentId: string;
        studentName: string;
        dateOfBirth: Date;
        email: string;
        classId: string;
    }): Promise<IStudent> {
        // Kiểm tra xem lớp học có tồn tại không dựa trên classId (string)
        const targetClass = await ClassModel.findOne({ classId: data.classId });
        if (!targetClass) {
            throw new Error("Lớp học không tồn tại, không thể thêm sinh viên.");
        }
        const existingStudentId = await StudentModel.findOne({ studentId: data.studentId });
        if (existingStudentId) {
            throw new Error("Mã sinh viên đã tồn tại.");
        }
        const student = new StudentModel(data);
        return await student.save();
    }

    async update(id: string, data: Partial<IStudent>): Promise<IStudent | null> {
        return StudentModel.findOneAndUpdate({studentId: id}, data, { new: true });
    }

    async delete(id: string): Promise<IStudent | null> {
        return StudentModel.findOneAndDelete({studentId: id});
    }


}


export const studentService = new StudentService();
