// Imports
import { University } from "./database";
import { IStudent, IResult, IResults, IVoid, IError } from "../interface"
import { v4 as uuidv4 } from 'uuid';

// Intializing Database
const db = new University();

// Functions
export default {
    create: async function (data: IStudent): Promise<IError | IVoid> {
        try {
            if (!data.name) {
                return {
                    error: true,
                    msg: "invalidStudentName"
                }
            }

            if (!data.course) {
                return {
                    error: true,
                    msg: "invalidCourse"
                }
            }

            if (!data.college) {
                return {
                    error: true,
                    msg: "invalidCollege"
                }
            }

            let student: IStudent = {
                pid: uuidv4(),
                name: data.name,
                course: data.course,
                college: data.college,
                grades: data.grades
            }

            await db.student.put(student)

            return {
                error: false
            }
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    },
    read: async function (pid: string): Promise<IError | IResult> {
        try {
            if (!pid) {
                return {
                    error: true,
                    msg: "invalidStudentID"
                }
            }

            let student: any = await db.student.filter((r) => { return r.pid === pid }).first();
            if (student !== undefined) {
                return {
                    error: false,
                    result: { ...student }
                }
            } else {
                return {
                    error: true,
                    msg: "invalidData"
                }
            }

        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    },
    readAll: async function (limit?: number): Promise<IError | IResults> {
        try {
            let student: IStudent[]
            let db_student = db.student
            let count = await db_student.count()
            if (limit) {
                student = await db_student.limit(limit).toArray();
            } else {
                student = await db_student.toArray();
            }

            return {
                error: false,
                limit: count,
                results: [...student]
            }
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    },
    update: async function (pid: string, data: IStudent): Promise<IError | IVoid> {
        try {
            if (!pid) {
                return {
                    error: true,
                    msg: "invalidStudentID"
                }
            }

            if (!data.name) {
                return {
                    error: true,
                    msg: "invalidStudentName"
                }
            }

            if (!data.course) {
                return {
                    error: true,
                    msg: "invalidCourse"
                }
            }

            if (!data.college) {
                return {
                    error: true,
                    msg: "invalidCollege"
                }
            }
            let student = await db.student.filter((r) => { return r.pid === pid }).first();

            if (student !== undefined) {
                student.name = data.name;
                student.course = data.course;
                student.college = data.college;
                student.grades = data.grades;

                await db.student.put(student)
            } else {
                return {
                    error: true,
                    msg: "invalidData"
                }
            }

            return {
                error: false
            }
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    },
    delete: async function (pid: string): Promise<IError | IVoid> {
        try {
            if (!pid) {
                return {
                    error: true,
                    msg: "invalidStudentID"
                }
            }

            await db.student.where("pid").anyOf(pid).delete();
            return {
                error: false
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