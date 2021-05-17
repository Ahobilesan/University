// Imports
import { University } from "./database";
import { ITeacher, IResult, IResults, IVoid, IError } from "../interface"
import { v4 as uuidv4 } from 'uuid';

// Intializing Database
const db = new University();

// Functions
// eslint-disable-next-line
export default {
    create: async function (data: ITeacher): Promise<IError | IVoid> {
        try {
            if (!data.firstName) {
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

            if (!data.gender) {
                return {
                    error: true,
                    msg: "invalidGender"
                }
            }
            let teacher: ITeacher = {
                tid: uuidv4(),
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                birthday: data.birthday,
                salary: data.salary,
                subjects: data.subjects,
                gender: data.gender
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
    readAll: async function (limit?: number, filter?: any): Promise<IError | IResults> {
        try {
            let teacher: ITeacher[]

            limit = limit ? parseFloat(limit as any) + 25 : 25;

            let filteredData = await (await db.teacher.filter((r: any) => {
                let result = false;

                if (filter && filter.name) {
                    if (r.firstName.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1 || r.lastName.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1) {
                        result = true
                    } else {
                        return false
                    }
                }
                if (filter && filter.subject) {
                    if (r.subjects.indexOf(filter.subject) !== -1) {
                        result = true
                    } else {
                        return false
                    }
                }
                if (!filter || !filter.name || !filter.subject) {
                    result = true
                }
                return result
            }))
            let count = await filteredData.count();
            teacher = await (await filteredData.limit(limit).toArray()).reverse();

            return {
                error: false,
                limit: Math.ceil(count / 25),
                active: Math.ceil(limit / 25),
                offset: limit,
                results: [...teacher.slice(0, 25)]
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

            if (!data.firstName) {
                return {
                    error: true,
                    msg: "invalidTeacherName"
                }
            }

            if (!data.gender) {
                return {
                    error: true,
                    msg: "invalidGender"
                }
            }

            let teacher = await db.teacher.filter((r) => { return r.tid === tid }).first();

            if (teacher !== undefined) {
                teacher.firstName = data.firstName ? data.firstName : teacher.firstName;
                teacher.lastName = data.lastName ? data.lastName : teacher.lastName;
                teacher.email = data.email ? data.email : teacher.email;
                teacher.birthday = data.birthday ? data.birthday : teacher.birthday;
                teacher.salary = data.salary ? data.salary : teacher.salary;
                teacher.gender = data.gender ? data.gender : teacher.gender;
                teacher.subjects = data.subjects ? data.subjects : teacher.subjects;

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