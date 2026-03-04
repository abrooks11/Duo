# Duo

<div align="center">
  <img src="public/duo-favicon.png" alt="Duo Logo" width="260" height="200">
</div>

[![AI Powered](https://img.shields.io/badge/AI_Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)


## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)


## Overview

Duo is a **Full-Stack Data Integration Bridge** designed specifically for small to mid-size healthcare facilities. The application ingests CSV and XML export files from various healthcare systems and consolidates them into a unified relational database, presenting the data through advanced, filterable data tables.

**Perfect for healthcare practices** that don't have comprehensive practice management systems and instead rely on diverse, disparate vendors to manage different pieces of patient data. Duo dramatically simplifies the maintenance and visualization of appointments, claims, and patient information by bridging the gap between multiple data sources.

## Features

### Core Features
- **📊 Excel/CSV File Imports** - Ingest patient, appointment, payment, and EOB data from exported spreadsheets
- **🔄 Tebra/Kareo EHR Sync** - Automatic SOAP API sync for appointments and EOBs from Tebra
- **💰 Payment Reconciliation** - Match EOBs to deposits, EFT reference matching, and reconciliation dashboard
- **🤖 AI-Powered Reports** - Natural language to SQL report generation via OpenAI
- **🗄️ Unified Database** - Centralized storage with PostgreSQL and Prisma ORM
- **📋 Advanced Data Tables** - Filterable, sortable tables with Material-UI MUI X DataGrid

### Secondary Features
- **📅 Appointment Management** - View and manage patient appointments with auto-sync
- **👥 Patient Management** - Comprehensive patient data handling
- **📞 Voicemail Integration** - RingRX voicemail management with AI-assisted features
- **💬 SMS Messaging** - Send messages to patients via RingRX

## Installation

```bash
# Clone the repository
git clone [repository-url]
cd Duo

# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Start the development servers
npm run start
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/duo
PORT=3000
NODE_ENV=development

# OpenAI (AI reports, voicemail features)
OPENAI_API_KEY=

# RingRX (voicemail, SMS)
RING_USER_NAME=
RING_PASSWORD=
RINGRX_BASE_URL=https://portal.ringrx.com

# Tebra/Kareo (EHR sync)
TEBRA_API_URL=
TEBRA_CUSTOMER_KEY=
TEBRA_USER_ID=
TEBRA_PASSWORD=
TEBRA_PRACTICE_NAME=
```

### Third-Party Integrations

- **Tebra/Kareo**: SOAP API integration for syncing appointments and EOBs from the EHR
- **RingRX**: Cookie-based auth for voicemail management and SMS messaging
- **OpenAI**: Powers AI report generation and voicemail features

## Usage

### For Users

1. **File Import**: Navigate to the upload section and select your CSV/XML files
2. **Data Management**: Use the advanced tables to filter, sort, and view your data
3. **Appointments**: View and manage patient appointments with calendar integration
4. **Voicemail**: Handle voicemail messages through the integrated RingRX system

### For Developers

```bash
# Start development environment
npm run start

# Frontend only (port 5173)
npm run dev

# Backend only (port 3000)
npm run server

# Database operations
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Apply migrations
npx prisma generate        # Generate Prisma client
```