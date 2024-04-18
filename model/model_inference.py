import numpy as np 
import pickle
import pandas as pd 
from joblib import load

# Normalize the row to the training pattern
def normalize_row(row, scaler):
    row_reshaped = row.values.reshape(1, -1)
    normalized_row = scaler.transform(row_reshaped)
    return normalized_row  

# Normalize the input and compute the Probability 
# Load the model back from the file

# Use loaded_model to predict or evaluate to ensure it works

def compute_P(input, scaler):
    loaded_model = load('logistic_model.joblib')
    
    user_input_T = normalize_row(pd.DataFrame([input]),scaler)
    predictions = loaded_model.predict_proba(user_input_T)
    return predictions[0][1]
    
def main():
    # Get user input and fit scaler
    #user_input = [29.76, 'No', 'No', 'Uncomfortable', 'No', 'No', 7.0, 'No', 'Bad', 'No']
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    # Transfer user input to number
    user_input = [0.0, 9.0, 4.0, 1.0, 0.0, 3.0, 0.0, 111.13, 1.63, 0.0]

    # compute the output
    P = compute_P(user_input, scaler)
    print(P)

if __name__ == "__main__":
    main()

