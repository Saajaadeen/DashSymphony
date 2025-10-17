# DashSymphony 🎶

DashSymphony is a modern, feature-rich dashboard application built with **React Router**, **Prisma**, and **Tailwind CSS**. Organize and manage multiple dashboards with customizable cards for quick access to your favorite links and resources.

---

## Overview

DashSymphony helps you centralize your online resources, creating personalized dashboards for easy access and organization.  It combines powerful features like multiple dashboard management, visual cards, and a modern UI, all while prioritizing security and user experience.

---

## Features

### 🎯 Dashboard Management

*   **Multiple Dashboards:**  Organize your content across themed dashboards.
*   **Visibility Controls:** Set dashboards as Private (only you), Public (anyone can view), or Global (shared across your organization - requires appropriate setup).
*   **Auto-Select:** The first dashboard automatically loads on page visit for convenience.
*   **Real-time Updates:**  Changes are instantly reflected across the application.

### 🎴 Card System

*   **Visual Cards:** Image-based cards with overlay titles for clear identification.
*   **Quick Access:** Direct links to your favorite websites and resources.
*   **Easy Management:**  Create, edit, and delete cards via intuitive modals.
*   **Responsive Grid:** Layout adapts to display 3–10 cards per row depending on screen size for optimal viewing on any device.
*   **Fallback Icons:** Auto-generated icons for cards without images.

### 🎨 Modern UI/UX

*   **Glassmorphism Design:**  Smooth backdrop blur effects and translucent panels create a visually appealing aesthetic.
*   **Dark Mode:** A sleek dark theme with vibrant accent colors.
*   **Responsive Design:** Works seamlessly on mobile, tablet, and desktop.
*   **Smooth Animations:**  Polished hover effects and transitions enhance the user experience.
*   **Icon System:** Visual indicators for dashboard visibility levels.

### 🔐 User Authentication

*   **Secure Sessions:** Authentication with robust session management.
*   **Protected Routes:**  Only authenticated users can access dashboards.
*   **User-specific Content:**  Each user sees only their own dashboards, ensuring data privacy.

---

## Tech Stack

*   **React Router 7:** File-based routing with data loading.
*   **Prisma:** Type-safe database ORM.
*   **TypeScript:** Full type safety across the application.
*   **Tailwind CSS:** Utility-first styling framework.
*   **PostgreSQL:**  Robust relational database (or your preferred DB).

---

## Getting Started

### Prerequisites

*   Node.js 18+
*   npm or Yarn
*   PostgreSQL (or your preferred database)
*   Docker (optional, for local database setup)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Saajaadeen/dashboard-app.git
    cd dashboard-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Docker container (optional)**
    ```bash
    docker compose up
    ```

4.  **Run database migrations**
    ```bash
    npx prisma migrate reset
    # or
    npx prisma migrate dev
    ```

5.  **Start the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Visit `http://localhost:3000` to see the app in action.

---

## Development

*   **Database Management**
    ```bash
    npx prisma migrate dev --name migration_name
    npx prisma migrate reset
    npx prisma studio
    ```

*   **Type Generation**
    ```bash
    npx prisma generate
    ```

---

## Contributing

1.  Fork the repository
2.  Create your feature branch:
    ```bash
    git checkout -b feature/amazing-feature
    ```
3.  Commit your changes:
    ```bash
    git commit -m "Add some amazing feature"
    ```
4.  Push to the branch:
    ```bash
    git push origin feature/amazing-feature
    ```
5.  Open a Pull Request

---

## License

This project is licensed under the MIT License – see the `LICENSE` file for details.

---

## Acknowledgements

*   Built with React Router
*   Database ORM powered by Prisma
*   Styled with Tailwind CSS
*   Made with ❤️ by Saajaadeen

---

## Screenshots & Demo 📸