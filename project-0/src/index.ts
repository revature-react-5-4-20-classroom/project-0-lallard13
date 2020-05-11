import * as Models from './models';
import express from 'express';
import bodyparser from 'body-parser';
import {Application, Request, Response} from 'express';

const app: Application = express();

app.use(bodyparser.json());

// trying to make the endpoints
// login
app.post('/login', (req: Request, res: Response) => {
    // lets user log in
})

// find users
app.get('/users', (req: Request, res: Response) => {
    // responds with users
    // allowed roles: finance-manager
})

// find users by ID
app.get('/users/:id', (req: Request, res: Response) => {
    // responds with users
    // allowed roles: finance-manager, or if id matches id of current user
})

// update user
app.patch('/users', (req: Request, res: Response) => {
    // userId as well as all fields to update must be present in request
    // any fields left undefined will not be updated
    // returns with user
    // allowed roles: admin
})

// find reimbursements by status
app.get('/reimbursements/status/:stadusId', (req: Request, res: Response) => {
    // returns reimbursements
    // allowed roles: fincance-manager
})

// find reimbursements by user
app.get('/reimbursements/author/userId/:userID', (req: Request, res: Response) => {
    // returns reimbursements
    // allowed roles: finance-manager, or if their userIs is the user making the request
})

// submit reimbursement
app.post('/reimbursements', (req: Request, res: Response) => {
    // Request: the reimbursementId should be 0
    // Response: Status Code 201 CREATED
})

// update reimbursement
app.patch('/reimbursements', (req: Request, res: Response) => {
    // The reimbursementId must be present as well as all fields to update, any field left undefined will not be updated.
    // Can be used to approve or deny
    // Request: Reimbursement
    // Response: Reimbursement
    // allowed roles: finance-manager
})