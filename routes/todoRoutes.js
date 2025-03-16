const express = require('express');
const mongoose = require('mongoose');
const { redisClient } = require('../config/redis');
const router = express.Router();

// Todo Schema
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// Get single todo by ID
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all todos
router.get('/', async (req, res) => {
    try {
        const cachedTodos = await redisClient.get('todos');
        if (cachedTodos) {
            return res.json(JSON.parse(cachedTodos));
        }

        const todos = await Todo.find().sort({ createdAt: -1 });
        await redisClient.setEx('todos', 3600, JSON.stringify(todos));
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// Create todo
router.post('/', async (req, res) => {
    try {
        if (!req.body.task) {
            return res.status(400).json({ error: 'Task is required' });
        }

        const todo = new Todo({
            task: req.body.task,
            priority: req.body.priority || 'medium',
            completed: req.body.completed || false
        });
        const savedTodo = await todo.save();
        
        await redisClient.del('todos');
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// Update todo
router.put('/:id', async (req, res) => {
    try {
        const updateData = {};
        if (req.body.task) updateData.task = req.body.task;
        if (req.body.priority) updateData.priority = req.body.priority;
        if (typeof req.body.completed !== 'undefined') updateData.completed = req.body.completed;

        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        await redisClient.del('todos');
        res.json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// Delete todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        
        await redisClient.del('todos');
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

module.exports = router;