import { Router, Request, Response } from 'express';
import { subjectController } from "../../controllers/subject/controller.js";

class SubjectRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', (req: Request, res: Response) => subjectController.getAll(req, res));
        this.router.get('/:id', (req: Request, res: Response) => subjectController.getById(req, res));
        this.router.post('/', (req: Request, res: Response) => subjectController.create(req, res));
        this.router.put('/:id', (req: Request, res: Response) => subjectController.update(req, res));
        this.router.delete('/:id', (req: Request, res: Response) => subjectController.delete(req, res));
    }
}

export const subjectRouter = new SubjectRoute().router;