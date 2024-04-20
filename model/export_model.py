import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sklearn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder
from joblib import load
import pickle


# Read data from CSV
def read_data(file_path):
    df = pd.read_csv(file_path)
    columns_to_keep = [
        'HeartDisease', 'BMI', 'Smoking', 'Stroke', 'PhysicalHealth',
        'DiffWalking', 'Sex', 'AgeCategory', 'Diabetic',
        'Asthma', 'KidneyDisease']
    df = df[columns_to_keep]
    df1 = df.copy()
    le = LabelEncoder()
    categorical = df.select_dtypes(include='O')
    for feature in categorical:
        df1[feature] = le.fit_transform(df1[feature])
    return df1


# Split the data into training set and test test
def split_data(X, Y, df):
    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, stratify=df['HeartDisease'])
    return X_train, X_test, y_train, y_test


# Oversample the training data
def over_sample_date(X_train, y_train, data_rate=1):
    minority_class = y_train.value_counts().idxmin()
    majority_class = y_train.value_counts().idxmax()

    minority_data = X_train[y_train == minority_class]
    majority_data = X_train[y_train == majority_class]
    minority_labels = y_train[y_train == minority_class]
    majority_labels = y_train[y_train == majority_class]

    oversampled_minority_data = minority_data.sample(int(len(majority_data) * data_rate), replace=True)
    oversampled_minority_labels = minority_labels.sample(int(len(majority_data) * data_rate), replace=True)
    X_train_oversampled = pd.concat([majority_data, oversampled_minority_data])
    y_train_oversampled = pd.concat([majority_labels, oversampled_minority_labels])
    return X_train_oversampled, y_train_oversampled


def normalize_row(row, scaler):
    row_reshaped = row.values.reshape(1, -1)
    normalized_row = scaler.transform(row_reshaped)
    return normalized_row  

def compute_P(input, scaler, path):
    loaded_model = load(path)
    user_input_T = normalize_row(pd.DataFrame([input]),scaler)
    predictions = loaded_model.predict_proba(user_input_T)
    return predictions[0][1]


def run_model(user_input=[0.0, 9.0, 4.0, 1.0, 0.0, 3.0, 0.0, 111.13, 1.63, 0.0]):
    # user_input = preprocess_input((user_input))
    # user_input=[0.0, 9.0, 4.0, 1.0, 0.0, 3.0, 0.0, 111.13, 1.63, 0.0]
    with open('model/saved_files/scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    
    model_path = 'model/saved_files/logistic_model.joblib'
    # compute the output
    P = compute_P(user_input, scaler,model_path)
    print(P)
    print('ok')
    return P


def preprocess_input(user_input):
    mapping = {
        'Yes': 1.0,
        'No': 0.0,
        'Male': 0.0,
        'Female': 1.0,

        '18-24': 1.0,
        '24-29': 2.0,
        '30-34': 3.0,
        '35-39': 4.0,
        '40-44': 5.0,
        '45-49': 6.0,
        '50-54': 7.0,
        '55-59': 8.0,
        '60-64': 9.0,
        '65-69': 10.0,
        '70-74': 11.0,
        '75-79': 12.0,
        '80 or older': 13.0,

        "Yes but during pregnancy": 1.0, 
        "No but pre-diabetes or borderline diabetes": 0.0,
        
        "Current smoker - now smokes every day": 0.0, 
        "Current smoker - now smokes some days": 1.0,
        "Former smoker": 2.0,
        "Never Smoked": 3.0,

        'Excellent': 0.0, 
        'Fair': 1.0,
        'Good': 2.0,
        'Poor': 3.0,
        'Very good': 4.0,


    }

    converted_input = []
    for value in user_input:
        if isinstance(value, str) and value in mapping:
            converted_input.append(mapping[value])
        else:
            converted_input.append(value)

    return converted_input

