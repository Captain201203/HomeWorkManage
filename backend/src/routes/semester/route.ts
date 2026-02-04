import { Router, Request, Response } from 'express';
import { semesterController } from '../../controllers/semester/controller.js';

class SemesterRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', (req: Request, res: Response) => semesterController.getAll(req, res));
        this.router.get('/:id', (req: Request, res: Response) => semesterController.getById(req, res));
        this.router.post('/', (req: Request, res: Response) => semesterController.create(req, res));
        this.router.put('/:id', (req: Request, res: Response) => semesterController.update(req, res));
        this.router.delete('/:id', (req: Request, res: Response) => semesterController.delete(req, res));
    }
}

export const semesterRouter = new SemesterRoute().router;