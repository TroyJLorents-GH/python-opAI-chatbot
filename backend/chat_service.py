# chat_service.py
from backend.openai_client import OpenAIClient
from backend.extractor import extract_keywords
from backend.db_manager import log_chat, log_flagged


client = OpenAIClient()

def handle_chat(prompt):
    flagged, categories = client.moderate_content(prompt)

    if flagged:
        log_flagged(prompt, categories)
        return "Sorry, I can't respond to that."

    response = client.chat_completion(prompt)
    keywords = extract_keywords(prompt)
    log_chat(prompt, response, keywords, categories)
    return response
