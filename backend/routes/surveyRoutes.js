const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/survey', async(req, res)=>{
    const {
        fullName, email, dataOfBirth, age, contactNo, food, ratingLikes
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

        const ratingData = [
            {hobies: 'Movies', likeMeter: ratings.Movies},
            {hobies: 'Radio', likeMeter: ratings.FM},
            {hobies: 'Eatout', likeMeter: ratings.Eatout},
            {hobies: 'TV', likeMeter: ratings.TV},
        ];

        for (const{hobies, likeMeter} of ratingData){
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
        const [respondents] = await db.query('select * from SurveyRespondent');
        const [foodChoices] = await db.query('select * from FoodChoice');
        const [ratings] = await db.query('select * from RatingLikes');

        const surveyData = respondents.map((respondent)=>{
            const food = foodChoices.filter(f => f.respondentID === respondent.respondentID)
            .map(f => f.foodItem);

            const ratingLikes = {};
            ratings.filter(r => r.respondentID === respondent.respondentID).forEach(r => {
                switch(r.hobies){
                    case 'Movies': ratings.Movies = r.likeMeter; break;
                    case 'Radio': ratings.FM = r.likeMeter; break;
                    case 'Eatput': ratings.Eatout = r.likeMeter; break;
                    case 'TV': ratings.TV = r.likeMeter; break;
                }
            });

            const today = new Date();
            const dob = new Date(respondent.dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const moonth = today.getMonth() - birthDate.getMonth();
            if (moonth < 0 || (moonth === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return{
                id:respondent.respondentID,
                fullName: respondent.fullName,
                email: respondent.email,
                dataOfBirth: respondent.dateOfBirth,
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