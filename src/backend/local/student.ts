// Imports
import { University } from "./database";
import { IStudent, IResult, IResults, IVoid, IError } from "../interface"
import { sleep } from "./util"
import { v4 as uuidv4 } from 'uuid';

// Intializing Database
const db = new University();

// Functions
// eslint-disable-next-line
export default {
    create: async function (data: IStudent): Promise<IError | IVoid> {
        await sleep()
        try {
            if (!data.firstName) {
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

            if (!data.grades) {
                return {
                    error: true,
                    msg: "invalidGrades"
                }
            }

            let student: IStudent = {
                sid: uuidv4(),
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                gender: data.gender,
                birthday: data.birthday,
                regNumber: data.regNumber,
                course: data.course,
                grades: data.grades
            }

            await db.student.add(student)

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
    read: async function (sid: string): Promise<IError | IResult> {
        await sleep()
        try {
            if (!sid) {
                return {
                    error: true,
                    msg: "invalidStudentID"
                }
            }

            let student: any = await db.student.filter((r) => { return r.sid === sid }).first();
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
    readAll: async function (limit?: number, filter?: any): Promise<IError | IResults> {
        await sleep()
        try {
            let student: IStudent[]

            limit = limit ? parseFloat(limit as any) + 15 : 15;

            let filteredData = await (await db.student.filter((r: any) => {
                let result = false;

                if (filter && filter.name) {
                    if (r.firstName.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1 || r.lastName.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1) {
                        result = true
                    } else {
                        return false
                    }
                }
                if (filter && filter.course) {
                    if (r.course.cid === filter.course) {
                        result = true
                    } else {
                        return false
                    }
                }
                if (!filter || !filter.name || !filter.course) {
                    result = true
                }
                return result
            }))
            let count = await filteredData.count();
            student = await (await filteredData.limit(limit).toArray()).reverse();

            return {
                error: false,
                limit: Math.ceil(count / 15),
                active: Math.ceil(limit / 15),
                offset: limit,
                results: [...student.slice(0, 15)]
            }
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    },
    update: async function (sid: string, data: IStudent): Promise<IError | IVoid> {
        await sleep()
        try {
            if (!sid) {
                return {
                    error: true,
                    msg: "invalidStudentID"
                }
            }

            if (!data.firstName) {
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

            if (!data.grades) {
                return {
                    error: true,
                    msg: "invalidGrades"
                }
            }
            let student = await db.student.filter((r) => { return r.sid === sid }).first();

            if (student !== undefined) {
                student.firstName = data.firstName ? data.firstName : student.firstName;
                student.lastName = data.lastName ? data.lastName : student.lastName;
                student.email = data.email ? data.email : student.email;
                student.gender = data.gender ? data.gender : student.gender;
                student.regNumber = data.regNumber ? data.regNumber : student.regNumber;
                student.birthday = data.birthday ? data.birthday : student.birthday;
                student.course = data.course ? data.course : student.course;
                student.grades = data.grades ? data.grades : student.grades;

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
    delete: async function (sid: string): Promise<IError | IVoid> {
        await sleep()
        try {
            if (!sid) {
                return {
                    error: true,
                    msg: "invalidStudentID"
                }
            }

            await db.student.where("sid").anyOf(sid).delete();
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