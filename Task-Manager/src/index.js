const express = require('express')
require('./db/mongoose')
const usersRouter = require('./routers/users')
const tasksRouter = require('./routers/tasks') 

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(usersRouter)
app.use(tasksRouter)


app.listen(port, () => {
    console.log('server is up on port ' + port)
})




// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 100000
//     },
//     fileFilter(req,file,cb) {
//         // if (!file.originalname.endsWith('.pdf')) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Plz upload a word file'))
//         }

//         cb(undefined,true)
//     }
// })
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })



















// const Tasks = require('./models/tasks')
// const Users = require('./models/users')

// const main = async () => {
//     // const tasks = await Tasks.findById('63bbdcdda11e2c32014f9d13')
//     // await tasks.populate('owner')
//     // console.log(tasks.owner)

//     const users = await Users.findById('63bbc2b3cbbfddcab4e971b5')
//     await users.populate('tasks')
//     console.log(users.tasks)
// }

// main()












//JSON
// const pet = {
//     name: 'Hal'
// }

// pet.toJSON = function () {
//     console.log(this)
//     return this
// }

// console.log(JSON.stringify(pet))





//hash password using bycrypt 
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')

// const myFunction = async () => {
    
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)

    // const password = 'Red12345!'
    // const hashedPassword = await bcrypt.hash(password, 8)

    // console.log(password)
    // console.log(hashedPassword)

    // const isMatch = await bcrypt.compare('red12345!', hashedPassword)
    // console.log(isMatch)
// }

// myFunction()
