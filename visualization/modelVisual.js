var modelContainer = document.getElementById('modelContainer');

// Create the form title element
var formTitle = document.createElement('div');
formTitle.className = 'form-title';
formTitle.textContent = 'Project Model Questionnaire:';
modelContainer.appendChild(formTitle);

// Create the form element
var form = document.createElement('form');
form.setAttribute('id', 'userInput');

function addField(form, name, type = "text", placeholder = '', label_text = '') {
    var label = document.createElement('label');
    label.setAttribute('for', name);
    if (label_text === '') {
        label_text = name+": ";
    }
    label.textContent = label_text;

    var input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('name', name);
    input.setAttribute('id', name);
    input.setAttribute('placeholder', placeholder);

    var wrapper = document.createElement('div');
    wrapper.className = 'form-field';
    wrapper.appendChild(label);
    wrapper.appendChild(input);

    form.appendChild(wrapper);
}

function addDropdown(form, name, options, label_text = '') {
    var label = document.createElement('label');
    label.setAttribute('for', name);
    if (label_text === '') {
        label_text = name+": ";
    }
    label.textContent = label_text;

    var select = document.createElement('select');
    select.setAttribute('name', name);
    select.setAttribute('id', name);

    options.forEach(option => {
        var optionElement = document.createElement('option');
        optionElement.setAttribute('value', option);
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    var wrapper = document.createElement('div');
    wrapper.className = 'form-field';
    wrapper.appendChild(label);
    wrapper.appendChild(select);

    form.appendChild(wrapper);
}

// Sex
addDropdown(form, "Sex", ["Male", "Female"], label_text = "Sex at born: ");

// Age Category
addDropdown(form, "AgeCategory", ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-Older"], "What is your age: ");

// Height in meters
addField(form, "HeightCM", type = "number", placeholder = '0', label_text = "What is your height in centimeters (cm)?");

// Weight in kg
addField(form, "WeightKg", type = "number", placeholder = '0', label_text = "What is your weight in kilograms (kg)?");

// Smoking
addDropdown(form, "Smoking", ["Never Smoked","Current Smoker - every day", "Current Smoker - some days","Former smoker" ]);

// Diabetic
addDropdown(form, "Diabetic", ["No", "Yes", "Yes but during pregnancy", "No but pre-diabetes or borderline diabetes"], "Have you ever had diabetes?");

// Alcohol Drinking
addDropdown(form, "AlcoholDrinking", ["Yes", "No"], "Do you drink alcohol?");

// General Health
addDropdown(form, "GenHealth", ["Excellent", "Very Good", "Good", "Fair", "Poor"], "How would you rate your general health?");

// Physical Healthy days for past 30 days
addField(form, "PhysicalHealth", type = "number", placeholder = '0', label_text = "Now thinking about your physical health, which includes physical illness and injury, for how many days during the past 30 days was your physical health not good?");

// Difficult in Walking
addDropdown(form, "DiffWalking", ["Yes", "No"], label_text = "Do you have serious difficulty walking or climbing stairs?");

// Stroke
addDropdown(form, "Stroke", ["Yes", "No"], label_text = "Have you had a stroke?");

// Asthma
addDropdown(form, "Asthma", ["Yes", "No"], "Have you had Asthma:");

// Kidney Disease
addDropdown(form, "KidneyDisease", ["Yes", "No"], "Not including kidney stones, bladder infection or incontinence, were you ever told you had kidney disease?");

// Angina
addDropdown(form, "Angina", ["Yes", "No"], "Have you ever had angina or coronary heart disease?");

// Chest Scan
addDropdown(form, "ChestScan", ["Yes", "No"], "Have you ever had a CT scan or ECG of your chest?");

// Create the submit button
var submitButton = document.createElement('button');
submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Submit';
form.appendChild(submitButton);

// Append the form to the model container
modelContainer.appendChild(form);

// API connection
document.getElementById('userInput').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the traditional form submission

    // Optionally validate the form data here
    const formData = new FormData(this);

    const values = {};
    for (let [key, value] of formData.entries()) {
        values[key] = value;
    }

    // Log all form values
    console.log(values);

    // TODO: convert values to data input for model
    user_input = [values['Sex'], values['AgeCategory'], +values['HeightCM'], +values['WeightKg'], values['Smoking'], values['Diabetic'], values['AlcoholDrinking'], values['GenHealth'], +values['PhysicalHealth'], values['DiffWalking'], values['Stroke'], values['Asthma'], values['KidneyDisease'], values['Angina'], values['ChestScan']];
    console.log(user_input);

    // call model function
    fetch('http://127.0.0.1:8001', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(user_input)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});