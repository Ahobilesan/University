import { ICourse, IStudent, ITeacher } from "../backend/interface";
import { Genders, Months, Days } from "./data"


// Variables
const DateObj = new Date()
const NumberFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

// Functions
function formatDate(d: Date | string | number | undefined): Date {
    let D = DateObj;

    if (d) {
        if (validateNumber(d as any)) {
            D = new Date(parseFloat(d as any))
        } else {
            D = new Date(d as any)
        }
    }

    if (isNaN(D.getTime())) {
        D = DateObj
    }
    return D
}

// Exports
export function validateString(str: string) {
    let stringReg = new RegExp(/^[a-zA-Z-&/(),.:-]+$/)
    return stringReg.test(str.replace(/\s/g, ""))
}

export function validateNumber(str: number) {
    let numberReg = new RegExp(/^\d+$/)
    return numberReg.test(String(str))
}

export function validateEmail(email: string) {
    let emailReg = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return emailReg.test(email)
}

export function getTimestemp(date?: Date | string) {
    return formatDate(date).getTime()
}

export function getDate(timestamp?: string | number) {
    let date = formatDate(timestamp);
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
}

export function getVisibleDate(date?: Date | string | number, showDay?: boolean) {
    let _date = formatDate(date)
    if (showDay) {
        return `${Days[_date.getDay()]} ${_date.getDate()} ${Months[_date.getMonth()]} ${_date.getFullYear()}`
    } else {
        return `${_date.getDate()} ${Months[_date.getMonth()].substring(0, 3)} ${_date.getFullYear()}`
    }
}

export function getCurrency(amount: number | string) {
    let number = parseFloat(amount as any)
    if (!number) {
        return NumberFormat.format(0)
    }

    return NumberFormat.format(number)
}

export function validateStudent(student: IStudent) {
    if (!student) {
        return {
            valid: false,
            msg: "Student not defined"
        }
    }

    if (!student.firstName) {
        return {
            valid: false,
            msg: "First name not defined"
        }
    } else {
        if (!validateString(student.firstName)) {
            return {
                valid: false,
                msg: "First name is not a valid"
            }
        }
    }
    if (!student.lastName) {
        return {
            valid: false,
            msg: "Last name not defined"
        }
    } else {
        if (!validateString(student.lastName)) {
            return {
                valid: false,
                msg: "Last name is not a valid"
            }
        }
    }
    if (!student.email) {
        return {
            valid: false,
            msg: "Email not defined"
        }
    } else {
        if (!validateEmail(student.email)) {
            return {
                valid: false,
                msg: "Email is not a valid"
            }
        }
    }
    if (!student.gender) {
        return {
            valid: false,
            msg: "Gender name not defined"
        }
    } else {
        if (Genders.findIndex((r) => r.text === student.gender) === -1) {
            return {
                valid: false,
                msg: "Gender is not a valid"
            }
        }
    }
    if (!student.regNumber) {
        return {
            valid: false,
            msg: "Regstration Number name not defined"
        }
    } else {
        if (!validateNumber(student.regNumber as any)) {
            return {
                valid: false,
                msg: "Regstration Number is not a valid"
            }
        }
    }
    if (!student.birthday) {
        return {
            valid: false,
            msg: "Date of Birth name not defined"
        }
    } else {
        let date = new Date(parseFloat(student.birthday))
        if (isNaN(date.valueOf())) {
            return {
                valid: false,
                msg: "Date of Birth is not valid"
            }
        }
    }
    if (!student.course) {
        return {
            valid: false,
            msg: "Course name not defined"
        }
    }
    if (!student.grades) {
        return {
            valid: false,
            msg: "Grades name not defined"
        }
    } else {
        let isValid = false
        student.grades.forEach(element => {
            if (!element.grade) {
                return isValid = false
            } else {
                isValid = true
            }
        });
        if (!isValid) {
            return {
                valid: false,
                msg: "Grades are not valid"
            }
        }
    }
    return {
        valid: true,
        msg: "Student dictionary is complete"
    }
}

