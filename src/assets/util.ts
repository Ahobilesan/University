import { IStudent } from "../backend/interface";
import { Genders, Months, Days } from "./data"

// Functions
function formatDate(d: Date | string | number | undefined): Date {
    let D = new Date();

    if (d) {
        if (validateNumber(d as any)) {
            D = new Date(parseFloat(d as any))
        } else {
            D = new Date(d as any)
        }
    }

    if (isNaN(D.getTime())) {
        D = new Date()
    }
    return D
}

// Exports
export function validateString(str: string) {
    let stringReg = new RegExp(/^[a-zA-Z]+$/)
    return stringReg.test(str)
}

export function validateNumber(str: number) {
    let numberReg = new RegExp(/^\d+$/)
    return numberReg.test(String(str))
}

export function validateEmail(email: string) {
    let emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
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

export function validateStudent(student: IStudent) {
    if (!student) {
        return {
            valid: false,
            msg: "student not defined"
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