
import ClassModel, { IClass } from "../../models/class/model.js";
import { IStudent } from "../../models/student/model.js";
import StudentModel from "../../models/student/model.js";
import MajorModel from "../../models/major/model.js";



interface IClassService {
    getAll(): Promise<IClass[]>;
    getById(id: string): Promise<IClass | null>;
    create(data: any): Promise<IClass>;
}


export class ClassService implements IClassService {
    
    async getAll(): Promise<IClass[]> {
        return ClassModel.find();
    }

    async getById(id: string): Promise<IClass | null> {
        return ClassModel.findOne({ classId: id });
    }

    async create(data: {
        classId: string;
        majorName: string;
        teacherName: string;
    }): Promise<IClass> {
        const existingClass = await ClassModel.findOne({ classId: data.classId });
        if (existingClass) {
            throw new Error("Lớp học đã tồn tại.");
        }

        const newClass = new ClassModel(data);
        return await newClass.save();
    }

    async update(id: string, data: Partial<IClass>): Promise<IClass | null> {
        return ClassModel.findOneAndUpdate({ classId: id }, data, { new: true });
    }

    async delete(id: string): Promise<IClass | null> {
        const existingClass = await ClassModel.findOne({ classId: id });
        if (!existingClass) {
            throw new Error("Lớp học không tồn tại.");
        }
        return ClassModel.findOneAndDelete({ classId: id });
    }

    async countStudentsInClass(classId: string): Promise<number> {
        return await StudentModel.countDocuments({ classId });
    }

    async deleteAllInClass(classId: string): Promise<void> {
        await StudentModel.deleteMany({ classId });
    }

    async getMajor(classId: string): Promise<string | null> {
        const classDoc = await ClassModel.findOne({ classId });
        return classDoc?.majorId || null;
    }
}


export const classService = new ClassService();