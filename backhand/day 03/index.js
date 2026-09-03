import express from "express";
import mongoose from "mongoose";

const server = express();

server.use(express.json());

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

const StudentModel = mongoose.model("students", StudentSchema);

server.post("/api/student/create", async (req, res) => {
    try {
        const { name, email, age } = req.body;

        const student = await StudentModel.findOne({ email });
        if(student) {
            return res.status(409).json({
                message: "Student Id Already Exist",
                success: false
            })
        }

        if (student) {
            return res.status(400).json({
                message: "Email already exists",
                success: false
            });
        }

        const newStudent = await StudentModel.create({
            name,
            email,
            age
        });

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            data: newStudent
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
});

mongoose.connect("mongodb://localhost:27017/college")
    .then(() => {
        console.log("Database Connected");
    })
    .catch((error) => {
        console.log("Database Not Connected");
        console.log(error);
    });

server.listen(5000, () => {
    console.log("Server is running on port number 5000");
});