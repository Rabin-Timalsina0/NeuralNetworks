from fastapi import FastAPI
import pickle
from tensorflow import keras
import numpy as np
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

model = keras.models.load_model('model.keras')

with open('columns.pkl','rb') as f:
    columns = pickle.load(f)

with open('scaler.pkl','rb') as f:
    scaler = pickle.load(f)

class Response(BaseModel):
    brand: str
    year: int
    mileage: int
    fuel_type: str
    transmission: str
    accident: int
    speed: int
    horsepower: int
    engine_size: int
    cylinders: int

def predict(brand,year,mileage,fuel_type,transmission,accident,speed,horsepower,engine_size,cylinders):
    arr1 = np.zeros(columns[8:-8].shape[0])
    arr1[np.where(columns[8:-8]==brand)] = 1 
    arr2 = np.zeros(columns[-8:-2].shape[0])
    arr2[np.where(columns[-8:-2]==fuel_type)] = 1 
    arr3 = np.zeros(columns[-2:].shape[0])
    arr3[np.where(columns[-2:]==transmission)] = 1 
    
    features = np.array([year,mileage,accident,horsepower,engine_size,cylinders,speed])
    final_features = np.concatenate((features, arr1, arr2, arr3))
    final_features = final_features.reshape(1, -1)  

    return scaler.transform(final_features)


@app.get('/brands')
def load():
    return {'brands': list(columns[8:-8])}

@app.post('/predict')
def predict_page(response: Response):
    features = predict(response.brand,response.year,response.mileage,response.fuel_type,response.transmission,response.accident,response.speed,response.horsepower,response.engine_size,response.cylinders)
    prediction = model.predict(features)
    final = '$' + str(int(prediction[0][0]))
    return {'price': final}
