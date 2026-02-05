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
        // Trả về trực tiếp mảng từ handleResponse
        return await this.handleResponse<IStudent[]>(res);
    }

    public async getByClass(classId: string): Promise<IStudent[]> {
        // Đảm bảo classId không bị undefined hoặc rỗng
        if (!classId) return [];

        // URL mong đợi: http://localhost:3001/api/students/by-class/22DTHG3
        const url = `${this.endpoint}/by-class/${encodeURIComponent(classId)}`;
        
        console.log("Đang gọi API tại:", url); // Log ra để kiểm chứng 100%

        const res = await fetch(url, {
            cache: 'no-store',
            method: 'GET'
        });
        
        return await this.handleResponse<IStudent[]>(res);
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
