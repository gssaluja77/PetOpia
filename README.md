# 🐾 PetOpia

> A beautiful, modern web application for managing your pet's health and connecting with the pet community

PetOpia is a comprehensive pet health management platform where you can track your pet's medications, appointments, prescriptions, and connect with other pet lovers through a vibrant community feed.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)

## ✨ Features

### 🏠 Pet Center

- **Pet Profiles** - Create and manage multiple pet profiles
- **Health Records** - Track medications with dosage and administration dates
- **Appointments** - Schedule and manage vet appointments with automated email reminders
- **Prescriptions** - Upload and store pet prescription images
- **Photo Gallery** - Add photos to each pet's profile

### 🌍 Community

- **Social Feed** - Share photos and stories about your pets
- **Engagement** - Like and comment on posts from other pet owners
- **Search** - Find posts by keywords with debounced search
- **My Posts** - View and manage your own posts
- **Edit & Delete** - Full control over your content

### 🐕 Adopt a Pet

- **Pet Adoption** - Browse adoptable pets from external API
- **Search & Filter** - Find pets by type, breed, and location
- **Detailed Profiles** - View comprehensive pet information

### 👤 User Features

- **Authentication** - Secure signup and signin with session management
- **Profile Management** - Update your account information
- **Personalized Dashboard** - Access all your pets and posts in one place

## 🛠 Tech Stack

- **Framework**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: Material-UI (MUI)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Context API (RefreshContext)
- **Date Handling**: Moment.js with timezone support
- **Modals**: React Modal
- **Build Tool**: Create React App

## 📦 Prerequisites

Before running this project locally, ensure you have:

- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **PetOpia Backend** server running (see [petopia-server](../petopia-server))

## 🚀 Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/petopia.git
   cd petopia-client
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Create environment file**

   ```bash
   touch .env
   ```

   Then add your configuration (see [Environment Variables](#-environment-variables))

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL (Local Development)
REACT_APP_API_URL=http://localhost:8000
```

## 💻 Running the App

Start the development server:

```bash
npm run dev
```

or

```bash
npm start
```

The app will open automatically at `http://localhost:3000`

**Make sure the backend server is running first!**

## 👨‍💻 Author

**Gundeep Singh Saluja**

---

Made with ❤️ for pets everywhere 🐾
