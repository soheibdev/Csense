# 🧠 Cyber Security Training Desktop App (Electron + React)

A **modern desktop application** built with **Electron + React + Vite** designed to teach cybersecurity concepts through interactive modules, quizzes, and gamification.  
The app simulates real-world cyber scenarios like phishing, password security, browsing safety, and incident response.

---

## 📁 Project Structure
```
├── 📁 electron
│   ├── 📄 main.js
│   └── 📄 preload.js
├── 📁 frontend
│   ├── 📁 src
│   │   ├── 📁 assets
│   │   │   └── 📄 index.js
│   │   ├── 📁 components
│   │   │   ├── 📁 gamification
│   │   │   │   └── 📄 index.js
│   │   │   ├── 📁 quiz
│   │   │   │   └── 📄 index.js
│   │   │   ├── 📁 ui
│   │   │   │   └── 📄 index.js
│   │   │   └── 📄 index.js
│   │   ├── 📁 hooks
│   │   │   ├── 📄 index.js
│   │   │   ├── 📄 useDisclosure.js
│   │   │   └── 📄 useLocalStorage.js
│   │   ├── 📁 modules
│   │   │   ├── 📁 browsing
│   │   │   │   └── 📄 index.js
│   │   │   ├── 📁 incident
│   │   │   │   └── 📄 index.js
│   │   │   ├── 📁 password
│   │   │   │   └── 📄 index.js
│   │   │   ├── 📁 phishing
│   │   │   │   └── 📄 index.js
│   │   │   ├── 📁 physical
│   │   │   │   └── 📄 index.js
│   │   │   ├── 📁 welcome
│   │   │   │   └── 📄 index.js
│   │   │   └── 📄 index.js
│   │   ├── 📁 pages
│   │   │   ├── 📄 DashboardPage.jsx
│   │   │   ├── 🎨 DashboardPage.module.css
│   │   │   ├── 📄 HomePage.jsx
│   │   │   ├── 🎨 HomePage.module.css
│   │   │   ├── 📄 NotFoundPage.jsx
│   │   │   └── 🎨 NotFoundPage.module.css
│   │   ├── 📁 routes
│   │   │   └── 📄 AppRouter.jsx
│   │   ├── 📁 services
│   │   │   ├── 📄 apiService.js
│   │   │   └── 📄 electronService.js
│   │   ├── 📁 store
│   │   │   └── 📄 useAppStore.js
│   │   ├── 📁 styles
│   │   │   └── 🎨 global.css
│   │   ├── 📁 utils
│   │   │   ├── 📄 cn.js
│   │   │   ├── 📄 formatDate.js
│   │   │   └── 📄 index.js
│   │   ├── 📄 App.jsx
│   │   └── 📄 main.jsx
│   ├── 🌐 index.html
│   └── 📄 vite.config.js
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ package-lock.json
└── ⚙️ package.json
```

---

## 🚀 Features

### 🎓 Learning Modules
- 🔐 Password Security
- 🎣 Phishing Awareness
- 🌐 Safe Browsing
- 🚨 Incident Response
- 🧍 Physical Security Awareness

### 🧪 Interactive Quiz System
- Multiple choice questions
- Instant feedback
- Score tracking

### 🎮 Gamification
- Points system
- Progress tracking
- Rewards & achievements

### 🖥️ Desktop Experience
- Built with Electron
- Cross-platform (Windows / Linux / Mac)
- Native-like performance

---

## 🛠️ Tech Stack

- ⚛️ React (Frontend UI)
- ⚡ Vite (Build tool)
- 🖥️ Electron (Desktop app runtime)
- 🎨 CSS Modules + Global Styles
- 🧠 Zustand / Store (state management)
- 🔌 Electron IPC (backend communication)

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/your-username/cyber-security-app.git

# Install dependencies
cd frontend
npm install

# Run frontend
npm run dev

