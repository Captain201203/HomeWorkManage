import { Request, Response } from "express";
import { semesterService } from "../../service/semester/service.js";

export class SemesterController {
    async getAll(req: Request, res: Response) {
        try{
            const semesters = await semesterService.getAll();
            res.status(200).json(semesters);
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    }

    async getById(req: Request, res: Response) {
        try{
            const semester = await semesterService.getById(req.params.id);
            if(!semester) return res.status(404).json({message: "Không tìm thấy học kì"});
            res.status(200).json(semester);
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    }

    async create(req: Request, res: Response) {
        try{
            const newSemester = await semesterService.create(req.body);
            res.status(201).json(newSemester);
        }catch(error: any){
            if(error.message.includes("Semester already exist")){
                return res.status(400).json({message: "Semester already exist"});
            }
            if(error.message.includes("Start date must be before end date")){
                return res.status(400).json({message: "Start date must be before end date"});
            }
            return res.status(500).json({message: error.message});
        }
    }

    async update(req: Request, res: Response) {
        try{
            const updatedSemester = await semesterService.update(req.params.id, req.body);
            if(!updatedSemester) return res.status(404).json({message: "Không tìm thấy học kì"});
            res.status(200).json(updatedSemester);
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    }

    async delete(req: Request, res: Response) {
        try{
            const deletedSemester = await semesterService.delete(req.params.id);
            if(!deletedSemester) return res.status(404).json({message: "Không tìm thấy học kì"});
            res.status(200).json({message: "Xóa học kì thành công"});
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    }

}

export const semesterController = new SemesterController();