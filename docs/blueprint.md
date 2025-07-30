# **App Name**: Clause Companion

## Core Features:

- Document Upload and Query Input: Intuitive interface for query input and file uploads (PDF, DOCX, EML).
- Upload Progress & Feedback: Visual progress indicators and error handling for document uploads.
- Structured Results Viewer: Display results in a readable JSON format, with highlighted clause snippets.
- Semantic Clause Retrieval: Semantic search using LLM embeddings to find relevant clauses in uploaded documents based on user query. This tool provides justifications.
- Query Parsing: Leverage a tool like OpenAI or a local LLM for parsing the user query to recognize entities relevant to clauses.
- LLM Decision Logic: Employ LLM reasoning for decision justification based on retrieved clauses, returning a structured JSON.
- API Interaction: Uses API calls to post user query and files and displays the returned result from backend

## Style Guidelines:

- Primary color: A deep indigo (#4B0082) to convey a sense of intellect, precision, and depth. This color avoids the overused blues often found in tech while remaining serious and professional.
- Background color: A very light gray (#F0F0F0), nearly white, provides a clean, neutral backdrop that allows the indigo to stand out without overwhelming the user. It also contributes to a modern and uncluttered feel.
- Accent color: A vibrant magenta (#FF00FF), analogous to indigo but shifted in hue, to draw attention to interactive elements and key information. The higher saturation differentiates it from the primary, creating effective contrast.
- Headline font: 'Space Grotesk' (sans-serif) for a tech-oriented feel.
- Body font: 'Inter' (sans-serif), a modern, neutral font to facilitate readability.
- Crisp, minimalist icons to represent file types (PDF, DOCX, EML) and actions (upload, submit, download).
- Clean, structured layout with clear separation between input area, upload progress, and results viewer.