import { Task } from '../models/task.js';

async function  getTasks(req, res, next) {
    const { userId } = req.user;
    try{
        const tasks = await Task.findAll({
            attributes: ['id', 'name', 'done'],
            order: [['name', 'ASC']],
            where:{
                userId,
            },
        });
        res.json(tasks);
    }catch (error){
        next(error);
    }
}

async function createTask(req, res, next) {
    const { userId } = req.user;
    console.log('userId', userId);
    const { name } = req.body;
    console.log('name', name);
    try{
        const task = await Task.create({
            name,
            userId,
        });
        res.json(task);
    }catch(error){
        next(error);
    }
}

async function getTask(req, res, next) {
    const { id } = req.params;
    console.log ('id', id);
    const { userId } = req.user;
    console.log('userid', userId);
    try{
        const task = await Task.findOne({
            attributes: ['name', 'done'],
            where: {
                id,
                userId,
            },
        });
        if(!task) res.status(404).json({ message: 'Task not found '});
        res.json(task);
    }catch(error){
        next(error);
    }
}

async function updateTask(req, res, next) {
    const { id } = req.params;
    const { name} = req.body;
    const { userId } = req.user;
    try{
        const task = await Task.update(
            {
                name,
            },
            {
                where: {
                    id,
                    userId,
                },
            }
        );
        if(task[0] === 0) res.status(404).json({ message: 'Task not found' });
        res.json(task);
    }catch (error){
        next(error);
    }
}

async function taskDone(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;
    const { done} = req.body;
    try{
        const task = await Task.update(
            {
                done,
            },
            {
                where: {
                    id,
                    userId,
                },
            }
        );
        if(task[0] === 0) res.status(404).json({ message: 'Task not found' });
        res.json(task);
    }catch (error){
        next(error);
    }
}

async function deleteTask(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;
    try{
        const task = await Task.destroy({
            where: {
                id,
                userId,
            },
        });
        if(task[0] === 0) res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'task deleted' });
    }catch (error){
        next(error);
    }
}  

export default {
    getTasks,
    createTask,
    getTask,
    updateTask,
    taskDone,
    deleteTask,
}