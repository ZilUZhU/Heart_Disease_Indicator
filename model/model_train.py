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
    df=pd.read_csv(file_path)
    columns_to_keep = [
        'HeartDisease','BMI', 'Smoking', 'Stroke', 'PhysicalHealth',
        'DiffWalking', 'Sex', 'AgeCategory', 'Diabetic',
        'Asthma', 'KidneyDisease']
    df = df[columns_to_keep]
    df1 = df.copy()
    le=LabelEncoder()
    categorical = df.select_dtypes(include = 'O')
    for feature in categorical:
        df1[feature]=le.fit_transform(df1[feature])
    return df1

# Split the data into training set and test test
def split_data(X, Y, df):
    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size = 0.2,stratify=df['HeartDisease'])
    return X_train, X_test, y_train, y_test

# Oversample the training data
def over_sample_date(X_train, y_train, data_rate = 1):
    minority_class = y_train.value_counts().idxmin()    
    majority_class = y_train.value_counts().idxmax()    

    minority_data = X_train[y_train == minority_class]
    majority_data = X_train[y_train == majority_class]
    minority_labels = y_train[y_train == minority_class]
    majority_labels = y_train[y_train == majority_class]

    oversampled_minority_data = minority_data.sample(int(len(majority_data)*data_rate), replace=True)
    oversampled_minority_labels = minority_labels.sample(int(len(majority_data)*data_rate), replace=True)
    X_train_oversampled = pd.concat([majority_data, oversampled_minority_data])
    y_train_oversampled = pd.concat([majority_labels, oversampled_minority_labels])
    return X_train_oversampled, y_train_oversampled

def main():
    '''
    file_path = '../data/data2020.csv'
    df1 = read_data(file_path)
    # Get training data
    X=df1.drop('HeartDisease',axis=1)
    Y=df1['HeartDisease']
    X_train, X_test, y_train, y_test = split_data(X,Y, df1)
    X_train_oversampled, Y_train_oversampled = over_sample_date(X_train, y_train, data_rate = 0.4)
    '''

if __name__ == "__main__":
    main()