export interface ISemester {
    _id?: string;
    semesterId: string;   // Mã gộp: HK1-2025-2026
    semesterName: string;
    startDate: string | Date;
    endDate: string | Date;
}