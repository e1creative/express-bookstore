process.env.NODE_ENV = "test"

const request = require("supertest");

const app = require("../app");
const db = require("../db");

const Books = require("../models/book");


describe("Book Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM books");

    const data1 = {
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
      }

    let b1 = await Books.create(data1);

  });

  /** GET /books */

  describe("GET /books", function () {
    test("can get list of books", async function () {
      let response = await request(app)
        .get("/books/");

      expect(response.status).toEqual(200)
      expect(response.body).toEqual({
        books: [
            {
                isbn: "0691161518",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew Lane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
            }
        ]
      });
    });
  });

  /** GET /books/:id */

  describe("GET /books/:id", function () {
    test("can get a single book using the isbn", async function () {
      let response = await request(app)
        .get("/books/0691161518");

      expect(response.status).toEqual(200)
      expect(response.body).toEqual({
        book:
            {
                isbn: "0691161518",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew Lane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
            }
      });
    });
    test("return 404 if a single book cannot be found", async function () {
      const isbn = "0691161511"
      let response = await request(app)
        .get(`/books/${isbn}`);

      expect(response.status).toEqual(404)
      expect(response.body).toEqual({ 
        error: {
            message: `There is no book with an isbn '${isbn}'`,
            status: 404
        },
        message: `There is no book with an isbn '${isbn}'`
      });
    });
  });


  /** POST /books/  */

  describe("POST /books", function () {
    test("can add a book", async function () {
      let response = await request(app)
        .post("/books")
        .send({
            isbn: "0070342075",
            amazon_url: "https://www.amazon.com/dp/0070342075/?coliid=I3PJ9U4OTA9EXQ&colid=2XF17GS8UBLC2&psc=0&ref_=lv_ov_lig_dp_it",
            author: "Brian W. Kernighan",
            language: "english",
            pages: 168,
            publisher: "McGraw-Hill",
            title: "The Elements of Programming Style",
            year: 1978
        });

        expect(response.status).toEqual(201)
        expect(response.body).toEqual({
            book: {
                isbn: "0070342075",
                amazon_url: "https://www.amazon.com/dp/0070342075/?coliid=I3PJ9U4OTA9EXQ&colid=2XF17GS8UBLC2&psc=0&ref_=lv_ov_lig_dp_it",
                author: "Brian W. Kernighan",
                language: "english",
                pages: 168,
                publisher: "McGraw-Hill",
                title: "The Elements of Programming Style",
                year: 1978
            }
        })
    });
  });

  /** PUT /books/:isbn => token  */

  describe("PUT /books/:isbn", function () {
    test("can update a book", async function () {
      const isbn = "0691161518"
      let response = await request(app)
        .put(`/books/${isbn}`)
        .send({ 
            isbn,
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2000
         });

      expect(response.status).toEqual(200)
      expect(response.body).toEqual({
        book: {
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2000
        }
      });
    });
    // isbn in the url must be correct
    test("return 404 if isbn is incorrect", async function () {
      const isbn = "0691161511"
      let response = await request(app)
        .put(`/books/${isbn}`)
        .send({ 
            isbn,
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2018
        });

      expect(response.status).toEqual(404)
      expect(response.body).toEqual({ 
        error: {
            message: `There is no book with an isbn '${isbn}'`,
            status: 404
        },
        message: `There is no book with an isbn '${isbn}'`
      });
    });
  });

  /** DELETE /books/:isbn => token  */

  describe("DELETE /books/:isbn", function () {
    test("can delete a book", async function () {
      const isbn = "0691161518"
      let response = await request(app)
        .delete(`/books/${isbn}`);

      expect(response.status).toEqual(200)
      expect(response.body).toEqual({ message: "Book deleted" });
    });
    // isbn in the url must be correct
    test("return 404 if isbn is incorrect", async function () {
      const isbn = "0691161511"
      let response = await request(app)
        .delete(`/books/${isbn}`);

      expect(response.status).toEqual(404)
      expect(response.body).toEqual({ 
        error: {
            message: `There is no book with an isbn '${isbn}'`,
            status: 404
        },
        message: `There is no book with an isbn '${isbn}'`
      });
    });
  });

});

afterAll(async function () {
  await db.end();
});
