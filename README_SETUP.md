# GovInsight-AI Setup Guide

This project consists of a Node.js backend (`server`) and a React frontend (`web`).

## Prerequisites

- **Node.js**: You must have Node.js installed (v18 or higher recommended).
- **API Key**: You need a Qwen API key (DashScope) for the AI features.

## Quick Start

We have provided a script to automate the setup and running of the project.

1.  **Run the setup script:**
    ```bash
    ./setup_and_run.sh
    ```

    This script will:
    - Install dependencies for both server and web.
    - Create a `.env` file in `server/` if it doesn't exist.
    - Start both the backend and frontend.

2.  **Configuration:**
    - Open `server/.env` and replace `your_api_key_here` with your actual Qwen API Key.
    - Restart the script if you changed the `.env` file while it was running.

## Manual Setup

If you prefer to run it manually:

### Server
1.  Navigate to `server/`:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment:
    - Copy `.env.example` to `.env`.
    - Update `QWEN_API_KEY` in `.env`.
4.  Start server:
    ```bash
    node index.js
    ```

### Web
1.  Navigate to `web/`:
    ```bash
    cd web
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start development server:
    ```bash
    npm run dev
    ```
