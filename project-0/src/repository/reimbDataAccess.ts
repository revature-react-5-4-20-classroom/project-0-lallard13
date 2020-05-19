import { Reimbursement } from '../models/Reimbursement'
import { PoolClient, QueryResult } from 'pg'
import { connectionPool } from '.'

// sorts an array of reimbursements by date submitted
// function sortByTime(reimbursements : Reimbursement[]) : Reimbursement[] {
//     reimbursements.sort((a, b) => {
//         let aDate = new Date(a.dateSubmitted);
//         let bDate = new Date(b.dateSubmitted);
//         let aTime = aDate.getTime();
//         let bTime = bDate.getTime();
//         return aTime - bTime;
//     });
//     return reimbursements;
// }

// functions for accessing reimbursements from the database

// search for reimbursement by reimbursement id (not used in endpoints)
async function getReimbursementById(id : number) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    // find a single reimbursement by its id
    try {
        const result : QueryResult = await client.query(`
            SELECT reimbs.id, u1.username AS author_name, reimbs.amount, reimbs.date_submitted, reimbs.date_resolved, reimbs.description, u2.username AS resolver_name,reimb_status.status,reimb_type."type"
            FROM project_0.reimbursements AS reimbs
            INNER JOIN project_0.users AS u1 ON reimbs.author = u1.id
            LEFT JOIN project_0.users AS u2 ON reimbs.resolver = u2.id
            INNER JOIN project_0.reimbursement_status AS reimb_status ON reimbs.status = reimb_status.id
            INNER JOIN project_0.reimbursement_type AS reimb_type ON reimbs."type" = reimb_type.id
            WHERE reimbs.id = $1
            ORDER BY reimbs.date_submitted`, [id]);
        const resultRows = result.rows;
        if(resultRows.length === 0) {
            throw new Error('Invalid reimbursement ID');
        }
        console.log(resultRows);
        // convert into reimbursement objects
        let reimbursements : Reimbursement[] = resultRows.map((reimb) => {
            return new Reimbursement(reimb.id, reimb.author_name, reimb.amount, reimb.date_submitted, reimb.date_resolved, reimb.description, reimb.resolver_name, reimb.status, reimb.type)
        });
        console.log(reimbursements);
        return reimbursements[0];
    } catch(e) {
        throw new Error(`Failed to access DB: ${e.message}`);
    } finally {
        client && client.release();
    }
}

// search for reimbursements by status id
export async function getReimbursementsByStatus(statusId) : Promise<Reimbursement[]> {
    let client : PoolClient = await connectionPool.connect();
    // find every reimbursement with the given status id
    try {
        const result : QueryResult = await client.query(`
            SELECT reimbs.id, u1.username AS author_name, reimbs.amount, reimbs.date_submitted, reimbs.date_resolved, reimbs.description, u2.username AS resolver_name,reimb_status.status,reimb_type."type"
            FROM project_0.reimbursements AS reimbs
            INNER JOIN project_0.users AS u1 ON reimbs.author = u1.id
            LEFT JOIN project_0.users AS u2 ON reimbs.resolver = u2.id
            INNER JOIN project_0.reimbursement_status AS reimb_status ON reimbs.status = reimb_status.id
            INNER JOIN project_0.reimbursement_type AS reimb_type ON reimbs."type" = reimb_type.id
            WHERE reimbs.status = $1
            ORDER BY reimbs.date_submitted`, [statusId]);
        const resultRows = result.rows;
        if(resultRows.length === 0) {
            throw new Error('Invalid status id');
        }
        console.log(resultRows);
        // convert into reimbursement objects
        let reimbursements : Reimbursement[] = resultRows.map((reimb) => {
            return new Reimbursement(reimb.id, reimb.author_name, reimb.amount, reimb.date_submitted, reimb.date_resolved, reimb.description, reimb.resolver_name, reimb.status, reimb.type)
        });
        // sort by date submitted
        //reimbursements = sortByTime(reimbursements);
        console.log(reimbursements);
        return reimbursements;
    } catch(e) {
        throw new Error(`Failed to access DB: ${e.message}`);
    } finally {
        client && client.release();
    }
}

