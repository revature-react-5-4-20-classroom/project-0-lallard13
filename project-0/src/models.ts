// the User model keeps track of users information
export interface IUser {
    userId: number, // primary key
    password: string, // not null
	firstName: string, // not null
	lastName: string, // not null
	email: string, // not null
	role: IRole // not null
}

// the Role model is used to track what permissions a user has
export interface IRole {
    roleId: number, // primary key
    role: string // not null, unique
}

// the Reimbursement model represents a single reimbursement that an employee would submit
export interface IReimbursement {
    reimbursementId: number, // primary key
	author: number,  // foreign key -> User, not null
	amount: number,  // not null
    dateSubmitted: number, // not null
    dateResolved: number, // not null
    description: string, // not null
    resolver: number, // foreign key -> User
    status: number, // foreign key -> ReimbursementStatus, not null
    type: number // foreign key -> ReimbursementType
}

// the ReimbursementStatus model keeps track of reimbursements.
// Status possibilities are Pending, Approved, or Denied
export interface IReimbursementStatus {
    statusId: number, // primary key
    status: string // not null, unique
}

// The ReimbursementType model is used to track what kind of reimbursement is being submitted
// Types include Travel, Food, or Other
export interface IReimbursementType {
    typeId: number, // primary key
    type: string, // not null, unique
}