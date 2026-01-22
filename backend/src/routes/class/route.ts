import { Router, Request, Response } from 'express'; // Thêm Request và Response
import { classController } from '../../controllers/class/controller.js';

class ClassRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Gán kiểu Request, Response cho các callback để tránh lỗi 'any'
        this.router.get('/', (req: Request, res: Response) => classController.getAll(req, res));

        this.router.get('/:id', (req: Request, res: Response) => classController.getById(req, res));

        this.router.post('/', (req: Request, res: Response) => classController.create(req, res));

        this.router.put('/:id', (req: Request, res: Response) => classController.update(req, res));

        this.router.delete('/:id', (req: Request, res: Response) => classController.delete(req, res));
        
        // Các route bổ sung
        this.router.get('/count/:classId', (req: Request, res: Response) => classController.countStudentsInClass(req, res));
        
        this.router.delete('/deleteAllInClass/:classId', (req: Request, res: Response) => classController.deleteAllInClass(req, res));
    }
}

export const classRouter = new ClassRouter().router;