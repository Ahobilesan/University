
// Data Types
export interface ICollege {
    cid: string;
    name: string;
    course: ICourse[];
}

export interface ICourse {
    name: string;
    subject: ISubject;
    month: 6 | 9 | 12 | 24 | 36;
}

export interface ISubject {
    name: string;
}

export interface IGrade {
    subject: string;
    grade: string;
}

export interface ITeacher {
    tid: string;
    name: string;
    college: string;
    subjects: ISubject[];
}

export interface IStudent {
    pid: string;
    name: string;
    college: string;
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
    results: any[];
}

export interface IError {
    error: boolean;
    msg?: string;
    arg?: any;
}