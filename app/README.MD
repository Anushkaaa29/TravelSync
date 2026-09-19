# TravelSync Mobile App

TravelSync is a React Native mobile application designed to provide a smooth and interactive booking experience with real-time communication and seamless user interaction.

## 📱 Overview

The mobile application serves as the primary user-facing platform of TravelSync. It connects users with the backend services and provides features such as booking management, real-time messaging, media sharing, notifications, and offline/online network handling.

## ✨ Key Features

### 🔐 User Authentication
- Secure user registration and login
- Authentication-based access to application features
- Persistent user session handling

### 📋 Booking Management
- Browse and manage available booking information
- View relevant booking details
- Manage user-related booking activities

### 💬 Real-Time Chat
- One-to-one real-time messaging
- Instant message delivery using Socket.io
- Edit and delete sent messages
- Image/media sharing through chat

### 🔔 Push Notifications
- Firebase Cloud Messaging integration
- Push notifications for relevant application events
- Notification handling within the mobile application

### 🌐 Offline & Online Support
- Network connectivity detection using NetInfo
- Handles application behavior during connectivity changes
- Provides a smoother experience in unstable network conditions

### 📦 State Management
- Redux Toolkit for centralized application state
- Organized state handling across different screens and features
- Efficient management of user and application data

## 🛠️ Technologies Used

- **React Native** – Mobile application development
- **JavaScript** – Application logic
- **Redux Toolkit** – State management
- **Node.js & Express.js** – Backend APIs
- **MongoDB Atlas** – Database
- **Socket.io** – Real-time communication
- **Firebase Cloud Messaging** – Push notifications
- **NetInfo** – Network connectivity handling

## 📂 Application Structure

```text
mobile/
│
├── android/
├── ios/
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── redux/
│   ├── services/
│   └── ...
│
├── package.json
└── README.md
