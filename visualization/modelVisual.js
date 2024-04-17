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

// BMI
addField(form, "BMI", type = "number", placeholder = '0');

// Smoking
addDropdown(form, "Smoking", ["Never Smoked","Current Smoker - every day", "Current Smoker - some days","Former smoker" ]);

// // Alcohol Drinking
// addDropdown(form, "Alcohol Drinking", ["Yes", "No"]);

// Physical Healthy days for past 30 days
addField(form, "PhysicalHealth", type = "number", placeholder = '0', label_text = "Now thinking about your physical health, which includes physical illness and injury, for how many days during the past 30 days was your physical health not good?");

// // Mental Healthy days for past 30 days
// addField(form, "Mental Healthy days for past 30 days", type = "number", placeholder = '0');

// Difficult in Walking
addDropdown(form, "DiffWalking", ["Yes", "No"], label_text = "Do you have serious difficulty walking or climbing stairs?");

// Sex
addDropdown(form, "Sex", ["Male", "Female"], label_text = "Sex at born: ");

// Age Category
addDropdown(form, "AgeCategory", ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-Older"], "What is your age: ");

// // Race
// addDropdown(form, "Race", ["White", "Black", "Other Race", "Multiracial", "Hispanic"]);

// Diabetic
addDropdown(form, "Diabetic", ["No", "Yes", "Yes but during pregnancy", "No but pre-diabetes or borderline diabetes"], "Have you ever had diabetes?");

// Stroke
addDropdown(form, "Stroke", ["Yes", "No"], label_text = "Have you had a stroke?");


// // Physical Active
// addDropdown(form, "Physical Active", ["Yes", "No"]);

// // General Health
// addDropdown(form, "General Health", ["Very Good", "Fair", "Good", "Excellent", "Poor"]);

// // Sleep Time
// addField(form, "Sleep Time Daily", type = "number", placeholder = '0');

// Asthma
addDropdown(form, "Asthma", ["Yes", "No"], "Have you had Asthma:");

// Kidney Disease
addDropdown(form, "KidneyDisease", ["Yes", "No"], "Not including kidney stones, bladder infection or incontinence, were you ever told you had kidney disease?");

// // Skin Cancer
// addDropdown(form, "Had Skin Cancer ?", ["Yes", "No"]);

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

    // user_input = [values['BMI'],  values['Smoking'], values['Stroke'], values['PhysicalHealth'], values['DiffWalking'], values['Sex'], values['AgeCategory'], values['Diabetic'], values['Asthma'], values['KidneyDisease']]
    user_input = [29.76, 1.0, 0.0, 1.0, 0.0, 1.0, 9.0, 0.0, 9.0, 2.0]
    // user_input = [29.76, 'No', 'No', 'Uncomfortable', 'No', 'No', 7.0, 'No', 'Bad', 'No']
    console.log([values['BMI'],  values['Smoking'], values['Stroke'], values['PhysicalHealth'], values['DiffWalking'], values['Sex'], values['AgeCategory'], values['Diabetic'], values['Asthma'], values['KidneyDisease']])



    // call model function
    fetch('http://127.0.0.1:8001', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        // body: JSON.stringify(values)
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

