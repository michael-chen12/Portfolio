# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Technology Stack

This is a portfolio website built with:
- **React 19.2** - UI framework
- **Vite 7.3** - Build tool and dev server with HMR (Hot Module Replacement)
- **TailwindCSS 4.2** - Utility-first CSS framework
- **ESLint 9.39** - Code linting with React Hooks and React Refresh plugins

## Development Commands

```bash
# Install dependencies (required after clone)
npm install

# Start development server (runs on http://localhost:5173 by default)
npm run dev

# Build for production (outputs to ./dist)
npm run build

# Preview production build locally
npm run preview

# Run ESLint checks
npm run lint
```

## Project Structure

```
/
├── src/
│   ├── main.jsx          # Application entry point
│   ├── App.jsx           # Root component
│   ├── App.css           # Component-specific styles
│   ├── index.css         # Global styles with Tailwind directives
│   └── assets/           # Static assets (images, icons, etc.)
├── public/               # Static files copied as-is to dist
├── index.html            # HTML entry point (Vite uses this for HMR)
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration (for Tailwind)
└── eslint.config.js      # ESLint configuration (flat config format)
```

## Architecture Notes

### Vite Configuration
- Uses `@vitejs/plugin-react` for Fast Refresh via Babel
- Entry point is `index.html` (not a JS file) - this is Vite's convention
- Dev server provides instant HMR for React components

### TailwindCSS Setup
- **Uses Tailwind CSS v4** - Note: v4 requires `@tailwindcss/postcss` plugin
- Configured to scan all HTML and JSX/TSX files in `src/` for classes
- Base directives imported in `src/index.css`
- PostCSS configuration uses `@tailwindcss/postcss` (not standalone `tailwindcss`)

### ESLint Configuration
- Uses modern flat config format (eslint.config.js)
- Configured for React Hooks rules enforcement
- React Refresh plugin ensures components are HMR-compatible
- Ignores `dist/` directory
- Allows unused variables starting with uppercase (component pattern)

### Module System
- Package is set to `"type": "module"` - uses ES modules throughout
- All imports/exports use ESM syntax
- Config files use `export default` instead of `module.exports`

## Development Guidelines

### Adding New Components
- Create components in `src/components/`
- Separate `.css` file and component file
- Use `.jsx` extension for files containing JSX
- Import styles using `import './Component.css'` if needed
- Use Tailwind utility classes for styling when possible

### Naming Conventions
- Variable naming should be in pascalCase format (eg. michaelChen)

### Styling Approach
- Primary styling method: TailwindCSS utility classes
- Component-specific CSS: Create `.css` files alongside components
- Global styles: Add to `src/index.css` after Tailwind directives
- For creating new components, call frontend-design skills

### General Rules
- Before implementation (Component or feature), Make sure there is no uncommited changes and after that, Git switch to a new branch with naming as claude/[feature of component name] 
- Always generate unit test and E2E test cases after feature implementation
- Ask at least 2 to 3 questions to grab user input regarding the feature or component implementation.
- Do not write any code unless I told you so.

### Build Output
- Use vercel-react-best-practices to ensure code quality and performance
- Production builds output to `./dist`
- Assets are fingerprinted for cache busting
- `index.html` is processed and included in dist
- Public files are copied to dist root

### HMR (Hot Module Replacement)
- Changes to React components trigger instant updates without page reload
- CSS changes are injected without reload
- If HMR fails, Vite performs full page reload as fallback

---

## Performance & SEO bar
Performance:
- Keep JS bundle small; don’t add big client-only libraries casually
- Prefer static rendering for marketing pages when possible
- Optimize images (size, format, lazy loading)

SEO:
- Use Next.js metadata API (`app/*/metadata`)
- Add Open Graph + Twitter cards
- Add `sitemap.xml` + `robots.txt`
- Each project detail page should have unique title/description

---
