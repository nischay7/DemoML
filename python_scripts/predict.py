#!bin/python

import joblib
import pandas as pd
import sys
import numpy as np
import json

RESULTS_DIR = 'results/results.csv'

def predict(path: str, datapoint: dict=None, file=None) -> str:
    if datapoint is None and file is None:
        raise Exception("Either provide datapoint or csv file")
    model = joblib.load(path)
    
    if file:
        data = pd.read_csv(file)
        columns = data.iloc[0,:]
        X = data.iloc[1:,:]
    else:
        X = np.array(list(datapoint.values()))
        X = np.reshape(X, (1,len(X)))

    out = model.predict(X)

    if type(out) == list:
        out = np.array(out)
        out = np.reshape(out, (len(out),1))
        out.tofile(RESULTS_DIR, sep=',')
        return RESULTS_DIR
    else:
        return "positive" if out.tolist()[0] else "negative"


if __name__ == "__main__":
    out = predict(sys.argv[1], json.loads(sys.argv[2]), sys.argv[3])
    print(out)