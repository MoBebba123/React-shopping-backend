 

 exports.signup = (req,res) =>{
    User.findOne({email: req.body.email})
    .exec((error, user) => {
        if(user) return res.status(400).json({
            message: "user already registred"
        })
    })

 }

