import joblib
import pandas as pd
import sys
def predict(path: str, datapoint: list=None, file=None) -> str:
    model = joblib.load(path)
    X = datapoint
    if file:
        data = pd.read_csv(file)
        X = data.iloc[::]
    out = model.predict(X)

    return "positive" if out else "negative"


if __name__ == "main":
    out = predict(sys.argv[1], sys.argv[2], sys.argv[3])
    print(out)