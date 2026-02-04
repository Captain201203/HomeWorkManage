# Kiểm Tra & Xác Minh Luồng Nhập Điểm

## 1. KIỂM TRA CÁC CRUD OPERATIONS

### Backend Controllers
- ✅ **StudentController**: getAll, getById, create, update, delete, **getByClass** (NEW)
- ✅ **SubjectController**: getAll, getById, create, update, delete, **getByMajor** (NEW)
- ✅ **ClassController**: getAll, getById, create, update, delete
- ✅ **SemesterController**: getAll, getById, create, update, delete
- ✅ **ScoreController**: getAll, getById, create, update, delete (với getAllScores hỗ trợ filtering)

### Backend Services
- ✅ **StudentService**: 
  - getAll()
  - getById(id)
  - create(data)
  - update(id, data)
  - delete(id)
  - **getByClass(classId)** - NEW: Lọc sinh viên theo lớp

- ✅ **SubjectService**:
  - getAll()
  - getById(id)
  - create(data)
  - update(id, data)
  - delete(id)
  - **getByMajor(majorName)** - NEW: Lọc môn học theo ngành

- ✅ **ClassService**: Đầy đủ CRUD, hỗ trợ countStudentsInClass, deleteAllInClass

- ✅ **ScoreService**:
  - createScore(data) - Tạo hoặc cập nhật điểm (upsert)
  - getAllScores(filter) - Lọc theo studentId, subjectId, semester, className
  - getScoreById(id)
  - updateScore(id, data)
  - deleteScore(id)

### Backend Routes (Endpoints)
- ✅ GET `/subjects` - Lấy tất cả môn
- ✅ **GET `/subjects/by-major/:majorName`** - NEW: Lọc môn theo ngành
- ✅ GET `/subjects/:id` - Chi tiết môn
- ✅ GET `/students` - Lấy tất cả sinh viên
- ✅ **GET `/students/by-class/:classId`** - NEW: Lọc sinh viên theo lớp
- ✅ GET `/students/:id` - Chi tiết sinh viên
- ✅ GET `/classes` - Lấy tất cả lớp
- ✅ GET `/semesters` - Lấy tất cả học kì
- ✅ GET `/scores` - Lấy điểm (với query filter)
- ✅ POST `/scores` - Tạo/cập nhật điểm
- ✅ PUT `/scores/:id` - Cập nhật điểm
- ✅ DELETE `/scores/:id` - Xóa điểm

---

## 2. KIỂM TRA FRONTEND SERVICES

### SubjectService
- ✅ getAll() - Lấy tất cả môn
- ✅ **getByMajor(majorName)** - NEW: Lọc môn theo ngành (gọi endpoint `/subjects/by-major/:majorName`)
- ✅ getById(id)
- ✅ create(data)
- ✅ update(id, data)
- ✅ delete(id)

### StudentService
- ✅ getAll() - Lấy tất cả sinh viên
- ✅ **getByClass(classId)** - NEW: Lọc sinh viên theo lớp (gọi endpoint `/students/by-class/:classId`)
- ✅ getById(id)
- ✅ create(data)
- ✅ update(id, data)
- ✅ delete(id)

### ScoreService
- ✅ upsertScore(data) - Tạo hoặc cập nhật điểm
- ✅ getAll(query) - Lấy điểm với filter
- ✅ getById(id)
- ✅ updateScore(id, data)
- ✅ delete(id)

---

## 3. LUỒNG NHẬP ĐIỂM - TRUY VẤN CẦN THIẾT

### Bước 1: Chọn Học Kì
```
API Call: GET /semesters
Frontend: semesterService.getAll()
Response: ISemester[]
Display: Danh sách tất cả học kì
```

### Bước 2: Chọn Ngành
```
API Call: GET /majors
Frontend: majorService.getAll()
Response: IMajor[]
Display: Danh sách tất cả ngành
Note: Không cần filter vì tất cả ngành có thể có môn học ở bất kỳ học kì nào
```

### Bước 3: Chọn Môn Học
```
API Call: GET /subjects/by-major/:majorName
Frontend: subjectService.getByMajor(major.majorName)
Response: ISubject[] (đã lọc theo ngành)
Display: Danh sách môn học của ngành đã chọn
Note: Sử dụng API lọc từ backend thay vì lọc trên frontend
```

### Bước 4: Chọn Lớp
```
API Call: GET /classes
Frontend: classService.getAll()
Response: IClass[]
Display: Danh sách tất cả lớp
Note: Có thể cần filter thêm theo major/subject nếu logic yêu cầu
```

### Bước 5: Chọn Sinh Viên
```
API Call: GET /students/by-class/:classId
Frontend: studentService.getByClass(class.classId)
Response: IStudent[] (đã lọc theo lớp)
Display: Danh sách sinh viên của lớp đã chọn
Note: Sử dụng API lọc từ backend thay vì lọc trên frontend
```

### Bước 6: Form Nhập Điểm
```
API Call: POST /scores (upsert)
Frontend: scoreService.upsertScore({
  studentId: student._id,
  subjectId: subject._id,
  semester: semester._id,
  ex1Score: number,
  ex2Score: number,
  examScore: number
})
Response: IScore
Note: Backend sẽ tự động tính finalScore, GPA, letterGrade
```

