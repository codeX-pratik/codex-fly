# 🚀 Code-Fly: Real-Time Collaborative Code Editor

**Code-Fly** is a modern, full-stack web application, enabling real-time collaborative code editing and sharing. Built with Next.js (React/TypeScript) for the frontend and a Socket.IO + MongoDB backend, it offers a seamless, VS Code-like experience for developers to write, share, and collaborate on code instantly.

---

## ✨ Features

- **Real-Time Collaboration:**  
  Multiple users can join a room and edit code together, with changes instantly reflected for all participants.

- **Room System:**  
  Each session has a unique room ID (URL-based). Users can create or join rooms and share the link for collaboration.

- **Monaco Editor Integration:**  
  Uses the Monaco Editor (the editor behind VS Code) for a familiar, powerful coding experience, including syntax highlighting, dark theme, and responsive fullscreen layout.

- **Automatic Language Detection:**  
  Detects the programming language of the code and updates syntax highlighting and file extension accordingly.

- **Copy & Share Room Link:**  
  Easily copy the room link to your clipboard to invite others.

- **Download Code:**  
  Download the current code as a file with the correct extension based on detected language.

- **Persistent Storage:**  
  Code is saved in MongoDB per room, so new users joining a room see the latest code instantly.

- **Automatic Room Cleanup:**  
  Rooms are automatically deleted from the database after a period of inactivity (using MongoDB TTL indexes).

- **Mobile-Friendly & Touch Support:**  
  Responsive design with touch-friendly controls for mobile and tablet users.

- **Professional UI/UX:**  
  Modern, clean interface with feedback for copy/download actions, line-level highlights, and accessible controls.

---

## 🛠️ How It Works

1. **Frontend (Next.js + Monaco Editor):**
   - Users land on the homepage and are redirected to a unique room.
   - The Monaco Editor provides a VS Code-like editing experience.
   - Code changes are sent to the backend via Socket.IO and broadcast to all users in the same room.
   - The UI includes room info, copy/download buttons, and language detection badges.

2. **Backend (Socket.IO + MongoDB):**
   - Handles real-time communication between clients.
   - Stores the latest code for each room in MongoDB.
   - On joining a room, the backend sends the current code to the new user.
   - Periodically cleans up inactive rooms using MongoDB TTL.

3. **Persistence & Security:**
   - Environment variables are used for sensitive data (MongoDB URI, server URLs).
   - No code or room data is stored in the frontend; all persistence is handled server-side.

---

## 📋 Planned & Optional Features

- Multi-file/project support
- User presence indicators
- Integrated chat
- Authentication (Google, GitHub, etc.)
- Code execution/sandboxing
- Syntax error highlighting/linting
- Custom room names/short links
- Read-only mode for viewers

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
