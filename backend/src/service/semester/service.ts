import SemesterModel, { ISemester } from "../../models/semester/model.js";

interface ISemesterService {
    getAll(): Promise<ISemester[]>;
    create(data: any): Promise<ISemester>;
}

export class SemesterService implements ISemesterService {

    async getAll(): Promise<ISemester[]> {
        // Xóa populate vì semesterId là String, không phải Ref
        return SemesterModel.find({}).sort({ startDate: -1 }); 
    }

    async create(data: {
        semesterId: string;
        semesterName: string;
        startDate: Date;
        endDate: Date;
    }): Promise<ISemester> {
        // 1. Kiểm tra tồn tại
        const existSemester = await SemesterModel.findOne({ semesterId: data.semesterId });
        if (existSemester) throw new Error("Semester already exist");

        // 2. Kiểm tra logic ngày tháng (Start < End)
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        if (start >= end) {
            throw new Error("Start date must be before end date");
        }

        const semester = new SemesterModel(data);
        return await semester.save();
    }

    async getById(id: string): Promise<ISemester | null> {
        return SemesterModel.findOne({ semesterId: id });
    }

    async update(id: string, data: Partial<ISemester>): Promise<ISemester | null> {
        return SemesterModel.findOneAndUpdate({ semesterId: id }, data, { new: true });
    }

    async delete(id: string): Promise<ISemester | null> {
        return SemesterModel.findOneAndDelete({ semesterId: id });
    }
}

export const semesterService = new SemesterService();