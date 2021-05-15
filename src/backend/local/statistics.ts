// Imports
import { University } from "./database";
import { IResult, IError } from "../interface"

// Intializing Database
const db = new University();

// Functions
export default {
    read: async function (): Promise<IError | IResult> {
        try {
            let courseCount = await db.course.count()
            let studentCount = await db.student.count()
            let teacherCount = await db.teacher.count()
            return {
                error: false,
                result: { courses: courseCount, students: studentCount, teachers: teacherCount }
            }
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    }
}
