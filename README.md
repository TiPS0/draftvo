<div align="center">

# Draftvo

**The unified workspace bridging technical and non-technical workflows.**

</div>

---

Draftvo is a workspace tailored for cross-functional teams to store documents, manage data, write API specifications, plan via calendars, and communicate seamlessly with external stakeholders (vendors, outsourcers, leadership) via PDF exports and integrated email.

## ✨ Core Feature Pillars

| Feature                    | Description                                                                                    |
| :------------------------- | :--------------------------------------------------------------------------------------------- |
| 📝 **The Workspace**       | Block-based document editing, data file storage, and API spec rendering.                       |
| 📅 **Calendar & Planning** | Visual calendar views linked to documents for project roadmapping.                             |
| 📄 **The Export Engine**   | High-quality, template-driven PDF generation designed for external communication.              |
| 📧 **Communication Hub**   | Native email sending capabilities directly from the workspace to share docs or alerts.         |
| ⚡ **Workflow Automation** | Webhook architecture designed to connect natively with tools like n8n.                         |
| 🔐 **Authentication**      | Local n8n-style auth (email/password) stored via a Go backend to quickly bootstrap workspaces. |

---

## 🏗️ Technical Architecture

This project is structured as a **Monorepo** using `pnpm` workspaces:

- **Frontend (`/frontend`)**: Next.js 16 (React 19) with Tailwind CSS v4, handling the complex UI, auth flows, block editor, and calendar.
- **Backend (`/backend`)**: Go server for API endpoints (including JWT authentication and `users.json` local store) and background tasks.
- **PDF Microservice (Future)**: Isolated Dockerized headless browser service (Puppeteer/Playwright) to handle heavy PDF generation.

---

## 📦 Getting Started

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **Go** 1.20+

### Installation & Usage

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/draftvo.git
cd draftvo
pnpm install
```

2. Start the development servers (runs both Frontend and Backend concurrently):

```bash
pnpm dev
```

---

## 🤝 Contributing

We love contributions! Whether it's adding new features, fixing bugs, or improving documentation, your help is appreciated.

Please read our [Contributing Guide](CONTRIBUTING.md) to get started with setting up your local environment and submitting a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
