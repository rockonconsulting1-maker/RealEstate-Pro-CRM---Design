# RC CRM — Repository Structure & File Inventory

Full list of directories and files in the repository with detailed summaries and links.

---

## Root Directory

- [RC CRM Desktop.html](./RC%20CRM%20Desktop.html): The main entry point for the desktop version of the CRM. It initializes the desktop environment, loading `mobile/data.jsx` for mock data and icons, then `desktop/*` for implementation.
- [RC CRM Mobile.html](./RC%20CRM%20Mobile.html): The primary entry point for the mobile version. It simulates an iPhone bezel and allows navigation between various mobile prototype screens.
- [RC CRM Screen Inventory.html](./RC%20CRM%20Screen%20Inventory.html): An inventory page listing all available screens across the application for quick access and overview.
- [RC CRM Auth Desktop.html](./RC%20CRM%20Auth%20Desktop.html): A prototype of the desktop authentication and login flow.
- [RC CRM Auth Mobile.html](./RC%20CRM%20Auth%20Mobile.html): A prototype of the mobile authentication and login flow.
- [design.md](./design.md): The Design System documentation. It defines the principles, color tokens (OKLCH), typography, spacing, component specs, and UI patterns used throughout the project.
- [frontend-designs.md](./frontend-designs.md): A detailed breakdown of all screens, pages, and components for both Desktop and Mobile, including data fields for lists and forms.
- [repo-structure.md](./repo-structure.md): This file; a comprehensive list and summary of every directory and file in the repository.

---

## [desktop/](./desktop/)
Implementation of the desktop surface, focused on pipeline planning and complex offer operations.

- [app.jsx](./desktop/app.jsx): Root React component for the desktop surface. Handles high-level routing and state management (modals, selected records).
- [shell.jsx](./desktop/shell.jsx): Core UI layout including the Sidebar (navigation), Topbar (search, breadcrumbs), and shared primitives like Money, Countdown, and Avatar.
- [dashboard.jsx](./desktop/dashboard.jsx): The desktop landing page. Composes KPI grids, the "Next up" appointment hero, attention lists, and activity timelines.
- [leads.jsx](./desktop/leads.jsx): Implementation of the Leads module. Supports a master-detail list view and a Kanban board for the nurture funnel.
- [contacts.jsx](./desktop/contacts.jsx): The Contacts directory for desktop. Features a split-pane view with a searchable directory on the left and contact details on the right.
- [conversations.jsx](./desktop/conversations.jsx): Messaging inbox for desktop. Supports multiple communication channels (SMS, Email, WhatsApp) in a split-pane thread view.
- [mls.jsx](./desktop/mls.jsx): Searchable database for MLS property listings with advanced filters (price, beds, baths, type).
- [modals.jsx](./desktop/modals.jsx): A collection of creation modals (New Lead, Client, Property, Offer, etc.) and the "Quick Add" trigger.
- [screens.jsx](./desktop/screens.jsx): Implementation of secondary pages like Clients (Kanban/List), My Listings inventory, and basic detail views.
- [screens2.jsx](./desktop/screens2.jsx): Specialized sub-views for the Calendar (Day, Month, Agenda) and the Settings/Account management page.
- [screens3.jsx](./desktop/screens3.jsx): Expanded detail page implementations for Clients and Properties, featuring deep tabbed content.
- [screens4.jsx](./desktop/screens4.jsx): A specialized combined detail view for "James & Kira Morton" who are both buying and selling simultaneously.
- [styles.css](./desktop/styles.css): Desktop-specific tokens and component styles, implementing the design system's density and hierarchy.

---

## [mobile/](./mobile/)
Focused implementation for iPhone-sized prototypes, optimized for in-the-field work.

- [app.jsx](./mobile/app.jsx): Root React component for mobile. Includes the screen switcher, iPhone bezel integration, TabBar, and FAB logic.
- [data.jsx](./mobile/data.jsx): The central "source of truth" for mock data (`window.MOCK`) and the inline-SVG icon registry (`window.Icon`).
- [styles.css](./mobile/styles.css): Mobile-specific styles, safe area treatments, and gesture-friendly components.
- [screen-dashboard.jsx](./mobile/screen-dashboard.jsx): The mobile dashboard featuring the "Now" ribbon for active appointments and KPI carousels.
- [screen-leads.jsx](./mobile/screen-leads.jsx): Mobile leads view with swipeable list items and a vertical Kanban stack.
- [screen-clients.jsx](./mobile/screen-clients.jsx): Kanban view for the buyer/seller transaction pipeline and flexible role-based client details.
- [screen-lead-detail.jsx](./mobile/screen-lead-detail.jsx): Tabbed detail view for Buyer and Seller leads, including CRM history and search criteria.
- [screen-client-detail.jsx](./mobile/screen-client-detail.jsx): Detailed views for active buyer and seller clients, featuring transaction milestones.
- [screen-client-detail-both.jsx](./mobile/screen-client-detail-both.jsx): Combined detail view for "James & Kira Morton" (simultaneous buy/sell) for mobile.
- [screen-props-offers.jsx](./mobile/screen-props-offers.jsx): Mobile listings directory and deep detail views for properties and active offers.
- [screen-mls.jsx](./mobile/screen-mls.jsx): Property search interface for the broader MLS database optimized for mobile touch.
- [screen-calendar-full.jsx](./mobile/screen-calendar-full.jsx): Comprehensive calendar implementation with Day, Week, and Month grids and event details.
- [screen-cal-tasks.jsx](./mobile/screen-cal-tasks.jsx): The Agenda-first calendar view and the Task management list (Today + Overdue).
- [screen-tasks-notes.jsx](./mobile/screen-tasks-notes.jsx): Grouped views for Tasks and Notes (by Property, Client, or Tag).
- [screen-contacts.jsx](./mobile/screen-contacts.jsx): Mobile-optimized Contacts directory and individual contact records.
- [screen-conversations.jsx](./mobile/screen-conversations.jsx): Messaging interface with chat bubbles and channel-specific logs (Phone, Review, Group SMS).
- [screen-modals.jsx](./mobile/screen-modals.jsx): Bottom-sheet creation forms and notification lists.
- [screen-documents.jsx](./mobile/screen-documents.jsx): A "Coming Soon" vault for listing agreements, offers, and inspection reports.
- [screen-settings.jsx](./mobile/screen-settings.jsx): Agent profile, preference toggles, and data export settings.
- [print-app.jsx](./mobile/print-app.jsx): A specialized root component used by `RC CRM Mobile-print.html` to render all mobile screens at once for review.
