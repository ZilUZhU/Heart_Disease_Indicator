import numpy as np 
import pickle
import pandas as pd 
from joblib import load

def normalize_row(row, scaler):
    row_reshaped = row.values.reshape(1, -1)
    normalized_row = scaler.transform(row_reshaped)
    return normalized_row  

def compute_P(input, scaler, path):
    loaded_model = load(path)
    user_input_T = normalize_row(pd.DataFrame([input]),scaler)
    predictions = loaded_model.predict_proba(user_input_T)
    return predictions[0][1]
    
def main():
    # Get user input and fit scaler
    #user_input = [29.76, 'No', 'No', 'Uncomfortable', 'No', 'No', 7.0, 'No', 'Bad', 'No']
    
    user_input = [0.0, 9.0, 4.0, 1.0, 0.0, 3.0, 0.0, 111.13, 1.63, 0.0]

    with open('./saved_files/scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    
    model_path = './saved_files/logistic_model.joblib'
    # compute the output
    P = compute_P(user_input, scaler,model_path)
    print(P)

if __name__ == "__main__":
    main()

