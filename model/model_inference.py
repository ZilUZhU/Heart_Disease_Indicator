import numpy as np 
import pickle
import pandas as pd 

# Normalize the row to the training pattern
def normalize_row(row, scaler):
    row_reshaped = row.values.reshape(1, -1)
    normalized_row = scaler.transform(row_reshaped)
    return normalized_row  

# Normalize the input and compute the Probability 
def compute_P(input, scaler):
    user_input_T = normalize_row(pd.DataFrame([input]),scaler)
    coef = np.array([0.09889642, 0.22637016, 0.30912101, 0.2488255 , 0.18334112,
         0.37937364, 1.03940385, 0.25440507, 0.13933909, 0.17579232]).flatten()
    intercept = -1.29850855
    # Compute the linear combination
    z = np.dot(user_input_T, coef) + intercept
    # Apply the logistic regression
    p = 1 / (1 + np.exp(-z))
    return p
    
def main():
    # Get user input and fit scaler
    #user_input = [29.76, 'No', 'No', 'Uncomfortable', 'No', 'No', 7.0, 'No', 'Bad', 'No']
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    # Transfer user input to number
    user_input = [29.76, 0.0, 0.0, 0.0, 0.0, 1.0, 7.0, 0.0, 0.0, 0.0]

    # compute the output
    P = compute_P(user_input, scaler)
    print(P)

if __name__ == "__main__":
    main()

