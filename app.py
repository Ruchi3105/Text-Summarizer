from flask import Flask, request, jsonify, render_template
from flask_restful import Api, Resource
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from keybert import KeyBERT
from googletrans import Translator
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
api = Api(app)
CORS(app)

tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")
kw_model = KeyBERT(model="all-mpnet-base-v2") 
translator = Translator() 
similarity_model = SentenceTransformer('all-MiniLM-L6-v2') 

@app.route('/')
def home():
    return render_template('index.html')

def summarize_text(text):
    inputs = tokenizer(text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = model.generate(inputs["input_ids"], length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

def extract_topics(text):
    keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english')
    return [keyword[0] for keyword in keywords]

def translate_text(text, src_language, target_language):
    translated = translator.translate(text, src=src_language, dest=target_language)
    return translated.text

def calculate_similarity(text1, text2):
    embeddings1 = similarity_model.encode(text1, convert_to_tensor=True)
    embeddings2 = similarity_model.encode(text2, convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(embeddings1, embeddings2).item()
    return similarity

class Summarize(Resource):
    def post(self):
        data = request.get_json()
        text = data["text"]
        input_language = data.get("input_language", "en")
        target_language = data.get("target_language", "en")
        topic_extraction = data.get("topic_extraction", False)

        detected_lang = translator.detect(text).lang
        if detected_lang != input_language:
            return jsonify({"error": "Input text language does not match the selected input language."}), 400

        if input_language != "en":
            text = translate_text(text, src_language=input_language, target_language="en")

        summary = summarize_text(text)

        if target_language != "en":
            summary = translate_text(summary, src_language="en", target_language=target_language)

        topics = []
        if topic_extraction:
            extracted_topics = extract_topics(text)
            if target_language != "en":
                topics = [translate_text(topic, src_language="en", target_language=target_language) for topic in extracted_topics]
            else:
                topics = extracted_topics

        translated_text = translate_text(text, src_language="en", target_language=target_language)

        return jsonify({
            "summary": summary,
            "topics": topics,
            "translated_text": translated_text
        })

class TextSimilarity(Resource):
    def post(self):
        data = request.get_json()
        text1 = data["text1"]
        text2 = data["text2"]

        similarity = calculate_similarity(text1, text2)
        return jsonify({"similarity": similarity})

api.add_resource(Summarize, "/summarize")
api.add_resource(TextSimilarity, "/similarity")

if __name__ == "__main__":
    app.run(debug=True)