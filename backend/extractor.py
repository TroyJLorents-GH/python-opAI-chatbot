# extractor.py
from backend.openai_client import OpenAIClient


client = OpenAIClient()

def extract_keywords(prompt):
    instruction = f"Extract 3 to 5 important keywords or topics from the following message:\n\n\"{prompt}\"\n\nList them separated by commas."
    response = client.chat_completion(instruction)
    return [kw.strip() for kw in response.split(',') if kw.strip()]
