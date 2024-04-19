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
        optionElement.setAttribute('value', option[1]);
        optionElement.textContent = option[0];
        select.appendChild(optionElement);
    });

    var wrapper = document.createElement('div');
    wrapper.className = 'form-field';
    wrapper.appendChild(label);
    wrapper.appendChild(select);

    form.appendChild(wrapper);
}

// Sex
// addDropdown(form, "Sex", [["Male", 1], ["Female", 0]], label_text = "Sex at born: ");

// Age Category
addDropdown(form, "AgeCategory", [["18-24",0], ["25-29",1], ["30-34",2], ["35-39",3], ["40-44",4], ["45-49",5], ["50-54",6], ["55-59",7], ["60-64",8], ["65-69",9], ["70-74",10], ["75-79",11], ["80-Older",12]], "What is your age: ");

// Height in meters
addField(form, "HeightCM", type = "number", placeholder = '0', label_text = "What is your height in centimeters (cm)?");

// Weight in kg
addField(form, "WeightKg", type = "number", placeholder = '0', label_text = "What is your weight in kilograms (kg)?");

// Smoking
addDropdown(form, "Smoking", [["Never Smoked",3],["Current smoker - now smokes every day",0], ["Current Smoker - now smokes some days", 1],["Former smoker",2]]);

// Diabetic
addDropdown(form, "Diabetic", [["No",0], ["Yes",2], ["Yes but only during pregnancy",3], ["No but pre-diabetes or borderline diabetes",1]], "Have you ever had diabetes?");

// Alcohol Drinking
addDropdown(form, "AlcoholDrinking", [["Yes",1], ["No",0]], "Do you drink alcohol?");

// General Health
addDropdown(form, "GenHealth", [["Excellent",0], ["Very Good",4], ["Good",2], ["Fair",1], ["Poor",3]], "How would you rate your general health?");

// Physical Healthy days for past 30 days
// addField(form, "PhysicalHealth", type = "number", placeholder = '0', label_text = "Now thinking about your physical health, which includes physical illness and injury, for how many days during the past 30 days was your physical health not good?");

// Difficult in Walking
// addDropdown(form, "DiffWalking", [["Yes",1], ["No",0]], label_text = "Do you have serious difficulty walking or climbing stairs?");

// Stroke
addDropdown(form, "Stroke", [["Yes",1], ["No",0]], label_text = "Have you had a stroke?");

// Asthma
// addDropdown(form, "Asthma", [["Yes",1], ["No",0]], "Have you had Asthma:");

// Kidney Disease
// addDropdown(form, "KidneyDisease", [["Yes",1], ["No",0]], "Not including kidney stones, bladder infection or incontinence, were you ever told you had kidney disease?");

// Angina
addDropdown(form, "Angina", [["Yes",1], ["No",0]], "Have you ever had angina or coronary heart disease?");

// Chest Scan
addDropdown(form, "ChestScan", [["Yes",1], ["No",0]], "Have you ever had a CT scan or ECG of your chest?");

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

    //convert values to data input for model
    user_input = [+values['Angina'], +values['AgeCategory'], +values['GenHealth'], +values['ChestScan'], +values['Stroke'], 
            +values['Smoking'], +values['Diabetic'], +values['WeightKg'], +values['HeightCM']/100, +values['AlcoholDrinking']]
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
        displayoutput();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});