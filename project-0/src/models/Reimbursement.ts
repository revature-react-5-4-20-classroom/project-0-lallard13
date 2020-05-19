// the Reimbursement model represents a single reimbursement that an employee would submit
export class Reimbursement {
    reimbursementId: number; // primary key
	author: string;  // foreign key -> User, not null
	amount: number;  // not null
    dateSubmitted: string; // not null
    dateResolved: string; // not null
    description: string; // not null
    resolver: string; // foreign key -> User
    status: string; // foreign key -> ReimbursementStatus, not null
    type: string; // foreign key -> ReimbursementType

    constructor(reimbursementId:number, author:string, amount:number, dateSubmitted:string, dateResolved:string, description:string, resolver:string, status:string, type:string) {
        this.reimbursementId = reimbursementId;
        this.author = author;
        this.amount = amount;
        this.dateSubmitted = dateSubmitted;
        this.dateResolved = dateResolved;
        this.description = description;
        this.resolver = resolver;
        this.status = status;
        this.type = type;
    }
}