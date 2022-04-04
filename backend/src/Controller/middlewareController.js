const jwt = require('jsonwebtoken');
const middlewareController = {
    verifyToken:(req, res, next) => {
        const token = req.headers.token
        if(token) {
            const accessToken = token.split(' ')[1]
            console.log(accessToken)
            jwt.verify(accessToken, 'accessToken',(err, user) => {
                if(err) {
                    return res.status(404).json('Token is not invalid')
                }
                if(user.isAdmin) {
                    next()
                }else {
                    return res.status(403).json('You are not authentication')
                }
            })
        }else {
            return res.status(403).json('You are not authentication')
        }
    },
    verifyAdmin:(req,res,next) => {
        const token = req.headers.token
         if(token) {
            const accessToken = token.split(' ')[1]
            jwt.verify(accessToken, 'accessToken',(err, user) => {
                if(err) {
                    return res.status(404).json('Token is not invalid')
                }
                console.log(user.id === req.params.id)
                if(user.id === req.params.id | user.isAdmin){
                    next()
                }else {
                    return res.status(403).json('You are not authentication')
                }
            })
        }else {
            return res.status(403).json('You are not authentication')
        }
    } 
}

module.exports = middlewareController