import { Request, Response, NextFunction } from "express";

// middleware for authentication
// authRoleFactory returns a middleware function which authorizes specific roles
export function authRoleFactory(roles : string[]) {
    return (req : Request, res : Response, next : NextFunction) => {
        if(!req.session || !req.session.user) {
            res.status(401).send('Please login');
        } else {
            // filters the roles list to determine a match
            const approvedRole = roles.filter((r : string) => {
                return (r === req.session.user.role);
            });
            if(approvedRole.length > 0) {
                next();
            } else {
                res.status(403).send(`Access for role : ${req.session.user.role} denied.`)
            }
        }
    }
}