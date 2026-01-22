import { Router } from 'express';
import { studentController } from '../../controllers/student/controller.js';

class StudentRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Lấy danh sách sinh viên
        this.router.get('/', (req, res) => studentController.getAll(req, res));

        // Lấy chi tiết 1 sinh viên
        this.router.get('/:id', (req, res) => studentController.getById(req, res));

        // Tạo sinh viên mới
        this.router.post('/', (req, res) => studentController.create(req, res));

        // Cập nhật sinh viên
        this.router.put('/:id', (req, res) => studentController.update(req, res));

        // Xóa sinh viên
        this.router.delete('/:id', (req, res) => studentController.delete(req, res));
    }
}

// Export instance của router
export const studentRouter = new StudentRouter().router;