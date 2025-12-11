# DyslexiaPilot AI: The AI-Powered Dyslexia Companion for Students

DyslexiaPilot AI is a web application designed to be an adaptive, supportive, and engaging companion for students with dyslexia. It leverages cutting-edge AI to create tools that build confidence, enhance literacy skills, and foster a sense of community.

## About DyslexiaPilot AI

Our mission is to make learning accessible for every student. DyslexiaPilot AI was created to ensure that dyslexia is never a barrier to understanding, expression, or academic success. The platform adapts to each student’s unique learning needs—simplifying reading, guiding writing, supporting study routines, and reducing stress—so students can learn with clarity, confidence, and independence.

## Features

DyslexiaPilot AI comes packed with features designed to support student at every step of their literacy journey:

-   **Adaptive Text Reader**: Read any text with options to simplify complex language, generate summaries, and listen to an AI-powered audio narration. You can also scan text from an image.
-   **AI Writing Assistant**: Get real-time help as you write. The assistant corrects spelling (including common dyslexic patterns like b/d reversals), explains grammar simply, and offers a voice-to-text option. You can also rephrase sentences to improve clarity.
-   **Reading Practice**: Practice reading aloud and receive friendly, encouraging feedback from an AI coach designed to be emotionally supportive.
-   **Interactive Games**: Engage in fun exercises designed to strengthen literacy skills in a low-pressure environment. Games include:
    -   **Word Scramble**: Unscramble letters to form a word.
    -   **Sound Match**: Listen to a word and choose the correct spelling from a list of homophones.
    -   **Rhyme Time**: Find and match pairs of rhyming words.
    -   **Spell Check**: Identify the correctly spelled word from a list of common misspellings.
    -   **Letter Hunt**: Find a specific target letter in a grid of distracting letters.
-   **Quiz Forge**: Generate practice quizzes from any text to help you study and retain information.
-   **Mental Health Check-in**: A private space to log your mood, get supportive suggestions from an AI coach, reflect in a private journal, and practice guided breathing exercises.
-   **Community Hub**: A dedicated space to connect with peers and mentors who understand the journey with dyslexia.
-   **Personalized Settings**: Adjust the theme (light/dark), font size, and line height to create the most comfortable reading experience for you.

## Tech Stack

This project is built with a modern, robust, and scalable tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **UI Library**: [React](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)

## Architecture Diagram

The application uses a modern architecture that separates the frontend UI from the backend and AI logic. All AI-related tasks are handled by Genkit flows, which are called from Next.js Server Actions.

```
+--------------------------------+
|      Client (Browser)          |
|  (Next.js, React, ShadCN UI)   |
+--------------------------------+
             |
             | User Interaction (e.g., clicks a button)
             v
+--------------------------------+
|   Server (Next.js App Router)  |
|      (Server Actions)          |
+--------------------------------+
             |
             | Function Call (e.g., `simplifyText(text)`)
             v
+--------------------------------+
|       AI Layer (Genkit)        |
|          (AI Flows)            |
+--------------------------------+
             |
             | API Request
             v
+--------------------------------+
|  Google Generative AI Models   |
|         (Gemini)               |
+--------------------------------+
```

## How to Run the Project Locally

To get DyslexiaPilot AI running on your local machine, follow these steps.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (version 18 or later recommended)
-   `npm` or your preferred package manager

### 2. Set Up Environment Variables

You will need a Gemini API key to use the AI features.

1.  Create a `.env` file in the root of the project.
2.  Add your API key to the file:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

### 3. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 4. Run the Development Server

Once the dependencies are installed, you can start the development server for the Next.js app and the Genkit flows. It's recommended to run them in separate terminal windows.

**To run the Next.js app:**

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

**To run the Genkit flows:**

```bash
npm run genkit:watch
```

This command starts the Genkit development server and automatically reloads it when you make changes to the AI flows.

## AI Flows (Genkit)

The application's AI capabilities are powered by a series of Genkit flows located in the `src/ai/flows` directory. Each flow is a server-side function that interacts with a generative model to perform a specific task.

Here is a breakdown of the current flows:

-   **`assist-writing.ts`**: Analyzes text for spelling and grammar errors, providing corrections and simple explanations tailored for users with dyslexia.
-   **`generate-audio-narration.ts`**: Converts a string of text into a natural-sounding audio narration, which is used in the Adaptive Text Reader and the Sound Match game.
-   **`generate-quiz-flow.ts`**: Creates multiple-choice or open-ended quiz questions based on a provided block of text, powering the Quiz Forge.
-   **`get-coping-suggestion.ts`**: Provides a short, actionable, and empathetic suggestion based on a user's selected mood in the Mental Health Check-in.
-   **`get-journal-feedback.ts`**: Analyzes a user's journal entry to determine its sentiment and provides a supportive, non-judgmental reflection with gentle, actionable advice if the sentiment is negative.
-   **`get-reading-feedback.ts`**: Compares a user's spoken text against an original sentence and generates encouraging, emotionally supportive feedback for the Reading Practice feature.
-   **`scan-and-convert-text.ts`**: Uses Optical Character Recognition (OCR) to extract plain text from an uploaded image, allowing users to digitize text from books or documents.
-   **`simplify-text-for-dyslexia.ts`**: Rewrites complex text into a simpler format with shorter sentences and more common words to improve readability.
-   **`summarize-text-for-review.ts`**: Generates a concise summary of a long piece of text for quick review.

# Team Members:
- Krushna Chandra Pradhan (Team Lead)


# Built with ❤️ for students in Student HackPad 2025