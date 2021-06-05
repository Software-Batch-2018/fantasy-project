const express = require('express')
const app = express()
const api = require('./route/api')

const PORT = 4000

app.use(express.json());

app.use('/api', api)


app.listen(PORT, ()=>{
    console.log(`Listening in Port ${PORT}`)
})