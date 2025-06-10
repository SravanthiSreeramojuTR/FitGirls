import json

def generate_workout_plan(user_data):
    """
    Generates a workout plan based on user data.
    For now, this is a placeholder.
    """
    plan = {
        "title": f"Your Personalized Workout Plan for {user_data.get('goals', ['general fitness'])[0]}",
        "days": []
    }
    workout_days = int(user_data.get("workoutDays", 3))
    fitness_level = user_data.get("fitnessLevel", "beginner")

    for i in range(workout_days):
        day_plan = {
            "day": i + 1,
            "focus": f"{fitness_level.capitalize()} Full Body" if i % 2 == 0 else f"{fitness_level.capitalize()} Cardio & Core",
            "exercises": [
                {"name": "Warm-up: Light Cardio", "details": "5-10 minutes"},
                {"name": "Exercise A", "sets": 3, "reps": "10-12", "rest": "60s"},
                {"name": "Exercise B", "sets": 3, "reps": "10-12", "rest": "60s"},
                {"name": "Exercise C", "sets": 3, "reps": "10-12", "rest": "60s"},
                {"name": "Cool-down: Stretching", "details": "5-10 minutes"}
            ]
        }
        plan["days"].append(day_plan)
    return plan

def generate_nutrition_plan(user_data):
    """
    Generates a nutrition plan based on user data.
    For now, this is a placeholder.
    """
    plan = {
        "title": "Your Personalized Nutrition Guidelines",
        "guidelines": [
            "Focus on whole, unprocessed foods.",
            "Ensure adequate protein intake to support muscle repair and growth.",
            "Stay hydrated by drinking plenty of water throughout the day.",
            "Include a variety of fruits and vegetables for essential vitamins and minerals.",
            "Adjust portion sizes based on your activity level and goals."
        ],
        "sample_meal_ideas": {
            "breakfast": "Oatmeal with berries and nuts, or eggs with whole-wheat toast.",
            "lunch": "Grilled chicken salad with mixed greens, or quinoa bowl with roasted vegetables.",
            "dinner": "Baked salmon with sweet potato and steamed broccoli, or lentil soup with a side of brown rice.",
            "snacks": "Greek yogurt, fruit, nuts, or a protein shake."
        }
    }
    if "weight-loss" in user_data.get("goals", []):
        plan["guidelines"].append("Consider a slight caloric deficit if weight loss is a primary goal, but consult a professional.")
    if "strength" in user_data.get("goals", []):
        plan["guidelines"].append("Ensure sufficient calorie and protein intake to fuel strength gains.")

    return plan

if __name__ == '__main__':
    # This part is for testing the functions directly
    # In a real application, this script would be called by a web server (e.g., Flask)
    sample_data = {
        "height": "165",
        "weight": "60",
        "age": "25",
        "gender": "female",
        "fitnessLevel": "intermediate",
        "goals": ["strength", "tone"],
        "workoutDays": "4",
        "workoutDuration": "45-60"
    }
    
    print("--- Sample Workout Plan ---")
    workout = generate_workout_plan(sample_data)
    print(json.dumps(workout, indent=2))
    
    print("\n--- Sample Nutrition Plan ---")
    nutrition = generate_nutrition_plan(sample_data)
    print(json.dumps(nutrition, indent=2))
