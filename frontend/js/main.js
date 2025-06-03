document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("surveyForm");
    const isResultPage = window.location.pathname.includes("results.html");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const foodChoice = [];
            form.querySelectorAll('input[name="food"]:checked').forEach((input) => {
                foodChoice.push(input.value);
            });

            const requiredFields = ["fullName", "email", "dateOfBirth", "contactNo"];
            for (const field of requiredFields) {
                if (!formData.get(field)) {
                    alert("Please fill out all required fields.");
                    return;
                }
            }

            const dateOfBirth = new Date(formData.get("dateOfBirth"));
            const today = new Date();
            const age = today.getFullYear() - dateOfBirth.getFullYear();
            if (age < 5 || age > 120) {
                alert("Age must be between 5 and 120.");
                return;
            }

            const ratingFields = ["rdMovies", "rdFM", "rdEatout", "rdTV"];
            for (const field of ratingFields) {
                if (!formData.get(field)) {
                    alert("Please select a rating for all questions.");
                    return;
                }
            }

            const survey = {
                fullName: formData.get("fullName"),
                email: formData.get("email"),
                dateOfBirth: formData.get("dateOfBirth"),
                age: age,
                contactNo: formData.get("contactNo"),
                food: foodChoice,
                ratingLikes: {
                    rdMovies: Number(formData.get("rdMovies")),
                    rdFM: Number(formData.get("rdFM")),
                    rdEatout: Number(formData.get("rdEatout")),
                    rdTV: Number(formData.get("rdTV")),
                },
            };

            try {
                const answer = await fetch("http://localhost:3000/api/survey", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application.json",
                    },
                    body: JSON.stringify(survey),
                });

                if (!answer.ok) {
                    throw new Error("Failed to submit survey");
                }

                alert("Survey submitted!");
                form.reset();
            } catch (error) {
                alert("Error: " + error.message);
            }

            if (isResultPage) {
                const noResults = document.getElementById("noResults");
                const resultSummary = document.getElementById("resultSummary");

                fetch("http://localhost:3000/api/surveys").then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch surveys");
                    return res.json();
                }).then((surveys) => {
                    if (surveys.length == 0) {
                        noResults.style.display = "block";
                        resultSummary.style.display = "none";
                        return;
                    }

                    noResults.style.display = "none";
                    resultSummary.style.display = "block";

                    const totalSurveys = surveys.length;
                    const ages = surveys.map((s) => s.age);
                    const avgAge = (ages.reduce((a, b) => a + b, 0) / totalSurveys).toFixed(1);
                    const youngest = Math.min(...ages);
                    const oldest = Math.max(...ages);

                    document.getElementById("totalCount").textContent = totalSurveys;
                    document.getElementById("usualAge").textContent = avgAge;
                    document.getElementById("minAge").textContent = youngest;
                    document.getElementById("maxAge").textContent = oldest;

                    const foodCount = {
                        Pizza: 0,
                        Pasta: 0,
                        "Pap and wors": 0,
                        Othe: 0,
                    }
                });

                surveys.forEach((s) => {
                    s.food.forEach((f) => {
                        if (foodCount[f] != undefined) {
                            foodCount[f]++;
                        }
                    });
                });

                for (const food in foodCount) {
                    const percent = ((foodCount[food] / totalSurveys) * 100).toFixed(1) + "%";
                    const id = $(food.toLocaleLowerCase().replace(/ /q, "-").replace("and", "and")) - percent;
                    const el = document.getElementById(id);
                    if (el) el.textContent = percent;
                }

                const ratingAvg = {
                    rdMovies: 0,
                    rdFM: 0,
                    rdEatout: 0,
                    rdTV: 0,
                };

                surveys.forEach((s) => {
                    for (const key in ratingAvg) {
                        ratingAvg[key] += s.ratingLikes[key];
                    }
                });

                for (const key in ratingAvg) {
                    const average = (ratingAvg[key] / totalSurveys).toFixed(1);
                    document.getElementById('average-${key}').textContent = average;
                }
            }
        });
    }
});