const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());



mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));




const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    isbn: {
        type: String,
        required: true,
        unique: true
    },

    genre: {
        type: String,
        required: true
    },

    publisher: {
        type: String,
        required: true
    },

    publicationYear: Number,

    totalCopies: {
        type: Number,
        required: true,
        min: 1
    },

    availableCopies: Number,

    shelfLocation: String,

    bookType: {
        type: String,
        enum: ["Reference", "Circulating"]
    },

    status: {
        type: String,
        default: "Available"
    }

});

const Book = mongoose.model("Book", bookSchema);



app.post("/books", async (req, res) => {

    try {

        const book = new Book(req.body);
        await book.save();

        res.status(201).json({
            message: "Book created successfully",
            data: book
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});



app.get("/books", async (req, res) => {

    try {

        const books = await Book.find();

        res.status(200).json(books);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});



app.get("/books/:id", async (req, res) => {

    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




app.put("/books/:id", async (req, res) => {

    try {

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book updated successfully",
            data: updatedBook
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});



app.delete("/books/:id", async (req, res) => {

    try {

        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




app.get("/books/search", async (req, res) => {

    try {

        const title = req.query.title;

        const books = await Book.find({
            title: { $regex: title, $options: "i" }
        });

        res.status(200).json(books);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        message: "Server Error"
    });

});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});