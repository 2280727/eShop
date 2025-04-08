import express from 'express';
import sequelize from './db.js';


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
   res.send("Landing page")
})

sequelize.sync();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});