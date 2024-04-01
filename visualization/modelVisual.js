var formContainer = document.getElementById('formContainer');

// Create the form element
var form = document.createElement('form')
// form.setAttribute('method', 'post')

function addField (form, name, type = "text", placeholder = '') {
    var input = document.createElement('input')
    input.setAttribute('type', type)
    input.setAttribute('name', name)
    input.setAttribute('id', name)
    input.setAttribute('placeholder', placeholder)

    var label = document.createElement('label');
    label.setAttribute('for', name);
    label.textContent = name+": ";

    form.appendChild(label);
    form.appendChild(input);

}
// alcohol drinking
addField(form, "Alcohol Drinking", type = "number")
// smoking
addField(form, "Smoking", type = "text")
// stroke

// physical health

// mental health

// diffwalking

// sex
addField(form, "Gender", type = "text")

// age category

// race

// diabetic

// physical activity

// genhealth
function createStyledRadioButton(name, id, value, labelText) {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '10px';

    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', name);
    input.setAttribute('id', id);
    input.setAttribute('value', value);
    input.style.marginRight = '10px';

    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    return wrapper;
}

function createStyledLabel(forInput, textContent) {
    const label = document.createElement('label');
    label.setAttribute('for', forInput);
    label.textContent = textContent;
    label.style.display = 'block';
    label.style.marginTop = '10px';
    label.style.marginBottom = '5px';
    return label;
}

// Add a section for single choice input
const questionLabel = createStyledLabel('', 'What is your general health status?');
questionLabel.style.fontWeight = 'bold';
form.appendChild(questionLabel);

// Options for the single choice question
// Very good', 'Fair', 'Good', 'Excellent', 'Poor'
const options = [
    { id: 'genhealth0', value: 'Excellent', labelText: 'Excellent' },
    { id: 'genhealth1', value: 'Very good', labelText: 'Very good' },
    { id: 'genhealth2', value: 'Good', labelText: 'Good' },
    { id: 'genhealth3', value: 'Fair', labelText: 'Fair' },
    { id: 'genhealth4', value: 'Poor', labelText: 'Poor' },
];

// Append radio buttons for each option
options.forEach(option => {
    form.appendChild(createStyledRadioButton('genhealth', option.id, option.value, option.labelText));
});


// sleep time

// asthma

// kidney disease

// skin cancer

// Create fields for required inputs

// BMI
var BMIinput = document.createElement('input')
BMIinput.setAttribute('id', 'BMI')
BMIinput.setAttribute('type', 'number')
BMIinput.setAttribute('name', 'BMI')
BMIinput.setAttribute('placeholder', '0')

var BMILabel = document.createElement('label');
BMILabel.setAttribute('for', 'BMI');
BMILabel.textContent = 'BMI: ';

// Create the submit button
var submitButton = document.createElement('input');
submitButton.setAttribute('type', 'submit');
submitButton.setAttribute('value', 'Submit');

// Append the input fields and the submit button to the form
form.appendChild(BMILabel);
form.appendChild(BMIinput);
// form.appendChild();
// form.appendChild();
form.appendChild(submitButton);

// Finally, append the form to the container
formContainer.appendChild(form);