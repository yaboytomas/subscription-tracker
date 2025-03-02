import aj from "../config/arcjet.js";


const arcjetMiddleware = async (req, res, next) => {
    try {
        
    const decision = await aj.protect(req, { requested: 1});

    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return res.status(429).send("Rate limit exceeded");
        }  
        if (decision.reason.isBot()) {
            return res.status(4028).send("Bot Detected");
        }

        return res.status(403).send("Access Denied");
    }

    next();
        
    } catch (error) {
        console.log('Arcjet middleware error: ', error);
        next(error);
    }   
}

export default arcjetMiddleware;