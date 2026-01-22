import { IClass } from "@/app/types/class/type";

class ClassService{
    private readonly apiBase: string; 
    private readonly endpoint: string; 

    constructor() {
        this.apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        this.endpoint = `${this.apiBase}/api/classes`;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        return response.json();
    }

    public async getAll(): Promise<IClass[]> {
        const res = await fetch(this.endpoint, {
            cache: 'no-store',
            method: 'GET'
        });
        return this.handleResponse<IClass[]>(res);
    }

    public async getById(classId: string): Promise<IClass> {
        // Kết quả: http://localhost:3001/api/classes/CLASS_ID
        const res = await fetch(`${this.endpoint}/${classId}`, {
            method: 'GET'
        });
        return this.handleResponse<IClass>(res);
    }

    public async create(classData: IClass): Promise<IClass> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            body: JSON.stringify(classData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return this.handleResponse<IClass>(res);
    }

    public async update(classId: string, classData: IClass): Promise<IClass> {
        const res = await fetch(`${this.endpoint}/${classId}`, {
            method: 'PUT',
            body: JSON.stringify(classData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return this.handleResponse<IClass>(res);
    }

    public async delete(classId: string): Promise<void> {
        const res = await fetch(`${this.endpoint}/${classId}`, {
            method: 'DELETE'
        });
        return this.handleResponse<void>(res);
    }

    public async countStudentsInClass(classId: string): Promise<{ classId: string; studentCount: number }> {
        const res = await fetch(`${this.endpoint}/${classId}/students/count`, {
            method: 'GET'
        });
        return this.handleResponse<{ classId: string; studentCount: number }>(res);
    }
}

export const classService = new ClassService();