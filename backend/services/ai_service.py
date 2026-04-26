import openai
import os
from anthropic import Anthropic

openai.api_key = os.environ.get('OPENAI_API_KEY')
anthropic_client = Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))

def analyze_text_with_ai(text, provider='openai'):
    if provider == 'openai':
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant specialized in text analysis."},
                {"role": "user", "content": f"Analyze the following text and provide insights: {text}"}
            ],
            max_tokens=500
        )
        return {
            'result': response.choices[0].message.content,
            'provider': 'openai',
            'model': 'gpt-3.5-turbo'
        }
    elif provider == 'anthropic':
        message = anthropic_client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=500,
            messages=[
                {"role": "user", "content": f"Analyze the following text: {text}"}
            ]
        )
        return {
            'result': message.content,
            'provider': 'anthropic',
            'model': 'claude-3-haiku'
        }
    return {'error': 'Unknown provider'}

def generate_prediction(data, model_type='classification'):
    return {
        'predictions': [{'class': 'A', 'probability': 0.85, 'model': model_type}],
        'feature_importance': [0.7, 0.2, 0.1],
        'version': '1.0.0'
    }

def summarize_content(content, max_words=100):
    prompt = f"Summarize the following content in {max_words} words or less:\n\n{content}"
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )
    return response.choices[0].message.content