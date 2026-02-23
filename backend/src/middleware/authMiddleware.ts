// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Cách đơn giản nhất: Định nghĩa Interface mở rộng ngay tại đây
interface AuthenticatedRequest extends Request {
    user?: any; // Hoặc chi tiết hơn: { id: string; role: string }
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Bạn chưa đăng nhập" });

    try {
        console.log("Token nhận được:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY") as any;
        
        // Gán thông tin user vào request đã được mở rộng kiểu
        req.user = {
            id: decoded.id,     // Đây là accountId/studentId
            role: decoded.role  // 'admin', 'teacher', hoặc 'student'
        }; 
        
        next();
    } catch (error: any) {
        console.error("Lỗi xác thực JWT:", error.message);
        return res.status(403).json({ message: "Token không hợp lệ" });
    }
};

export const checkStudentOwnData = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Kiểm tra an toàn nếu req.user tồn tại
    if (!req.user) return res.status(401).json({ message: "Yêu cầu xác thực" });

    // Nếu là admin thì cho qua
    if (req.user.role === 'admin') return next();

    // Nếu là sinh viên, bắt buộc studentId trong query phải khớp với ID trong Token
    const queryStudentId = req.query.studentId as string;
    
    if (queryStudentId && queryStudentId !== req.user.id) {
        return res.status(403).json({ message: "Bạn không có quyền xem điểm của người khác" });
    }
    
    next();
};