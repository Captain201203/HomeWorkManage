// src/app/service/auth/service.ts

import { BaseApiService } from "../baseApi/service";
import { ILoginResponse } from "@/app/types/auth/type";

class AuthService extends BaseApiService {
  constructor() {
    super('auth'); 
  }

  public async login(data: any): Promise<ILoginResponse> {
    const res = await fetch(`${this.endpoint}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const response = await this.handleResponse<ILoginResponse>(res);
    

    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user_role", response.user.role);
 
      localStorage.setItem("student_session", response.user.accountId);
    }
    
    return response;
  }

  public logout() {
    localStorage.clear();
    window.location.href = "/login";
  }
}

export const authService = new AuthService();