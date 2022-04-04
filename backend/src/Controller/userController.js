const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken");
let refreshTokens = []
const signupUser = async (req, res) => {
    const user = req.body
    try {
        if(!user) {
            return res.status(404).json('Missing parameters!!');
        }
       const salt =  await bcrypt.genSaltSync(10);
       const hashed = await bcrypt.hashSync(user.password, salt);
       const newUser = new User({
            name: user.name, 
            email: user.email,
            password: hashed,

        });
        const createUser = await newUser.save()
        return res.status(200).json(createUser)
    }catch(e) {
        console.log(e)
        return res.status(404).json(e)
    } 
}

const generateAccessToken = (user) => {
    return jwt.sign(
        { isAdmin : user.isAdmin, id:user._id,},
         'accessToken',
        {expiresIn: '30m'}
        )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { isAdmin : user.isAdmin, id:user._id,},
         'refreshToken',
        {expiresIn: '365d'}
        )
}

const loginUser = async (req, res) => {
    try {
        if(!req.body) {
            return res.status(404).json("Missing parameters!!!")
        }
        let user = await User.findOne({
            email: req.body.email
        })
        let {password, ...newUser} = user._doc
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(user && validPassword) {
            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)
            refreshTokens.push(refreshToken)
            console.log(refreshTokens)   
            res.cookie('refreshToken',refreshToken, 
                { 
                    secure: false,
                    httpOnly: true,
                    path: '/',
                    sameSite: 'Strict' 
                }
            )
            return res.status(200).json({...newUser,accessToken})
        }else {
            return res.status(404).json('User or password not valid')
        }
    }catch(e) {
        console.log(e)
        return res.status(404).json(e)
    }
}

const getAllUser = async (req, res) => {
    try {
        let user = await User.find()
        if(user) {
            res.status(200).json(user)
        }else {
            res.status(404).json("Can't find user")
        }
    }catch(e) {
        return res.status(404).json(e)
    }
}

const deleteUser = async (req, res) => {
    let id = req.params.id
    try {
        let user = await User.findOne({
            _id : id
        })
        if(user) {
            res.status(200).json('Delete successful')
        }else {
            res.status(404).json("Can't find user")
        }
    }catch(e) {
        return res.status(404).json(e)
    }
}

const requestRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshTokens.includes(refreshToken)) {
        return res.status(404).json('RefreshToken is not valid')
    }
    if(!refreshToken){
        return res.status(403).json('You are not authentication ')
    }else {
        jwt.verify(refreshToken, 'refreshToken', (err,user) => {
            if(err) {
                res.status(500).json('Token is not valid')
            }
            console.log('refreshTokens', refreshTokens)
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
            const newAccessToken = generateAccessToken(user)
            const newRefreshToken = generateRefreshToken(user)
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'Strict' 

            })
            refreshTokens.push(newRefreshToken)
            return res.status(200).json({'accessToken': newAccessToken})
        })
    }
}

module.exports = {
    signupUser,loginUser,getAllUser,requestRefreshToken,deleteUser
}