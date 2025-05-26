# RahaFest Beta

A React Native mobile application for festival management and attendee engagement.

## Features

- **Event Discovery** - Browse upcoming festivals and events
- **Real-time Schedules** - Live performance and activity updates
- **E-commerse Store** - Purchase event merchandise
- **Artist Profiles** - Detailed performer information
- **Chat Integration** - Connect with attendees
- **Push Notifications** - Real-time alerts and updates
- **Ticket Management** - Purchase and manage tickets
- **Offline Support** - Core functionality without internet

## Tech Stack

- React Native
- Redux
- Expo router
- FCM notifications
- Firebase
- React Native Maps
- Socket.io

## Prerequisites

- Node.js v22+
- React Native CLI
- Android Studio / Xcode
- CocoaPods (iOS)

## Installation

```bash
# Clone repository
git clone https://github.com/mwendwa99/rahafest-beta.git
cd rahafest-beta

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Environment setup
cp .env.example .env

# Start Metro
npm start

# Run app
npm run ios     # iOS
npm run android # Android
```
## License
Proprietary software. See [LICENSE.md](LICENSE.md) for details.
