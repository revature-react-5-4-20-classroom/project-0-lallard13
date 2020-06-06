import { User } from '../models/User'
import { PoolClient, QueryResult } from 'pg'
import { connectionPool } from '.'

// functions for accessing user data from the database

// accessing users by username and password
export async function getUserByUsernamePassword(username: string, password: string) : Promise<User> {
    // connect to database
    console.log("before pool client");
    let client : PoolClient = await connectionPool.connect();
    console.log("connecting to get user")
    try {
        const result : QueryResult = await client.query(`
            SELECT users.id, username, password, first_name, last_name, email, role_name FROM project_0.users
            INNER JOIN project_0.roles ON users.role_id = roles.id
            WHERE username = $1 AND password = $2`,[username, password]);
        // Creates array (size 1) of matching user objects (perhaps use DTO if there's time)
        console.log("Got query result");
        const matchingUsers = result.rows.map((u) => {
            return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email, u.role_name);
        });
        if(matchingUsers.length > 0) {
            console.log("trying to return");
            return matchingUsers[0];
        } else {
            throw new Error('Username/password combination not found');
        }
    } catch(e) {
        console.log("error");
        throw new Error(`Failed to validate user with Database: ${e.message}`);
    } finally {
        client && client.release();
    }
}

// accessing users by id
export async function getUserById(id : number) : Promise<User> {
   // connect to database
   let client : PoolClient = await connectionPool.connect();
   try {
       const result : QueryResult = await client.query(`
           SELECT users.id, username, password, first_name, last_name, email, role_name FROM project_0.users
           INNER JOIN project_0.roles ON users.role_id = roles.id
           WHERE users.id = $1`,[id]);
       // Creates array (size 1) of matching user objects
       const matchingUsers = result.rows.map((u) => {
           return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email, u.role_name);
       });
       if(matchingUsers.length > 0) {
           return matchingUsers[0];
       } else {
           throw new Error(`Cannot find user with id: ${id}`);
       }
   } catch(e) {
       throw new Error(`Failed to validate user with Database: ${e.message}`);
   } finally {
       client && client.release();
   }
} 


// accessing all users
export async function getAllUsers() : Promise<User[]> {
    let client : PoolClient = await connectionPool.connect();
    try {
        const result : QueryResult = await client.query(`
            SELECT users.id, username, password, first_name, last_name, email, role_name FROM project_0.users
            INNER JOIN project_0.roles ON users.role_id = roles.id`);
        // Creates array of all user objects
        const matchingUsers = result.rows.map((u) => {
            return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email, u.role_name);
        });
        return matchingUsers;
    } catch(e) {
        throw new Error(`Failed to access Database: ${e.message}`);
    } finally {
        client && client.release();
    }
}

// update user
export async function updateUser(userToUpdate) : Promise<User> {
    let client : PoolClient = await connectionPool.connect();
    try {
        // first, make sure the user actually exists
        const currentUser : User = await getUserById(userToUpdate.userId); // throws an error if user does not exist
        // next, check if the role is one of the fields to be updated
        let roleId : number = null;
        if(userToUpdate.role) {
            const newRole : string = userToUpdate.role;
            // find the correct role id
            const roleIdResult : QueryResult = await client.query(`
                SELECT id FROM project_0.roles WHERE role_name = $1`,[newRole]);
            roleId = roleIdResult.rows[0].id;
        }
        // get the current role id
        let currentRoleId : number;
        const currentRole : string = currentUser.role;
        const currentRoleIdResult : QueryResult = await client.query(`
            SELECT id FROM project_0.roles WHERE role_name = $1`,[currentRole]);
        currentRoleId = currentRoleIdResult.rows[0].id;
        // Compare current user with submitted user object to create an array of fields
        const fieldsToUpdate = [];
        for(let field in currentUser) {
            if(!userToUpdate[field]) {
                userToUpdate[field] = currentUser[field];
            }
            fieldsToUpdate.push(userToUpdate[field])
        }
        fieldsToUpdate.pop();
        if(roleId) {
            // remove last element, replace it with role id
            fieldsToUpdate.push(roleId);
        } else {
            fieldsToUpdate.push(currentRoleId);
        }
        // now we can make our query
        await client.query(`
        UPDATE project_0.users 
        SET username = $2,
            password = $3,
            first_name = $4,
            last_name = $5,
            email = $6,
            role_id = $7
            WHERE id = $1`,fieldsToUpdate);
        // now get the new user
        const updatedUser : User = await getUserById(userToUpdate.userId);
        return updatedUser;
    } catch(e) {
        throw new Error(`Failed to update user in DB: ${e.message}`);
    } finally {
        client && client.release();
    }
}