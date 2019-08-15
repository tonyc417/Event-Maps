const express = require('express');

const PORT = 3000 || process.env.PORT;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("index");
})

app.listen(PORT, console.log('Server stared on ' + PORT));