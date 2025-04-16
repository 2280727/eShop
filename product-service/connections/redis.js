import { createClient } from 'redis';

import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    url: 'redis://135.181.150.234:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully.');
});

await redisClient.connect();

export default redisClient;