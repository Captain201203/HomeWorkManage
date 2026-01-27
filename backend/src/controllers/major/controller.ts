import { Request, Response } from "express";
import { MajorService } from "../../service/major/service.js";
import { IMajor } from "../../models/major/model.js";



export class MajorController{
    private majorService: MajorService;

    constructor(majorService: MajorService) {
        this.majorService = majorService;
    }

    async getAll(Request: Request, res: Response) {
        try{
            const majors = await this.majorService.getAll();
            res.status(200).json(majors);
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }


    async getById(Request: Request, res: Response) {
        try{
            const id = Request.params.id;
            const major = await this.majorService.getById(id);
            if(major){
                res.status(200).json(major);
            }else{
                res.status(404).json({error: 'Major not found'});
            }
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }

    async create(Request: Request, res: Response) {
        try{
            const data = Request.body;
            const major = await this.majorService.create(data);
            res.status(201).json(major);
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }

    async update(Request: Request, res: Response) {
        try{
            const id = Request.params.id;
            const data = Request.body;
            const major = await this.majorService.update(id, data);
            if(major){
                res.status(200).json(major);
            }else{
                res.status(404).json({error: 'Major not found'});
            }
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }

    async delete(Request: Request, res: Response) {
        try{
            const id = Request.params.id;
            const major = await this.majorService.delete(id);
            if(major){
                res.status(200).json(major);
            }else{
                res.status(404).json({error: 'Major not found'});
            }
        }catch(error: any){
            return res.status(500).json({error: error.message});
        }
    }
}
export const majorController = new MajorController(new MajorService());