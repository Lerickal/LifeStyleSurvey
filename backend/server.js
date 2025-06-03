const express = require('express');
const cors = require('cors');
const baodyPrser = require('body-parse');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();
const port = 300;

app.use(cors());
app.use(baodyPrser.json());
app.use('/api', surveyRoutes);

app.listen(port, ()=>{
    console.log('Server is running at http://localhost:{port}');
});