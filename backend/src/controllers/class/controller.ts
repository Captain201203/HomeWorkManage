import { Request, Response } from 'express';
import { classService } from '../../service/class/service.js';

export class ClassController {
    // 1. Lấy tất cả lớp học
    async getAll(req: Request, res: Response) {
        try {
            const classes = await classService.getAll();
            return res.status(200).json(classes);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // 2. Tạo sinh viên mới (Có xử lý lỗi nghiệp vụ từ Service)
    async create(req: Request, res: Response) {
        try {
            const newClass = await classService.create(req.body);
            return res.status(201).json(newClass);
        } catch (error: any) {
            // Nếu lỗi là "Lớp không tồn tại" từ Service, trả về 400
            if (error.message.includes("không tồn tại")) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
        }
    }

    // 3. Lấy chi tiết sinh viên
    async getById(req: Request, res: Response) {
        try {
            const getClass = await classService.getById(req.params.id);
            if (!getClass) return res.status(404).json({ message: "Không tìm thấy sinh viên" });
            return res.status(200).json(getClass);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // 4. Cập nhật sinh viên
    async update(req: Request, res: Response) {
        try {
            const updatedclass = await classService.update(req.params.id, req.body);
            if (!updatedclass) return res.status(404).json({ message: "Không tìm thấy sinh viên" });
            return res.status(200).json(updatedclass);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // 5. Xóa sinh viên
    async delete(req: Request, res: Response) {
        try {
            const deletedclass = await classService.delete(req.params.id);
            if (!deletedclass) return res.status(404).json({ message: "Không tìm thấy sinh viên" });
            return res.status(200).json({ message: "Xóa lớp học thành công" });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async countStudentsInClass(req: Request, res: Response) {
        try {
            const classId = req.params.classId;
            const count = await classService.countStudentsInClass(classId);
            return res.status(200).json({ classId, studentCount: count });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

        async deleteAllInClass(req: Request, res: Response) {
        try{
            const classId = req.params.classId;
            await classService.deleteAllInClass(classId);
            return res.status(200).json({ message: `Xóa tất cả sinh viên trong lớp ${classId} thành công` });

        }catch(error: any){
            return res.status(500).json({ message: error.message });
        }
    }

}

// Export một instance để dùng trong Router
export const classController = new ClassController();