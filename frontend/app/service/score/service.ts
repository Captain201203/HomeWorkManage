import { IScore } from "@/app/types/score/type";
import { BaseApiService } from "../baseApi/service";

class ScoreService extends BaseApiService {
    constructor() {
        super('scores');
    }

    private getAuthHeader(): Record<string, string> {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        if (!token) {
            return {}; 
        }
        return {
            'Authorization': `Bearer ${token}`
        };
    }

    public async getAll(query?: Record<string, string>): Promise<IScore[]> {
        const queryString = query ? `?${new URLSearchParams(query).toString()}` : '';
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...this.getAuthHeader() 
        };

        const res = await fetch(`${this.endpoint}${queryString}`, { 
            cache: 'no-store',
            method: 'GET',
            headers: headers 
        });

        const response = await this.handleResponse<{ success: boolean; data: IScore[] }>(res);
        return response.data;
    }

    /**
     * SỬA LỖI: Thêm headers vào hàm upsertScore
     */
    public async upsertScore(data: Partial<IScore>): Promise<IScore> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...this.getAuthHeader() // PHẢI CÓ DÒNG NÀY ĐỂ GỬI TOKEN
            },
            body: JSON.stringify(data),
        });
        const response = await this.handleResponse<{ success: boolean; data: IScore }>(res);
        return response.data;
    }

    /**
     * SỬA LỖI: Thêm headers vào hàm delete
     */
    public async delete(id: string): Promise<{ success: boolean }> {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                ...this.getAuthHeader() // PHẢI CÓ DÒNG NÀY ĐỂ XÁC THỰC QUYỀN XÓA
            }
        });
        return this.handleResponse(res);
    }
}

export const scoreService = new ScoreService();