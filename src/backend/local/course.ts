// Imports
import { University } from "./database";
import { ICourse, IResult, IResults, IVoid, IError } from "../interface"
import { sleep } from "./util"
import { v4 as uuidv4 } from 'uuid';

// Intializing Database
const db = new University();

// Functions
export default {
    create: async function (data: ICourse): Promise<IError | IVoid> {
        await sleep()
        try {
            if (!data.name) {
                return {
                    error: true,
                    msg: "invalidCourseName"
                }
            }

            if (!data.subjects) {
                return {
                    error: true,
                    msg: "invalidSubjects"
                }
            }

            if (!data.month) {
                return {
                    error: true,
                    msg: "invalidMonth"
                }
            }

            let course: ICourse = {
                cid: uuidv4(),
                name: data.name,
                subjects: data.subjects,
                month: data.month
            }

            await db.course.put(course)

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
                    msg: "invalidCourseID"
                }
            }

            let course: any = await db.course.filter((r) => { return r.cid === cid }).first();
            if (course !== undefined) {
                let teacher = await db.teacher.filter((r) => {
                    let result = false
                    let comp = r.subjects.length > course!.subjects.length;
                    if (comp) {
                        r.subjects.forEach((el) => {
                            if (result === false && course!.subjects.indexOf(el) !== -1) {
                                result = true
                            }
                        })
                    } else {
                        course!.subjects.forEach((el: any) => {
                            if (result === false && r.subjects.indexOf(el) !== -1) {
                                result = true
                            }
                        })
                    }

                    return result
                }).toArray();
                let student = await db.student.filter((r) => { return r.course.name === course!.name }).toArray();
                course.teacher = [...teacher]
                course.student = [...student]
            } else {
                return {
                    error: true,
                    msg: "invalidData"
                }
            }

            return {
                error: false,
                result: { ...course }
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
            let course: ICourse[]

            limit = limit ? parseFloat(limit as any) + 15 : 15;

            let filteredData = await (await db.course.filter((r: any) => {
                let result = false;

                if (filter && filter.name) {
                    if (r.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1) {
                        result = true
                    } else {
                        return false
                    }
                }
                if (!filter || !filter.name) {
                    result = true
                }
                return result
            }))
            let count = await filteredData.count();
            course = await (await filteredData.limit(limit).toArray());


            let _course = []
            for (let i = 0; i < course.length; i++) {
                const element = course[i];
                let obj: any = await this.read(element.cid);
                _course.push(obj.result)
            }

            return {
                error: false,
                limit: Math.ceil(count / 15),
                active: Math.ceil(limit / 15),
                offset: limit,
                results: [..._course]
            }
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    },
    update: async function (cid: string, data: ICourse): Promise<IError | IVoid> {
        await sleep()
        try {
            if (!cid) {
                return {
                    error: true,
                    msg: "invalidCourseID"
                }
            }

            if (!data.name) {
                return {
                    error: true,
                    msg: "invalidCourseName"
                }
            }

            if (!data.subjects) {
                return {
                    error: true,
                    msg: "invalidSubjects"
                }
            }

            if (!data.month) {
                return {
                    error: true,
                    msg: "invalidMonth"
                }
            }

            let course: any = await db.course.filter((r) => { return r.cid === cid }).first();
            if (course !== undefined) {
                course.name = data.name;
                course.subjects = data.subjects;
                course.month = data.month;

                await db.course.put(course)
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
        await sleep()
        try {
            if (!cid) {
                return {
                    error: true,
                    msg: "invalidCourseID"
                }
            }

            await db.course.where("cid").anyOf(cid).delete();
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
