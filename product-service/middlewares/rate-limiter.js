import moment from 'moment';
import redisClient from '../connections/redis.js';
import rateLimit from 'express-rate-limit';


const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs  
    message: "Too many requests, please try again later",
})
const RATELIMIT_DURATION_IN_SECONDS = 60;
const  RATELIMIT_MAX_REQUESTS = 5;



const customrateLimiter = async (req, res, next) => {
    const id = req.ip;
    const currentTime = moment().unix();

    const results = await redisClient.hGetAll(id);
    if (Object.keys(results).length === 0) {
        // No data for this IP, create a new entry
        await redisClient.hSet(id, {
            'createAt': currentTime,
            'count': 1
        });
        return next();
    } else {
        const { createAt, count } = results;
        const elapsedTime = currentTime - createAt;
        if (elapsedTime > RATELIMIT_DURATION_IN_SECONDS) {
            // Time window has expired, reset the count
            await redisClient.hSet(id, 'count', {
                'createAt': currentTime,
                'count': 1
            });
            return next();
        } else if (count < RATELIMIT_MAX_REQUESTS) {
            // Within the time window, increment the count
            await redisClient.hIncrBy(id, 'count', 1);
            return next();
        } else {
            // Rate limit exceeded
            return res.status(429).json({
                error: "Too many requests, please try again later"
            });
        }
    }
}

export {
    rateLimiter ,
    customrateLimiter};