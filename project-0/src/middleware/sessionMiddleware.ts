import express, {Request, Response, NextFunction} from 'express'

import session from 'express-session';

// config settings
const sessionConfig = {
    secret: 'thisShouldBeSecret',
    cookie: {secure:false},
    resave: false,
    saveUninitialized: false
}

export const sessionMiddleware = session(sessionConfig);