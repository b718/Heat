from gensim.test.utils import common_texts
from gensim.models import Word2Vec

def main():
    model = Word2Vec(sentences=common_texts, vector_size=100, window=5, min_count=1, workers=4)

    """Tinker"""
    vector = model.wv['computer']
    print(vector)

    sims = model.wv.most_similar('computer', topn=10)
    print(sims)

if __name__ == "__main__":
    main()