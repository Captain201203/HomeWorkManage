import { Router, Request, Response } from 'express'; // Import thêm Request và Response
import { studentController } from '../../controllers/student/controller.js';

class StudentRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Thêm kiểu dữ liệu (req: Request, res: Response) để fix lỗi TS7006
        
        // Lấy danh sách sinh viên
        this.router.get('/', (req: Request, res: Response) => studentController.getAll(req, res));

        // Lấy sinh viên theo lớp
        this.router.get('/by-class/:classId', (req: Request, res: Response) => studentController.getByClass(req, res));

        // Lấy chi tiết 1 sinh viên
        this.router.get('/:id', (req: Request, res: Response) => studentController.getById(req, res));

        // Tạo sinh viên mới
        this.router.post('/', (req: Request, res: Response) => studentController.create(req, res));

        // Cập nhật sinh viên
        this.router.put('/:id', (req: Request, res: Response) => studentController.update(req, res));

        // Xóa sinh viên
        this.router.delete('/:id', (req: Request, res: Response) => studentController.delete(req, res));
    }
}

export const studentRouter = new StudentRouter().router;
