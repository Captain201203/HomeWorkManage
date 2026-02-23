// src/service/auth/service.ts
import AccountModel from "../../models/account/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
    async login(username: string, password: string) {
        // 1. Tìm tài khoản theo username (email)
        const account = await AccountModel.findOne({ username });
        if (!account) {
            throw new Error("Tài khoản không tồn tại");
        }

        // 2. So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            throw new Error("Mật khẩu không chính xác");
        }

        // 3. Tạo JWT Token (thời hạn 1 ngày)
        const token = jwt.sign(
            { id: account.accountId, role: account.role },
            "YOUR_SECRET_KEY", // Nên để trong file .env
            { expiresIn: "1d" }
        );

        // 4. Trả về thông tin cần thiết (không trả về password)
        return {
            token,
            user: {
                username: account.username,
                role: account.role,
                accountId: account.accountId
            }
        };
    }
}

export const authService = new AuthService();