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
        const response = await this.handleResponse<{ success: boolean; data: ISemester[] }>(res);
        return response.data; // Trả về mảng data từ cấu trúc { success, data }
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
}

export const semesterService = new SemesterService();