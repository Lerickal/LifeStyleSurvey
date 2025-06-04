const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/survey', async(req, res)=>{
    const {
        fullName, email, dateOfBirth, age, contactNo, food, ratingLikes
    } = req.body;

    const connection = await db.getConnection();
    try{
        await connection.beginTransaction();

        const [respondentResult] = await connection.query(
            'insert into SurveyRespondent(fullName, email, dateOfBirth, contactNo) values(?, ?, ?, ?)',
            [fullName, email, dateOfBirth, contactNo]
        );

        const respondentID = respondentResult.insertId;

        for(const foodItem of food){
            await connection.query(
                'insert into FoodChoice(respondentID, foodItem) values(?, ?)',
                [respondentID, foodItem]
            );
        }

        const ratings = [
            {hobies: 'Movies', likeMeter: ratingLikes.Movies},
            {hobies: 'Radio', likeMeter: ratingLikes.Radio},
            {hobies: 'Eatout', likeMeter: ratingLikes.Eatout},
            {hobies: 'TV', likeMeter: ratingLikes.TV},
        ];

        for (const{hobies, likeMeter} of ratings){
            await connection.query(
                'insert into RatingLikes(respondentID, hobies, likeMeter) values(?, ?, ?)',
                [respondentID, hobies, likeMeter]
            );
        }

        await connection.commit();
        res.status(201).json({message: 'Survey Submitted!'});
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
        const [respondents] = await db.query('select * from SurveyRespondent');
        const [foodChoices] = await db.query('select * from FoodChoice');
        const [ratings] = await db.query('select * from RatingLikes');

        const surveyData = respondents.map((respondent)=>{
            const food = foodChoices.filter(f => f.respondentID === respondent.respondentID)
            .map(f => f.foodItem);

            const ratingLikes = {};
            ratings.filter(r => r.respondentID === respondent.respondentID).forEach(r => {
                switch(r.hobies){
                    case 'Movies': ratingLikes.Movies = r.likeMeter; break;
                    case 'Radio': ratingLikes.Radio = r.likeMeter; break;
                    case 'Eatout': ratingLikes.Eatout = r.likeMeter; break;
                    case 'TV': ratingLikes.TV = r.likeMeter; break;
                }
            });

            const today = new Date();
            const dob = new Date(respondent.dateOfBirth);
            let age = today.getFullYear() - dob.getFullYear();
            const moonth = today.getMonth() - dob.getMonth();
            if (moonth < 0 || (moonth === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            return{
                id:respondent.respondentID,
                fullName: respondent.fullName,
                email: respondent.email,
                dateOfBirth: respondent.dateOfBirth,
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