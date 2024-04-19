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


# Normalize the row to the training pattern
def normalize_row(row, scaler):
    row_reshaped = row.values.reshape(1, -1)
    normalized_row = scaler.transform(row_reshaped)
    return normalized_row


# Normalize the input and compute the Probability 
def compute_P(input, scaler):
    user_input_T = normalize_row(pd.DataFrame([input]), scaler)
    coef = np.array([0.09250334, 0.23067485, 0.30712092, 0.24308795, 0.19264143,
                     0.35994048, 1.03353847, 0.2447468, 0.13934069, 0.17743164]).flatten()
    intercept = -1.29850855
    # Compute the linear combination
    z = np.dot(user_input_T, coef) + intercept
    # Apply the logistic regression
    p = 1 / (1 + np.exp(-z))
    return p


def run_model(user_input=[29.76, 'No', 'No', 'Uncomfortable', 'No', 'No', 7.0, 'No', 'Bad', 'No']):
    user_input = preprocess_input((user_input))
    file_path = 'data/data2020.csv'
    df1 = read_data(file_path)
    # Get training data
    X = df1.drop('HeartDisease', axis=1)
    Y = df1['HeartDisease']
    X_train, X_test, y_train, y_test = split_data(X, Y, df1)
    X_train_oversampled, Y_train_oversampled = over_sample_date(X_train, y_train, data_rate=0.4)
    # Get user input and fit scaler
    # user_input = [29.76, 0.0, 0.0, 0.0, 0.0, 1.0, 7.0, 0.0, 0.0, 0.0]
    scaler = StandardScaler().fit(X_train_oversampled.values)
    # compute the output
    P = compute_P(user_input, scaler)
    print(P)
    print('ok')
    return P


def preprocess_input(user_input):
    mapping = {
        'Yes': 1.0,
        'No': 0.0,
        'Male': 0.0,
        'Female': 1.0,
        'No, borderline diabetes': 2.0,
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

        # 2022 inputs
        "Yes but during pregnancy": 1.0, 
        "No but pre-diabetes or borderline diabetes": 0.0,
        "Never Smoked": 0.0,
        "Current Smoker - every day": 1.0, 
        "Current Smoker - some days": 1.0,
        "Former smoker": 0.0 
    }

    converted_input = []
    for value in user_input:
        if isinstance(value, str) and value in mapping:
            converted_input.append(mapping[value])
        else:
            converted_input.append(value)

    return converted_input

