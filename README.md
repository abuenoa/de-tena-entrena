# De Tena Entrena - Personal Trainer PWA

Professional Progressive Web App (PWA) designed for high-end personal training services. This application connects clients with their trainer, providing a seamless experience for workout tracking, onboarding, and communication.

## 🚀 Key Features

- **Public Landing Page**: Modern, responsive landing page to showcase services.
- **Authentication**: Secure login system with Role-Based Access Control (RBAC) via Firebase.
  - **Admin Dashboard**: Dedicated area for the trainer to manage clients and content.
  - **Client Dashboard**: Personalized area for clients to view their plans and progress.
- **Onboarding Flow**: Interactive wizard for collecting new client data.
- **Internationalization**: Full support for English and Spanish (`i18next`).
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Animations**: Smooth transitions and effects using Framer Motion.

## 🛠️ Tech Stack

- **Core**: React 19, Vite
- **Styling**: Tailwind CSS, PostCSS, clsx, tailwind-merge
- **Routing**: React Router DOM 7
- **State & Logic**: Custom Hooks, Context API
- **Backend / Auth**: Firebase (Authentication, Firestore)
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **I18n**: i18next, react-i18next

## 📂 Project Structure

```text
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components and specific page views
│   ├── AdminDashboard.jsx
│   ├── UserDashboard.jsx
│   ├── LandingPage.jsx
│   ├── Onboarding.jsx
│   └── ...
├── hooks/          # Custom hooks (e.g., useAuth)
├── locales/        # Translation files (en/es)
├── utils/          # Helper functions
├── App.jsx         # Main application routing and layout
├── firebase.js     # Firebase configuration
├── i18n.js         # Internationalization setup
└── main.jsx        # Entry point
```

## ⚡ Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd de-tena-entrena
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Development

To start the development server with HMR (Hot Module Replacement):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

To build the application for deployment:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Linting

To run the linter and check for code quality issues:

```bash
npm run lint
```
