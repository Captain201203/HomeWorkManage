import { IAdmin } from "../../models/admin/model.js";
import AdminModel from "../../models/admin/model.js";

interface IAdminService {
    getAll(): Promise<IAdmin[]>;
    getById(id: string): Promise<IAdmin | null>;
    create(data: any): Promise<IAdmin>;
}

export class AdminService implements IAdminService{
    async getAll(): Promise<IAdmin[]> {
        return AdminModel.find();
    
    }

    async getById(id: string): Promise<IAdmin | null> {
        return AdminModel.findOne({adminId: id});

    }

    async create(data: any): Promise<IAdmin> {
        const existingAdmin = await AdminModel.findOne({ adminId: data.adminId });
        if (existingAdmin) {
            throw new Error("Quản trị viên đã tồn tại.");
        }

        
        return await AdminModel.create(data);

    }

    async update(id: string, data: Partial<IAdmin>): Promise<IAdmin | null> {
        return AdminModel.findOneAndUpdate({adminId: id}, data, { new: true });
    }

    async delete(id: string): Promise<IAdmin | null> {
        return AdminModel.findOneAndDelete({adminId: id});
    }
}

export const adminService = new AdminService();