# 📈 Real-Time Stock Dashboard

A high-performance stock dashboard for visualizing historical and live market data.

## 🚀 Key Features

- **Historical Data Visualization**: Fetches and displays historical stock aggregates (Open, High, Low, Close, Volume) from a REST API in a clean, tabular format.
- **Modular & Scalable UI**: Built with React and CSS Modules to ensure a component-based architecture with scoped styles, ready for expansion.
- **Optimized Tooling**: Leverages **Vite** with **SWC** (Speedy Web Compiler) for a lightning-fast development experience and optimized build process.
- **Type Safety**: Developed entirely with **TypeScript** to ensure code quality, catch errors early, and improve maintainability.
- **Ready for Low Latency**: The architecture is built to easily integrate a real-time WebSocket client for future low-latency data streaming.

## ⚙️ Tech Stack

This project was built with the following technologies, chosen for their performance, scalability, and developer experience.

- **Frontend Framework**: React ⚛️
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Market Data**: Polygon.io API

## ✨ Why This Stack?

- **Vite**: Its **SWC-powered** build process is significantly faster than traditional bundlers like Webpack, which is crucial for modern, large-scale projects.
- **TypeScript**: Ensures the codebase is robust and maintainable, preventing common runtime errors and providing a better developer experience.
- **Polygon.io**: A well-known, industry-standard market data provider, demonstrating experience working with real-world financial APIs.
- **CSS Modules**: Prevents style conflicts in large applications by scoping CSS, which is essential for a clean and scalable codebase.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

---

## 🛠️ Getting Started

To run this project locally, you'll need a Polygon.io API key.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/samirllama/quasar.git
   cd quasar
   ```

2. **Install dependencies:**

   ```bash
   pnpm add
   # or
   yarn install
   ```

3. **Set up the environment variable:**
   Create a new file in the project's root directory named `.env`.

   ```
   VITE_POLYGON_API_KEY=your_api_key_here
   ```

   _Replace `your_api_key_here` with your actual key._

4. **Run the development server:**

   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

## 🎯 Future Enhancements

- Implement a charting library (e.g., Lightweight Charts) to visualize data in candlestick or line chart formats.
- Add user authentication and state management with a library like Redux or Zustand.
- Introduce optimization techniques (e.g., `React.memo`, `useCallback`) to reduce re-renders and boost performance.

---
