const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());


const databasePath = path.join(__dirname, 'task.json');


function readDatabase() {
    try {
        const data = fs.readFileSync(databasePath); 
        return JSON.parse(data); 
    } catch (err) {
        return []; 
    }
}

function writeDatabase(data) {
    fs.writeFileSync(databasePath, JSON.stringify(data)); 
}

app.post('/users', (req, res) => {
    const database = readDatabase();
    const newUser = {
        id: database.length + 1,
        name: req.body.name,
        age: req.body.age,
    };
    database.push(newUser);
    writeDatabase(database);
    res.status(201).json(newUser);
});

app.get('/users', (req, res) => {
    const database = readDatabase();
    res.json(database);
});


app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const database = readDatabase();
    const user = database.find(u => u.id === userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const database = readDatabase();
    const userIndex = database.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        database[userIndex] = { ...database[userIndex], ...req.body };
        writeDatabase(database);
        res.json(database[userIndex]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const database = readDatabase();
    const userIndex = database.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        const deletedUser = database.splice(userIndex, 1);
        writeDatabase(database);
        res.json(deletedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});