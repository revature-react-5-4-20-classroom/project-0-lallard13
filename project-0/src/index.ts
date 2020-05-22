import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import {Application, Request, Response} from 'express';
import { userRouter } from './routers/userRouter';
import { reimbursementRouter } from './routers/reimbursementRouter';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import { connectionPool } from './repository';
import { PoolClient, QueryResult } from 'pg';
import { getUserByUsernamePassword } from './repository/userDataAccess';
import { authRoleFactory } from './middleware/authMiddleware';

const app: Application = express();

// Check if webhook works by pushing new endpoint:
app.get('/new-endpoint', (req: Request, res: Response) => {
    res.send('Webhooks worked!');
})

app.use(bodyParser.json());

// session middleware for keeping track of session data
app.use(sessionMiddleware);

// logging middleware to make note of all requests
app.use(loggingMiddleware);

// login endpoint
app.post('/login', async (req: Request, res: Response, next:NextFunction) => {
    // lets user log in
    const {username, password} = req.body;
    if(!username || !password) {
        res.status(400).json({ message: "Invalid Credentials" });
    } else {
        try {
            const user = await getUserByUsernamePassword(username, password);
            if(req.session){
                req.session.user = user;
                res.json(user)
            } else {
                res.sendStatus(400);
            }
    
        } catch(e) {
            next(e);
        }
    }
})

// require login
app.use(authRoleFactory(['employee','finance-manager','admin']))

// endpoints to /users
app.use('/users',userRouter);
//endpoints to /reimbursements
app.use('/reimbursements',reimbursementRouter);

app.listen(1313, async ()=> {
    console.log('Reimbursement Server has started. Testing connection...');
    try {
        let client : PoolClient = await connectionPool.connect();
        console.log('Connected');
    } catch(e) {
        console.error(`Failed to connect: ${e.message}`);
    }
});
