import { ISemester } from "@/app/types/semester/type";
import { BaseApiService } from "../baseApi/service";

class SemesterService extends BaseApiService {
    constructor() {
        super('semesters'); // Endpoint khớp với route backend
    }

    public async getAll(): Promise<ISemester[]> {
        const res = await fetch(this.endpoint, { 
            cache: 'no-store',
            method: 'GET'
        });
        // Trả về trực tiếp kết quả từ handleResponse
        return await this.handleResponse<ISemester[]>(res); 
    }

    public async getById(semesterId: string): Promise<ISemester> {
        const res = await fetch(`${this.endpoint}/${semesterId}`, {
            method: 'GET'
        });
        return await this.handleResponse<ISemester>(res);
    }

    public async create(data: Omit<ISemester, '_id'>): Promise<ISemester> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const response = await this.handleResponse<{ success: boolean; data: ISemester }>(res);
        return response.data;
    }

    public async update(semesterId: string, data: Partial<ISemester>): Promise<ISemester> {
        const res = await fetch(`${this.endpoint}/${semesterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const response = await this.handleResponse<{ success: boolean; data: ISemester }>(res);
        return response.data;
    }

    public async delete(semesterId: string): Promise<{ success: boolean; message?: string }> {
        const res = await fetch(`${this.endpoint}/${semesterId}`, {
            method: 'DELETE'
        });
        return this.handleResponse(res);
    }
}

export const semesterService = new SemesterService();