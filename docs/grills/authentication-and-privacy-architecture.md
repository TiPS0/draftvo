# Agent Grill Audit: Authentication & Privacy Architecture

**Context:** The user is building Draftvo (Next.js frontend, Go backend), a monorepo project designed to be dockerized and self-hosted on a server for team usage. The core question was whether login is still necessary for a self-hosted tool, and how to prevent data leaks.

## 1. Flow & Journey Mapping
- Current state includes mail/password login.
- Future state involves deploying via Docker to a local/global server.
- The risk: If login is removed, the application becomes completely open to anyone who can access the server's IP/port, leading to anonymous edits, lack of task attribution, and massive data leak risks.

## 2. Interrogation & Decisions
Through interactive questioning, the following architectural decisions were solidified:
1. **Authentication System:** Kept. We MUST use built-in Auth to ensure users only see their team's data, and to correctly attribute tasks, notes, and calendar events to specific people.
2. **Account Provisioning:** Invitation-only / Admin-provisioned. To prevent random users from finding the server and signing up, the system will use an Admin-invite model. The *first* user to register on a fresh database will automatically become the Admin.
3. **Data Isolation (Tenancy):** Single Organization (Self-Hosted Model). One server deployment equals one organization/team. All users on the server belong to the same company, and role-based access control (Admin, Member) will restrict permissions.

## 3. Logic Audit & Silent Failure Prevention
- **First-User Admin Logic:** We must ensure the backend securely identifies the "first user" state. If the user table is empty, the registration endpoint is open. Once 1 user exists, the registration endpoint MUST reject signups unless accompanied by a valid Admin invite token.
- **Session Security:** Since the Next.js frontend and Go backend will run together, authentication should ideally use HTTP-only secure cookies to prevent XSS attacks from stealing session tokens.
- **Data Privacy:** Because we retain login, team drafts and implementation details are protected from unauthenticated access. Role-based access (RBAC) ensures standard members cannot delete or modify other users' sensitive data unless granted permission.

## 4. Next Steps for Implementation
- Update the Go backend registration flow to implement the "First User is Admin, rest require invite" logic.
- Ensure the Next.js frontend routes redirect to login if unauthenticated.
- Scaffold the User Management / Invite screen for Admins.
