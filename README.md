# Text Summarizer

## Overview
The **Text Summarizer** is a web-based application that allows users to generate concise summaries of input text, translate summaries into different languages, and check the similarity between two pieces of text. The application supports multiple languages and provides an intuitive user interface for enhanced usability.

## Features
- **Text Summarization**: Enter a paragraph of text and get a shorter summarized version.
- **Multilingual Support**: Translate the summarized text into multiple languages (English, Hindi, Spanish, French).
- **Topic Extraction**: Extract key topics from the text.
- **Text Similarity Checker**: Compare two pieces of text to find their similarity score.
- **Interactive UI**: Modern, user-friendly interface.

## Tech Stack
- **Frontend**: HTML, CSS (Bootstrap, custom styles), JavaScript
- **Backend**: Flask (Python 3.10.11)
- **APIs**: Fetch API for communication with the backend

## Installation & Setup
### Prerequisites
Ensure you have the following installed on your system:
- Python 3.10.11
- Flask

### Steps to Run the Application
1. Clone the repository:
   ```bash
   git clone https://github.com/Ruchi3105/Text-Summarizer.git
   cd text-summarizer
   ```
2. Create virtual environment in root directory:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   ```bash
   venv\Scripts\activate
   ```
4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the Flask server:
   ```bash
   python app.py
   ```
6. Open the application in a web browser:
   ```
   http://127.0.0.1:5000
   ```

## Project Structure
```
text-summarizer/
│-- static/
│   ├── style.css      # Styling for the frontend
│   ├── script.js      # JavaScript for handling UI interactions and API calls
│   ├── bgvideo.mp4    # Background video for UI aesthetics
│-- templates/
│   ├── index.html     # Main frontend file
│-- .gitignore         # to ignore venv upload on github
│-- app.py             # Flask backend logic
│-- requirements.txt   # List of dependencies
│-- README.md          # Documentation
```

## API Endpoints
- **Summarization API**
  - Endpoint: `/summarize`
  - Method: `POST`
  - Payload:
    ```json
    {
      "text": "Your input text",
      "input_language": "en",
      "target_language": "hi",
      "topic_extraction": true
    }
    ```
  - Response:
    ```json
    {
      "summary": "Summarized text here",
      "translated_text": "Translated summary here",
      "topics": ["Topic1", "Topic2"]
    }
    ```

- **Text Similarity API**
  - Endpoint: `/similarity`
  - Method: `POST`
  - Payload:
    ```json
    {
      "text1": "First text input",
      "text2": "Second text input"
    }
    ```
  - Response:
    ```json
    {
      "similarity_score": 0.85
    }
    ```

## Future Enhancements
- Add support for more languages.
- Improve summarization accuracy using advanced NLP models.
- Deploy the project on a cloud platform (AWS, Heroku, etc.).

## Contributors
- Ruchi
- Open for contributions! Feel free to create a pull request.

