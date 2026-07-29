import json
import sys
from dataclasses import dataclass
from typing import List

@dataclass
class FlashCard:
    question: str
    answer: str


def load_flashcards(path: str) -> List[FlashCard]:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return [FlashCard(**item) for item in data]


def run_quiz(cards: List[FlashCard]) -> None:
    score = 0
    for idx, card in enumerate(cards, start=1):
        print(f"Question {idx}: {card.question}")
        user_answer = input("Your answer: ").strip()
        if user_answer.lower() == card.answer.lower():
            print("Correct!\n")
            score += 1
        else:
            print(f"Incorrect. The answer is: {card.answer}\n")
    print(f"You got {score}/{len(cards)} correct.")


def main(argv: List[str]) -> None:
    path = argv[1] if len(argv) > 1 else 'flashcards.json'
    cards = load_flashcards(path)
    run_quiz(cards)


if __name__ == '__main__':
    main(sys.argv)
