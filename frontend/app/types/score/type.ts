export interface IScore {
    _id?: string;
    studentId: string;
    subjectId: string;
    subjectName?: string;
    className?: string;
    ex1Score: number;
    ex2Score: number;
    examScore: number;
    finalScore: number;    // Điểm tổng kết hệ 10
    GPA?: number;          // Hệ 4
    letterGrade?: string;  // A, B, C...
    semester: string;      // Chính là semesterId từ bảng Semester
    createdAt?: string;
    updatedAt?: string;
}