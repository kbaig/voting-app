const router = require('express').Router();

router.get('/poll/:id', (req, res) => {
    console.log(req.params.id);
});

module.exports = router;