# YouthConnect Health Platform

An open-source, offline-capable telehealth platform for youth sexual and reproductive health (SRH).

## Architecture (Turborepo)
- **Frontend (`apps/youthconnect-mobile`)**: React Native with Expo, utilizing `AsyncStorage` for offline queuing and Jitsi Meet for WebRTC teleconsultations. Features a vibrant White & Blue theme tailored for young users.
- **Backend (`apps/youthconnect-api`)**: Node.js, Express, Prisma ORM. Provides secure JWT authentication, endpoints for open-source AI integration (Llama 3 via Ollama), and WebRTC room generation for live teleconsultations.

## Phases Implemented
1. Monorepo Foundation & Database Schema
2. UI/UX Foundation & Navigation
3. Backend APIs & AI Chatbot Integration
4. Offline Capabilities & Sync Engine
5. WebRTC Telehealth Integration
6. UI Polish & Documentation

Developed securely via terminal-driven atomic commits.
