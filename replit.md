# Fred.ke - AI Website Generator

## Overview

Fred.ke is a modern web application that generates complete websites using AI. It's built with a React frontend and Express backend, utilizing OpenAI's GPT-4o model to generate HTML, CSS, and JavaScript code based on user prompts. The application features a chat-like interface where users can request different types of websites (e-commerce, blogs, portfolios, landing pages) and receive fully functional code.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful endpoints
- **Development**: Hot module replacement via Vite integration

### Database and Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Provider**: Neon Database (serverless PostgreSQL)
- **Schema**: Single messages table storing chat history and generated code
- **Development Storage**: In-memory storage for development

## Key Components

### Chat Interface
- **ChatInput**: Multi-line textarea with quick action buttons for common website types
- **ChatMessage**: Displays user messages and AI responses with code preview capabilities
- **CodeBlock**: Syntax-highlighted code display with copy/download functionality
- **TypingIndicator**: Visual feedback during AI generation

### Code Generation
- **OpenAI Integration**: Uses GPT-4o model for website generation
- **Output Format**: Returns structured JSON with HTML, CSS, JavaScript, title, and description
- **Code Preview**: Live preview of generated websites in modal dialogs

### UI Components
- **Design System**: shadcn/ui components with Radix UI primitives
- **Theme**: Dark theme with gradient backgrounds and modern aesthetics
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Data Flow

1. **User Input**: User types a prompt or selects a quick action
2. **Request Processing**: Frontend sends prompt and session ID to `/api/generate`
3. **AI Generation**: Backend calls OpenAI API with structured prompt
4. **Response Storage**: Generated code and messages are stored in database
5. **UI Update**: Frontend displays both user message and AI response with generated code
6. **Code Interaction**: Users can copy, download, or preview generated code

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database client
- **drizzle-orm**: Type-safe database ORM
- **openai**: OpenAI API client
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution
- **esbuild**: Fast bundler for production builds

## Deployment Strategy

### Development
- **Script**: `npm run dev` - Runs server with hot reload
- **Database**: In-memory storage for development
- **Environment**: NODE_ENV=development

### Production Build
- **Frontend**: Vite builds optimized React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Requires PostgreSQL connection string in DATABASE_URL

### Production Deployment
- **Script**: `npm start` - Runs built application
- **Environment**: NODE_ENV=production
- **Database**: Neon PostgreSQL database with migration support
- **Static Assets**: Served from `dist/public` directory

### Database Management
- **Migrations**: Stored in `./migrations` directory
- **Schema**: Defined in `shared/schema.ts`
- **Push Command**: `npm run db:push` - Pushes schema changes to database

## Architecture Decisions

### Monorepo Structure
- **Problem**: Organizing frontend, backend, and shared code
- **Solution**: Unified repository with `client/`, `server/`, and `shared/` directories
- **Benefits**: Simplified development, shared types, single deployment

### In-Memory Development Storage
- **Problem**: Quick development without database setup
- **Solution**: MemStorage class implementing storage interface
- **Benefits**: Fast development iteration, no external dependencies
- **Trade-off**: Data lost on server restart

### OpenAI Integration
- **Problem**: Generating high-quality website code
- **Solution**: GPT-4o with structured prompts and JSON responses
- **Benefits**: Consistent output format, modern code generation
- **Alternative**: Could use other AI models or template-based generation

### Drizzle ORM Choice
- **Problem**: Type-safe database interactions
- **Solution**: Drizzle ORM with PostgreSQL
- **Benefits**: Full TypeScript support, migration management
- **Alternative**: Prisma or raw SQL queries

### Chat-Based Interface
- **Problem**: User-friendly code generation interface
- **Solution**: Conversational UI with message history
- **Benefits**: Intuitive interaction, context preservation
- **Alternative**: Form-based or wizard-style interface