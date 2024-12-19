CREATE DATABASE Library;

CREATE TABLE Library.book(
	title VARCHAR(255) NOT NULL,
	author VARCHAR(255) NOT NULL,
	isbn VARCHAR(13) NOT NULL PRIMARY KEY,
	available_quantity INT NOT NULL,
	section VARCHAR(100) NOT NULL,
	bay_number INT NOT NULL,
	shelf_number CHAR(1) NOT NULL,
	import_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Library.user(
 	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL PRIMARY KEY,
	password_hash VARCHAR(255) NOT NULL,
	registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	last_login_at DATETIME DEFAULT NULL,
	role ENUM('librarian', 'admin', 'borrower') NOT NULL
);

CREATE TABLE Library.borrow(
	borrower_mail VARCHAR(255) NOT NULL,
	book_isbn VARCHAR(13) NOT NULL,
	borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
	due_date DATETIME NOT NULL,
 	return_date DATETIME,
	PRIMARY KEY(borrower_mail, book_isbn, borrow_date),
	FOREIGN KEY (borrower_mail) REFERENCES user(email)
		ON DELETE RESTRICT
		ON UPDATE CASCADE,
	FOREIGN KEY(book_isbn) REFERENCES book(isbn)
		ON DELETE RESTRICT
		ON UPDATE CASCADE
);

CREATE TABLE Library.passkey( 
	token VARCHAR(6) NOT NULL, 
	borrower_mail VARCHAR(255) NOT NULL, 
	generation_time DATETIME DEFAULT CURRENT_tIMESTAMP, 
	PRIMARY KEY(borrower_mail), 
	FOREIGN KEY(borrower_mail) REFERENCES user(email) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE INDEX author_index ON Library.book (author);
CREATE INDEX title_author_index ON Library.book (title, author);
CREATE INDEX import_time_index ON Library.book (import_time DESC);
CREATE INDEX registered_at_index ON Library.user (registered_at DESC);
CREATE INDEX borrow_date_index ON Library.borrow (borrow_date DESC);