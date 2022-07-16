# Library - CSoC Dev Task 4 (Express)

Jim
Test1234$

## Introduction

Welcome to the Week 4 of CSOC Dev. In this assignment, you will be working on the Express backend of a library web application. A boilerplate has already been created for you and all that remains is to fill in the code wherever we've asked you to, or wherever you feel required.

A very basic frontend has already been created for visualizing the results. You need not mess with it until the later stages of the assignment. Also there are no extra points for UI, as main aim of the task is to learn about working with express.

### Setting up the project

- Fork and clone this repo.
- Go to project folder in terminal and run `npm install`, to install all dependencies.
- Start the development server using `npm run dev`.
- Server should automatically reload and reflect your changes upon saving, if that doesn't happen quit the server using `ctrl+c` and restart development server.

### Working
* There will be several books present in the Library, which can be added or removed only from the database directly (Book model).
* Every book will have several instances. Again, this can be added or removed only from the database directly. Note that each instance denotes a physical copy of the book (BookCopy model).
* As an example, if a book B1 has 5 copies, then there shall be 5 BookCopy instances corresponding to the book B1.
* While borrowing a book, a logged in user can borrow any instance of the BookCopy model whose status is available. A user is allowed to borrow multiple copies of the same book. After successfully borrowing a copy, the number of copies of the book available in the library will decrease. That is, if the user borrows the book B1, then the number of instances of book B1 will become 4. The instance won't get deleted on borrowing as it represents a physical copy of the book.
* A user can return a copy of the book, and thereby, the number of copies of the book available will increase by 1, for each book copy returned.

## Tasks
#### Stage 1 (50 Points)
Complete the following controllers without altering the frontend. Necessary details have been mentioned as comments in the controllers themselves. Add in the middleware function so that only a logged in user can view the loaned books or issue a book.

* `getAllBooks`
* `getBook`
* `searchBooks`
* `getLoanedBooks`
* `issueBook`

#### Stage 2 (30 Points)
Complete the controller and route for returning an issued book. You need to write this route all by yourself.

* Your route will accept Book Copy ID as an argument and mark the appropriate Book Copy as returned and return an appropriate response.
* You will have to add route in app.js and call the respective controller which you will define in `controller/store.js`.

#### Stage 3 (60 Points)
In this stage, you will need to connect your express app with your Mongo DB and create the models.

* You will need to create your MongoDB server using Mongo Atlas and connect it to your express app in app.js. 
* Create the Book, BookCopy and User model according to the fields given.
* Store references of user who has loaned the copy and of the book in the bookCopy Schema and store array of references of loaned book copies in User Schema.
* Import these models in `controllers/store.js` and `controllers/auth.js` and use it to access the data from the db.


#### Stage 4 (100 Points)
In the `controllers/auth.js`, fill in the controllers for login, logout and user registration. You will also need to create basic frontend view for these in `views/`. Refer to the existing ejs templates if you have any issue. Also fill in the isLoggedIn function in `middleware/index.js`.

## Deadline
You'll have a week to complete this task. Hence, the deadline of this task is 23rd July, 2022.
