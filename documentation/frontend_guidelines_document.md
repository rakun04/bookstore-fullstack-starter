# Frontend Guideline Document

This document outlines the frontend architecture, design principles, and technologies used to build a modern, scalable Admin Panel for an E-Commerce application. It’s written in everyday language so anyone can understand how the frontend is set up and why.

## 1. Frontend Architecture

### Overview
- We use **Next.js (App Router)** with **React 19** and **TypeScript** to build a fast, server-rendered, and SEO-friendly Admin Panel.  
- **Tailwind CSS** and **shadcn/ui** provide ready-made, accessible UI components styled with a utility-first approach.  
- **Drizzle ORM** powers our database schema definitions in a type-safe way (these live in the NestJS backend but inform the frontend types).  
- For local development and CI, we use **Docker Compose** to spin up the Next.js app, NestJS API, and PostgreSQL database in one go.

### Scalability, Maintainability & Performance
- **Server Components** in Next.js let us fetch data on the server for faster page loads and less client bundle size.  
- **File-based routing** and a clear folder structure (`/app`, `/components`, `/lib`) keep code organized as the app grows.  
- **Utility-first CSS** (Tailwind) removes unused styles at build time, keeping CSS bundles small.  
- **Dockerized services** and shared Drizzle schemas ensure that all developers run the same environment and database structure.

## 2. Design Principles

1. **Usability**  
   - Clear navigation with a sidebar and header.  
   - Consistent form and table layouts for CRUD operations.  
   - Immediate validation feedback on forms.  

2. **Accessibility**  
   - All components follow WCAG color contrast guidelines.  
   - Keyboard navigation and focus outlines enabled.  
   - Aria labels used where needed (modals, dialogs, icons).  

3. **Responsiveness**  
   - Mobile-first design: sidebar collapses into a hamburger menu on small screens.  
   - Flex and grid utilities from Tailwind ensure layouts adapt to any viewport.  

4. **Consistency**  
   - Reusable UI components (buttons, cards, tables) built with `shadcn/ui`.  
   - A single theme configuration drives colors, typography, and spacing.

## 3. Styling and Theming

### Styling Approach
- **Utility-First CSS** with **Tailwind CSS**: We write classes like `px-4 py-2 text-indigo-600` instead of custom CSS files.  
- **No BEM or SMACSS** needed, since Tailwind handles most layout and design needs.  
- If you need custom styles, you can add them in `globals.css` or via the `@layer` feature in Tailwind.

### Theming
- We define a **theme** in `tailwind.config.ts` with custom colors, font, and border-radius tokens.  
- Theme variables are available as CSS variables for any non-Tailwind component.

### Visual Style
- **Modern Flat Design**: Clean shapes, subtle shadows, and consistent spacing.  
- Occasionally use **soft glassmorphism** (semi-transparent cards with a light blur) for emphasis in dashboard widgets.

### Color Palette
- Primary: `#4F46E5` (indigo-600)  
- Secondary: `#059669` (emerald-600)  
- Accent: `#FBBF24` (amber-400)  
- Background: `#F9FAFB` (gray-50)  
- Surface/Card: `#FFFFFF`  
- Text: `#1F2937` (gray-800)  
- Border: `#E5E7EB` (gray-200)

### Typography
- Font Family: **Inter**, system-fallbacks (`-apple-system, BlinkMacSystemFont, 'Segoe UI'`).  
- Base Font Size: `16px` with responsive scaling using Tailwind’s `text-base` and `text-lg` classes.

## 4. Component Structure

### Organization
- `/app/`: Next.js pages and layouts, including `app/dashboard`, `app/sign-in`, `app/sign-up`.  
- `/components/`: All reusable UI components (e.g., `Navbar.tsx`, `Sidebar.tsx`, `Card.tsx`, `Form.tsx`).  
- `/lib/`: Helper modules like `api-client.ts` for REST calls and `auth.ts` for client-side authentication helpers.  
- `/db/`: Shared Drizzle ORM schemas (moved into NestJS, but kept here for type definitions).

### Reusability and Maintainability
- Each component lives in its own folder with `Component.tsx`, `Component.test.tsx`, and a CSS or style file if needed.  
- We build storybook stories (optional) for each component to document its use cases.  
- Components accept props for maximum flexibility (data, loading states, callbacks).

## 5. State Management

### Libraries & Patterns
- **TanStack Query (React Query)** for server state: data fetching, caching, and background refetching.  
- **React Context** for global UI state: theme toggles, modal open/close, and authenticated user data (token, role).  
- **Local component state** (useState) for ephemeral UI elements like form inputs and temporary filters.

### How It Works Together
1. **Login Flow**: A login form calls `apiClient.login()`, stores JWT in an http-only cookie, and updates AuthContext.  
2. **Protected Routes**: The dashboard layout reads AuthContext; if no valid token or role !== Admin, it redirects to `/sign-in`.  
3. **Data Pages**: Dashboard pages use `useQuery` hooks to fetch lists of products, orders, etc. Mutations (`useMutation`) handle create/update/delete with automatic cache invalidation.

## 6. Routing and Navigation

### Next.js App Router
- **File-based routing** in the `/app` directory.  
- Nested routes: `/app/dashboard/products/page.tsx` for the products list, `/app/dashboard/products/[id]/page.tsx` for product details.  
- Layouts: `app/dashboard/layout.tsx` wraps all dashboard pages with a common sidebar and header.

### Navigation Structure
- **Sidebar**: Links to Dashboard Home, Products, Categories, Orders, Reports.  
- **Header**: Contains user avatar, notifications icon, and a logout button.  
- **Breadcrumbs** (optional) in page headers to show the current path.

## 7. Performance Optimization

- **Server Components** reduce client JS bundle size by rendering data-heavy pages on the server.  
- **Code Splitting**: Dynamic imports (`next/dynamic`) for rarely used components or heavy chart libraries.  
- **Lazy Loading**: Defer loading of modals, charts, and image assets until they’re needed.  
- **Image Optimization**: Use `next/image` for automatic resizing and modern formats (WebP).  
- **Tailwind CSS Purge**: Removes unused styles in production, keeping CSS footprint minimal.

## 8. Testing and Quality Assurance

### Unit Tests
- **Jest** with **React Testing Library** for UI components.  
- Mock API calls with MSW (Mock Service Worker) to test components in isolation.

### Integration Tests
- Combine multiple components and test data fetching flows and form submissions.  

### End-to-End Tests
- **Cypress** for full user flows: sign in, list products, create a new category, update an order.  

### Code Quality Tools
- **ESLint** with a shared config (TypeScript, React rules).  
- **Prettier** for consistent code formatting.  
- **Husky** + **lint-staged** to run linters and tests before commits.

## 9. Conclusion and Overall Frontend Summary

This Admin Panel frontend uses Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui to deliver a modern, accessible, and maintainable interface. The architecture supports:

- **Scalability** through clear folder structure, reusable components, and Dockerized services.  
- **Maintainability** by using Drizzle ORM schemas for shared types, Context API for global state, and Storybook for component documentation.  
- **Performance** via server components, code splitting, and asset optimization.

By following these guidelines, you ensure a consistent, user-friendly, and robust Admin Panel that can grow with your E-Commerce project’s needs.