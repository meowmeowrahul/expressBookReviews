const express = require("express");

const books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (isValid(username)) {
		res.status(403).json({ message: "User already exists" });
	}
	if (!username || !password) {
		res.status(404).json({ message: "Username or Password missing" });
	} else {
		users.push({
			username: username,
			password: password,
		});
		res.send("User Registered Successfully");
	}
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
	try {
		const getBooks = new Promise((resolve, reject) => {
			resolve(books);
		});

		const bookList = await getBooks;
		res.status(200).send(JSON.stringify(bookList, null, 4));
	} catch (error) {
		res.status(500).json({ message: "Error retrieving books" });
	}
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
	try {
		const isbn = Number(req.params.isbn);
		const foundBook = books[isbn];

		if (foundBook) {
			res.json(foundBook); // Use res.json() for objects
		} else {
			res.status(404).json({ message: "Book Not Found" });
		}
	} catch (error) {
		res.status(500).json({ message: "Server Error" });
	}
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	const foundBooks = [];
	const author = req.params.author;
	Object.values(books).forEach((book) => {
		if (book.author === author) {
			foundBooks.push(book);
		}
	});

	if (foundBooks.length > 0) {
		res.send(foundBooks);
	} else {
		res.status(404).json({ message: "Books Not Found" });
	}
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
	try {
		const getBooksByTitle = new Promise((resolve, reject) => {
			const foundBooks = [];
			const title = req.params.title;
			Object.values(books).forEach((book) => {
				if (book.title === title) {
					foundBooks.push(book);
				}
			});

			if (foundBooks.length > 0) {
				resolve(foundBooks);
			} else {
				reject("Book Not Found");
			}
		});

		const result = await getBooksByTitle;
		res.send(result);
	} catch (e) {
		res.status(404).json({ message: "Books Not Found" });
	}
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
	try {
		const getReviewByIsbn = new Promise((resolve, reject) => {
			const foundBook = books[parseInt(req.params.isbn)];

			if (foundBook) {
				resolve(foundBook.reviews);
			} else {
				reject("No Reviews/Books Found");
			}
		});

		const result = await getReviewByIsbn;
		res.send(result);
	} catch (e) {
		res.status(404).json({ message: "Books Not Found" });
	}
});

module.exports.general = public_users;
