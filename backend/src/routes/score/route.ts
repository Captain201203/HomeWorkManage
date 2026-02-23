import express from "express";
import { scoreController } from "../../controllers/score/controller.js";
import { verifyToken, checkStudentOwnData } from "../../middleware/authMiddleware.js";


class ScoreRouter {
    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Áp dụng verifyToken cho tất cả các route điểm
        this.router.use(verifyToken);

        this.router.post('/', scoreController.create);
        
        // Áp dụng kiểm tra chính chủ khi lấy danh sách điểm
        this.router.get('/', checkStudentOwnData, scoreController.getAll);
        
        this.router.get('/:id', scoreController.getById);
        this.router.put('/:id', scoreController.update);
        this.router.delete('/:id', scoreController.remove);
    }
}

export const scoreRouter = new ScoreRouter().router;