---

## 4. DATA RELATIONSHIPS

### Mối quan hệ giữa các entities

```
Semester (Học kì)
  ↓
Major (Ngành)
  ↓
Subject (Môn học)
  ↓
Class (Lớp)
  ↓
Student (Sinh viên)
  ↓
Score (Điểm) ← liên kết Student + Subject + Semester
```

### Key Relationships
- Subject → Major: `subject.majorName === major.majorName`
- Student → Class: `student.classId === class.classId`
- Score → Student + Subject + Semester: `score.studentId + score.subjectId + score.semester`

---

## 5. BACKEND MODEL SCHEMAS

### Score Model
```typescript
{
  studentId: string (required, indexed)
  subjectId: string (required, indexed)
  subjectName?: string
  className?: string
  ex1Score: number (0-10)
  ex2Score: number (0-10)
  examScore: number (0-10)
  finalScore: number (auto-calculated: ex1*0.1 + ex2*0.3 + exam*0.6)
  GPA: number (auto-calculated: 0-4)
  letterGrade: string (auto-calculated: A+ to F)
  semester: string (required)
  createdAt: Date
  updatedAt: Date
}

Unique Index: { studentId, subjectId, semester }
Pre-save Hook: Tự động tính finalScore, GPA, letterGrade
```

### Subject Model
```typescript
{
  subjectId: string (unique, required)
  subjectName: string (required)
  majorName: string (required)
}
```

### Student Model
```typescript
{
  studentId: string (unique, required)
  studentName: string (required)
  dateOfBirth: Date (required)
  email: string (required)
  classId: string (required)
}
```

### Class Model
```typescript
{
  classId: string (unique, required)
  majorName: string (required)
  teacherName: string (required)
}
```

---

## 6. FRONTEND TYPES

### IScore
```typescript
{
  _id?: string
  studentId: string
  subjectId: string
  subjectName?: string
  className?: string
  ex1Score: number
  ex2Score: number
  examScore: number
  finalScore: number
  GPA?: number
  letterGrade?: string
  semester: string
  createdAt?: Date
  updatedAt?: Date
}
```

---

## 7. KIỂM TRA LỖI TIỀM ẨN

### Vấn đề đã sửa ✅
1. **Thiếu endpoint lọc môn theo ngành** → Thêm `GET /subjects/by-major/:majorName`
2. **Thiếu endpoint lọc sinh viên theo lớp** → Thêm `GET /students/by-class/:classId`
3. **Frontend vẫn lọc trên client** → Cập nhật để gọi endpoint lọc từ backend
4. **Thiếu method getByMajor, getByClass** → Thêm vào backend services

### Lưu ý quan trọng
- Score API endpoint `POST /scores` sử dụng `createScore()` có logic upsert (tạo mới nếu không tồn tại, cập nhật nếu tồn tại)
- Score model có pre-save hook tự động tính toán finalScore, GPA, letterGrade
- Frontend component đã cập nhật để sử dụng các service method mới

---

## 8. KIỂM TRA CUỐI CÙNG - SỰ TƯƠNG THÍCH

### Flow Kiểm Tra
```
Frontend Input → API Call → Backend Validation → DB Query → Response
```

1. ✅ Tất cả endpoints đều tồn tại trên backend
2. ✅ Tất cả service methods có trên frontend
3. ✅ Data types được định nghĩa đầy đủ
4. ✅ Filtering logic chính xác
5. ✅ Error handling có sẵn
6. ✅ CRUD operations đầy đủ

---

## 9. TÓNG NƯỚC LUỒNG NHẬP ĐIỂM

```
┌─────────────────┐
│ Chọn Học Kì    │ → GET /semesters
└────────┬────────┘
         ↓
┌─────────────────┐
│ Chọn Ngành      │ → GET /majors
└────────┬────────┘
         ↓
┌─────────────────┐
│ Chọn Môn Học    │ → GET /subjects/by-major/:majorName ⭐ NEW
└────────┬────────┘
         ↓
┌─────────────────┐
│ Chọn Lớp        │ → GET /classes
└────────┬────────┘
         ↓
┌─────────────────┐
│ Chọn Sinh Viên  │ → GET /students/by-class/:classId ⭐ NEW
└────────┬────────┘
         ↓
┌─────────────────┐
│ Form Nhập Điểm  │ → POST /scores (upsert)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Lưu Thành Công  │ 
└─────────────────┘
```

---

## Kết Luận

Luồng nhập điểm đã được xác minh và sửa hoàn chỉnh:
- ✅ Tất cả CRUD operations hiện có và đầy đủ
- ✅ Các endpoint lọc dữ liệu cần thiết đã được thêm vào
- ✅ Frontend services đã được cập nhật để gọi các endpoint mới
- ✅ Component nhập điểm đã được cập nhật để sử dụng service methods chính xác
- ✅ Mối quan hệ dữ liệu giữa các entities rõ ràng và chính xác
