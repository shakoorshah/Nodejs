const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./tasks')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,

        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:7,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('this password not allowed')
            }
            
        } 
    },
    age: {
        type: Number,
        default: 0,

        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive no.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps:true
})

usersSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

//hide private data
usersSchema.methods.toJSON = function () {
    const users = this
    const usersObject = users.toObject()

    delete usersObject.password
    delete usersObject.tokens
    delete usersObject.avatar

    return usersObject
}

//generate token
usersSchema.methods.generateAuthToken = async function () {
    const users = this
    const token = jwt.sign({ _id: users._id.toString() }, 'thisismynewcourse')

    users.tokens = users.tokens.concat({ token })
    await users.save()

    return token
}

//compare passwords function
usersSchema.statics.findByCredentials = async (email, password) => {
    const users = await Users.findOne({ email })

    if (!users) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, users.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return users
}

// Hash the plain text password before saving
usersSchema.pre('save', async function (next) {
    const users = this

    if (users.isModified('password')) {
        users.password = await bcrypt.hash(users.password, 8)
    }

    next()
})

//delete user tasks when user is removed
usersSchema.pre('remove', async function (next) {
    const users = this
    await Tasks.deleteMany({owner: users._id })
    next()
})

const Users = mongoose.model('Users', usersSchema)

module.exports = Users