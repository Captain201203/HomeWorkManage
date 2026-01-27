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
}
export const accountController = new AccountController(new AccountService());