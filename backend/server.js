const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/survey', surveyRoutes);

app.listen(port, ()=>{
    console.log('Server is running at http://localhost:${port}');
});