document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('fitness-form');
    const formSteps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('form-progress');
    const stepIndicators = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    const goalCheckboxes = document.querySelectorAll('.goal-checkbox');
    const goalError = document.getElementById('goal-error');
    const hasInjuriesRadios = document.querySelectorAll('input[name="has-injuries"]');
    const injuriesContainer = document.getElementById('injuries-container');
    const questionnaire = document.getElementById('questionnaire-container');
    const resultsContainer = document.getElementById('results-container');
    const backToFormBtn = document.getElementById('back-to-form-btn');
    const planTabs = document.querySelectorAll('.plan-tab');
    const planPanels = document.querySelectorAll('.plan-panel');
    const printPlanBtn = document.getElementById('print-plan-btn');
    const emailPlanBtn = document.getElementById('email-plan-btn');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const profileDetails = document.getElementById('profile-details');
    const workoutSchedule = document.getElementById('workout-schedule');
    const nutritionGuidelines = document.getElementById('nutrition-guidelines');
    const workoutPlanTitleElement = document.querySelector('#workout-plan h3');
    const nutritionPlanTitleElement = document.querySelector('#nutrition-plan h3');
    
    let currentStep = 1;
    const totalSteps = formSteps.length;
    
    // Initialize
    updateProgressBar();
    
    // Event Listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', goToNextStep);
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', goToPrevStep);
    });
    
    generatePlanBtn.addEventListener('click', generatePlan);
    
    goalCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateGoals);
    });
    
    hasInjuriesRadios.forEach(radio => {
        radio.addEventListener('change', toggleInjuriesSection);
    });
    
    backToFormBtn.addEventListener('click', backToForm);
    
    planTabs.forEach(tab => {
        tab.addEventListener('click', switchTab);
    });
    
    printPlanBtn.addEventListener('click', printPlan);
    emailPlanBtn.addEventListener('click', emailPlan);
    savePlanBtn.addEventListener('click', savePlan);
    
    // Functions
    function updateProgressBar() {
        // Update progress bar width
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Update step indicators
        stepIndicators.forEach((step, index) => {
            if (index + 1 < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    function goToNextStep() {
        // Validate current step
        if (!validateStep(currentStep)) {
            return;
        }
        
        // Hide current step
        formSteps[currentStep - 1].classList.remove('active');
        
        // Show next step
        currentStep++;
        formSteps[currentStep - 1].classList.add('active');
        
        // Update progress
        updateProgressBar();
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth' });
    }
    
    function goToPrevStep() {
        // Hide current step
        formSteps[currentStep - 1].classList.remove('active');
        
        // Show previous step
        currentStep--;
        formSteps[currentStep - 1].classList.add('active');
        
        // Update progress
        updateProgressBar();
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth' });
    }
    
    function validateStep(step) {
        // For testing purposes, always return true to allow navigation
        return true;
        
        /* Original validation code
        let isValid = true;
        
        // Get all required inputs in current step
        const currentStepElement = formSteps[step - 1];
        const requiredInputs = currentStepElement.querySelectorAll('[required]');
        
        // Check if all required fields are filled
        requiredInputs.forEach(input => {
            if (!input.value) {
                input.classList.add('invalid');
                isValid = false;
            } else {
                input.classList.remove('invalid');
            }
        });
        
        // Special validation for goals (step 3)
        if (step === 3) {
            const selectedGoals = document.querySelectorAll('.goal-checkbox:checked');
            if (selectedGoals.length === 0) {
                goalError.classList.remove('hidden');
                isValid = false;
            } else {
                goalError.classList.add('hidden');
            }
        }
        
        return isValid;
        */
    }
    
    function validateGoals() {
        const selectedGoals = document.querySelectorAll('.goal-checkbox:checked');
        
        // Limit to 2 selections
        if (selectedGoals.length > 2) {
            this.checked = false;
            goalError.textContent = 'Please select a maximum of 2 goals';
            goalError.classList.remove('hidden');
        } else {
            goalError.classList.add('hidden');
        }
    }
    
    function toggleInjuriesSection() {
        if (this.value === 'yes') {
            injuriesContainer.classList.remove('hidden');
        } else {
            injuriesContainer.classList.add('hidden');
        }
    }
    
    async function generatePlan() {
        // Validate final step
        if (!validateStep(currentStep)) {
            return;
        }

        generatePlanBtn.disabled = true;
        generatePlanBtn.innerHTML = 'Generating Plan... <i class="fas fa-spinner fa-spin"></i>';
        
        // Collect form data with better default handling
        const formData = {
            height: document.getElementById('height').value.trim() || "170",  // Better defaults
            weight: document.getElementById('weight').value.trim() || "70", 
            age: document.getElementById('age').value.trim() || "30",
            gender: document.querySelector('input[name="gender"]:checked')?.value || 'not_specified',
            fitnessLevel: document.querySelector('input[name="fitness-level"]:checked')?.value || 'beginner',
            exerciseFrequency: document.getElementById('exercise-frequency').value || '0',
            goals: Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(cb => cb.value) || ['general_fitness'],
            equipment: Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(cb => cb.value) || [],
            hasInjuries: document.querySelector('input[name="has-injuries"]:checked')?.value || 'no',
            limitations: Array.from(document.querySelectorAll('input[name="limitations"]:checked')).map(cb => cb.value) || [],
            injuryDetails: document.getElementById('injury-details').value || '',
            workoutDays: document.getElementById('workout-days').value || '3',
            workoutTime: Array.from(document.querySelectorAll('input[name="workout-time"]:checked')).map(cb => cb.value) || ['morning'],
            workoutDuration: document.getElementById('workout-duration').value || '30'
        };
        
        // Console log to verify what's being sent
        console.log("Sending data to server:", formData);
    
        
        // Generate profile summary
        profileDetails.innerHTML = ''; // Clear previous summary
        
        const summaryDetails = [
            { label: 'Height', value: `${formData.height} cm` },
            { label: 'Weight', value: `${formData.weight} kg` },
            { label: 'Age', value: formData.age },
            { label: 'Gender', value: formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'N/A' },
            { label: 'Fitness Level', value: formData.fitnessLevel ? formData.fitnessLevel.charAt(0).toUpperCase() + formData.fitnessLevel.slice(1) : 'N/A' },
            { label: 'Current Exercise', value: formData.exerciseFrequency || 'N/A' },
            { label: 'Goals', value: formData.goals.length > 0 ? formData.goals.map(goal => goal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(', ') : 'N/A' },
            { label: 'Equipment', value: formData.equipment.length > 0 ? formData.equipment.map(eq => eq.charAt(0).toUpperCase() + eq.slice(1).replace('-', ' ')).join(', ') : 'Bodyweight only' },
            { label: 'Injuries/Limitations', value: formData.hasInjuries === 'yes' ? (formData.limitations.length > 0 ? formData.limitations.join(', ') : 'Yes, details provided') + (formData.injuryDetails ? ` (${formData.injuryDetails})` : '') : 'No' },
            { label: 'Workout Days', value: `${formData.workoutDays} days per week` },
            { label: 'Preferred Workout Time', value: formData.workoutTime.length > 0 ? formData.workoutTime.join(', ') : 'Any' },
            { label: 'Workout Duration', value: formData.workoutDuration }
        ];
        
        summaryDetails.forEach(detail => {
            const detailItem = document.createElement('div');
            detailItem.className = 'profile-detail-item';
            const label = document.createElement('h4');
            label.textContent = detail.label;
            const value = document.createElement('p');
            value.textContent = detail.value;
            detailItem.appendChild(label);
            detailItem.appendChild(value);
            profileDetails.appendChild(detailItem);
        });

        try {
            const response = await fetch('http://localhost:5000/generate_plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Failed to parse error response from server." })); // Catch parsing error
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Populate Workout Plan
            workoutSchedule.innerHTML = ''; // Clear previous plan
            if (data.workout_plan && data.workout_plan.title) {
                workoutPlanTitleElement.textContent = data.workout_plan.title;
            }
            if (data.workout_plan && data.workout_plan.days) {
                data.workout_plan.days.forEach(day => {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'workout-day';
                    
                    const dayHeader = document.createElement('div');
                    dayHeader.className = 'workout-day-header';
                    dayHeader.textContent = `Day ${day.day}: ${day.focus}`;
                    dayElement.appendChild(dayHeader);
                    
                    const exercisesContainer = document.createElement('div');
                    exercisesContainer.className = 'workout-exercises';
                    day.exercises.forEach(ex => {
                        const exerciseItem = document.createElement('div');
                        exerciseItem.className = 'exercise-item';
                        
                        const exerciseName = document.createElement('div');
                        exerciseName.className = 'exercise-name';
                        exerciseName.textContent = ex.name;
                        exerciseItem.appendChild(exerciseName);
                        
                        const exerciseDetails = document.createElement('div');
                        exerciseDetails.className = 'exercise-details';
                        if (ex.sets && ex.reps) {
                            exerciseDetails.textContent = `Sets: ${ex.sets}, Reps: ${ex.reps}, Rest: ${ex.rest || 'N/A'}`;
                        } else if (ex.details) {
                            exerciseDetails.textContent = ex.details;
                        }
                        exerciseItem.appendChild(exerciseDetails);
                        exercisesContainer.appendChild(exerciseItem);
                    });
                    dayElement.appendChild(exercisesContainer);
                    workoutSchedule.appendChild(dayElement);
                });
            } else {
                 workoutSchedule.innerHTML = '<p>Could not load workout plan.</p>';
            }
            
            // Populate Nutrition Plan
            nutritionGuidelines.innerHTML = ''; // Clear previous plan
            if (data.nutrition_plan && data.nutrition_plan.title) {
                nutritionPlanTitleElement.textContent = data.nutrition_plan.title;
            }
            if (data.nutrition_plan && data.nutrition_plan.guidelines) {
                const guidelinesList = document.createElement('ul');
                data.nutrition_plan.guidelines.forEach(guideline => {
                    const listItem = document.createElement('li');
                    listItem.textContent = guideline;
                    guidelinesList.appendChild(listItem);
                });
                nutritionGuidelines.appendChild(guidelinesList);

                if (data.nutrition_plan.sample_meal_ideas) {
                    const mealIdeasHeader = document.createElement('h4');
                    mealIdeasHeader.textContent = 'Sample Meal Ideas';
                    nutritionGuidelines.appendChild(mealIdeasHeader);
                    const mealIdeasList = document.createElement('ul');
                    for (const mealType in data.nutrition_plan.sample_meal_ideas) {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<strong>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}:</strong> ${data.nutrition_plan.sample_meal_ideas[mealType]}`;
                        mealIdeasList.appendChild(listItem);
                    }
                    nutritionGuidelines.appendChild(mealIdeasList);
                }
            } else {
                nutritionGuidelines.innerHTML = '<p>Could not load nutrition plan.</p>';
            }

            // Show results
            questionnaire.classList.remove('active-section');
            questionnaire.classList.add('hidden-section');
            resultsContainer.classList.remove('hidden-section');
            resultsContainer.classList.add('active-section');

        } catch (error) {
            console.error('Error generating plan:', error);
            alert(`Failed to generate plan: ${error.message}`);
            // Optionally, display error in the UI
            workoutSchedule.innerHTML = `<p class="error-message">Error loading workout plan: ${error.message}</p>`;
            nutritionGuidelines.innerHTML = `<p class="error-message">Error loading nutrition plan: ${error.message}</p>`;
        } finally {
            generatePlanBtn.disabled = false;
            generatePlanBtn.innerHTML = 'Generate My Plan <i class="fas fa-check-circle"></i>';
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    function backToForm() {
        resultsContainer.classList.remove('active-section');
        resultsContainer.classList.add('hidden-section');
        questionnaire.classList.remove('hidden-section');
        questionnaire.classList.add('active-section');
    }
    
    function switchTab(e) {
        const tabId = e.target.getAttribute('data-tab');
        
        // Update active tab
        planTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Show corresponding panel
        planPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `${tabId}-plan`) {
                panel.classList.add('active');
            }
        });
    }
    
    function printPlan() {
        window.print();
    }
    
    function emailPlan() {
        alert('This feature would email the plan to the user. Not implemented in this demo.');
    }
    
    function savePlan() {
        alert('This feature would save the plan for later. Not implemented in this demo.');
    }
});
