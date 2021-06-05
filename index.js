const express = require('express')
const app = express();

const mongoose = require('mongoose')

const mongoURI = "mongodb+srv://pubois:pubois123@fantasy.xneou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const PORT = 4000

mongoose.connect(mongoURI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true
})

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});




app.get('/', (req, res)=>{
    res.send('Hello world')
})


const server = app.listen(PORT, ()=>{
    console.log(`Listening in Port ${PORT}`)
})