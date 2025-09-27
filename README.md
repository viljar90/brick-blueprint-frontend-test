# Azure RAG Blueprint

A modern React-based chat application built with TypeScript, Vite, and Tailwind CSS. This project provides a beautiful, responsive chat interface with sidebar navigation, message history, and a clean UI design.

## Features

- 🤖 Interactive chat interface with AI responses
- 📱 Responsive design that works on desktop and mobile
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 📝 Message history with sidebar navigation
- 🎯 Typing indicators and smooth animations
- 📁 File upload support
- 🔄 Real-time message handling
- 🎛️ Customizable company branding

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Sonner** - Toast notifications
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

Make sure you have Node.js installed (version 16 or higher):
- Download from [nodejs.org](https://nodejs.org/)
- Or use a version manager like [nvm](https://github.com/nvm-sh/nvm)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "/Users/viljar/Azure RAG Blueprint"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
azure-rag-blueprint/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix UI)
│   ├── ChatHeader.tsx   # Top navigation header
│   ├── ChatSidebar.tsx  # Side navigation panel
│   ├── MessageBubble.tsx # Individual message display
│   ├── MessageInput.tsx # Message input and controls
│   ├── TypingIndicator.tsx # Loading animation
│   └── WelcomeScreen.tsx # Landing page
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── globals.css          # Global styles and Tailwind setup
└── ...
```

## Customization

### Company Branding

Edit the configuration in `App.tsx` to customize:

```typescript
const config = {
  companyName: "Your Company Name",
  logoUrl: "https://your-logo-url.com/logo.png",
  welcomeMessage: "How can I help you today?",
  aiName: "Assistant"
};
```

### Styling

The project uses Tailwind CSS with custom CSS variables for theming. You can modify colors and styling in:

- `globals.css` - CSS variables and global styles
- `tailwind.config.js` - Tailwind configuration
- Individual component files for specific styling

## Development

### Adding New Components

1. Create your component in the `components/` directory
2. Import and use it in `App.tsx` or other components
3. Follow the existing patterns for TypeScript interfaces and styling

### UI Components

The project includes a comprehensive set of UI components in `components/ui/` based on Radix UI primitives. These are ready to use and fully customizable.

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deploy to Static Hosting

The built files can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `vite.config.ts` or kill the process using the port
2. **Dependencies not installing**: Clear npm cache with `npm cache clean --force`
3. **TypeScript errors**: Make sure all imports are correct and dependencies are installed

### Getting Help

- Check the browser console for errors
- Ensure all dependencies are installed with `npm install`
- Verify Node.js version compatibility

## License

This project is open source and available under the MIT License.

