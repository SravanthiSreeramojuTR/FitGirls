from flask import Flask, request, jsonify
from flask_cors import CORS
import plan_generator

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/generate_plan', methods=['POST'])
def generate_plan_route():
    try:
        user_data = request.json
        
        # Validate that essential data is present (basic validation)
        required_fields = ['height', 'weight', 'age', 'gender', 'fitnessLevel', 'goals', 'workoutDays', 'workoutDuration']
        for field in required_fields:
            if field not in user_data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        workout_plan = plan_generator.generate_workout_plan(user_data)
        nutrition_plan = plan_generator.generate_nutrition_plan(user_data)
        
        return jsonify({
            "workout_plan": workout_plan,
            "nutrition_plan": nutrition_plan
        })
    except Exception as e:
        app.logger.error(f"Error generating plan: {e}")
        return jsonify({"error": "An error occurred while generating the plan."}), 500

if __name__ == '__main__':
    # It's recommended to run Flask with a production-ready WSGI server for actual deployment
    # For development, app.run() is fine.
    app.run(debug=True, port=5000)
