import SubjectModel,{ ISubject } from "../../models/subject/model.js";
import MajorModel from "../../models/major/model.js";


interface ISubjectService {
    getAll(): Promise<ISubject[]>;
    create(data: any): Promise<ISubject>;
}

export class SubjectService implements ISubjectService {
    

    async getAll(): Promise<ISubject[]> {
        return SubjectModel.find({}).populate('subjectId');

    }

    async getByMajor(majorName: string): Promise<ISubject[]> {
        return SubjectModel.find({ majorName }).populate('subjectId');
    }

    async getById(id: string): Promise<ISubject | null> {
        return  SubjectModel.findOne({ subjectId: id }).populate('subjectId');
    }

    async create(data:
        {
            subjectId: string;
            subjectName: string;
            majorName: string;
        }
    ): Promise<ISubject> {
       const existSubject = await SubjectModel.findOne({ subjectId: data.subjectId });
        if (existSubject) {
            throw new Error("Subject already exist");
        }
        const major = await MajorModel.findOne({ majorName: data.majorName });
        if (!major) {
            throw new Error("Major not found");
        }
        const subject = new SubjectModel(data);
        return await subject.save();

    }

    async update(id: string, data: Partial<ISubject>): Promise<ISubject | null> {
        return SubjectModel.findOneAndUpdate({ subjectId: id }, data, { new: true });
    }

    async delete(id: string): Promise<ISubject | null> {
        return SubjectModel.findOneAndDelete({ subjectId: id });
    }
}

export const subjectService = new SubjectService();
   
