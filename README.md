# 🏟️ Slotify 

**Slotify** is a fully-featured sports venue slot-booking mobile app built with **React Native**, **Expo Router**, and **TypeScript**. Designed for both players and venue owners, Slotify provides a seamless experience for discovering sports venues, booking slots, and hosting community matches.

## ✨ Features

- **User Authentication**: Secure Login/Sign-up flow with mock Admin/User credentials.
- **Venue Discovery & Booking**: 
   - Browse nearby turfs (Football, Cricket, Tennis, etc.).
   - View venue details, ratings, reviews, and a Map overview.
   - Proceed to responsive slot booking interfaces with dynamic pricing calculation.
- **Matchmaking & Hosting**: 
   - Host community matches and set player limits, skill levels, and price per player.
   - Join existing matches and chat with other players in a real-time lobby simulation.
- **Admin Dashboard**:
   - Venue owners have an exclusive dashboard to view daily revenue, upcoming bookings, and manage sports grounds.
- **Optimized UI & UX**:
   - Heavy lists use `<FlatList>` for buttery smooth 60fps scrolling.
   - Pull-To-Refresh functionality implemented natively.
   - Dark Mode support matching your device's native OS theme.
   - Native OS Share API integration to text message venue locations.
   - Smooth transitions and edge case handling (Empty States).

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- Expo Go App on your iOS or Android device (for physical device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/robinrawat007/Slotify.git
   cd Slotify/slotify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Expo server**
   ```bash
   npx expo start
   ```

4. **Preview the App**
   - Scan the QR code from your terminal in the **Expo Go** app on your phone.
   - Press `a` to open in an Android Emulator.
   - Press `i` to open in an iOS Simulator.

## 🔐 Demo Credentials

Slotify uses a mock authentication layer. You can use the following credentials to explore different roles:

- **Venue Owner (Admin):**
   - Email: `admin@slotify.com`
   - Password: `<any characters>`
- **Standard Player (User):**
   - Email: `user@slotify.com`
   - Password: `<any characters>`

## 🛠️ Built With

- **Framework:** React Native + Expo
- **Routing:** Expo Router (File-based navigation)
- **Language:** TypeScript
- **Styling:** React Native Base Stylesheet (Theme-aware and dynamic)
- **UI Icons:** `@expo/vector-icons` (SF Symbols / Material Icons)

## 📁 Project Structure

```bash
slotify/
├── app/                  # Expo Router file-based routing entry points
│   ├── (tabs)/           # Main Application Bottom Tabs Navigation
│   ├── matches/          # Match Lobby and Creation flow
│   └── venue/            # Venue Details Screens
├── components/           # Reusable UI components (VenueCard, Maps)
├── constants/            # Mock data, App Theme (Dark/Light mode) colors
├── hooks/                # Custom React Hooks (useColorScheme)
└── assets/               # Local app icons and fonts
```

## 📜 License
This project is licensed under the MIT License.
