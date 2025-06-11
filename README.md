# UoA Your Way – App & Content Management System (CMS)

Welcome to the official repository for the **UoA Your Way** project. This system includes:

- A mobile app built with React Native for end users.
- A web-based content management system (CMS) for administrators to manage content.

---

## 📦 Technologies Used

### 🟦 Mobile App

- **Language:** TypeScript
- **Framework:** React Native
- **Tooling:** Expo

### 🖥️ Content Management System (CMS)

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - Tiptap (Rich Text Editor)
- **Backend:**
  - Node.js
  - Express
  - MongoDB (via Mongoose)

---

## 🛠 Prerequisites

Make sure the following tools are installed before starting:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)  
  If you don’t have it installed:
  ```bash
  npm install --global yarn
  ```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:uoa-compsci399-2025-s1/capstone-project-2025-s1-team-5.git
cd capstone-project-2025-s1-team-5
```

---

## 🧑‍💼 CMS Setup (Admin-Only Website)

### Step 1: Install Dependencies

```bash
cd cms
yarn install
```

### Step 2: Configure Client Environment

Create a `.env` file in the `cms/client/` folder with the following:

```env
REACT_APP_API_URL=http://localhost:3000
```

### Step 3: Configure Server Environment

Create a `.env` file in the `cms/server/` folder with the following:

```env

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=uoayourway@gmail.com
SMTP_PASS=wjdg waao qqnj yjcv
TO_EMAIL=vereinen00@gmail.com
```

> ⚠️ **Security Notice:** Do **not** commit `.env` files to version control. Be sure `.env` is listed in `.gitignore`.

### Step 4: Start the CMS

From the `cms/` directory:

```bash
yarn start
```

Then open your browser and go to:

```
http://localhost:5000
```

---

## 📱 Mobile App Setup

> ⚠️ To launch the Expo app successfully, you must have the Content Management System (CMS) running in another terminal.
> This is because the app depends on the CMS server for backend functionality.
> Navigate to the cms folder and start the server before launching the Expo app.

### Step 1: Install Expo Go on Your Mobile Device

Download **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent).

### Step 2: Install App Dependencies

```bash
cd app
npm install
```

### Step 3: Configure App Environment

Create a `.env` file in the `app` folder with the following:

```env
LOCAL_IP= YourIPvAddress
```

### Step 4: Start the App

```bash
npx expo start
```

A QR code will appear in your terminal or browser.

### Step 5: Launch on Your Phone

- Open the **Expo Go** app.
- Scan the QR code.
- The UoA Your Way app will launch on your device.

---

## 🚀 Deployment

### 📂 Content Management System (CMS)

The CMS is currently deployed on an AWS EC2 instance and is accessible via the following link:

🌐 [http://3.107.214.51/](http://3.107.214.51/)

> ⚠️ This deployment is for administrative use only and is not publicly listed.

### 📱 Mobile App

The mobile app is currently in **development mode** and has not yet been deployed to the **Apple App Store** or **Google Play Store**.

- The app is built using **Expo**, which simplifies development and testing but requires additional steps to generate production-ready binaries.
- Future plans include building and submitting standalone iOS and Android apps through the Expo build and submission pipeline.

---

## 🔮 Future Plans

We plan to enhance and expand the platform with the following initiatives:

### 🛒 App Store Releases

- **Production Release**:  
  Submit the mobile app to the **Apple App Store** and **Google Play Store** using Expo’s EAS Build system, ensuring:
  - Proper branding, app store compliance, and assets
  - Production configuration with secure environment variables
  - Testing across various devices before publishing

### 🌐 Community Engagement

- **Forum for International Students**:  
  Launch a community forum that enables overseas students to connect with each other and University of Auckland staff. This will help answer common questions and provide emotional and academic support.

### 📊 Data Analytics

- **User Insights & Tracking**:  
  Implement analytics to collect meaningful data such as:
  - Module clicks and time spent per section
  - Quiz completions and scores
  - Conversion tracking (e.g., app users who later apply or enroll at UoA)

### 🌏 China-Compatible Infrastructure

- **Global Accessibility**:  
  Plan for deployment using infrastructure that ensures compatibility with China's internet environment by:
  - Using CDN and database solutions compliant with Chinese regulations
  - Hosting data closer to the region for improved speed and reliability

These enhancements aim to improve usability, engagement, and global accessibility, particularly for international students.

---

## 📝 License

This project is part of the COMPSCI 399 capstone course at the University of Auckland. All rights reserved.
