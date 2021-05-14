// Imports
import { University } from "./database";
import { ITeacher, IResult, IResults, IVoid, IError } from "../interface"
import { v4 as uuidv4 } from 'uuid';

// Intializing Database
const db = new University();

// Functions
export default {
    create: async function (data: ITeacher): Promise<IError | IVoid> {
        try {
            if (!data.name) {
                return {
                    error: true,
                    msg: "invalidTeacherName"
                }
            }

            if (!data.subjects) {
                return {
                    error: true,
                    msg: "invalidSubjects"
                }
            }

            if (!data.college) {
                return {
                    error: true,
                    msg: "invalidCollege"
                }
            }
            let teacher: ITeacher = {
                tid: uuidv4(),
                name: data.name,
                subjects: data.subjects,
                college: data.college
            }

            await db.teacher.put(teacher)

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
    read: async function (tid: string): Promise<IError | IResult> {
        try {
            if (!tid) {
                return {
                    error: true,
                    msg: "invalidTeacherID"
                }
            }

            let teacher: any = await db.teacher.filter((r) => { return r.tid === tid }).first();
            if (teacher !== undefined) {
                return {
                    error: false,
                    result: { ...teacher }
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
            let teacher: ITeacher[]
            let db_teacher = db.teacher
            let count = await db_teacher.count()
            if (limit) {
                teacher = await db_teacher.limit(limit).toArray();
            } else {
                teacher = await db_teacher.toArray();
            }

            return {
                error: false,
                limit: count,
                results: [...teacher]
            }
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    },
    update: async function (tid: string, data: ITeacher): Promise<IError | IVoid> {
        try {
            if (!tid) {
                return {
                    error: true,
                    msg: "invalidTeacherID"
                }
            }

            if (!data.name) {
                return {
                    error: true,
                    msg: "invalidTeacherName"
                }
            }

            if (!data.college) {
                return {
                    error: true,
                    msg: "invalidCollege"
                }
            }

            let teacher = await db.teacher.filter((r) => { return r.tid === tid }).first();

            if (teacher !== undefined) {
                teacher.name = data.name;
                teacher.college = data.college;
                teacher.subjects = data.subjects;

                await db.teacher.put(teacher)
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
    delete: async function (tid: string): Promise<IError | IVoid> {
        try {
            if (!tid) {
                return {
                    error: true,
                    msg: "invalidTeacherID"
                }
            }

            await db.teacher.where("tid").anyOf(tid).delete();
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