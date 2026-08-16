# Contributing to Clothing Exchange Marketplace

Thank you for your interest in contributing to the **Clothing Exchange & Swap Marketplace**! We welcome community contributions to build sustainable fashion tech.

## 🚀 How to Get Started

### 1. Fork and Clone
1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Clothing-exchange.git
   cd Clothing-exchange
   ```

### 2. Set Up Development Environment
1. Install dependencies across workspace:
   ```bash
   npm run install-all
   ```
2. Configure `.env` files:
   - Backend: Copy `backend/.env.example` to `backend/.env`
   - Frontend: Copy `frontend/.env.example` to `frontend/.env`

3. Start development servers concurrently:
   ```bash
   npm run dev
   ```

---

## 🌿 Branching & Commit Conventions

- Use feature branches off `main`:
  - `feat/feature-name`
  - `fix/bug-fix-name`
  - `docs/documentation-update`
  - `refactor/refactor-name`

- Write clear, imperative commit messages:
  - `feat: add real-time notification audio cue`
  - `fix: resolve socket room reconnection issue`
  - `docs: update deployment guidelines for Render`

---

## 🧪 Testing and Verification

Before submitting a Pull Request:
1. Verify the frontend build succeeds without warnings:
   ```bash
   cd frontend
   npm run build
   ```
2. Ensure no secrets, logs, or unneeded files are staged.

---

## 📬 Submitting a Pull Request

1. Push your branch to GitHub.
2. Open a Pull Request against `main`.
3. Fill out the PR template with details of your changes and test results.
4. Maintainers will review and collaborate with you on your PR!
