const express = require("express");
const app = express();
const PORT = 5000;
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const redis = require("redis");
const client = redis.createClient();
app.use(bodyParser.json());

const fakeUser = {
    name: "John",
    email: "john@mail.com",
    password: "pass1234"
};

// 1. Get the counter value
// 2. Get the token value using the counter
// 3. Get the payload inside the token

app.post("/protected", (req, res) => {
    const { id } = req.body;
    client.get(id, (err, data) => {
        jwt.verify(data, "secret", async (err, payload) => {
            console.log(payload);
        });
    });
});

app.get("/login", (req, res) => {
    try {
        client.get("counter", (err, data) => {
            client.set("counter", parseInt(data) + 1);
            jwt.sign(fakeUser, "secret", { expiresIn: "1d" }, (err, token) => {
                client.set(parseInt(data) + 1, token);
                res.cookie("jwt-id", parseInt(data) + 1);
                return res.send("logged in");
            });
        });
    } catch (er) {
        console.log(er);
    }

    // 1. Increment the counter. --
    // 2. Map the counter to newly created token.
    // 3. Send the counter as response to store it in a cookie.
});

app.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
});
