# David de Tena - Personal Training Management

A comprehensive platform for personal training management, featuring client and admin dashboards, workout tracking, and progress monitoring.

## 🚀 Features

*   **Landing Page**: Modern, responsive landing page with services implementation.
*   **Authentication**: Secure login system with role-based access control (Admin vs Client).
*   **Dashboards**:
    *   **Admin Dashboard**: Manage clients, assign workouts, and view overall statistics.
    *   **User Dashboard**: View assigned workouts, track progress, and update personal profile.
*   **Internationalization**: Multi-language support (English/Spanish) using `i18next`.
*   **Progress Tracking**: Visual charts for tracking workout history and body metrics.

## 🛠 Tech Stack

*   **Frontend Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **State Management & Auth**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📂 Project Structure

```bash
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components
│   ├── admin/      # Admin-specific components
│   ├── Layout.jsx  # Main application layout
│   └── ...
├── hooks/          # Custom React hooks (useAuth, etc.)
├── locales/        # i18n translation files
├── utils/          # Helper functions
├── App.jsx         # Main application component & Routing
├── firebase.js     # Firebase configuration & initialization
└── main.jsx        # Entry point
```

## ⚡ Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd de-tena-entrena
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Build the application for production deployment:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## ⚙️ Configuration

**Note**: Currently, Firebase configuration is hardcoded in `src/firebase.js`. 
Ensure you have the correct Firebase project credentials if you need to modify the backend connection.

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
