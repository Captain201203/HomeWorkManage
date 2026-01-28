import { IAdmin } from "../../types/admin/type";
import { BaseApiService } from "../baseApi/service";

class AdminService extends BaseApiService{


    constructor() {
        super('admin');

    }

    public async getAll(): Promise<IAdmin[]> {
        const res = await fetch(this.endpoint, {
            cache: 'no-store',
            method: 'GET'
        });
        return this.handleResponse<IAdmin[]>(res);
    }

    public async getById(adminId: string): Promise<IAdmin> {
        const res = await fetch(`${this.endpoint}/${adminId}`, {
            method: 'GET'
        });
        return this.handleResponse<IAdmin>(res);
    }

    public async create(data: Omit<IAdmin, '_id'>): Promise<IAdmin> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IAdmin>(res);
    }

    public async update(adminId: string, data: Partial<IAdmin>): Promise<IAdmin> {
        const res = await fetch(`${this.endpoint}/${adminId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IAdmin>(res);
    }

    public async delete(adminId: string): Promise<{ success: boolean; message?: string }> {
        const res = await fetch(`${this.endpoint}/${adminId}`, {
            method: 'DELETE'
        });
        return this.handleResponse(res);
    }
}

export const adminService = new AdminService();