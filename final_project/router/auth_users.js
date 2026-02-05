const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	const validUserName = users.find((user) => user.username === username);

	return validUserName ? true : false;
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.

	return users.some(
		(user) => user.username === username && user.password === password,
	);
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		res.status(404).json({ message: "Username or Password missing" });
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			"acesss",
			{ expiresIn: 60 * 60 },
		);

		req.session.authorization = {
			accessToken,
			username,
		};

		res.status(200).send("User logged Sucessfully");
	} else {
		res.status(403).json({ message: "Wrong Credentials" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const username = req.session.authorization.username;
	const isbn = parseInt(req.params.isbn);
	const review = req.body.review;
	const bookToBeReviewed = books[isbn];
	if (bookToBeReviewed) {
		if (bookToBeReviewed.reviews[username]) {
			books[isbn].reviews[username] = review;
		} else {
			book.reviews[username] = review;
		}
	} else {
		res.status(404).json({ message: "Book Not Found" });
	}
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	books = Object.keys(books).filter((isbn) => {
		isbn != req.params.isbn;
	});

	res.status(200).send("Deleted Successfully");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
