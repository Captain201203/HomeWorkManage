import { Request, Response } from "express";
import { scoreService } from "../../service/score/service.js";

class ScoreController {
    /**
     * POST /scores
     * Tạo hoặc cập nhật điểm cho một sinh viên
     */
    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const score = await scoreService.createScore(req.body);
            res.status(201).json({
                success: true,
                data: score
            });
        } catch (error: any) {
            res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    /**
     * GET /scores
     * Lấy danh sách điểm kèm bộ lọc (studentId, classCode, semester, ...)
     */
    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            // Truyền req.query trực tiếp vào service để lọc
            const scores = await scoreService.getAllScores(req.query);
            res.status(200).json({
                success: true,
                count: scores.length,
                data: scores
            });
        } catch (error: any) {
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    /**
     * GET /scores/:id
     */
    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const score = await scoreService.getScoreById(req.params.id);
            if (!score) {
                res.status(404).json({ message: "Không tìm thấy bản ghi điểm" });
                return;
            }
            res.status(200).json({ success: true, data: score });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * PUT /scores/:id
     * Cập nhật điểm và trigger tính lại GPA/Hạng chữ
     */
    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            const score = await scoreService.updateScore(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: "Cập nhật điểm thành công",
                data: score
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * DELETE /scores/:id
     */
    public remove = async (req: Request, res: Response): Promise<void> => {
        try {
            await scoreService.deleteScore(req.params.id);
            res.status(200).json({ 
                success: true, 
                message: "Đã xóa bản ghi điểm" 
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

// Export Singleton Instance
export const scoreController = new ScoreController();