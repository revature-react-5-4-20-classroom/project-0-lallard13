import {Role} from './Role';

// the User model keeps track of users information
export class User {
    userId: number; // primary key
    password: string; // not null
	firstName: string; // not null
	lastName: string; // not null
	email: string; // not null
    role: Role; // not null
    
    constructor(userId:number, password:string, firstName:string, lastName:string, email:string, role:Role) {
        this.userId = userId;
        this.password = password;
        this. firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }
}