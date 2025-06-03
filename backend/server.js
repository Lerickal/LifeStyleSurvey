const express = require('express');
const cors = require('cors');
const bodyPrser = require('body-parse');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyPrser.json());
app.use('/api', surveyRoutes);

app.listen(port, ()=>{
    console.log('Server is running at http://localhost:${port}');
});