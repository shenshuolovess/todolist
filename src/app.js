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

const getAllAccounts = (req, res) => fs.readFile('./data.json','utf-8',(err,data)=>{
    if(err){
    res.status(500).send()
}else{
    res.json(JSON.parse(data))
}
})

const createAccount = async (req, res) => {
  const newAccount = req.body
  const file = await asyncReadFile('./data.json')
  const accounts = JSON.parse(file)
  if (accounts.filter(v => v.id === newAccount.id).length != 0) {
    res.status(400).send()
  } else {
    accounts.push(newAccount)
    await asyncWriteFile(JSON.stringify(accounts), './data.json')
    res.status(201).send(accounts)
  }
}

const getAccount = async (req, res) => {
  const Id = req.params.id
  const file = await asyncReadFile('./data.json')
  const accounts = JSON.parse(file).filter(v => v.id == Id)
  accounts.length == 0 ? res.status(404).send() : res.send(accounts[0])
}

const deleteAccount = async (req, res) => {
  const Id = req.params.id
  const file = await asyncReadFile('./data.json')
  const accounts = JSON.parse(file)
  const newAccounts = accounts.filter(v => v.id != Id)
  console.log(newAccounts)
  if (newAccounts.length === accounts.length) {
    res.status(404).send()
  } else {
    await asyncWriteFile(JSON.stringify(newAccounts), './data.json')
    res.status(204).send()
  }
}
app.get('/api/tasks/', getAllAccounts)
app.post('/api/tasks/',createAccount)
app.get('/api/tasks/:id', getAccount)
app.delete("/api/tasks/:id", deleteAccount)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

exports.app=app