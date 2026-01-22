export interface IStudent {
    _id?: string; // ID của MongoDB
    studentId: string;
    studentName: string;
    dateOfBirth: string | Date;
    email: string;
    classId: string;
}