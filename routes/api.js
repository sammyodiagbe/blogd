let express = require('express');

let router = express.Router();

// creating the api route for the get method
router.get('/posts', (req, res) => {
    res.send({
        message: 'You have made a get request'
    })
})

router.post('/posts', (req, res) => {
    res.send({
        message: 'You have made a post request'
    })
})

router.put('/posts/update/:id', (req, res) => {
    console.log(req.params.id);
    res.send({
        message: `You made changes to the collections with the id of ${req.params.id}`
    })
})


router.delete('/posts/delete/:id', (req, res) => {
    res.send({
        message: `You deleted the collection with the id of ${req.params.id}`
    })
})

module.exports = router