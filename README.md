# Memory game with discriminated unions in TypeScript

This project demonstrates how to build a type-safe memory card game using React and TypeScript, with a focus on modeling game state using discriminated unions.

## Overview

The memory game is a classic card-matching puzzle where players need to find pairs of matching cards. This implementation emphasizes type safety and state management using TypeScript's discriminated unions and React's `useReducer` hook.

## Getting started

Follow these steps to set up and run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/memory-game.git
   cd memory-game
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to play the game.

## Features

- **Type-safe game state**: Leveraging TypeScript's discriminated unions for robust state management.
- **State management with `useReducer`**: Efficiently manage game state transitions using React's `useReducer` hook.
- **Interactive gameplay**: Flip cards, match pairs, and track your progress.
- **React-based UI**: A responsive and dynamic user interface built with React.
- **Customizable**: Easily extendable to include more cards, themes, or rules.

## Development tools

This project uses **Biome.js** as a unified tool for linting, formatting, and code analysis. Biome.js replaces the need for separate tools like ESLint and Prettier, providing a faster and more integrated developer experience.

To run Biome.js checks, use the following command:
```bash
npx biome --help
```

For more information about Biome.js, visit [Biome.js documentation](https://biomejs.dev/).
