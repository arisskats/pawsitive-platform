# Technical Proposal: Pawsitive AI Food Scanner 📸🧠

## Overview
The AI Food Scanner allows pet owners to take a photo of the ingredients list on any pet food packaging. The AI then analyzes these ingredients to determine if the food is high-quality, safe, or potentially harmful based on the pet's specific profile (age, breed, weight).

## The Workflow (Step-by-Step)
1. **Frontend (Next.js 15):** User clicks the "📸 Food Scanner" button, which opens the camera or file uploader.
2. **Image Processing:** The image is sent to the NestJS backend.
3. **AI Vision (Gemini/Grok):** The backend forwards the image to an AI Vision model with a specialized prompt.
4. **Data Extraction:** The AI extracts the ingredients list and provides a "Health Score" (1-10) and a summary.
5. **Display:** The results are shown in a beautiful, easy-to-read dashboard card.

## Proposed AI Prompt
*"Analyze this pet food ingredients image for a [PET_TYPE]. Extract the main ingredients. Identify any fillers (like corn or soy) or harmful additives. Provide a health rating from 1 to 10 and a 2-sentence summary of why it received this score. Return the response in JSON format."*

## Technical Stack
- **Image Upload:** `multer` (NestJS) or direct to Supabase Storage.
- **AI Engine:** Google Gemini Pro Vision (via API).
- **Frontend UI:** Tailwind CSS with a "Scanning" animation.

## Next Steps
- [ ] Create the `FoodAnalysis` module in the Backend.
- [ ] Implement image upload logic.
- [ ] Connect the Backend with the Vision API.
- [ ] Build the Camera UI in the Frontend.
