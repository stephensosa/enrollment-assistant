"""Train the enrollment-question intent classifier."""

import csv
from pathlib import Path

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "intents.csv"
MODEL_PATH = ROOT / "model.joblib"


def main():
    with DATA_PATH.open(newline="", encoding="utf-8") as data_file:
        rows = list(csv.DictReader(data_file))

    questions = [row["text"].strip() for row in rows]
    labels = [row["category"].strip() for row in rows]
    categories = sorted(set(labels))
    if len(rows) != 50 or len(categories) != 5:
        raise ValueError("Expected 50 questions across exactly five categories.")
    if any(not question or not label for question, label in zip(questions, labels)):
        raise ValueError("Every training row must include a question and category.")

    train_questions, test_questions, train_labels, test_labels = train_test_split(
        questions,
        labels,
        test_size=0.2,
        random_state=42,
        stratify=labels,
    )
    model = Pipeline(
        [
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), strip_accents="unicode")),
            ("classifier", LogisticRegression(max_iter=1000, random_state=42)),
        ]
    )
    model.fit(train_questions, train_labels)
    predictions = model.predict(test_questions)

    print(f"Training examples: {len(train_questions)}")
    print(f"Test examples: {len(test_questions)}")
    print(f"Accuracy: {accuracy_score(test_labels, predictions):.2%}")
    print(f"Category order: {categories}")
    print("Confusion matrix (rows=actual, columns=predicted):")
    print(confusion_matrix(test_labels, predictions, labels=categories))

    joblib.dump(model, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")


if __name__ == "__main__":
    main()