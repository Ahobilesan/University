
// Data Types
export interface ICollege {
    cid: string;
    name: string;
    course: ICourse[];
}

export interface ICourse {
    cid: string;
    name: string;
    subjects: string[];
    month: 6 | 9 | 12 | 24 | 36;
}

export interface ISubject {
    name: string;
}

export interface IGrade {
    subject: string;
    grade: any;
}

export interface ITeacher {
    tid: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    salary: string;
    birthday: string;
    subjects: string[];
}

export interface IStudent {
    sid: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    regNumber: string;
    birthday: string;
    course: ICourse;
    grades: IGrade[];
}

// Return types
export interface IVoid {
    error: boolean;
}

export interface IResult {
    error: boolean;
    result: any;
}

export interface IResults {
    error: boolean;
    limit: number;
    offset: number;
    active: number;
    results: any[];
}

export interface IError {
    error: true;
    msg?: string;
    arg?: any;
}