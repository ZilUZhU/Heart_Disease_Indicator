import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset
from torch.optim import Adam


def preprocess_data(data, scaler=None, fit_scaler=True):
    binary_columns = ['Smoking', 'AlcoholDrinking', 'Stroke', 'DiffWalking', 'Sex', 'Diabetic', 'PhysicalActivity',
                      'Asthma', 'KidneyDisease', 'SkinCancer']
    for col in binary_columns:
        data[col] = LabelEncoder().fit_transform(data[col])
    multiclass_columns = ['AgeCategory', 'Race', 'GenHealth']
    for col in multiclass_columns:
        data[col] = LabelEncoder().fit_transform(data[col])
    data['HeartDisease'] = data['HeartDisease'].apply(lambda x: 1 if x == 'Yes' else 0)
    X = data.drop('HeartDisease', axis=1)
    y = data['HeartDisease'].values
    if fit_scaler:
        scaler = StandardScaler()
        X = scaler.fit_transform(X)
    else:
        X = scaler.transform(X)
    return X, y, scaler


def create_datasets(X, y, batch_size=32):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    X_train = torch.tensor(X_train, dtype=torch.float32)
    y_train = torch.tensor(y_train, dtype=torch.long)
    X_test = torch.tensor(X_test, dtype=torch.float32)
    y_test = torch.tensor(y_test, dtype=torch.long)
    train_dataset = TensorDataset(X_train, y_train)
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_dataset = TensorDataset(X_test, y_test)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    return train_loader, test_loader


class HeartDiseaseModel(nn.Module):
    def __init__(self, input_dim):
        super(HeartDiseaseModel, self).__init__()
        self.layer1 = nn.Linear(input_dim, 128)
        self.layer2 = nn.Linear(128, 64)
        self.layer3 = nn.Linear(64, 32)
        self.output = nn.Linear(32, 2)

    def forward(self, x):
        x = torch.relu(self.layer1(x))
        x = torch.relu(self.layer2(x))
        x = torch.relu(self.layer3(x))
        x = self.output(x)
        return x


def train_model(model, train_loader, criterion, optimizer, num_epochs=50):
    for epoch in range(num_epochs):
        for X_batch, y_batch in train_loader:
            optimizer.zero_grad()
            outputs = model(X_batch)
            loss = criterion(outputs, y_batch)
            loss.backward()
            optimizer.step()
        print(f'Epoch [{epoch + 1}/{num_epochs}], Loss: {loss.item():.4f}')


def evaluate_model(model, test_loader):
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for X_batch, y_batch in test_loader:
            outputs = model(X_batch)
            _, predicted = torch.max(outputs.data, 1)
            total += y_batch.size(0)
            correct += (predicted == y_batch).sum().item()
    accuracy = 100 * correct / total
    print(f'Accuracy: {accuracy:.2f}%')


def predict_single(model, input_data, scaler):
    model.eval()
    input_data = scaler.transform([input_data]) 
    input_tensor = torch.tensor(input_data, dtype=torch.float32)
    with torch.no_grad():
        output = model(input_tensor)
        probability = torch.softmax(output, dim=1)[:, 1].item()
    return probability


def main():
    data = pd.read_csv('../data/data2020.csv')
    X, y, scaler = preprocess_data(data)
    train_loader, test_loader = create_datasets(X, y)
    model = HeartDiseaseModel(X.shape[1])
    optimizer = Adam(model.parameters(), lr=0.001)
    criterion = nn.CrossEntropyLoss()
    train_model(model, train_loader, criterion, optimizer)
    evaluate_model(model, test_loader)
    torch.save(model.state_dict(), 'model_checkpoint/heart_disease_model.pth')
    torch.save(scaler, 'model_checkpoint/scaler.pth')

    new_input = [0.5, 0.5, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0]
    probability = predict_single(model, new_input, scaler)
    print(f'Predicted Probability of Heart Disease: {probability:.4f}')


if __name__ == "__main__":
    main()
