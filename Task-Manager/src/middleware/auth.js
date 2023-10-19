const jwt = require('jsonwebtoken')
const Users = require('../models/users')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const users = await Users.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!users) {
            throw new Error()
        }
        
        req.token = token
        req.users = users
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth