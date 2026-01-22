// import { Router } from "express";
// import { adminController } from "../../controllers/admin/controller.js";

// class AdminRouter {
//     public router: Router;

//     constructor() {
//         this.router = Router();
//         this.initializeRoutes();
//     }
//     private initializeRoutes() {
//         // Lấy danh sách quản trị viên
//         this.router.get('/', (req, res) => adminController.getAll(req, res));
//         this.router.post('/', (req, res) => adminController.create(req, res));
//         this.router.get('/:id', (req, res) => adminController.getById(req, res));
//         this.router.put('/:id', (req, res) => adminController.update(req, res));
//         this.router.delete('/:id', (req, res) => adminController.delete(req, res));
//     }
// }

// export const adminRouter = new AdminRouter().router;