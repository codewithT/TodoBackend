const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
console.log(process.env.mongodb_url);

const mongoURL = process.env.mongodb_url;

const connection = async() => {
    console.log("hello");
    try {
        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then("server is connected")
        ;
    } catch (error) 
    {
        console.log("database didn't connect!!!!!!!!!", error);    
    }
} 



// Modify routes to use async/await

app.get('/', async function(req, res) {
    console.log("reached home!");
    res.json({"hurrah" : "yes"})
    // try {
    //     const todos = await Todo.find();
    //     res.json(todos);
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ error: "Server error" });
    // }
});

app.get('/:id' ,async function(req, res) {
    try {
        const todo = await Todo.findById(req.params.id);
        res.json(todo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/update/:id' , async function(req, res) {
    

    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send("data is not found");
        }
        todo.todo_description = req.body.todo_description;
        todo.todo_responsible = req.body.todo_responsible;
        todo.todo_priority = req.body.todo_priority;
        todo.todo_completed = req.body.todo_completed;

        await todo.save();
        res.json('Todo updated!');
    } catch (err) {
        console.log(err);
        res.status(400).send("Update not possible");
    }
});

app.post('/todos/add', async function(req, res) {

    
const connect = await connection()
console.log(connect);

    try {

        console.log(req.body);

        const description = req.body.todo_description;
        const responsible = req.body.todo_responsible;

        // Create a new Todo instance and save it to the database
        const newTodo = new Todo({ todo_description: description, todo_responsible :  responsible});
        await newTodo.save();
        
        // await Todo.save();
        res.status(200).json({ 'todo': 'todo added successfully' });
    } catch (err) {
        console.log("failed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(err);
        res.status(400).send('adding new todo failed');
    }
});

// app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
