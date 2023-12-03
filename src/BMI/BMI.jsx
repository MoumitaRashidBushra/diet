import React, { useState } from 'react';

const BMI = () => {
    const [bmiResult, setBmiResult] = useState(null);
    const [foodRecommendations, setFoodRecommendations] = useState(null);

    const generateBMI = (event) => {
        event.preventDefault();
        const form = event.target;
        const age = form.age.value;
        const height = form.height.value;
        const weight = form.weight.value;
        const gender = form.gender.value;
        const activityLevel = form.activityLevel.value;

        // BMI Calculation
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        // Determine BMI range
        let bmiRange;
        if (bmi < 18.5) {
            bmiRange = 'Underweight';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            bmiRange = 'Normal Weight';
        } else if (bmi >= 25 && bmi <= 29.9) {
            bmiRange = 'Overweight';
        } else {
            bmiRange = 'Obese';
        }

        // Calculate BMR
        const bmr = calculateBMR(weight, height, age, gender);

        // Calculate Daily Caloric Needs
        const dailyCalories = calculateDailyCalories(bmr, activityLevel);

        // Update state with BMI result and calories
        setBmiResult({
            bmi: bmi.toFixed(2),
            range: bmiRange,
            calories: dailyCalories.toFixed(0),
        });

        // Fetch food recommendations based on BMI range and gender
        fetchFoodRecommendations(bmiRange, gender);
    };

    const calculateBMR = (weight, height, age, gender) => {
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else if (gender === 'female') {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        } else {

            bmr = 0;
        }
        return bmr;
    };

    const calculateDailyCalories = (bmr, activityLevel) => {
        let activityFactor;
        switch (activityLevel) {
            case 'sedentary':
                activityFactor = 1.2;
                break;
            case 'lightlyActive':
                activityFactor = 1.375;
                break;
            case 'moderatelyActive':
                activityFactor = 1.55;
                break;
            case 'veryActive':
                activityFactor = 1.725;
                break;
            default:
                activityFactor = 1.2;
        }
        return bmr * activityFactor;
    };

    const fetchFoodRecommendations = (bmiRange, gender) => {
        // Replace 'your_api_endpoint' with the actual API endpoint for food recommendations
        fetch('/foodRecommendations.json')
            .then((response) => response.json())
            .then((data) => {
                // Find food recommendations based on BMI range and gender
                const recommendations = data.recommendations.find(
                    (item) => item.bmiRange === bmiRange && item.gender === gender
                );

                // Update state with food recommendations
                setFoodRecommendations(recommendations ? recommendations.foods : null);
            });
    };

    return (
        <div className="container lg:container lg:mx-auto lg:pt-8 px-20">
            <h2 className='text-center text-4xl font-bold pt-10 pb-6'>Automatic Diet Recommendation</h2>

            <form onSubmit={generateBMI}>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 pt-8  mb-6 px-20 '>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Age</span>
                        </label>
                        <input type="number" placeholder="Age" name='age' className="input input-bordered w-full" />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Height cm</span>
                        </label>
                        <input type="number" placeholder="Height(cm)" name='height' className="input input-bordered w-full" />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Weight(kg)</span>
                        </label>
                        <input type="number" placeholder="Weight(kg)" name='weight' className="input input-bordered w-full" />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Gender</span>
                        </label>
                        <select name="gender" className='input input-bordered w-full' >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Activity Level</span>
                        </label>
                        <select name="activityLevel" className='input input-bordered w-full' >
                            <option value="sedentary">Sedentary</option>
                            <option value="lightlyActive">Lightly Active</option>
                            <option value="moderatelyActive">Moderately Active</option>
                            <option value="veryActive">Very Active</option>
                        </select>
                    </div>
                </div>



                <div className="form-control mt-10 px-20 mb-20">
                    <input
                        type="submit"
                        value="Generate BMI"
                        className="btn btn-outline px-6 text-base font-bold hover:bg-[#ed8311] hover:border-none text-black"
                    />
                </div>
            </form>

            {bmiResult && (
                <div className='text-center'>
                    <p className='font-bold text-xl mb-4'>Your BMI is: {bmiResult.bmi} kg/m2</p>
                    <p className='font-bold text-xl mb-4'>BMI Range: {bmiResult.range}</p>
                    <p className='font-bold text-xl mb-4'>Your calories are: {bmiResult.calories} kcal/day</p>
                    <div>
                        <p className="text-3xl font-bold">Healthy BMI range: 18.5 kg/m2 - 25 kg/m2</p>
                    </div>
                </div>
            )}

            {foodRecommendations && (
                <div>
                    <p className="mt-16 text-center text-2xl font-bold">Food Recommendation based on your BMI</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10 pt-8 mb-16 px-20">
                        <div>
                            <div className="card w-full bg-neutral text-neutral-content">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title">Breakfast</h2>
                                    <ol>
                                        {foodRecommendations.breakfast.map((food, index) => (
                                            <li key={index}>{food}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="card w-full bg-neutral text-neutral-content">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title">Lunch</h2>
                                    <ol>
                                        {foodRecommendations.lunch.map((food, index) => (
                                            <li key={index}>{food}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="card w-full bg-neutral text-neutral-content">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title">Dinner</h2>
                                    <ol>
                                        {foodRecommendations.dinner.map((food, index) => (
                                            <li key={index}>{food}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BMI;
