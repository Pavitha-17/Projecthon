import google.generativeai as genai

genai.configure(api_key="AIzaSyCaPBor6pGdidK4uMPzqeB0xr7UCL24Tco")

model = genai.GenerativeModel("gemini-2.5-flash")
response = model.generate_content("Say: API KEY WORKS!")
<<<<<<< HEAD
print(response.text)
=======
print(response.text)
>>>>>>> 54e6ba309470c39fd3553995b24e430058513b1d
