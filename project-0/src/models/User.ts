// the User model keeps track of users information
export class User { // comments are constraints within the database
    userId: number; // primary key
    username: string; // unique not null
    password: string; // not null
	firstName: string; // not null
	lastName: string; // not null
	email: string; // not null
    role: string; // not null, foreign key -> roles
    
    constructor(userId:number,username:string, password:string, firstName:string, lastName:string, email:string, role:string) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this. firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }
}