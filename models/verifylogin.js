const jwt=require('jsonwebtoken');

const verify=(req,res,next)=>{
    const token=req.cookies.jwtToken;

    if (!token){
        res.status(401).render('login',{data:'unAthorized'})
    }
    jwt.verify(token,'secret',(err,decode)=>{
        if(err){
            res.status(401).render('login',{data:'unAthorized'})
        }
        else{
            console.log('se us ',decode['email'])
            req.user=decode['email'];
            next();
        }
    })
}


module.exports=verify