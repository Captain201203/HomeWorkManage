import { Router, Request, Response} from "express";
import { accountController } from "../../controllers/account/controller.js";

class AccountRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', (req: Request, res: Response) => accountController.getAll(req, res));

        this.router.post('/', (req: Request, res: Response) => accountController.create(req, res));

        this.router.put('/:id', (req: Request, res: Response) => accountController.update(req, res));

        this.router.delete('/:id', (req: Request, res: Response) => accountController.delete(req, res));
        
        this.router.get('/:username', (req: Request, res: Response) => accountController.findByUsername(req, res));
    }
}
export const accountRouter = new AccountRouter().router;