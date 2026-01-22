import TeacherModel, { ITeacher } from "../../models/teacher/model.js";

interface ITeacherService {
    getAll(): Promise<ITeacher[]>;
    getById(id: string): Promise<ITeacher | null>;
    create(data: any): Promise<ITeacher>;
}

export class TeacherService implements ITeacherService {
    async getAll(): Promise<ITeacher[]> {
        return TeacherModel.find();
    }
    async getById(id: string): Promise<ITeacher | null> {
        return TeacherModel.findOne({ teacherId: id });
    }
    async create(data: any): Promise<ITeacher> {
        const newTeacher = new TeacherModel(data);
        return await newTeacher.save();
    }

    async update(id: string, data: Partial<ITeacher>): Promise<ITeacher | null> {
        return TeacherModel.findOneAndUpdate({ teacherId: id }, data, { new: true });
    }

    async delete(id: string): Promise<ITeacher | null> {
        return TeacherModel.findOneAndDelete({ teacherId: id });
    }
}
export const teacherService = new TeacherService();