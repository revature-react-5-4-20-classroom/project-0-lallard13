// interfaces are like classes in that they specify fields
// but we don't add values to our interfaces. Instead an interface
// is like a contract that your classes / objects have to follow.
// If a class "implements" an interface, it must have all the interface's fields.

// To make this interface available in index.ts, we need to export it.
// we can just say "export interface IBook", it will be exported,
// and must be imported by name.
// Our other option is to make it our default export, by saying
// "export default interface IBook". Each file can have at most one
// default export. The default export can be imported without specifying its name

export default interface IBook {
    title: string,
    author: string,
    yearPublished: number,
    // we can have optional fields, denoted with ?
    pageCount? : number
}

