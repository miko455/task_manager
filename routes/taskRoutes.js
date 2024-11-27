import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res, next) => {
  try {
    const { priority, status, search } = req.query;
    let query = {};

    if (req.user) {
      query.$or = [{ user: req.user.userId }, { user: null }];
    } else {
      query.user = null;
    }

    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (search) {
      query.$and = [
        query.$or ? { $or: query.$or } : {},
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// Get a single task
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ user: req.user ? req.user.userId : null }, { user: null }]
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Create a new task
router.post('/', async (req, res, next) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user ? req.user.userId : null
    });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// Update a task
router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ user: req.user ? req.user.userId : null }, { user: null }]
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      $or: [{ user: req.user ? req.user.userId : null }, { user: null }]
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

