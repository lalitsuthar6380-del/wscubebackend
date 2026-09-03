import express from "express";

const server = express();
const students = [
  {
    id: 1,
    name: "Ankit",
    age: 20,
    course: "BCA",
    city: "Jaipur",
    email: "ankit@gmail.com"
  },
  {
    id: 2,
    name: "Rahul",
    age: 21,
    course: "B.Tech",
    city: "Delhi",
    email: "rahul@gmail.com"
  },
  {
    id: 3,
    name: "Priya",
    age: 19,
    course: "B.Sc",
    city: "Mumbai",
    email: "priya@gmail.com"
  },
  {
    id: 4,
    name: "Neha",
    age: 22,
    course: "BA",
    city: "Churu",
    email: "neha@gmail.com"
  },
  {
    id: 5,
    name: "Rohit",
    age: 20,
    course: "B.Com",
    city: "Sikar",
    email: "rohit@gmail.com"
  }
];

server.get("/student", (req, res) => {
 
    const query = req.query;
    let data = students
    if(query.id){
        data = students.find((st) => st.id == query.id)
    }

    if(query.city){
        data = students.filter((st) => st.city == query.city)
    }

  res.status(200).json({
    message:"Student data ",
    students,
    total:students.length
  })
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});