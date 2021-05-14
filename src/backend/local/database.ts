import Dexie from 'dexie';
import { ICollege, IStudent, ITeacher } from "../interface"

export class University extends Dexie {
    college: Dexie.Table<ICollege, number>;
    teacher: Dexie.Table<ITeacher, number>;
    student: Dexie.Table<IStudent, number>;

    constructor() {
        super("University");

        this.version(1).stores({
            college: 'cid, name, course',
            teacher: 'tid, name, college, subjects, students',
            student: 'pid, name, college, course, grades',
        });

        this.college = this.table("college");
        this.teacher = this.table("teacher");
        this.student = this.table("student");
    }

    async create(name: "college" | "teacher" | "student", data: ICollege | IStudent | ITeacher) {
        try {
            if (name !== "college" && name !== "teacher" && name !== "student") {
                return {
                    error: true,
                    msg: "unknownDatabase"
                }
            }

            if (!data) {
                return {
                    error: true,
                    msg: "invalidArguments"
                }
            }

            await this.transaction('rw', this[name], async () => {
                await this[name].put((data as any));
            });
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    }

    async read(name: ("college" | "teacher" | "student"), index?: string) {
        try {
            let key: any
            switch (name) {
                case "college":
                    key = "cid"
                    break;

                case "teacher":
                    key = "tid"
                    break;

                case "student":
                    key = "pid"
                    break;

                default:
                    return {
                        error: true,
                        msg: "unknownDatabase"
                    }
            }

            return await this.transaction('rw', this[name], async () => {
                if (index) {
                    return await this[name].filter((r: any) => (r[key] === index)).first();
                } else {
                    return await this[name].toArray();
                }
            });
        } catch (error) {
            console.log(error)
            return {
                error: true,
                msg: "internalServerError"
            }
        }
    }
}

