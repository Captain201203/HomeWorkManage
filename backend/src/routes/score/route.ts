import express from "express";
import { scoreController } from "../../controllers/score/controller.js";


class ScoreRouter {
    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', scoreController.create);
        this.router.get('/', scoreController.getAll);
        this.router.get('/:id', scoreController.getById);
        this.router.put('/:id', scoreController.update);
        this.router.delete('/:id', scoreController.remove);
    }
}

export const scoreRouter = new ScoreRouter().router;

