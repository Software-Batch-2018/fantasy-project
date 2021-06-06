const dbOperation = require('../controller/teamController')
var express = require('express')
const router = express.Router()
const session = require('../auth/session')

router.get('/teams', (req, res)=>{
    dbOperation.getTeam().then(result=>{
        res.json(result)
    })
})


router.use(session.passport.initialize());


router.get('/Players/:country', (req, res)=>{
    countryName = req.params.country
    dbOperation.getTeamPlayers(countryName).then(result=>{
        res.json(result)
    })
})

router.get('/matches/:date', (req, res)=>{
    date = req.params.date
    dbOperation.getMatches(date).then(result=>{
        res.json(result)
    })
})

router.get('/login', (req, res)=>{
    res.send('Hello from Login')
})

router.get('/faillogin', (req, res)=>{
    res.send('Hello from fail Login')
})

router.post('/login', session.passport.authenticate('local', { failureRedirect: '/api/faillogin' }), function(req, res) {
	req.token = session.generateToken(req.user);
	res.json({
		token: req.token,
		user: req.user
	});

});



module.exports = router