const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
            return res.status(401).send({ message: "Unauthorized - Admin Access Required" });
        }

        const token = tokenHeader.split(" ")[1];

        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                const isExpired = err.name === "TokenExpiredError";
                return res.status(401).send({
                    message: isExpired ? "Token Expired" : "Unauthorized Admin",
                });
            }
            
            if (decode.role !== 'admin') {
                return res.status(403).send({ message: "Access Denied - Admin Only" });
            }
            
            req.adminId = decode.id;
            next();
        });
        
    } catch (error) {
        return res.status(500).send({ message: "Server Error" });
    }
};
