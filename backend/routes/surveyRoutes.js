const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/servey', async(req, res)=>{
    const {
        fullName, email, dataOfBirth, age, contactNo, food, ratingLikes
    } = req.body;

    const connection = await db.getConnection();
    try{
        await connection.beginTransaction();

        const [respondentResult] = await connection.query(
            'insert into SurveyRespondent(fullName, email, dateOfBirth, contactNo) values(?, ?, ?, ?)',
            [fullName, email, dataOfBirth, contactNo]
        );

        const respondentID = respondentResult.insertId;

        for(const foodItem of food){
            await connection.query(
                'insert into FoodChoice(respondentID, foodItem) values(?, ?)',
                [respondentID, foodItem]
            );
        }

        const ratings = [
            {hobies: 'Movies', likeMeter: ratingLikes.rdMovies},
            {hobies: 'Radio', likeMeter: ratingLikes.rdFM},
            {hobies: 'Eatout', likeMeter: ratingLikes.rdEatout},
            {hobies: 'TV', likeMeter: ratingLikes.rdTV},
        ];

        for (const{hobies, likeMeter} of ratings){
            await connection.query(
                'insert into RatingLikes(respondentID, hobies, likeMeter) values(?, ?, ?)',
                [respondentID, hobies, likeMeter]
            );
        }

        await connection.commit();
        res.status(201).json({mesage: 'Survey Submitted!'});
    }catch(err){
        await connection.rollback();
        console.error('Survey submission failed: ', err);
        res.status(500).json({error: 'Failed to submit survey'});
    }finally{
        connection.release();
    }
});

router.get('/survey', async(req, res)=>{
    try{
        const [respondents] = await db.query('selct * from SurveyRespondent');
        const [foodChoices] = await db.query('select * from FoodChoice');
        const [ratings] = await db.query('select * from RatingLikes');

        const surveyData = respondents.map((respondent)=>{
            const food = foodChoices.filter(f => f.respondentID === respondent.respondentID)
            .map(f => f.foodItem);

            const ratingLikes = {};
            ratings.filter(r => r.respondentID === respondent.respondentID).array.forEach(r => {
                switch(r.hobies){
                    case 'Movies': ratingLikes.rdMovies = r.likeMeter; break;
                    case 'Radio': ratingLikes.rdFM = r.likeMeter; break;
                    case 'Eatoput': ratingLikes.rdEatout = r.likeMeter; break;
                    case 'TV': ratingLikes.rdTV = r.likeMeter; break;
                }
            });

            const today = new Date();
            const dob = new Date(respondent.dataOfBirth);
            const age = today.getFullYear() - dob.getFullYear();

            return{
                id:respondent.respondentID,
                fullName: respondent.fullName,
                email: respondent.email,
                dataOfBirth: respondent.dataOfBirth,
                age: age,
                contactNo: respondent.contactNo,
                food: food,
                ratingLikes: ratingLikes
            };
        });

        res.json(surveyData);
    }catch(err){
        console.error('Error fetching survey data: ', err);
        res.status(500).json({error:'Failed to fetch survey data'});        
    }
});

module.exports = router;