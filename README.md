# Savorly

A web application that simplifies cooking by decluttering recipes. Users can access clean, distraction-free recipes, save them, and organize their favorites. Built with **Next.js**, **Prisma**, and a suite of modern web technologies.

## Features

- 🧹 **Declutter Recipes**: Remove unnecessary content and focus on ingredients and instructions.  
- 📂 **Save, Edit & Organize Recipes**: Manage your favorite recipes in one place.  
- 🔒 **Secure User Accounts**: Seamlessly manage your recipes with personalized accounts using **NextAuth**.  
- 🚀 **Fast and Modern**: Built with Next.js and TypeScript for optimal performance.  

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn** (for managing dependencies)


### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/recipe-declutter.git
   cd recipe-declutter
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up the environment:

Create a `.env` file in the root directory and include necessary environment variables. Key variables might include:
- `DATABASE_URL` for Prisma
- `NEXTAUTH_SECRET` for authentication
- `NEXTAUTH_URL` for app URL

### Installation

Run the development server:

   ```bash
   npm run dev
   ```

Visit http://localhost:3000 to see the app in action.

### Production

To build and start the application for production:

1. Build the app:

   ```bash
   npm run build
   ```

2. Install required dependencies for Playwright (used for scraping):

   ```bash
   npm run postbuild
   ```
3. Start the app
    ```bash
   npm start
   ```

### Scripts

- `dev`: Starts the development server.
- `build`: Builds the app for production.
- `postbuild`: Installs Playwright and its dependencies after building.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check code quality.
- `seed`: Seeds the database using Prisma.

### Technologies used

- **Next.js**: Framework for server-rendered React applications.
- **Prisma**: Database ORM for type-safe database queries.
- **NextAuth**: Authentication library for secure user accounts.
- **Playwright**: End-to-end testing and scraping framework.
- **TypeScript**: For type-safe code.
- **Mantine**: Modern React UI library.

### License

This project is licensed under the MIT License.
