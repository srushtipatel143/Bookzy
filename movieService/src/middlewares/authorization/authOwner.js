const errorHandler=require("../../helpers/errors/errorHandler");
const jwt= require("jsonwebtoken");
const {getAccessTokenFromHeader,isTokenIncluded}=require("../../helpers/jwtToken/tokenHelper");

const getAccessToRoute=async(req,res,next)=>{
   try {
    const {JWT_SECRET_KEY} =process.env ;
    if(!isTokenIncluded(req)){
        return next(new errorHandler("Token is not available",401));
    }
    const accessToken=getAccessTokenFromHeader(req);
    const decoded=jwt.verify(accessToken,JWT_SECRET_KEY);
    if(!decoded || decoded.role!=='owner'){
        return next(new errorHandler("You are not authorized to access this route",401));
    }
    req.owner=decoded;
    next();
   } catch (error) {
    return next(new errorHandler("Error in JWT Webtoken",401,error));
   }
}

module.exports={getAccessToRoute}