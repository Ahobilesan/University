// Imports
import { University } from "./database";
import { ICollege, IResult, IResults, IVoid, IError } from "../interface"
import { v4 as uuidv4 } from 'uuid';

// Intializing Database
const db = new University();

// Functions
export default {
    create: async function (data: ICollege): Promise<IError | IVoid> {
        try {
            if (!data.name) {
                return {
                    error: true,
                    msg: "invalidCollegeName"
                }
            }

            if (!data.course) {
                return {
                    error: true,
                    msg: "invalidCourse"
                }
            }

            let college: ICollege = {
                cid: uuidv4(),
                name: data.name,
                course: data.course,
            }

            await db.college.put(college)

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
    read: async function (cid: string): Promise<IError | IResult> {
        try {
            if (!cid) {
                return {
                    error: true,
                    msg: "invalidCollegeID"
                }
            }

            let college: any = await db.college.filter((r) => { return r.cid === cid }).first();
            if (college !== undefined) {
                let teacher = await db.teacher.filter((r) => { return r.college === college!.name }).toArray();
                let student = await db.student.filter((r) => { return r.college === college!.name }).toArray();
                college.teacher = [...teacher]
                college.student = [...student]
            } else {
                return {
                    error: true,
                    msg: "invalidData"
                }
            }

            return {
                error: false,
                result: { ...college }
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
            let college: ICollege[]
            let db_college = db.college
            let count = await db_college.count()
            if (limit) {
                college = await db_college.limit(limit).toArray();
            } else {
                college = await db_college.toArray();
            }

            return {
                error: false,
                limit: count,
                results: [...college]
            }
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    },
    update: async function (cid: string, data: ICollege): Promise<IError | IVoid> {
        try {
            if (!cid) {
                return {
                    error: true,
                    msg: "invalidCollegeID"
                }
            }

            if (!data.name) {
                return {
                    error: true,
                    msg: "invalidCollegeName"
                }
            }

            if (!data.course) {
                return {
                    error: true,
                    msg: "invalidCourse"
                }
            }

            let college: any = await db.college.filter((r) => { return r.cid === cid }).first();
            if (college !== undefined) {
                college.name = data.name;
                college.course = data.course;

                await db.college.put(college)
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
    delete: async function (cid: string): Promise<IError | IVoid> {
        try {
            if (!cid) {
                return {
                    error: true,
                    msg: "invalidCollegeID"
                }
            }

            await db.college.where("cid").anyOf(cid).delete();
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
