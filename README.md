# MRC Club Admin & CMS Portal

**Mercedes Benz W205 Club Indonesia (MBW205CI)**

A comprehensive web application for managing club memberships, events, and website content. This system features a public registration portal, a secure admin dashboard, and a dynamic Content Management System (CMS).

## 🚀 Key Features

### 👤 Public Portal
- **Member Registration**: Multi-step form with vehicle details and document uploads (KTP, STNK, Photos).
- **Events Gallery**: Browse upcoming events and club activities.
- **Contact Form**: Direct communication channel for inquiries.

### 🛡️ Admin Dashboard
- **Member Management**: Approve, reject, and manage member applications.
- **Statistics**: Real-time overview of total members, pending applications, and recent activity.
- **Secure Authentication**: Protected admin access with session management.

### 📝 Content Management System (CMS)
- **Dynamic Content**: Update Hero section, About Us, Benefits, and Footer content directly from the dashboard.
- **Events Management**: Create, edit, and delete club events.
- **Gallery Manager**: Upload and organize gallery images.
- **Social Media**: Manage social links and contact information.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: PostgreSQL (pg)
- **Deployment**: Docker & Docker Compose

---

## 📚 Documentation

Detailed guides for setting up and maintaining the project:

- **[Setup Instructions](./SETUP_INSTRUCTIONS.md)**: Full guide for local development and environment configuration.
- **[Deployment Guide](./DEPLOYMENT.md)**: Instructions for Docker and VPS deployment.
- **[API Documentation](./API_DOC.md)**: comprehensive reference for all API endpoints.

---

## ⚡ Quick Start (Docker)

The fastest way to get running is using Docker Compose:

1. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Start Application**
   ```bash
   docker-compose up -d --build
   ```

3. **Initialize Database**
   ```bash
   # Run migration script inside the container
   docker-compose exec app npm run migrate
   ```

4. **Access**
   - App: [http://localhost:3000](http://localhost:3000)
   - Login: [http://localhost:3000/login](http://localhost:3000/login)

---

## 📄 License

Private - MRC Club Indonesia.
