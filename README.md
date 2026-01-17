<div align="center">

# curt (can u read this)

**The speed reader for people who want to stream words directly into their brain.**

![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

![curt hero image](screenshots/hero.png)

</div>

## What is this?

Reading is slow, but your brain is fast. Curt bridges this gap.

We use RSVP (Rapid Serial Visual Presentation) technology to flash words at you one by one. This eliminates the need for eye movements and prevents you from losing your place. It removes distractions and allows a pure signal to stream directly into your consciousness.

Whether you want to breeze through an extensive reading list or train yourself to read faster, Curt provides the ideal environment.

## Features

- **RSVP Core**: The application uses a high-contrast, single-word display.
- **Variable Modes**:
  - **Linear**: This mode provides smooth acceleration to help you find your flow state.
  - **Block**: This mode increases speed in steps for progressive training.
  - **Constant**: This mode maintains a fixed pace.
- **Daily Drops**: You can use the curated daily text to benchmark your WPM and compare it with your past performance.

## Stack

- **Next.js 15 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Neon (PostgreSQL)**

## Local Development

If you want to run the project locally, follow these steps.

First, clone the repository:

```bash
git clone https://github.com/GithubAnant/curt.git
cd curt
```

Next, install the dependencies:

```bash
npm install
```

Then, set up your environment variables:

```bash
cp .env.example .env.local
# Fill in the required values in .env.local
```

Finally, start the development server:

```bash
npm run dev
```

You can visit [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Reporting Issues

If you encounter any bugs or have feature requests, please report them on GitHub.

**[Report bugs or request features here](https://github.com/GithubAnant/curt/issues)**

## License

This project is licensed under the MIT License.
