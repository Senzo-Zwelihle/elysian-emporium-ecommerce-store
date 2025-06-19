![Hero Image](./public/assets/hero.png)



# Elysian Emporium E-commerce Store

## Overview

The "Elysian Emporium E-commerce Store" is a cutting-edge, feature-rich e-commerce platform engineered for optimal performance, scalability, and user experience. Built on the powerful Next.js framework, this application provides a robust foundation for online retail, integrating a wide array of modern web technologies to deliver a seamless and engaging shopping journey for customers, alongside intuitive management tools for administrators.

This project is designed to handle various aspects of an online store, from product display and user authentication to secure transactions and content management, making it suitable for a diverse range of e-commerce ventures.

## Features

This project leverages a sophisticated tech stack to deliver a comprehensive e-commerce solution. Here's a detailed breakdown of its core features and the underlying technologies:

* **Modern Web Development with Next.js 15:**

    * **Server-Side Rendering (SSR) & Static Site Generation (SSG):** Optimizes performance and SEO by pre-rendering pages on the server or at build time.

    * **API Routes:** Facilitates the creation of robust backend API endpoints directly within the Next.js application, simplifying development.

    * **React 19:** Utilizes the latest version of React for building dynamic and interactive user interfaces with improved performance and new features.

    * **Turbopack:** Leverages the high-performance build system for extremely fast development server startup and module updates.

* **Database Management with Prisma:**

    * **Type-Safe ORM:** Provides an elegant and type-safe way to interact with your database (e.g., PostgreSQL, MySQL, SQLite, MongoDB), ensuring data integrity and developer efficiency.

    * **Migrations:** Simplifies database schema evolution with version-controlled migrations.

    * **Prisma Client:** Automatically generated client for easy and efficient database queries.

* **Secure User Authentication with Kinde Auth Next.js:**

    * **Seamless Integration:** Offers a straightforward method for implementing secure user authentication flows, including sign-up, login, and session management.

    * **Robust Security:** Handles critical aspects of user identity and access control, adhering to modern security best practices.


    * **Tailwind CSS:** A utility-first CSS framework that enables rapid UI development by composing classes directly in your markup, ensuring a consistent and responsive design. Includes `@tailwindcss/postcss` and `@tailwindcss/typography` for enhanced styling capabilities.

    * **`tailwind-merge` & `clsx`:** Utilities for intelligently merging Tailwind CSS classes and conditionally combining class names.

    * **`tw-animate-css`:** Enhances UI with pre-built CSS animations integrated with Tailwind.

* **State Management & Data Fetching:**

    * **Tanstack Query (React Query):** A powerful library for fetching, caching, synchronizing, and updating asynchronous data in React, significantly improving performance and developer experience.

    * **Tanstack React Table:** Provides headless hooks for building powerful and customizable data tables, offering flexibility in rendering and functionality.

* **File Uploads with Uploadthing & Edgestore:**

    * **`@uploadthing/react` & `uploadthing`:** Simplified and secure product file uploads directly from your React components.

    * **`@edgestore/react` & `@edgestore/server`:** Provides a robust solution for handling file storage on the edge, optimizing upload speeds and reliability of products.

* **Data Visualization with Recharts:**

    * A flexible charting library built with React and D3, enabling the creation of beautiful and interactive data visualizations (e.g., sales trends, inventory levels).

* **Content Editing with Blocknote:**

    * **`@blocknote/core`, `@blocknote/mantine`, `@blocknote/react`:** Integrates a powerful, collaborative Notion-style rich text editor, ideal for managing product descriptions.

* **Real-time Data/Caching with Upstash Redis:**

    * **`@upstash/redis`:** Connects to Upstash Redis, a serverless Redis database, enabling high-performance caching, real-time analytics, and persistent data storage. Useful for frequently accessed data or session management this is used to handle our cart managment .

* **Animations & Visual Effects:**

    * **Motion:** A production-ready animation library for React that makes creating complex, fluid animations straightforward.

    * **TSParticles:**

        * `@tsparticles/engine`, `@tsparticles/react`, `@tsparticles/slim`: A highly customizable particle engine that allows for engaging background effects, interactive animations, and visual enhancements.

