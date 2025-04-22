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

module.exports={getAccessTokenFromHeader,isTokenIncluded}