// search for reimbursements by user id
export async function getReimbursementsByUser(userId) : Promise<Reimbursement[]> {
    let client : PoolClient = await connectionPool.connect();
    // find every reimbursement with the given user id
    try {
        const result : QueryResult = await client.query(`
            SELECT reimbs.id, u1.username AS author_name, reimbs.amount, reimbs.date_submitted, reimbs.date_resolved, reimbs.description, u2.username AS resolver_name,reimb_status.status,reimb_type."type"
            FROM project_0.reimbursements AS reimbs
            INNER JOIN project_0.users AS u1 ON reimbs.author = u1.id
            LEFT JOIN project_0.users AS u2 ON reimbs.resolver = u2.id
            INNER JOIN project_0.reimbursement_status AS reimb_status ON reimbs.status = reimb_status.id
            INNER JOIN project_0.reimbursement_type AS reimb_type ON reimbs."type" = reimb_type.id
            WHERE reimbs.author = $1
            ORDER BY date_submitted`, [userId]);
        const resultRows = result.rows;
        if(resultRows.length === 0) {
            throw new Error('Invalid user id');
        }
        console.log(resultRows);
        // convert into reimbursement objects
        let reimbursements : Reimbursement[] = resultRows.map((reimb) => {
            return new Reimbursement(reimb.id, reimb.author_name, reimb.amount, reimb.date_submitted, reimb.date_resolved, reimb.description, reimb.resolver_name, reimb.status, reimb.type)
        });
        // sort by date submitted
        // eimbursements = sortByTime(reimbursements);
        console.log(reimbursements);
        return reimbursements;
    } catch(e) {
        throw new Error(`Failed to access DB: ${e.message}`);
    } finally {
        client && client.release();
    }
}

// for submitting a new reimbursement request
export async function submitReimbursement(newReimb : Reimbursement) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    try {
        // get ids for author and type
        const authorResult = await client.query('SELECT id FROM project_0.users WHERE username = $1',[newReimb.author]);
        if(!authorResult.rows[0]) {
            throw new Error('Invalid user ID');
        }
        const typeResult = await client.query('SELECT id FROM project_0.reimbursement_type WHERE "type" = $1',[newReimb.type]);
        if(!typeResult.rows[0]) {
            throw new Error('Invalid reimbursement type');
        }
        let [authorId, typeId] = [authorResult, typeResult].map((result)=>{return result.rows[0].id});

        // submit reimbursement to database
        await client.query(`
            INSERT INTO project_0.reimbursements (author, amount, description, date_submitted, type)
            VALUES ($1, $2, $3, $4, $5)`,[authorId,newReimb.amount,newReimb.description,newReimb.dateSubmitted,typeId]);
        // get the max id to return the newly added reimbursement
        let submissionId : QueryResult = await client.query(`SELECT MAX(id) FROM project_0.reimbursements`);
        let submissionResult = await getReimbursementById(submissionId.rows[0].max);
        return submissionResult;

    } catch(e) {
        throw new Error(`Failed to add Reimbursement Request: ${e.message}`);
    } finally {
        client && client.release();
    }
}

export async function updateReimbursement(reimbToUpdate : Reimbursement) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    try {
        // first, get the current reimbursement in the DB
        const currentReimb = await getReimbursementById(reimbToUpdate.reimbursementId);
        // replace any empty fields with the fields of the current entry
        for(let field in reimbToUpdate) {
            if(!reimbToUpdate[field]) {
                reimbToUpdate[field] = currentReimb[field];
            }
        }
        // now update the entry in the database
        let updateParameters = await convertReimbToArray(reimbToUpdate);
        await client.query(`
            UPDATE project_0.reimbursements
            SET author = $2, 
            amount = $3, 
            date_submitted = $4,
            date_resolved = $5,
            description = $6,
            resolver = $7,
            status = $8,
            type = $9
            WHERE id = $1`, updateParameters);
        const updatedReimb : Reimbursement = await getReimbursementById(reimbToUpdate.reimbursementId);
        return updatedReimb;

    } catch(e) {
        throw new Error(`Failed to update reimbursement: ${e.message}`);
    } finally {
        client && client.release();
    }
}

// for converting from JS object to an array with fields for a database object
async function convertReimbToArray(reimb : Reimbursement) : Promise<any[]> {
    let client : PoolClient = await connectionPool.connect();
    // author
    let authorResult : QueryResult = await client.query(`
        SELECT id FROM project_0.users WHERE username = $1`,[reimb.author]);
    let authorId : number = authorResult.rows[0].id;
    // resolver
    let resolverResult : QueryResult = await client.query(`
        SELECT id FROM project_0.users WHERE username = $1`,[reimb.resolver]);
    let resolverId : number = resolverResult.rows[0].id;
    // status
    let statusResult : QueryResult = await client.query(`
        SELECT id FROM project_0.reimbursement_status WHERE status = $1`,[reimb.status]);
    let statusId : number = statusResult.rows[0].id;
    // type
    let typeResult : QueryResult = await client.query(`
        SELECT id FROM project_0.reimbursement_type WHERE type = $1`,[reimb.type]);
    let typeId : number = statusResult.rows[0].id;

    return [reimb.reimbursementId,authorId,reimb.amount,reimb.dateSubmitted,reimb.dateResolved,reimb.description,resolverId,statusId,typeId];

}