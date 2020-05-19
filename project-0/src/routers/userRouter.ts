import express, {Router, Request, Response, NextFunction} from 'express';
import { authRoleFactory } from '../middleware/authMiddleware';
import { User } from '../models/User'
import { getAllUsers, getUserById, updateUser } from '../repository/userDataAccess';

// router for all /users requests
export const userRouter : Router = express.Router();

// find users by ID
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    // responds with users
    // allowed roles: finance-manager, or if id matches id of current user
    const id = +req.params.id;
    if (isNaN(id)) {
        res.status(400).send('ID field must be an integer');
    } else if (id !== req.session.user.userId && req.session.user.role !== 'finance-manager') {
        res.status(403).send('Not authorized');
    } else {
        try {
            const user : User = await getUserById(id);
            res.json(user);
        } catch(e) {
            next(e);
        }
    }
});

// find all users
userRouter.get('/', authRoleFactory(['finance-manager']));
userRouter.get('/', async (req: Request, res: Response, next : NextFunction) => {
    // responds with users
    // allowed roles: finance-manager
    try {
        const users : User[] = await getAllUsers();
        res.json(users);
    } catch(e) {
        next(e);
    }
});

// update user
userRouter.use(authRoleFactory(['admin']));
userRouter.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    // userId as well as all fields to update must be present in request
    // any fields left undefined will not be updated
    // returns with user
    // allowed roles: admin
    const userToUpdate : User = req.body;
    try {
        const updatedUser : User = await updateUser(userToUpdate);
        res.json(updatedUser);
    } catch(e) {
        next(e);
    }
});