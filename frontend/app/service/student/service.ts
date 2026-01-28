// src/services/studentService.ts

import { IStudent } from "@/app/types/student/type.js";
import { BaseApiService } from "../baseApi/service";

class StudentService extends BaseApiService {
    
    constructor() {
        super('students');

    }

    public async getAll(): Promise<IStudent[]> {
        const res = await fetch(this.endpoint, { 
            cache: 'no-store',
            method: 'GET'
        });
        return this.handleResponse<IStudent[]>(res);
    }

  
    public async getById(studentId: string): Promise<IStudent> {
        const res = await fetch(`${this.endpoint}/${studentId}`, {
            method: 'GET'
        });
        return this.handleResponse<IStudent>(res);
    }


    public async create(data: Omit<IStudent, '_id'>): Promise<IStudent> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IStudent>(res);
    }

  
    public async update(studentId: string, data: Partial<IStudent>): Promise<IStudent> {
        const res = await fetch(`${this.endpoint}/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IStudent>(res);
    }


    public async delete(studentId: string): Promise<{ success: boolean; message?: string }> {
        const res = await fetch(`${this.endpoint}/${studentId}`, {
            method: 'DELETE'
        });
        return this.handleResponse(res);
    }
}

export const studentService = new StudentService();