export function validateCourse(course: ICourse) {
    if (!course) {
        return {
            valid: false,
            msg: "Course not defined"
        }
    }

    if (!course.name) {
        return {
            valid: false,
            msg: "Course name not defined"
        }
    } else {
        if (!validateString(course.name)) {
            return {
                valid: false,
                msg: "Course name is not valid"
            }
        }
    }
    if (!course.month) {
        return {
            valid: false,
            msg: "Course month not defined"
        }
    } else {
        if (!validateNumber(course.month)) {
            return {
                valid: false,
                msg: "Course month is not valid"
            }
        }
    }
    if (!course.subjects) {
        return {
            valid: false,
            msg: "Course subjects not defined"
        }
    } else {
        if (course.subjects.length === 0) {
            return {
                valid: false,
                msg: "Atleast need one subject to add Course"
            }
        } else {
            let result = false
            for (let i = 0; i < course.subjects.length; i++) {
                if (!validateString(course.subjects[i])) {
                    console.log(course.subjects[i])
                    result = false
                    break
                } else {
                    result = true
                }
            }
            if (!result) {
                return {
                    valid: false,
                    msg: "One of the Subject is not valid"
                }
            }
        }
    }
    return {
        valid: true,
        msg: "Course dictionary is complete"
    }
}

export function validateTeacher(teacher: ITeacher) {
    if (!teacher) {
        return {
            valid: false,
            msg: "Teacher not defined"
        }
    }

    if (!teacher.firstName) {
        return {
            valid: false,
            msg: "First name not defined"
        }
    } else {
        if (!validateString(teacher.firstName)) {
            return {
                valid: false,
                msg: "First name is not a valid"
            }
        }
    }
    if (!teacher.lastName) {
        return {
            valid: false,
            msg: "Last name not defined"
        }
    } else {
        if (!validateString(teacher.lastName)) {
            return {
                valid: false,
                msg: "Last name is not a valid"
            }
        }
    }
    if (!teacher.email) {
        return {
            valid: false,
            msg: "Email not defined"
        }
    } else {
        if (!validateEmail(teacher.email)) {
            return {
                valid: false,
                msg: "Email is not a valid"
            }
        }
    }
    if (!teacher.gender) {
        return {
            valid: false,
            msg: "Gender name not defined"
        }
    } else {
        if (Genders.findIndex((r) => r.text === teacher.gender) === -1) {
            return {
                valid: false,
                msg: "Gender is not a valid"
            }
        }
    }
    if (!teacher.salary) {
        return {
            valid: false,
            msg: "Salary name not defined"
        }
    } else {
        if (!validateNumber(Math.ceil(parseFloat(teacher.salary)) as any)) {
            return {
                valid: false,
                msg: "Salary is not a valid"
            }
        }
    }
    if (!teacher.birthday) {
        return {
            valid: false,
            msg: "Date of Birth name not defined"
        }
    } else {
        let date = new Date(parseFloat(teacher.birthday))
        if (isNaN(date.valueOf())) {
            return {
                valid: false,
                msg: "Date of Birth is not valid"
            }
        }
    }
    if (!teacher.subjects) {
        return {
            valid: false,
            msg: "Course subjects not defined"
        }
    } else {
        if (teacher.subjects.length === 0) {
            return {
                valid: false,
                msg: "Atleast need one subject to add Course"
            }
        } else {
            let result = false
            for (let i = 0; i < teacher.subjects.length; i++) {
                if (!validateString(teacher.subjects[i])) {
                    console.log(teacher.subjects[i])
                    result = false
                    break
                } else {
                    result = true
                }
            }
            if (!result) {
                return {
                    valid: false,
                    msg: "One of the Subject is not valid"
                }
            }
        }
    }
    return {
        valid: true,
        msg: "Teacher dictionary is complete"
    }
}