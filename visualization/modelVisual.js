var modelContainer = document.getElementById('modelContainer');

// Create the form title element
var formTitle = document.createElement('div');
formTitle.className = 'form-title';
formTitle.textContent = 'Project Model Questionnaire:';
modelContainer.appendChild(formTitle);

// Create the form element
var form = document.createElement('form');
form.setAttribute('id', 'userInput');

function addField(form, name, type = "text", placeholder = '') {
    var label = document.createElement('label');
    label.setAttribute('for', name);
    label.textContent = name + ": ";

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

function addDropdown(form, name, options) {
    var label = document.createElement('label');
    label.setAttribute('for', name);
    label.textContent = name + ": ";

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

// Alcohol Drinking
addDropdown(form, "Alcohol Drinking", ["Yes", "No"]);

// Physical Healthy days for past 30 days
addField(form, "Physical Healthy days for past 30 days", type = "number", placeholder = '0');

// Mental Healthy days for past 30 days
addField(form, "Mental Healthy days for past 30 days", type = "number", placeholder = '0');

// Difficult in Walking
addDropdown(form, "Difficult in Walking", ["Yes", "No"]);

// Sex
addDropdown(form, "Sex", ["Male", "Female"]);

// Age Category
addDropdown(form, "Age Category", ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-Older"]);

// Race
addDropdown(form, "Race", ["White", "Black", "Other Race", "Multiracial", "Hispanic"]);

// Diabetic
addDropdown(form, "Diabetic", ["No", "Yes", "Yes but during pregnancy", "No but pre-diabetes or borderline diabetes"]);

// Physical Active
addDropdown(form, "Physical Active", ["Yes", "No"]);

// General Health
addDropdown(form, "General Health", ["Very Good", "Fair", "Good", "Excellent", "Poor"]);

// Sleep Time
addField(form, "Sleep Time Daily", type = "number", placeholder = '0');

// Asthma
addDropdown(form, "Had Asthma ?", ["Yes", "No"]);

// Kidney Disease
addDropdown(form, "Had Kidney Disease ?", ["Yes", "No"]);

// Skin Cancer
addDropdown(form, "Had Skin Cancer ?", ["Yes", "No"]);

// Create the submit button
var submitButton = document.createElement('button');
submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Submit';
form.appendChild(submitButton);

// Append the form to the model container
modelContainer.appendChild(form);
