import { IAccount } from "../../types/account/type";
import { BaseApiService } from "../baseApi/service";

class AccountService extends BaseApiService {


    constructor() {
        super('account');

    }

    public async getAll(): Promise<IAccount[]> {
        const res = await fetch(this.endpoint, {
            cache: 'no-store',
            method: 'GET'
        });
        return this.handleResponse<IAccount[]>(res);
    }

    public async getById(accountId: string): Promise<IAccount> {
        const res = await fetch(`${this.endpoint}/${accountId}`, {
            method: 'GET'
        });
        return this.handleResponse<IAccount>(res);
    }

    public async create(data: Omit<IAccount, '_id'>): Promise<IAccount> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IAccount>(res);
    }

    public async update(accountId: string, data: Partial<IAccount>): Promise<IAccount> {
        const res = await fetch(`${this.endpoint}/${accountId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<IAccount>(res);
    }

    public async delete(accountId: string): Promise<{ success: boolean; message?: string }> {
        const res = await fetch(`${this.endpoint}/${accountId}`, {
            method: 'DELETE'
        });
        return this.handleResponse(res);
    }
}
export const accountService = new AccountService();