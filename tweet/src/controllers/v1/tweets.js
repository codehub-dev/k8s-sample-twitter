const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({ message: 'hello' })
})

router.get('/:id', (req, res, next) => {
    res.status(200).json({ message: 'hello' })
})

router.post('/', (req, res, next) => {
    res.status(200).json({ message: 'hello' })
})

router.delete('/:id', (req, res, next) => {
    res.status(200).json({ message: 'hello' })
})

module.exports = router