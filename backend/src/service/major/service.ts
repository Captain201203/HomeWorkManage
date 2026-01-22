import MajorModel, { IMajor } from "../../models/major/model.js";

interface IMajorService {
    getAll(): Promise<IMajor[]>;
    getById(id: string): Promise<IMajor | null>;
    create(data: any): Promise<IMajor>;
}

export class MajorService implements IMajorService {
    async getAll(): Promise<IMajor[]> {
        return MajorModel.find();
    }
    async getById(id: string): Promise<IMajor | null> {
        return MajorModel.findOne({ majorId: id });
    }
    async create(data: any): Promise<IMajor> {
        const newMajor = new MajorModel(data);
        return await newMajor.save();
    }

    async update(id: string, data: Partial<IMajor>): Promise<IMajor | null> {
        return MajorModel.findOneAndUpdate({ majorId: id }, data, { new: true });
    }

    async delete(id: string): Promise<IMajor | null> {
        return MajorModel.findOneAndDelete({ majorId: id });
    }
    
}
