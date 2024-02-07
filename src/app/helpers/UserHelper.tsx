import { User } from "../types";


export function isValidUser({first_name, last_name, email}: User){
    if(first_name.length > 1 && last_name.length > 1){
        var userPartOfEmail = email.slice(0, email.indexOf('@'))
        if(userPartOfEmail.length > 1 && email.endsWith('@strath.ac.uk')){
        return true
        }
    }
    return false
}