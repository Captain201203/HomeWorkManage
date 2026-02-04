import { ISubject } from "@/app/types/subject/type";
import { BaseApiService } from "../baseApi/service";

class SubjectService extends BaseApiService {
    constructor() {
        super('subjects');
    }

    public async getAll(): Promise<ISubject[]> {
        const res = await fetch(this.endpoint, {
            cache: 'no-store',
            method: 'GET'
        });
        return this.handleResponse<ISubject[]>(res);
    }

    public async getById(subjectId: string): Promise<ISubject> {
        const res = await fetch(`${this.endpoint}/${subjectId}`, {
            method: 'GET'
        });
        return this.handleResponse<ISubject>(res);
    }

    public async create(data: Omit<ISubject, '_id'>): Promise<ISubject> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<ISubject>(res);
    }

    public async update(subjectId: string, data: Partial<ISubject>): Promise<ISubject> {
        const res = await fetch(`${this.endpoint}/${subjectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<ISubject>(res);
    }

    public async delete(subjectId: string): Promise<{ success: boolean; message?: string }> {
        const res = await fetch(`${this.endpoint}/${subjectId}`, {
            method: 'DELETE'
        });
        return this.handleResponse(res);
    }
}

export const subjectService = new SubjectService();
