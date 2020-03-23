const express = require('express')
const app = express()
const fs=require('fs')
const port = 3000
app.use(express.json())

const asyncReadFile = function (path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf-8', function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  }).catch((err) => {
    return err
  })
}

const asyncWriteFile = function (string, path) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, string, function (err) {
      reject(err)
    })
  }).catch((err) => {
    return err
  })
}

const getAllTasks = (req, res) => fs.readFile('./data.json','utf-8',(err,data)=>{
    if(err){
    res.status(500).send()
}else{
    res.json(JSON.parse(data))
}
})

const createTask = async (req, res) => {
  const newTask = req.body
  const file = await asyncReadFile('./data.json')
  const tasks = JSON.parse(file)
  if (tasks.filter(v => v.id === newTask.id).length != 0) {
    res.status(400).send()
  } else {
    tasks.push(newTask)
    await asyncWriteFile(JSON.stringify(tasks), './data.json')
    res.status(201).send(tasks)
  }
}

const getTask = async (req, res) => {
  const Id = req.params.id
  const file = await asyncReadFile('./data.json')
  const tasks = JSON.parse(file).filter(v => v.id == Id)
  tasks.length == 0 ? res.status(404).send() : res.send(tasks[0])
}

const deleteTask = async (req, res) => {
  const Id = req.params.id
  const file = await asyncReadFile('./data.json')
  const tasks = JSON.parse(file)
  const newTasks = tasks.filter(v => v.id != Id)
  console.log(newTasks)
  if (newTasks.length === tasks.length) {
    res.status(404).send()
  } else {
    await asyncWriteFile(JSON.stringify(newTasks), './data.json')
    res.status(204).send()
  }
}
app.get('/api/tasks/', getAllTasks)
app.post('/api/tasks/',createTask)
app.get('/api/tasks/:id', getTask)
app.delete("/api/tasks/:id", deleteTask)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

exports.app=app