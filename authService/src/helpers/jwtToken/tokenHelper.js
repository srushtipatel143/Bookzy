const sendToken=async(user,statusCode,res)=>{
    const token = user.generateJWTFromUser();

    // res.cookie('token', token, {
    //     httpOnly: true, // makes the cookie inaccessible to JavaScript (more secure)
    //     secure: false,  // don't require HTTPS in local environment
    //     maxAge: 24 * 60 * 60 * 1000, // expires in 1 day (adjust the time as needed)
    //     sameSite: 'lax' // helps prevent CSRF attacks (can use 'strict' or 'none' depending on your needs)
    // });
    return res.status(statusCode).json({
        success: true ,
        userName:user.userName,
        email:user.email,
        role:user.role,
        token
    })
};

const getAccessTokenFromHeader=(req)=>{
    const authorization=req.headers.authorization;
    const access_token=authorization.split(" ")[1];
    return access_token;
}

const isTokenIncluded=(req)=>{
    return (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    )
}

module.exports={sendToken,getAccessTokenFromHeader,isTokenIncluded}