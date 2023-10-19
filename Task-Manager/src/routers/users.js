const express = require('express')
const Users = require('../models/users')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendCancelationEmail} = require('../emails/account')

//USERS
//Users Create
router.post('/users', async (req,res) => {
    console.log(req.body)

    const users = new Users(req.body)
    try {
        await users.save()
        sendWelcomeEmail(users.email,users.name)
        res.status(201).send(users)
    } catch (e){
        res.status(400).send(e)
    }
    
})

//Users login
router.post('/users/login', async (req, res) => {
    try {
        const users = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await users.generateAuthToken()
        res.send({users,token})
    } catch (e) {
        res.status(400).send()
    }
})

//User logout
router.post('/users/logout', auth, async (req,res) => {
        try {
            req.users.tokens = req.users.tokens.filter((token) => {
                return token.token != req.token
            })
            await req.users.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }
})

router.post('/users/logoutAll', auth, async(req,res) => {
     try { 
        req.users.tokens = []
        await req.users.save()
        res.send()
     } catch (e) {
        res.status(500).send()
     }
})

//Users Read
router.get('/users/me', auth,async (req, res) => {
    res.send(req.users)
    
    try {
        const users = await Users.find({})
        res.send(users)
    } catch {
        res.status(500).send()
    }

    Users.find({}).then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send()
    })
})

//Users Update
router.patch('/users/me', auth,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        updates.forEach((update) => req.users[update] = req.body[update])
        await req.users.save()
        // const users = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.send(req.users)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Users Delete
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.users.remove()
        sendCancelationEmail(req.users.name,req.users.email)
        res.send(req.users)
    } catch (e) {
        res.status(500).send()
    }
})


//multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        // if (!file.originalname.endsWith('.pdf')) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Plz upload an image'))
        }

        cb(undefined,true)
    }
})

//users image upload
router.post('/users/me/avatar', auth, upload.single('upload'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()

    req.users.avatar = buffer
    await req.users.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//users image delete
router.delete('/users/me/avatar', auth, async (req,res) => {
    req.users.avatar = undefined
    await req.users.save()
    res.send()
})

//user image url 
//url:localhost:3000/users/63bc397942d0c5c700e82476/avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const users = await Users.findById(req.params.id)

        if (!users || !users.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(users.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router