* **Image Carousels with Embla Carousel:**

    * **`embla-carousel`, `embla-carousel-autoplay`, `embla-carousel-class-names`, `embla-carousel-react`:** A lightweight, unopinionated, and highly customizable carousel library, perfect for product image galleries or promotional banners, with autoplay functionality used for home billboards.

* **Form Management & Validation:**

    * **`react-hook-form`:** A performant, flexible, and extensible forms library for React, simplifying form state management and validation.

    * **`@hookform/resolvers`:** Integrates with schema validation libraries like Zod.

    * **`zod`:** A TypeScript-first schema declaration and validation library, ensuring robust data validation for forms and API inputs.

* **Utility Libraries & UI Enhancements:**

    * **`lucide-react`:** A collection of beautiful, community-driven, and highly customizable SVG icons.

    * **`date-fns`:** A comprehensive and modular JavaScript date utility library.

    * **`cmdk`:** A command menu component for React.

    * **`react-day-picker`:** A flexible date picker component for React.

    * **`react-resizable-panels`:** Components for creating resizable panel layouts.

    * **`react-use-measure`:** A React hook for measuring DOM elements.

    * **`sonner`:** A toast component for displaying notifications.

    * **`vaul`:** A drawer component for React.

    * **`lenis`:** For smooth scrolling experiences.

    * **`pdfjs-dist`:** For rendering PDF documents in the browser.

    * **`next-themes`:** Enables theme switching (e.g., dark/light mode) in Next.js applications.



To set up and run the "Elysian Emporium E-commerce Store" project locally, please follow these detailed steps:

1.  **Clone the Repository:**
    First, clone the project repository from your version control system (e.g., GitHub).

    ```
    git clone <your-repository-url>
    cd elysian-emporium-ecommerce-store

    ```

    Replace `<your-repository-url>` with the actual URL of your Git repository.

2.  **Install Dependencies:**
    This project uses `npm` as its primary package manager. Navigate to the project's root directory and install all required dependencies.

    ```
    npm install

    ```

    This command will read the `package.json` file and download all necessary packages into your `node_modules` directory.

3.  **Set Up Environment Variables:**
    Crucial for the application's functionality, environment variables store sensitive information and configuration settings.

    * Create a file named `.env` in the root of your project.

    * Refer to a `.env.example` file (if provided in the repository) or the specific requirements for your project to populate this file. Key variables you will typically need include:

        ```
        # Database Connection String Neon DB
        DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

        # Kinde Auth Credentials (Obtain from your Kinde dashboard)
        KINDE_CLIENT_ID="your_kinde_client_id"
        KINDE_CLIENT_SECRET="your_kinde_client_secret"
        KINDE_ISSUER_URL="https://your_kinde_domain.kinde.com"
        KINDE_SITE_URL="http://localhost:3000" # Your application's URL
        KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
        KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/dashboard"

        # Uploadthing API Keys (Obtain from Uploadthing dashboard) this is used to upload images and files
        UPLOADTHING_SECRET="sk_..."
        UPLOADTHING_APP_ID="app_..."

        # Upstash Redis Connection (Obtain from Upstash console) to manage cart products
        UPSTASH_REDIS_REST_URL="[https://...upstash.io](https://...upstash.io)"
        UPSTASH_REDIS_REST_TOKEN="..."

       

        ```

    * **Important:** Ensure these variables are correctly set for both development and production environments.

4.  **Database Setup:**
    This project uses Prisma for database management.

    * Ensure your database server (e.g., PostgreSQL) is running and accessible.

    * Apply the Prisma migrations to create your database schema.

        ```
        npx prisma migrate dev --name init

        ```

        This command will:

        * Create a new migration file (if changes are detected in `prisma/schema.prisma`).

        * Apply the migration to your database, creating or updating tables as defined in your schema.

        * Generate the Prisma Client, which is used by your application to interact with the database.

    * If you make changes to your `prisma/schema.prisma` file, you will need to run `npx prisma migrate dev` again to apply those changes.




## Contributing

Contributions to the Elysian Emporium E-commerce Store! If you'd like to contribute, please follow these steps:

1.  Fork the repository.

2.  Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b fix/bug-description`.

3.  Make your changes and ensure the code adheres to the project's coding standards.

4.  Write clear, concise commit messages.

5.  Push your branch to your forked repository.

6.  Open a Pull Request to the main repository, detailing your changes and their purpose.


---

