# AI Domain Generator

AI Domain Generator is a web application that helps users find available domain names based on their business or project description. It uses Google's Gemini AI to generate creative, relevant domain suggestions and checks their availability in real-time.

![AI Domain Generator Screenshot](screenshot.png)

## Features

- **AI-Powered Domain Suggestions**: Generates creative and relevant domain names based on your description
- **Language Detection**: Identifies the language of your query and prioritizes appropriate country TLDs
- **Real-time Availability Check**: Verifies if domains are available for registration
- **Multi-language Support**: Works with English, Spanish, Dutch, French, German, Italian, and more
- **Pricing Information**: Shows pricing and discount information for available domains

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: Google Gemini AI (gemini-2.0-flash model)
- **Domain API**: OpenProvider API for domain availability checking
- **Deployment**: Google Cloud Run

## Project Structure

```
ai-domain-generator/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── services/         # API service layers
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main React component
│   ├── index.tsx         # Entry point
│   └── constants.ts      # Application constants
├── backend/              # Backend server code
│   ├── server.js         # Express server
│   └── .env              # Environment variables (not in repo)
├── dist/                 # Built frontend files
├── public/               # Static files
└── vite.config.ts        # Vite configuration
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Google AI API key (for Gemini AI)
- OpenProvider API credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-domain-generator.git
   cd ai-domain-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. Create a `.env` file in the `backend` directory:
   ```
   API_KEY=your_gemini_api_key
   OPENPROVIDER_USERNAME=your_openprovider_username
   OPENPROVIDER_PASSWORD=your_openprovider_password
   ```

4. Update the constants in `src/constants.ts`:
   ```typescript
   export const BACKEND_API_BASE_URL = "http://localhost:8080";
   export const GEMINI_TEXT_MODEL = 'gemini-2.0-flash';
   export const DEFAULT_CURRENCY = 'USD';
   ```

### Development

1. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

1. Build the frontend:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory
   
3. For deployment, you can use the provided `deploy.sh` script:
   ```bash
   ./deploy.sh
   ```

## How It Works

1. **User Input**: Users enter a description of their business or project
2. **Language Detection**: The system identifies the language of the query
3. **AI Generation**: Gemini AI generates creative domain suggestions, prioritizing local TLDs
4. **Availability Check**: The system checks domain availability using OpenProvider API
5. **Display Results**: Available domains are displayed with pricing information

## API Endpoints

- **POST /api/ai-domain-suggestions**
  - Request: `{ description: string }`
  - Response: Array of available domain suggestions

- **POST /api/check-domain-availability**
  - Request: `{ domains: Array<{name: string, extension: string}> }`
  - Response: Availability information for each domain

- **GET /api/health**
  - Response: Health status of the API

## Customization

### Modifying Domain Generation

To adjust the way domains are generated, modify the prompt in the `/api/ai-domain-suggestions` endpoint in `backend/server.js`:

```javascript
const prompt = `
  You are a domain name generation expert. Generate 15 creative, memorable domain names for: "${description}"
  
  I've detected that this query is in ${detectedLang.toUpperCase()} language. Based on this:
  
  CRITICAL REQUIREMENTS:
  1. At least 5 domain names MUST use the .${primaryTld} TLD...
  ...
`;
```

### Adding More Languages

To support additional languages, add them to the `languagePatterns` object in the language detection function:

```javascript
const languagePatterns = {
  es: {
    words: ['el', 'la', 'los', ...],
    tld: 'es'
  },
  // Add a new language:
  pt: {
    words: ['o', 'a', 'os', 'as', ...],
    tld: 'pt'
  },
  ...
};
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Google Gemini AI](https://ai.google.dev/gemini-api) for the AI capabilities
- [OpenProvider](https://www.openprovider.com/) for domain availability checking
- [Vite](https://vitejs.dev/) for frontend tooling
- [Express](https://expressjs.com/) for the backend server
- [Tailwind CSS](https://tailwindcss.com/) for styling

