import json
import os
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity

DATA_PATHS = [f for f in os.listdir('../data')]

def main():
    """Load the data"""
    data = []
    with open("./all-artists-and-genres.json", "r") as file:
        data = json.load(file)

    """Create the content-based filtering matrix"""
    mlb = MultiLabelBinarizer()
    fit = mlb.fit_transform([
        ["artist" + "-" + "-".join(artist["name"].split(" ")).lower()] + artist["songGenres"] + artist["artistGenres"] for artist in data
    ])
    similarity_matrix = cosine_similarity(fit)

    """Visualize the data"""
    names = [artist["name"] for artist in data]
    similarity_df = pd.DataFrame(similarity_matrix, index=names, columns=names)
    print(similarity_df)

if __name__ == "__main__":
    main()