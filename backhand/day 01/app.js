const http = require("http");
const url = require("url");
const fs = require("fs");

// http://localhost ---Domain
//5000---Prot Number
// (/user) pathname

const users = [
    {
        name: "ankit",
        age: 23
    },
    {
        name: "mahesh",
        age: 23
    }
];

const server = http.createServer(
    (req, res) => {
        const parseUrl = url.parse(req.url, true);
        const path = parseUrl.pathname;
        const query = parseUrl.query;

        if (path == "/") {
            res.end("Home Page");

        } else if (path == "/about") {
            res.end("About Page");

        } else if (path == "/user") {
            // res.end(`user : ${query.name} and age: ${query.age}`)
            res.end(JSON.stringify(users));

        } else if (path == "/file-create") {

            fs.writeFile("index.txt", "File create", (err) => {
                if (err) {
                    console.log(err);
                    res.end("Error");
                } else {
                    res.end("File create sucessfully");
                }
            });

        } else if (path == "file-read") {
            fs.readFile("index.txt", "utf8", (err) => {
                if (err) {
                    console.log(err)
                } else {
                    res.end()
                }
            })
        } else if (path == "delete-file") {
            fs.readFile("quere.filename", (err, data) => {
                if (err) {
                    res.end("file not exist")
                } else {
                    fs.unlink(quere.filename, (err) => {
                        if (err) {
                            res.end("internal Server Error")
                        } else {
                            res.end("File delete .......")
                        }
                    })
                }
            })


        } else {
            res.end("404");
        }
    }
);

server.listen(5000, () => {
    console.log("Server is running 5000");
});