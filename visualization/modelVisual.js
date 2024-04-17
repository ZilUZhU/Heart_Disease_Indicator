var formContainer = document.getElementById('formContainer');

// Create the form element
var form = document.createElement('form')
form.setAttribute('method', 'get')
form.setAttribute('id', 'userInput')

function addField (form, name, type = "text", placeholder = '', label_text = '') {
    var input = document.createElement('input')
    input.setAttribute('type', type)
    input.setAttribute('name', name)
    input.setAttribute('id', name)
    input.setAttribute('placeholder', placeholder)

    var label = document.createElement('label');
    label.setAttribute('for', name);
    if (label_text === '') {
        label_text = name+": ";
    }
    label.textContent = label_text;

    form.appendChild(label);
    form.appendChild(input);

}

// function
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
    label.style.fontWeight = 'bold';
    return label;
}


// alcohol drinking
addField(form, "Alcohol Drinking", type = "number")
// smoking
// addField(form, "Smoking", type = "text")
const smoking_question = createStyledLabel('Smoking', 'How often do you smoke?');
form.appendChild(smoking_question);
Smoking_options = [
    { id: 'smoke0', value: 'Former smoker', labelText: 'Former smoker' },
    { id: 'smoke1', value: 'Never smoked', labelText: 'Never smoked' },
    { id: 'smoke2', value: 'Current smoker - now smokes every day', labelText: 'Current smoker - now smokes every day' },
    { id: 'smoke3', value: 'Current smoker - now smokes some days', labelText: 'Current smoker - now smokes some days' },
    ]
Smoking_options.forEach(option => {
    form.appendChild(createStyledRadioButton('Smoking', option.id, option.value, option.labelText));
});
// stroke
const stroke_question = createStyledLabel('Stroke', 'Have you had stroke?');
form.appendChild(stroke_question);
Stroke_options = [
    { id: 'stroke0', value: 'Yes', labelText: 'Yes' },
    { id: 'stroke1', value: 'No', labelText: 'No' },
    ]
Stroke_options.forEach(option => {
    form.appendChild(createStyledRadioButton('Stroke', option.id, option.value, option.labelText));
});

// physical health
PhysicalHealth_question = createStyledLabel('PhysicalHealth', 'Now thinking about your physical health, which includes physical illness and injury, for how many days during the past 30 days was your physical health not good?');
form.appendChild(PhysicalHealth_question)
addField(form, "PhysicalHealth", type = "number", label_text = 'Days: ')

// mental health

// diffwalking

// sex
addField(form, "Gender", type = "text")

// age category

// race

// diabetic

// physical activity

// genhealth
const questionLabel = createStyledLabel('genhealth', 'What is your general health status?');
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
const asthmaLabel = createStyledLabel('', 'Have you had asthma?');
asthmaLabel.style.fontWeight = 'bold';

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



async function test() {
    const response = await fetch('http://localhost:8001/test');
    const data = await response.json();
    console.log('test result:', data.result);
    const response2 = await fetch('http://127.0.0.1:8001/test', {
        method: 'POST',
        // mode: "no-cors",
        // cache: "no-cache",
        // credentials: "omit",
        AccessControlAllowOrigin: '*',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'content': 'contents'
        },
        body: JSON.stringify("values")
    });
    const data2 = await response2.json();
    console.log('post:', data2.result);

}



var testButton = document.getElementById('test');
testButton.setAttribute('type', 'button');
testButton.setAttribute('value', 'test');
testButton.onclick = function() {
    console.log('Test');
    test();
};