import express, {Router, Request, Response, NextFunction} from 'express';
import { getReimbursementsByStatus, getReimbursementsByUser, submitReimbursement, updateReimbursement } from '../repository/reimbDataAccess';
import { Reimbursement } from '../models/Reimbursement';
import { authRoleFactory } from '../middleware/authMiddleware';

// router for all /reimbursements requests
export const reimbursementRouter : Router = express.Router();

// submit reimbursement
reimbursementRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    // Request: the reimbursementId should be 0
    // Response: Status Code 201 CREATED
    const newReimb : Reimbursement = req.body;
    try{
        const returnedReimb : Reimbursement = await submitReimbursement(newReimb);
        res.status(201).json(returnedReimb);
    } catch(e) {
        next(e);
    }
});

// find reimbursements by user
reimbursementRouter.get('/author/userId/:userID', async (req: Request, res: Response, next: NextFunction) => {
    // returns reimbursements
    // allowed roles: finance-manager, or if their userIs is the user making the request\
    const userId = +req.params.userID;
    if(req.session.user.userId !== userId && req.session.user.role !== 'finance-manager') {
        res.status(401).send('Unauthorized request');
    } else if(isNaN(userId)) {
        res.status(400).send('ID field must be an integer');
    } else {
        try {
            const reimbursements = await getReimbursementsByUser(userId);
            res.json(reimbursements);
        } catch(e) {
            next(e);
        }
    }
});

reimbursementRouter.use(authRoleFactory(['finance-manager']));
// find reimbursements by status
reimbursementRouter.get('/status/:stadusId', async (req: Request, res: Response, next: NextFunction) => {
    // returns reimbursements
    // allowed roles: fincance-manager
    const statusId = +req.params.stadusId;
    if(isNaN(statusId)) {
        res.status(400).send('ID field must be an integer');
    } else {
        try {
            const reimbursements = await getReimbursementsByStatus(statusId);
            res.json(reimbursements);
        } catch(e) {
            next(e);
        }
    }
})

// update reimbursement
reimbursementRouter.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    // The reimbursementId must be present as well as all fields to update, any field left undefined will not be updated.
    // Can be used to approve or deny
    // Request: Reimbursement
    // Response: Reimbursement
    // allowed roles: finance-manager
    console.log('test');
    let reimbToUpdate : Reimbursement = req.body;
    if(!reimbToUpdate.reimbursementId){
        res.status(400).send('Invalid Reimbursement id');
    }
    try {
        let updatedReimb : Reimbursement = await updateReimbursement(reimbToUpdate);
        res.json(updatedReimb);
    } catch(e) {
        next(e);
    }
})

