import { Request, Response } from "express";
import { subjectService } from "../../service/subject/service.js";

export class SubjectController {
    async getAll(req: Request, res: Response) {
        try{
            const subjects = await subjectService.getAll();
            res.status(200).json(subjects);


        }catch(error: any){
            return res.status(500).json({message: error.message});

        }
    }

    async getById(req: Request, res: Response) {
        try{
            const subject = await subjectService.getById(req.params.id);
            if(!subject) return res.status(404).json({message: "Không tìm thấy mục đích"});
            res.status(200).json(subject);
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    }

    async create(req: Request, res: Response) {
        try{
            const newSubject = await subjectService.create(req.body);
            res.status(201).json(newSubject);
        }catch(error: any){
            if(error.message.includes("Subject already exist")){
                return res.status(400).json({message: "Subject already exist"});
            }
            if(error.message.includes("Major not found")){
                return res.status(400).json({message: "Major not found"});
            }
            return res.status(500).json({message: "Lỗi máy chủ nội bộ"});
        }
    }

    async update(req: Request, res: Response) {
        try{
            const updatedSubject = await subjectService.update(req.params.id, req.body);
            if(!updatedSubject) return res.status(404).json({message: "Không tìm thấy mục đích"});
            res.status(200).json(updatedSubject);
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    }

    async delete(req: Request, res: Response) {
        try{
            const deletedSubject = await subjectService.delete(req.params.id);
            if(!deletedSubject) return res.status(404).json({message: "Không tìm thấy mục đích"});
            res.status(200).json({message: "Xóa mục đích thành công"});
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    }
}

export const subjectController = new SubjectController();