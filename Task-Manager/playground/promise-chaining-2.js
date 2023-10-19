require('../src/db/mongoose.js')
const Tasks = require('../src/models/tasks.js')

// Tasks.findByIdAndDelete('63b28779dd8c25c0228f6124').then((tasks) => {
//     console.log(tasks)
//     return Tasks.countDocuments({completed:false}).then((result) => {
//         console.log(result)
//     }).catch((e) => {
//         console.log(e)
//     })
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5c1a634150c97706427d4661').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})