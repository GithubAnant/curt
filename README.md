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

## License

Private / Confidential.
