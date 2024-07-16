from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
import nltk
import pickle
import os

nltk.download('punkt')
nltk.download('stopwords')

# Load Data with only necessary columns
print("Loading data...")
df = pd.read_csv('movies.csv', usecols=['Title', 'Plot', 'Release Year'])
print("Data loaded successfully.")

# Preprocess and Vectorize
stop_words = set(stopwords.words('english'))
ps = PorterStemmer()

def preprocess_text(text):
    words = word_tokenize(text)
    filtered_words = [ps.stem(w.lower()) for w in words if w.isalpha() and w.lower() not in stop_words]
    return ' '.join(filtered_words)

# Check if processed data exists
processed_file = 'processed_plot.pkl'
if os.path.exists(processed_file):
    with open(processed_file, 'rb') as f:
        processed_plots = pickle.load(f)
else:
    print("Processing plots...")
    df['processed_plot'] = df['Plot'].apply(preprocess_text)
    processed_plots = df['processed_plot']
    with open(processed_file, 'wb') as f:
        pickle.dump(processed_plots, f)

# Add processed plots to DataFrame
df['processed_plot'] = processed_plots

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df['processed_plot'])
kmeans = KMeans(n_clusters=5, random_state=0)
kmeans.fit(X)
df['cluster'] = kmeans.labels_

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Flask is running!"

@app.route('/api/movies', methods=['GET'])
def get_movies():
    year = request.args.get('year')
    if year:
        filtered_movies = df[df['Release Year'] == int(year)]
        movies = filtered_movies.to_dict(orient='records')
    else:
        movies = df.to_dict(orient='records')
    return jsonify(movies)

@app.route('/api/similar', methods=['POST'])
def find_similar():
    data = request.get_json()
    plot = data['plot']
    processed_plot = preprocess_text(plot)
    vectorized_plot = vectorizer.transform([processed_plot])
    
    # Make prediction
    cluster = kmeans.predict(vectorized_plot)[0]
    similar_movies = df[df['cluster'] == cluster]
    
    # Return the results
    return jsonify(similar_movies.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
