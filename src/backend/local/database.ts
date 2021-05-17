import Dexie from 'dexie';
import { ICourse, IStudent, ITeacher } from "../interface"
import { course, grades, students, teachers } from "./data"
import { v4 as uuidv4 } from 'uuid';


export class University extends Dexie {
    course: Dexie.Table<ICourse, number>;
    teacher: Dexie.Table<ITeacher, number>;
    student: Dexie.Table<IStudent, number>;

    constructor() {
        super("University");

        this.version(1).stores({
            course: 'cid, name, subjects, month',
            teacher: 'tid, firstName, lastName, email, gender, subjects',
            student: 'sid, firstName, lastName, email, gender, course, grades',
        });

        this.course = this.table("course");
        this.teacher = this.table("teacher");
        this.student = this.table("student");
        this.initalizeMockData()
    }

    addTeacherData() {
        let _subjects: any = []
        course.forEach(element => {
            _subjects.push(...element.subjects)
        });

        for (let i = 0; i < _subjects.length; i++) {
            teachers[i % 20].tid = uuidv4()
            teachers[i % 20].subjects.push(_subjects[i])
        }
        return teachers
    }

    async addStudentData() {
        let success = new Promise((resolve) => {
            let addGrades = (student: IStudent) => {
                student.grades = []
                for (let i = 0; i < student.course.subjects.length; i++) {
                    const element = student.course.subjects[i];
                    student.grades.push({ subject: element, grade: grades[(i % 12)] })
                }
            }
            let idx = 0
            for (let i = 0; i < students.length; i++) {
                if (i > 3) {
                    students[i].course = course[(i % 4)]
                } else {
                    students[i].course = course[i]
                }
                students[i].sid = uuidv4()
                addGrades(students[i])
                idx = i
            }

            if (students.length - 1 === idx && students[idx].grades.length !== 0) {
                resolve(true)
            }
        })
        await success;
        return students
    }

    addCourseData() {
        for (let i = 0; i < course.length; i++) {
            course[i].cid = uuidv4()
        }
        return course
    }

    async initalizeMockData() {
        if (localStorage.getItem("mock_data") !== null) {
            return
        }

        localStorage.setItem("mock_data", "created")

        await this.course.bulkAdd(this.addCourseData());
        await this.teacher.bulkAdd(this.addTeacherData());
        await this.student.bulkAdd(await this.addStudentData());
    }
}

