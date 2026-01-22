import { Router } from 'express';
import { classController } from '../../controllers/class/controller.js';



class ClassRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Lấy danh sách sinh viên
        this.router.get('/', (req, res) => classController.getAll(req, res));

        // Lấy chi tiết 1 sinh viên
        this.router.get('/:id', (req, res) => classController.getById(req, res));

        // Tạo sinh viên mới
        this.router.post('/', (req, res) => classController.create(req, res));

        // Cập nhật sinh viên
        this.router.put('/:id', (req, res) => classController.update(req, res));

        // Xóa sinh viên
        this.router.delete('/:id', (req, res) => classController.delete(req, res));
        this.router.get('/count/:classId', (req, res) => classController.countStudentsInClass(req, res));
        this.router.delete('/deleteAllInClass/:classId', (req, res) => classController.deleteAllInClass(req, res));
    }
}

// Export instance của router
export const classRouter = new ClassRouter().router;