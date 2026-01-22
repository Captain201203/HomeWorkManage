import { IClass } from "@/app/types/class/type";

class ClassService{
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/classes';
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        return response.json();
    }

    public async getAll(): Promise<IClass[]> {
        const res = await fetch(this.baseUrl, {
            cache: 'no-store',
            method: 'GET'
        });
        return this.handleResponse<IClass[]>(res);
    }

    public async getById(classId: string): Promise<IClass> {
        const res = await fetch(`${this.baseUrl}/${classId}`, {
            method: 'GET'
        });
        return this.handleResponse<IClass>(res);
    }

    public async create(data: Omit<IClass, '_id'>): Promise<IClass> {
        const res = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IClass>(res);
    }

    public async update(classId: string, data: Partial<IClass>): Promise<IClass> {
        const res = await fetch(`${this.baseUrl}/${classId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IClass>(res);
    }

    public async delete(classId: string): Promise<{ success: boolean; message?: string }> {
        const res = await fetch(`${this.baseUrl}/${classId}`, {
            method: 'DELETE'
        });
        return this.handleResponse(res);
    }

    public async countStudentsInClass(classId: string): Promise<{ classId: string; studentCount: number }> {
        const res = await fetch(`${this.baseUrl}/${classId}/students/count`, {
            method: 'GET'
        });
        return this.handleResponse<{ classId: string; studentCount: number }>(res);
    }
}

export const classService = new ClassService();