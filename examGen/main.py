from openai import OpenAI
import json
from dotenv import load_dotenv
import os

#client = OpenAI(**Use openai api key**)

curriculum_payload = {
  "subject": "Physics",
  "class": "12",
  "unit": "Rotational Dynamics",
  "topic": "Angular Momentum",
  "difficulty": "hard",
  "blueprint_rule_id": "NEB-PHY12-MEC-R3",
  "questions": [
    {
      "type": "short",
      "marks": 5,
      "allowed_subtopics": [
        "conservation_of_angular_momentum"
      ],
      "question": "",
      "expected_answer": "",
      "marking_scheme": []
    }
  ]
}

completion = client.chat.completions.create(
    model="gpt-4.1-nano",
    temperature=0.2,  #Lower temperature makes more predictable results
    response_format={"type": "json_object"},
    messages=[
        {
            "role": "system",
            "content": """You are an NEB exam question generator.
STRICT RULES:
1) Stay inside allowed_subtopics ONLY.
2) Follow marks + difficulty exactly.
3) Follow NEB board exam tone and realism.
4) Fill ONLY the question, expected_answer, marking_scheme.
5) Output valid JSON ONLY."""
        },
        {
            "role": "user",
            "content": f"""
Generate NEB style questions.
Fill the empty fields in the JSON below WITHOUT changing structure.

{json.dumps(curriculum_payload)}  #using the pre made json
"""
        }
    ]
)

print(completion.choices[0].message.content)

#returns the same playload with fulfilled parameters
