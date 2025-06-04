document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("surveyForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const foodChoices = [];
            document.querySelectorAll('input[name="food"]:checked').forEach((input) => {
                foodChoices.push(input.value);
            });

            const requiredFields = ["fullName", "email", "dateOfBirth", "contactNo"];
            for (const field of requiredFields) {
                if (!formData.get(field)) {
                    alert("Please fill out all required fields.");
                    return;
                }
            }

            const ratings = {
                Movies: formData.get("rdMovies"),
                Radio: formData.get("rdFM"),
                Eatout: formData.get("rdEatout"),
                TV: formData.get("rdTV")
            };

            const ratingFields = ["rdMovies", "rdFM", "rdEatout", "rdTV"];
            for (const field of ratingFields) {
                if (!formData.get(field)) {
                    alert("Please select a rating for all questions.");
                    return;
                }
            }

            const dateOfBirth = new Date(formData.get("dateOfBirth"));
            const today = new Date();
            let age = today.getFullYear() - dateOfBirth.getFullYear();
            const moonth = today.getMonth() - dateOfBirth.getMonth();
            if (moonth < 0 || (moonth === 0 && today.getDate() < dateOfBirth.getDate())) {
                age--;
            }
            if (age < 5 || age > 120) {
                alert("Age must be between 5 and 120.");
                return;
            }

            const respondent = {
                fullName: formData.get("fullName"),
                email: formData.get("email"),
                dateOfBirth: formData.get("dateOfBirth"),
                contactNo: formData.get("contactNo"),
                food: foodChoices,
                ratingLikes: {
                    Movies: Number(formData.get("rdMovies")),
                    Radio: Number(formData.get("rdFM")),
                    Eatout: Number(formData.get("rdEatout")),
                    TV: Number(formData.get("rdTV")),
                }
            };

            try {
                const answer = await fetch("http://localhost:3000/api/survey/survey", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(respondent)
                });

                if (answer.ok) {
                    alert("Survey submitted!");
                    form.reset();
                } else {
                    alert("Failed to submit survey");
                }
            } catch (err) {
                console.error(err);
                alert("Error occured while submitting.");
            }
        });
    }

    const resultSection = document.getElementById("resultSection");
    if (resultSection) {
        fetch("http://localhost:3000/api/survey/survey").then((res) => res.json()).then((data) => {
            if (!Array.isArray(data) || data.length === 0) {
                document.getElementById("noResults").style.display = "block";
                document.getElementById("resultSummary").style.display = "none";
                return;
            }

            document.getElementById("noResults").style.display = "none";
            document.getElementById("resultSummary").style.display = "block";

            const totalSurveys = data.length;
            const ages = data.map((s) => s.age);
            const avgAge = (ages.reduce((a, b) => a + b, 0) / totalSurveys).toFixed(1);
            const oldest = Math.max(...ages);
            const youngest = Math.min(...ages);

            document.getElementById("totalSurveys").textContent = totalSurveys;
            document.getElementById("averageAge").textContent = avgAge;
            document.getElementById("oldestAge").textContent = oldest;
            document.getElementById("youngestAge").textContent = youngest;

            const foodStats = { Pizza: 0, Pasta: 0, "Pap and Wors": 0, Other: 0 };
            const ratingSums = { Movies: 0, Radio: 0, Eatout: 0, TV: 0 };
            const ratingCount = { Movies: 0, Radio: 0, Eatout: 0, TV: 0 };

            data.forEach((answer) => {
                if (answer.food && Array.isArray(answer.food)) {
                    answer.food.forEach((f) => {
                        if (foodStats[f] !== undefined) {
                            foodStats[f]++
                        } else {
                            foodStats["Other"]++;
                        }
                    });
                }

                for (let cat in answer.ratings) {
                    if (ratingSums[cat] !== undefined) {
                        ratingSums[cat] += parseInt(answer.ratings[cat]);
                        ratingCount[cat]++;
                    }
                }
            });

            const percent = (count) => ((count / totalSurveys) * 100).toFixed(1) + "%";

            document.getElementById("pizzaLikes").textContent = percent(foodStats["Pizza"]);
            document.getElementById("pastaLikes").textContent = percent(foodStats["Pasta"]);
            document.getElementById("papNworsLikes").textContent = percent(foodStats["Pap and Wors"]);
            document.getElementById("otherFoodLikes").textContent = percent(foodStats["Other"]);

            document.getElementById("movieRating").textContent = sumAvg(ratingSums["Movies"], ratingCount["Movies"]);
            document.getElementById("radioRating").textContent = sumAvg(ratingSums["Radio"], ratingCount["Radio"]);
            document.getElementById("eatoutRating").textContent = sumAvg(ratingSums["Eatout"], ratingCount["Eatout"]);
            document.getElementById("tvRating").textContent = sumAvg(ratingSums["TV"], ratingCount["TV"]);

        }).catch((err) => {
            console.error("Error loading results:", err);
        });
    }
});

function sumAvg(sum, count) {
    return count ? (sum / count).toFixed(1) : "N/A";
}