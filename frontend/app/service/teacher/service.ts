import { ITeacher } from "@/app/types/teacher/type";

class TeacherService{
    private readonly apiBase: string; 
    private readonly endpoint: string; 

    constructor() {
        this.apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        this.endpoint = `${this.apiBase}/api/teachers`;
    }


    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        return response.json();
    }

    public async getAll(): Promise<ITeacher[]> {
        const res = await fetch(this.endpoint, {
            cache: 'no-store',
            method: 'GET'
        });
        return this.handleResponse<ITeacher[]>(res);
    }

    public async getById(teacherId: string): Promise<ITeacher> {
        const res = await fetch(`${this.endpoint}/${teacherId}`, {
            method: 'GET'
        });
        return this.handleResponse<ITeacher>(res);
    }

    public async create(data: Omit<ITeacher, '_id'>): Promise<ITeacher> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<ITeacher>(res);
    }

    public async update(teacherId: string, data: Partial<ITeacher>): Promise<ITeacher> {
        const res = await fetch(`${this.endpoint}/${teacherId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<ITeacher>(res);
    }

    public async delete(teacherId: string): Promise<{ success: boolean; message?: string }> {
        const res = await fetch(`${this.endpoint}/${teacherId}`, {
            method: 'DELETE'
        });
        return this.handleResponse(res);
    }
}

export const teacherService = new TeacherService();