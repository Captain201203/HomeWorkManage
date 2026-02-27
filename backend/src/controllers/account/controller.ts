import { Request, Response } from "express";
import { AccountService } from "../../service/account/service.js";
import { IAccount } from "../../models/account/model.js";



export class AccountController{
    private accountService: AccountService;

    constructor(accountService: AccountService) {
        this.accountService = accountService;
    }

    async getAll(Request: Request, res: Response) {
        try{
            const accounts = await this.accountService.getAll();
            res.status(200).json(accounts);
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }

    async create(Request: Request, res: Response) {
        try{
            const data = Request.body;
            const account = await this.accountService.create(data);
            res.status(201).json(account);
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }

    async update(Request: Request, res: Response) {
        try{
            const id = Request.params.id;
            const data = Request.body;
            const account = await this.accountService.update(id, data);
            if(account){
                res.status(200).json(account);
            }else{
                res.status(404).json({error: 'Account not found'});
            }
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }

    async delete(Request: Request, res: Response) {
        try{
            const id = Request.params.id;
            const account = await this.accountService.delete(id);
            if(account){
                res.status(200).json(account);
            }else{
                res.status(404).json({error: 'Account not found'});
            }
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }
    async findByUsername(Request: Request, res: Response) {
        try{
            const username = Request.params.username;
            const account = await this.accountService.findByUsername(username);
            if(account){
                res.status(200).json(account);
            }else{
                res.status(404).json({error: 'Account not found'});
            }
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }

    // Tạo tài khoản mới tự động
    async createAutoAccountStudent(req: Request, res: Response) {
        try {
            const { email, mssv, role } = req.body;

            // Kiểm tra ràng buộc dữ liệu đầu vào
            if (!email || !mssv || !role) {
                return res.status(400).json({ 
                    error: 'Thiếu thông tin: email, mssv và role là bắt buộc.' 
                });
            }

            const account = await this.accountService.createAutoAccountStudent(email, mssv, role);
            res.status(201).json(account);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async createAutoAccountAdmin(req: Request, res: Response) {
        try {
            const { email, adminId, role } = req.body;

            // Kiểm tra ràng buộc dữ liệu đầu vào
            if (!email || !adminId || !role) {
                return res.status(400).json({
                    error: 'Thiếu thông tin: email, adminId và role là bắt buộc.'
                });
            }

            const account = await this.accountService.createAutoAccountAdmin(email, adminId, role);
            res.status(201).json(account);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async createAutoAccountTeacher(req: Request, res: Response) {
        try {
            const { teacherEmail, teacherId, role } = req.body;

            // Kiểm tra ràng buộc dữ liệu đầu vào
            if (!teacherEmail || !teacherId || !role) {
                return res.status(400).json({
                    error: 'Thiếu thông tin: email, teacherId và role là bắt buộc.'
                });
            }

            const account = await this.accountService.createAutoAccountTeacher(teacherEmail, teacherId, role);
            res.status(201).json(account);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}
export const accountController = new AccountController(new AccountService());