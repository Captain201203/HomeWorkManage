import { IMajor } from "../../types/major/type";
import { BaseApiService } from "../baseApi/service";

class MajorService extends BaseApiService {


    constructor() {
        super('majors');


    }



    public async getAll(): Promise<IMajor[]> {
        const res = await fetch(this.endpoint, {
            cache: 'no-store',
            method: 'GET'
        });
        return this.handleResponse<IMajor[]>(res);
    }

    public async getById(majorId: string): Promise<IMajor> {
        const res = await fetch(`${this.endpoint}/${majorId}`, {
            method: 'GET'
        });
        return this.handleResponse<IMajor>(res);
    }

    public async create(data: Omit<IMajor, '_id'>): Promise<IMajor> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IMajor>(res);
    }

    public async update(majorId: string, data: Partial<IMajor>): Promise<IMajor> {
        const res = await fetch(`${this.endpoint}/${majorId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IMajor>(res);
    }

    public async delete(majorId: string): Promise<{ success: boolean; message?: string }> {
        const res = await fetch(`${this.endpoint}/${majorId}`, {
            method: 'DELETE'
        });
        return this.handleResponse(res);
    }
}

export const majorService = new MajorService();