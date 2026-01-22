import { Router, Request, Response } from 'express'; // Sửa import
import { teacherController } from "../../controllers/teacher/controller.js";

class TeacherRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Lấy danh sách giảng viên
        this.router.get('/', (req: Request, res: Response) => teacherController.getAll(req, res));

        // Lấy chi tiết 1 giảng viên
        this.router.get('/:id', (req: Request, res: Response) => teacherController.getById(req, res));

        // Tạo giảng viên mới
        this.router.post('/', (req: Request, res: Response) => teacherController.create(req, res));

        // Cập nhật giảng viên
        this.router.put('/:id', (req: Request, res: Response) => teacherController.update(req, res));

        // Xóa giảng viên
        this.router.delete('/:id', (req: Request, res: Response) => teacherController.delete(req, res));
    }
}

export const teacherRouter = new TeacherRouter().router;