import ScoreModel, { IScore } from "../../models/score/model.js";
import StudentModel from "../../models/student/model.js";
import SubjectModel from "../../models/subject/model.js";
import SemesterModel from "../../models/semester/model.js";

// Định nghĩa Interface cho dữ liệu đầu vào để tăng tính an toàn về kiểu (Type-safe)
interface ICreateScoreDTO {
    studentId: string;
    subjectId: string;
    ex1Score: number;
    ex2Score: number;
    finalScore: number;
    semester: string;
}

class ScoreService {

    public async createScore(data: ICreateScoreDTO): Promise<IScore> {
        const { studentId, subjectId, semester } = data;
        console.log('🔍 Processing Score - Data:', data);

        
        const [student, subject, semesterExists] = await Promise.all([
            StudentModel.findOne({ studentId }),
            SubjectModel.findOne({ subjectId }),
            SemesterModel.findOne({ semesterId: semester }) 
        ]);

        if (!student) throw new Error(`Student with ID ${studentId} not found`);
        if (!subject) throw new Error(`Subject with ID ${subjectId} not found`);
        if (!semesterExists) throw new Error(`Semester with ID ${semester} not found`);

      
        let score = await ScoreModel.findOne({ studentId, subjectId, semester });

        if (score) {
            
            Object.assign(score, data);
        } else {
            
            score = new ScoreModel({
                ...data,
                subjectName: subject.subjectName,
                className: student.className,
            });
        }

        const savedScore = await score.save();
        
        console.log('✅ Score processed successfully');
        return savedScore;
    }

    public async getAllScores(filter: any = {}): Promise<IScore[]> {
        const query: any = {};
        const fields = ['studentId', 'subjectId', 'semester', 'className'];
        
        fields.forEach(field => {
            if (filter[field]) query[field] = filter[field];
        });

        return ScoreModel.find(query).sort({ createdAt: -1 });
    }

 
    public async getScoreById(id: string): Promise<IScore | null> {
        return ScoreModel.findById(id);
    }


    public async updateScore(id: string, data: Partial<IScore>): Promise<IScore | null> {
        const score = await ScoreModel.findById(id);
        if (!score) throw new Error("Score record not found");

        Object.assign(score, data);
        return await score.save(); 
    }

 
    public async deleteScore(id: string): Promise<void> {
        const result = await ScoreModel.findByIdAndDelete(id);
        if (!result) throw new Error("Could not find score to delete");
    }

    public async getScoreByStudentId(studentId: string): Promise<IScore[]> {
        return ScoreModel.find({ studentId });
    }
}


export const scoreService = new ScoreService();