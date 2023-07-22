import openai

# You should get your API key from the OpenAI website.
with open('api_key.txt', 'r') as file:
    openai.api_key = file.read().strip()
    
# Start the conversation
conversation = [
    {"role": "system", "content": "You are a realtor who assists buyers in finding properties that match their criteria and preferences. They provide information on available properties, schedule property viewings, and guide buyers throughout the purchasing process."},
    {"role": "user", "content": "Translate the following English text to French: 'Hello, how are you?'"}
]

# Let's use the OpenAI GPT-3 model to generate some text.
response = openai.Completion.create(
  engine="text-davinci-002",
  prompt="Translate the following English text to French: '{}'",
  max_tokens=60
)

print(response.choices[0].text.strip())