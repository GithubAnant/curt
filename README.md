# CURT (Can YoU Read This)

CURT is a high-performance Rapid Serial Visual Presentation (RSVP) engine designed to enhance reading speed and cognitive processing. By eliminating saccadic eye movements and anchoring perception to an Optimal Recognition Point (ORP), CURT allows users to achieve reading speeds significantly surpassing traditional methods.

## Core Core Concepts

- **RSVP (Rapid Serial Visual Presentation)**: Words are displayed sequentially at a fixed focal point.
- **ORP (Optimal Recognition Point)**: The "anchor" letter of each word (highlighted in red) is geometrically centered, minimizing the need for ocular adjustment.
- **Cognitive Flow State**: Variable speed controls allow users to push past their subvocalization threshold (typically ~400 WPM) into a pure comprehension state (900+ WPM).

## Features

- **Dynamic Speed Control**: Real-time WPM adjustment from 300 to 900+ WPM.
- **Precision Timing**: Uses `requestAnimationFrame` for frame-perfect word delivery, avoiding drift common in `setInterval` based implementations.
- **Smart Anchoring**: Algorithmic determination of the red anchor letter based on word length.
- **Distraction-Free UI**: specific "black-out" design to maximize contrast and focus.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS, CSS Variables for theming (Dark Mode default)
- **State Management**: React Hooks (Custom `useRSVP` engine)
- **Language**: TypeScript

## Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/curt.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## Development

The core engine logic resides in `src/hooks/useRSVP.ts`.
The visual rendering layout (ORP alignment) is managed in `src/components/rsvp/RSVPDisplay.tsx`.

## Daily Game & Auth Setup

This project now includes a Daily Speed Reading Game with Google Authentication and AI-generated content.

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# Database (Neon Postgres)
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

# Authentication (Better-Auth + Google)
BETTER_AUTH_SECRET="generate_a_long_random_string"
BETTER_AUTH_URL="http://localhost:3000" # Change for production
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# AI Content Generation (OpenRouter / Gemini)
OPENROUTER_API_KEY="your_openrouter_api_key"
CRON_SECRET="your_cron_secret_for_security"
```

### Database Setup

1.  Create a project on [Neon.tech](https://neon.tech).
2.  Get your connection string.
3.  Run migrations (ensure you have `drizzle-kit` installed):
    ```bash
    npx drizzle-kit push
    ```

### Authentication Setup

1.  Create a project in [Google Cloud Console](https://console.cloud.google.com/).
2.  Setup OAuth Consent Screen.
3.  Create OAuth 2.0 Credentials (Web Application).
    - Authorized Origins: `http://localhost:3000`
    - Authorized Redirect URIs: `http://localhost:3000/api/auth/callback/google`

## License

Private / Confidential.
