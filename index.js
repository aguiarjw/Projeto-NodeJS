const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks
app.get('/tasks', async (req, res) => {
  const Tasks = await tasks.findAll()
  res.status(200).json({Tasks})
})

// Create task
app.post('/tasks/', async (req, res) => {
    const { description, done} = req.body
    const task = await tasks.create(req.body)
      try{        
      task.set(req.body);
    await task.save();
    res.status(201).json(task)
  }catch(err){
      res.status(404).json({message: err.message})
      }
  })

// Show task
app.get('/tasks/:id', async (req, res) => {
  const task = await tasks.findByPk(req.params.id)

  try{
    if(task){ 
      res.status(200).json(task)
    return;
       }
 
  else{
      res.status(400).send('Não existe tal tarefa. Tente novamente')
    return;
  }
}
  catch{
    res.status(500).json({message: err.message})
  }
})
// Update task
app.put('/tasks/:id', async (req, res) => {
  const task = await tasks.findOne({ where: { id: req.params.id}});
  const { description, done} = req.body;
  
  try{
    
    task.set(req.body);
    await task.save();
    res.status(200).send(task)
  }

  catch{
    res.status(400).json({message: err.message})
  }
  
  })

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const task = await tasks.findByPk(req.params.id);
  try{
  await tasks.destroy({ where: { id: req.params.id}});
  res.status(200).json(task)
  }
catch{
  res.status(400).json({message: err.message})
}

})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
