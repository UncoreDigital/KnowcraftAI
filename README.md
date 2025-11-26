# KnowCraft

A full-stack fintech application built with React, TypeScript, and Express.

## How to Run This Project

### Prerequisites
- Node.js (v18 or higher)
- npm

### Main Steps

1. **Clone the repository**
```bash
git clone https://github.com/UncoreDigital/KnowcraftAI.git
cd KnowcraftAI
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the project**
```bash
npm run build
```

4. **Start the development server**
```bash
npm run dev
```

The project now uses `cross-env` for cross-platform compatibility, so the same command works on all platforms (Windows, Mac, Linux).

5. **Access the application**
- Open browser and go to `http://localhost:5000`
- Login with any username/password
- Select "Internal" user type to access Knowledge Base
- Navigate to Knowledge Base via sidebar or `http://localhost:5000/#/knowledge`

### Production
```bash
npm run build
npm start
```

## Features
- Chat interface
- Analytics dashboard
- Audit logs
- Knowledge base management