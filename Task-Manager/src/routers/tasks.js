const express = require('express')
const Tasks = require('../models/tasks')
const auth = require('../middleware/auth')
const router = new express.Router()

//TASKS
//Tasks Create
router.post('/tasks', auth, async (req,res) => {
    // const tasks = new Tasks(req.body)
    const tasks = new Tasks({
        ...req.body,
        owner: req.users._id
    })

    try {
        await tasks.save()
        res.status(201).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true/false
// GET /tasks?limit=10&skips=20
// GET /tasks?sortBy=createdAt:acs(1)/desc(-1)
router.get('/tasks', auth,async (req,res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    console.log(match);
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' || parts[1] === 'true' ? -1 : 1
    }

    try {
        // const tasks = await Tasks.find({owner:req.user._id})
        await req.users.populate({
            path: 'tasks',
            match : match,
            // match: {
            //     completed:req.query.completed
            // }
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
        
                sort : sort
                // sort: {
                //     // createdAt: -1
                //     completed: 1
                // }
            }
        
        })
        // const tasks = await Tasks.find(
        //     match,
        //     null,
        //     {
        //         limit: parseInt(req.query.limit),
        //         skip: parseInt(req.query.skip),
        //         sort
        //     }
        // )

        res.send(req.users.tasks/*tasks*/)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth,async (req,res) => {
    const _id = req.params.id
    try {
        // const tasks = await Tasks.findById(_id)
        const task = await Tasks.findOne({_id, owner: req.users._id})

        if (!tasks) {
            return res.status(404).send()
        }
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})








//Tasks Update
router.patch('/tasks/:id', auth,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const tasks = await Tasks.findOne({_id: req.params.id, owner: req.users._id})
        // const tasks = await Tasks.findByIdAndUpdate(req.params.id)
        
        

        if (!tasks) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => tasks[update] = req.body[update])
        await tasks.save()
        // const tasks = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})













//Tasks Delete
router.delete('/tasks/:id', auth,async (req, res) => {
    try {
        // const tasks = await Tasks.findByIdAndDelete(req.params.id)
        const tasks = await Tasks.findOneAndDelete({_id:req.params.id, owners:req.users_id})
        if (!tasks) {
            res.status(404).send()
        }

        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router