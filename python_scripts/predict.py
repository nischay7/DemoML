#!bin/python

import joblib
import pandas as pd
import sys
import numpy as np
import json
from sklearn.metrics import accuracy_score

MODEL_DIR = "models/"
SCALER_DIR = "scaler/"
RESULTS_DIR = 'results/'

def predict(application: str, datapoint: dict=None, file=None) -> str:
    if datapoint is None and file is None:
        raise Exception("Either provide datapoint or csv file")
    model_path = MODEL_DIR + application + "_model.joblib"
    scaler_path = SCALER_DIR + application + "_scaler.joblib"
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    
    if file:
        data = pd.read_csv(file)
        X = data.drop(columns = 'Outcome', axis=1)
    else:
        X = np.array(list(datapoint.values()))
        X = np.reshape(X, (1,len(X)))
    
    X = scaler.transform(X)
    out = model.predict(X)
    out = np.reshape(out, (len(out),1))
    if len(out) >1:
        result_path = RESULTS_DIR+application+"_result.csv"
        out.tofile(result_path, sep=',')
        return result_path
    else:
        return "positive" if out[0][0] else "negative"


if __name__ == "__main__":
    out = predict(sys.argv[1], json.loads(sys.argv[2]), sys.argv[3])
    print(out)