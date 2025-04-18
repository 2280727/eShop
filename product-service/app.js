import { initTracing } from './monitor/tracing.js';
import express from 'express';
import sequelize from './connections/db.js';   
import productRouter from './routes/productRouter.js'
import { NotFoundError } from './errors/index.js';
import cors from 'cors'
import { rateLimiter } from './middlewares/rate-limiter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: "json" };

initTracing({
    serviceName: 'product_service',
    collectorUrl: 'http://135.181.150.234:4318/v1/traces'
  });

const app = express();

app.use(express.json());
app.use(cors());

app.use(rateLimiter)
app.use('/v1/products', productRouter);

app.use((error, req, res, next) => {
    console.error("Error", error)
    if(error instanceof NotFoundError){
        return res.status(error.statusCode).json({
            error: error.message,
            details: error.errors
        })
    }
    return res.status(500).json({
        error: "Oops something went wrong, try again later"
    })
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

sequelize.sync();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});