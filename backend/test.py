import google.generativeai as genai

genai.configure(api_key="AIzaSyCaPBor6pGdidK4uMPzqeB0xr7UCL24Tco")

model = genai.GenerativeModel("gemini-2.5-flash")
response = model.generate_content("Say: API KEY WORKS!")
print(response.text)
