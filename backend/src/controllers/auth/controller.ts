// src/controllers/auth/controller.ts
import { Request, Response } from "express";
import { authService } from "../../service/auth/service.js";

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu" });
            }

            const result = await authService.login(username, password);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }
}

export const authController = new AuthController();