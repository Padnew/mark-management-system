export interface ClassType{
    class_code: string;
    class_name: string;
    credit_level: number;
    credits: number;
    locked: boolean;
    user_id?: number;
}
  
export interface Lecturer{
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: number;
}

export interface Student{
    reg_number: string;
    name: string;
    degree_name: string;
    degree_level: string;
}

export interface User{
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: number;
}

export interface Result{
    result_id: number;
    class_code: string;
    mark: number;
    reg_number: string;
    unique_code: string;
}

export interface CSVRow {
    ClassCode: string;
    RegistrationNumber: string;
    Result: string;
    Student: string;
    DegreeLevel: string;
    CourseName: string;
    UniqueCode: string;
  }