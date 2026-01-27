import { Router, Request, Response} from "express";
import { majorController } from "../../controllers/major/controller.js";

class MajorRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', (req: Request, res: Response) => majorController.getAll(req, res));

        this.router.get('/:id', (req: Request, res: Response) => majorController.getById(req, res));

        this.router.post('/', (req: Request, res: Response) => majorController.create(req, res));

        this.router.put('/:id', (req: Request, res: Response) => majorController.update(req, res));

        this.router.delete('/:id', (req: Request, res: Response) => majorController.delete(req, res));
    }
}

export const majorRouter = new MajorRouter().router;