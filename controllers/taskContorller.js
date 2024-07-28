const { Op } = require('sequelize');
const db = require("../models");
const Task = db.Task;
const TokenVerifier = require('./utils/user_tokenVerify');

const createTask = async (req, res) => {
  try {
    const { user_id, title, description, fromDate, toDate } = req.body;

    if (!user_id || !title || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = req.headers.authorization.split(' ')[1];
    await TokenVerifier.verifyUserToken(user_id, token, res);

    const newTask = await Task.create({
      user_id,
      title,
      description,
      fromDate,
      toDate,
    });

    res.status(201).json({ data: newTask, message: 'Task created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTasks = async (req, res) => {
  try {
    const { user_id, fromDate, toDate } = req.body;
console.log(fromDate,toDate)
    if (!user_id || !fromDate || !toDate) {
      return res.status(400).json({ error: 'user_id, fromDate and toDate are required' });
    }

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = req.headers.authorization.split(' ')[1];
    await TokenVerifier.verifyUserToken(user_id, token, res);

    const tasks = await Task.findAll({
      where: {
        user_id,
        fromDate: {
          [Op.gte]: new Date(fromDate),
        },
        toDate: {
          [Op.lte]: new Date(toDate),
        },
      },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.isDone).length;

    res.status(200).json({
      fromDate,
      toDate,
      totalTasks,
      completedTasks,
      data: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const toggleTask = async (req, res) => {
  try {
    const { user_id, task_Id,status } = req.body;

    if (!user_id || !task_Id  ||!status           ) {
      return res.status(400).json({ error: 'user_id and task_Id are required' });
    }

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = req.headers.authorization.split(' ')[1];
    await TokenVerifier.verifyUserToken(user_id, token, res);

    const task = await Task.findOne({
      where: {
        user_id,
        task_Id,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.isDone = status;
    await task.save();

    res.status(200).json({ message: 'Task marked as  given status' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





const deleteTask = async (req, res) => {
  try {      
    const { user_id, task_Id } = req.body;  
    if (!user_id || !task_Id) {
      return res.status(400).json({ error: 'user_id and task_Id are required' });
    }
  
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }
  
    const token = req.headers.authorization.split(' ')[1];
    await TokenVerifier.verifyUserToken(user_id, token, res);
  
    const task = await Task.findOne({
      where: {
        user_id,
        task_Id,
      },
    });
  
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }   
    await task.destroy();
  
    res.status(200).json({ message: 'Task deleted successfully' });     

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  createTask,
  getTasks,
toggleTask,
  deleteTask
};
