# file_uploader.py
import fitz  # PyMuPDF
import docx
import os

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text(file):
    filename = file.name
    file_ext = os.path.splitext(filename)[1].lower()

    with open(f"temp_{filename}", "wb") as f:
        f.write(file.read())

    try:
        if file_ext == ".pdf":
            return extract_text_from_pdf(f"temp_{filename}")
        elif file_ext == ".docx":
            return extract_text_from_docx(f"temp_{filename}")
        else:
            return "Unsupported file type. Only .pdf and .docx are supported."
    finally:
        os.remove(f"temp_{filename}")
