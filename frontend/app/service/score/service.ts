import { IScore } from "@/app/types/score/type";
import { BaseApiService } from "../baseApi/service";

class ScoreService extends BaseApiService {
    constructor() {
        super('scores');
    }

    /**
     * Lấy danh sách điểm kèm bộ lọc (Dùng cho trang nhập điểm)
     * Query có thể là { semester: '...', subjectId: '...' }
     */
    public async getAll(query?: Record<string, string>): Promise<IScore[]> {
        const queryString = query ? `?${new URLSearchParams(query).toString()}` : '';
        const res = await fetch(`${this.endpoint}${queryString}`, { 
            cache: 'no-store',
            method: 'GET'
        });
        const response = await this.handleResponse<{ success: boolean; data: IScore[] }>(res);
        return response.data;
    }

    /**
     * Tạo hoặc cập nhật điểm (Hàm này sẽ gọi tới logic .save() ở Backend)
     */
    public async upsertScore(data: Partial<IScore>): Promise<IScore> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const response = await this.handleResponse<{ success: boolean; data: IScore }>(res);
        return response.data;
    }

    /**
     * Lấy điểm theo ID
     */
    public async getById(id: string): Promise<IScore> {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'GET'
        });
        const response = await this.handleResponse<{ success: boolean; data: IScore }>(res);
        return response.data;
    }

    /**
     * Cập nhật điểm
     */
    public async updateScore(id: string, data: Partial<IScore>): Promise<IScore> {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const response = await this.handleResponse<{ success: boolean; data: IScore }>(res);
        return response.data;
    }

    /**
     * Xóa điểm
     */
    public async delete(id: string): Promise<{ success: boolean }> {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'DELETE'
        });
        return this.handleResponse(res);
    }
}

export const scoreService = new ScoreService();
