const getAccessTokenFromHeader = (req) => {
    const { token } = req.cookies;
    return token;
}

const isTokenIncluded = (req) => {
    return (
        req.cookies && req.cookies.token
    )
}

module.exports = { getAccessTokenFromHeader, isTokenIncluded }