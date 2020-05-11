import express from 'express';
import bodyparser from 'body-parser';
import IBook from './IBook'; // import IBook in this directory
// This is a basic ES6 import statement pulling in a default export
// we got via npm
// we also got bodyparser via npm

// We can also import non-default exports by name by using {}:
import {Application, Request, Response} from 'express';

// For now, we need some fake data to have in our API so we can send it out
let books : IBook[] = [
    {
        title: 'The Cat in the Hat',
        author: 'Dr. Seuss',
        yearPublished: 1957
    },
    {
        title: 'Lord of the Flies',
        author: 'William Golding',
        yearPublished: 1954
    },
    {
        title: 'The Fellowship of the Ring',
        author: 'J.R.R. Tolkien',
        yearPublished: 1954
    },
    {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J.K. Rowling",
        yearPublished: 1997
    }
]

const app : Application = express(); // This line builds the application using express

// We're adding our first piece of prebuilt middleware. bodyparser will parse
// the body of incoming HTTP requests as JSON
// This app.use doesn't have a path associated with it. That means it will
// catch all incoming requests
app.use(bodyparser.json());

// We're going to create a 'hello' endpoint
// since this is app.use, it takes all requests that come to /hello
app.use('/hello',(req : Request, res : Response) => {
    // req is the incoming HTTP request
    // res is the outgoing HTTP response
    // We're just going to send out 'Hello World' as JSON
    res.json('Hello From Our Server');
})

// This won't have an effect since requests to '/hello' are already handled above
// BE CAREFUL of errors like this one
app.get('/hello', (req : Request, res : Response) => {
    // return all books as JSON
    res.json("Hello From .get()!");
})

// We're going to make the same endpoint accept new books, submitted with a POST
app.post('/books', (req : Request, res : Response) => {
    // Here we add the book submitted in req to our books array
    // In practice, we want to be much more careful about this!!
    console.log(req.body); // log the body of the request
    // We just assume the request has a book to add
    books.push(req.body);
    res.sendStatus(201); // 201 is CREATED
})

// Make an endpoint for all books.
// This endpoint, since it involves retrieval, should resond to GET requests
app.get('/books', (req : Request, res : Response) => {
    // return all books as JSON
    res.json(books);
})

// Now we need to actually make the server run
// We do this by telling app to listen on a specific port
app.listen(3000, ()=>{
    console.log('app has started')
});