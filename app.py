from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "animal_population.csv")
df = pd.read_csv(csv_path)

@app.route("/")
def home():
    return jsonify({"message": "Street Animal API Running"})

@app.route("/data")
def data():
    return df.to_dict(orient="records")

if __name__ == "__main__":
    app.run(debug=True)
