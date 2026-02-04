"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

import { semesterService } from "@/app/service/semester/service"
import { majorService } from "@/app/service/major/service"
import { subjectService } from "@/app/service/subject/service"
import { classService } from "@/app/service/class/service"
import { studentService } from "@/app/service/student/service"
import { scoreService } from "@/app/service/score/service"

import type { ISemester } from "@/app/types/semester/type"
import type { IMajor } from "@/app/types/major/type"
import type { ISubject } from "@/app/types/subject/type"
import type { IClass } from "@/app/types/class/type"
import type { IStudent } from "@/app/types/student/type"

type Step = "semester" | "major" | "subject" | "class" | "student" | "form"

interface SelectionState {
  semester?: ISemester
  major?: IMajor
  subject?: ISubject
  class?: IClass
  student?: IStudent
}

export default function InputScoresPage() {
  const [currentStep, setCurrentStep] = useState<Step>("semester")
  const [selections, setSelections] = useState<SelectionState>({})

  // Data states
  const [semesters, setSemesters] = useState<ISemester[]>([])
  const [majors, setMajors] = useState<IMajor[]>([])
  const [subjects, setSubjects] = useState<ISubject[]>([])
  const [classes, setClasses] = useState<IClass[]>([])
  const [students, setStudents] = useState<IStudent[]>([])

  // Loading states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load semesters on mount
  useEffect(() => {
    loadSemesters()
  }, [])

  // Load majors when semester is selected
  useEffect(() => {
    if (selections.semester) {
      loadMajors()
    }
  }, [selections.semester])

  // Load subjects when major is selected
  useEffect(() => {
    if (selections.major) {
      loadSubjects()
    }
  }, [selections.major])

  // Load classes when subject is selected
  useEffect(() => {
    if (selections.subject) {
      loadClasses()
    }
  }, [selections.subject])

  // Load students when class is selected
  useEffect(() => {
    if (selections.class) {
      loadStudents()
    }
  }, [selections.class])

  const loadSemesters = async () => {
    try {
      setLoading(true)
      const data = await semesterService.getAll()
      setSemesters(data)
      setError(null)
    } catch (err) {
      setError("Không thể tải danh sách học kì")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMajors = async () => {
    try {
      setLoading(true)
      const data = await majorService.getAll()
      setMajors(data)
      setError(null)
    } catch (err) {
      setError("Không thể tải danh sách ngành")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadSubjects = async () => {
    try {
      setLoading(true)
      // Filter subjects by selected major
      const data = await subjectService.getAll()
      const filtered = data.filter(s => s.majorName === selections.major?.majorName)
      setSubjects(filtered)
      setError(null)
    } catch (err) {
      setError("Không thể tải danh sách môn học")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadClasses = async () => {
    try {
      setLoading(true)
      const data = await classService.getAll()
      setClasses(data)
      setError(null)
    } catch (err) {
      setError("Không thể tải danh sách lớp")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async () => {
    try {
      setLoading(true)
      const data = await studentService.getAll()
      // Filter students by selected class
      const filtered = data.filter(s => s.classId === selections.class?.classId)
      setStudents(filtered)
      setError(null)
    } catch (err) {
      setError("Không thể tải danh sách sinh viên")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSemesterSelect = (semester: ISemester) => {
    setSelections(prev => ({ semester })) // Reset other selections
    setCurrentStep("major")
  }

  const handleMajorSelect = (major: IMajor) => {
    setSelections(prev => ({ ...prev, major }))
    setCurrentStep("subject")
  }

  const handleSubjectSelect = (subject: ISubject) => {
    setSelections(prev => ({ ...prev, subject }))
    setCurrentStep("class")
  }

  const handleClassSelect = (cls: IClass) => {
    setSelections(prev => ({ ...prev, class: cls }))
    setCurrentStep("student")
  }

  const handleStudentSelect = (student: IStudent) => {
    setSelections(prev => ({ ...prev, student }))
    setCurrentStep("form")
  }

  const goBack = () => {
    const stepOrder: Step[] = ["semester", "major", "subject", "class", "student", "form"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const getStepTitle = (step: Step): string => {
    const titles: Record<Step, string> = {
      semester: "Chọn Học Kì",
      major: "Chọn Ngành",
      subject: "Chọn Môn Học",
      class: "Chọn Lớp",
      student: "Chọn Sinh Viên",
      form: "Nhập Điểm",
    }
    return titles[step]
  }

  const getStepDescription = (step: Step): string => {
    const descriptions: Record<Step, string> = {
      semester: "Vui lòng chọn học kì để tiếp tục",
      major: `Học kì: ${selections.semester?.semesterName}`,
      subject: `Ngành: ${selections.major?.majorName}`,
      class: `Môn: ${selections.subject?.subjectName}`,
      student: `Lớp: ${selections.class?.classId}`,
      form: `Sinh viên: ${selections.student?.studentName}`,
    }
    return descriptions[step]
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar Progress */}
      <div className="w-64 border-r border-border bg-background p-6">
        <Link href="/" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <h2 className="mb-4 text-sm font-semibold text-foreground">Quy Trình Nhập Điểm</h2>

        <div className="space-y-3">
          {["semester", "major", "subject", "class", "student", "form"].map((step, index) => (
            <div key={step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    currentStep === step
                      ? "bg-teal-600 text-white"
                      : selections[step as keyof SelectionState]
                        ? "bg-teal-100 text-teal-700"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {selections[step as keyof SelectionState] ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < 5 && (
                  <div className="h-8 w-0.5 bg-muted" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-xs font-medium ${
                  currentStep === step ? "text-teal-600" : selections[step as keyof SelectionState] ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {getStepTitle(step as Step)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{getStepTitle(currentStep)}</h1>
            <p className="mt-2 text-muted-foreground">{getStepDescription(currentStep)}</p>
          </div>

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-sm text-red-800">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Content Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {currentStep === "form" ? "Nhập Điểm cho Sinh Viên" : `Chọn ${getStepTitle(currentStep)}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
              ) : currentStep === "semester" ? (
                <SemesterSelector semesters={semesters} onSelect={handleSemesterSelect} />
              ) : currentStep === "major" ? (
                <MajorSelector majors={majors} onSelect={handleMajorSelect} />
              ) : currentStep === "subject" ? (
                <SubjectSelector subjects={subjects} onSelect={handleSubjectSelect} />
              ) : currentStep === "class" ? (
                <ClassSelector classes={classes} onSelect={handleClassSelect} />
              ) : currentStep === "student" ? (
                <StudentSelector students={students} onSelect={handleStudentSelect} />
              ) : (
                <ScoreInputForm
                  semester={selections.semester!}
                  major={selections.major!}
                  subject={selections.subject!}
                  cls={selections.class!}
                  student={selections.student!}
                  onBack={goBack}
                />
              )}

              {/* Back Button */}
              {currentStep !== "semester" && currentStep !== "form" && (
                <div className="mt-6 flex justify-start">
                  <Button variant="outline" onClick={goBack}>
                    Quay Lại
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Semester Selector Component
function SemesterSelector({
  semesters,
  onSelect,
}: {
  semesters: ISemester[]
  onSelect: (semester: ISemester) => void
}) {
  return (
    <div className="grid gap-3">
      {semesters.length === 0 ? (
        <p className="text-center text-muted-foreground">Không có học kì nào</p>
      ) : (
        semesters.map(semester => (
          <Button
            key={semester._id}
            variant="outline"
            className="h-auto justify-start border-2 p-4 text-left hover:border-teal-600 hover:bg-teal-50"
            onClick={() => onSelect(semester)}
          >
            <div className="flex-1">
              <p className="font-medium">{semester.semesterName}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(semester.startDate).toLocaleDateString('vi-VN')} -{' '}
                {new Date(semester.endDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </Button>
        ))
      )}
    </div>
  )
}

// Major Selector Component
function MajorSelector({ majors, onSelect }: { majors: IMajor[]; onSelect: (major: IMajor) => void }) {
  return (
    <div className="grid gap-3">
      {majors.length === 0 ? (
        <p className="text-center text-muted-foreground">Không có ngành nào</p>
      ) : (
        majors.map(major => (
          <Button
            key={major.majorId}
            variant="outline"
            className="h-auto justify-start border-2 p-4 text-left hover:border-teal-600 hover:bg-teal-50"
            onClick={() => onSelect(major)}
          >
            <p className="font-medium">{major.majorName}</p>
          </Button>
        ))
      )}
    </div>
  )
}

// Subject Selector Component
function SubjectSelector({
  subjects,
  onSelect,
}: {
  subjects: ISubject[]
  onSelect: (subject: ISubject) => void
}) {
  return (
    <div className="grid gap-3">
      {subjects.length === 0 ? (
        <p className="text-center text-muted-foreground">Không có môn học nào</p>
      ) : (
        subjects.map(subject => (
          <Button
            key={subject._id || subject.subjectId}
            variant="outline"
            className="h-auto justify-start border-2 p-4 text-left hover:border-teal-600 hover:bg-teal-50"
            onClick={() => onSelect(subject)}
          >
            <div className="flex-1">
              <p className="font-medium">{subject.subjectName}</p>
              <p className="text-xs text-muted-foreground">{subject.subjectId}</p>
            </div>
          </Button>
        ))
      )}
    </div>
  )
}

// Class Selector Component
function ClassSelector({ classes, onSelect }: { classes: IClass[]; onSelect: (cls: IClass) => void }) {
  return (
    <div className="grid gap-3">
      {classes.length === 0 ? (
        <p className="text-center text-muted-foreground">Không có lớp nào</p>
      ) : (
        classes.map(cls => (
          <Button
            key={cls._id || cls.classId}
            variant="outline"
            className="h-auto justify-start border-2 p-4 text-left hover:border-teal-600 hover:bg-teal-50"
            onClick={() => onSelect(cls)}
          >
            <div className="flex-1">
              <p className="font-medium">{cls.classId}</p>
              <p className="text-xs text-muted-foreground">Giáo viên: {cls.teacherName}</p>
            </div>
          </Button>
        ))
      )}
    </div>
  )
}

// Student Selector Component
function StudentSelector({
  students,
  onSelect,
}: {
  students: IStudent[]
  onSelect: (student: IStudent) => void
}) {
  return (
    <div className="grid gap-3">
      {students.length === 0 ? (
        <p className="text-center text-muted-foreground">Không có sinh viên nào</p>
      ) : (
        students.map(student => (
          <Button
            key={student._id || student.studentId}
            variant="outline"
            className="h-auto justify-start border-2 p-4 text-left hover:border-teal-600 hover:bg-teal-50"
            onClick={() => onSelect(student)}
          >
            <div className="flex-1">
              <p className="font-medium">{student.studentName}</p>
              <p className="text-xs text-muted-foreground">
                {student.studentId} • {student.email}
              </p>
            </div>
          </Button>
        ))
      )}
    </div>
  )
}

// Score Input Form Component
function ScoreInputForm({
  semester,
  major,
  subject,
  cls,
  student,
  onBack,
}: {
  semester: ISemester
  major: IMajor
  subject: ISubject
  cls: IClass
  student: IStudent
  onBack: () => void
}) {
  const [ex1Score, setEx1Score] = useState("")
  const [ex2Score, setEx2Score] = useState("")
  const [examScore, setExamScore] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const scoreData = {
        studentId: student._id || student.studentId,
        subjectId: subject._id || subject.subjectId,
        subjectName: subject.subjectName,
        className: cls.classId,
        semester: semester._id || semester.semesterId,
        ex1Score: parseFloat(ex1Score),
        ex2Score: parseFloat(ex2Score),
        examScore: parseFloat(examScore),
      }

      console.log("[v0] Submitting score:", scoreData)

      await scoreService.upsertScore(scoreData)

      // Reset form
      setEx1Score("")
      setEx2Score("")
      setExamScore("")

      alert("Lưu điểm thành công!")
      onBack()
    } catch (error) {
      console.error("[v0] Error submitting score:", error)
      alert("Lỗi khi lưu điểm!")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 space-y-2 rounded-lg bg-muted/50 p-4">
        <p>
          <span className="font-medium">Sinh viên:</span> {student.studentName}
        </p>
        <p>
          <span className="font-medium">Môn:</span> {subject.subjectName}
        </p>
        <p>
          <span className="font-medium">Lớp:</span> {cls.classId}
        </p>
        <p>
          <span className="font-medium">Học kì:</span> {semester.semesterName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground">Điểm Kiểm Tra 1 (0-10)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={ex1Score}
            onChange={e => setEx1Score(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Điểm Kiểm Tra 2 (0-10)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={ex2Score}
            onChange={e => setEx2Score(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Điểm Thi (0-10)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={examScore}
            onChange={e => setExamScore(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} disabled={submitting}>
            Quay Lại
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" disabled={submitting}>
            {submitting ? "Đang lưu..." : "Lưu Điểm"}
          </Button>
        </div>
      </form>
    </div>
  )
}
