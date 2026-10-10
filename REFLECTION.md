# Ethics and Emerging Technology Reflection

## 1. How could an enrollment chatbot produce unfair or biased outcomes?

The small training set may represent some phrasings, languages, or student situations better than others, so the classifier can mislabel questions from underrepresented groups. I would review errors across English and Filipino examples, invite students to report problems, and expand the dataset before treating predictions as reliable decisions. The classifier only routes a question and must never determine eligibility or access to enrollment.

## 2. How should student privacy be protected?

The chatbot should collect only the question needed to answer and should not ask for passwords, payment credentials, or unnecessary identity details. This app stores a request ID, predicted category, and optional rating rather than the question text, and access to its statistics database should still be restricted and retention reviewed. A real deployment must follow the institution's privacy rules and applicable data-protection law.

## 3. How can students know what the AI can and cannot do?

Answers are grounded in a limited FAQ, and the assistant should say when that source does not contain an answer instead of making up policy. Important dates, balances, eligibility, and official decisions are referred back to school offices for confirmation. Feedback and regular tests can expose mistakes, but a human contact path must remain available.

## 4. What are the opportunities and risks of emerging generative AI technology?

Generative AI can make school information easier to find across everyday language and can help staff identify common questions. It can also produce confident errors, reproduce bias, or be manipulated by prompt injection, and sending questions to a third-party model creates additional privacy and governance concerns. Retrieval limits, minimal data sharing, evaluation, and human oversight reduce these risks but do not remove them.