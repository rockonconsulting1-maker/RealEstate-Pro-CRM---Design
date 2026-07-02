# RC CRM Screen Inventory

This document lists and links all screens, views, modals, and pages for both the Desktop and Mobile surfaces of the RC CRM prototype.

## Desktop Surface

### Pages & Screens
| Screen Name | Description | Source File |
| :--- | :--- | :--- |
| **Dashboard** | Main overview with stats, "Now" ribbon, and activity. | [desktop/dashboard.jsx](desktop/dashboard.jsx) |
| **Leads** | Kanban and List views for lead management. | [desktop/leads.jsx](desktop/leads.jsx) |
| **Lead Detail** | Full detail view for a specific lead. | [desktop/leads.jsx](desktop/leads.jsx) |
| **Clients** | Pipeline and list of active buyers and sellers. | [desktop/screens.jsx](desktop/screens.jsx) |
| **Client Detail (Buyer)** | Detailed view for buyer clients. | [desktop/screens3.jsx](desktop/screens3.jsx) |
| **Client Detail (Seller)** | Detailed view for seller clients. | [desktop/screens3.jsx](desktop/screens3.jsx) |
| **Client Detail (Both)** | Combined view for dual-representation clients. | [desktop/screens4.jsx](desktop/screens4.jsx) |
| **Contacts** | Directory of all contacts and vendors. | [desktop/contacts.jsx](desktop/contacts.jsx) |
| **My Listings** | Overview of properties managed by the agent. | [desktop/screens.jsx](desktop/screens.jsx) |
| **MLS Properties** | Search and view properties from the MLS. | [desktop/mls.jsx](desktop/mls.jsx) |
| **Property Detail** | Comprehensive property record with offers and showings. | [desktop/screens3.jsx](desktop/screens3.jsx) |
| **Offers** | Table of all active and past offers. | [desktop/screens.jsx](desktop/screens.jsx) |
| **Offer Detail** | Negotiation history and offer terms. | [desktop/screens.jsx](desktop/screens.jsx) |
| **Calendar** | Week, Day, and Month views of the agent's schedule. | [desktop/screens.jsx](desktop/screens.jsx), [desktop/screens2.jsx](desktop/screens2.jsx) |
| **Tasks** | Task management grouped by property or client. | [desktop/screens.jsx](desktop/screens.jsx) |
| **Notes** | Centralized notes feed. | [desktop/screens.jsx](desktop/screens.jsx) |
| **Conversations** | SMS and Email message history. | [desktop/conversations.jsx](desktop/conversations.jsx) |
| **Settings** | Profile, notification, and theme configuration. | [desktop/screens2.jsx](desktop/screens2.jsx) |
| **Auth** | Login and Sign-up flows. | [RC CRM Auth Desktop.html](RC%20CRM%20Auth%20Desktop.html) |

### Modals
*All desktop modals are defined in [desktop/modals.jsx](desktop/modals.jsx).*
- **Quick Add**: Fast entry for any record type.
- **New Lead / Client / Property / Offer**: Creation forms.
- **New Task / Note / Event**: Activity logging forms.
- **Event / Task / Note Detail**: Detailed viewing and editing in a modal.
- **Convert Lead**: Flow to move a lead into the client pipeline.
- **Notifications Popover**: Quick-access notifications dropdown.

---

## Mobile Surface

### Screens
| Screen Name | Description | Source File |
| :--- | :--- | :--- |
| **Dashboard** | Mobile overview with "Now" card and quick stats. | [mobile/screen-dashboard.jsx](mobile/screen-dashboard.jsx) |
| **Search Screen** | Global search overlay. | [mobile/screen-dashboard.jsx](mobile/screen-dashboard.jsx) |
| **Leads** | List and Board views optimized for mobile. | [mobile/screen-leads.jsx](mobile/screen-leads.jsx) |
| **Lead Detail** | Mobile-optimized lead detail tabs. | [mobile/screen-lead-detail.jsx](mobile/screen-lead-detail.jsx) |
| **Clients** | Kanban/List views for active transactions. | [mobile/screen-clients.jsx](mobile/screen-clients.jsx) |
| **Client Detail** | Detail views for Buyer/Seller clients. | [mobile/screen-client-detail.jsx](mobile/screen-client-detail.jsx) |
| **Client Detail (Both)** | Detail view for clients with multiple roles. | [mobile/screen-client-detail-both.jsx](mobile/screen-client-detail-both.jsx) |
| **Properties** | Listing browse and stage tracking. | [mobile/screen-props-offers.jsx](mobile/screen-props-offers.jsx) |
| **Property Detail** | Essential listing data on the go. | [mobile/screen-props-offers.jsx](mobile/screen-props-offers.jsx) |
| **MLS Properties** | Searchable MLS property feed. | [mobile/screen-mls.jsx](mobile/screen-mls.jsx) |
| **Documents** | File browser stub for listing and client docs. | [mobile/screen-documents.jsx](mobile/screen-documents.jsx) |
| **Offers** | Offer tracking and detail views. | [mobile/screen-props-offers.jsx](mobile/screen-props-offers.jsx) |
| **Calendar** | Day, Week, and Month schedule views. | [mobile/screen-calendar-full.jsx](mobile/screen-calendar-full.jsx), [mobile/screen-cal-tasks.jsx](mobile/screen-cal-tasks.jsx) |
| **Tasks & Notes** | List views for daily activities. | [mobile/screen-tasks-notes.jsx](mobile/screen-tasks-notes.jsx) |
| **Contacts** | Mobile directory with quick call/text actions. | [mobile/screen-contacts.jsx](mobile/screen-contacts.jsx) |
| **Conversations** | Mobile-optimized messaging interface. | [mobile/screen-conversations.jsx](mobile/screen-conversations.jsx) |
| **Settings** | Mobile app settings. | [mobile/screen-settings.jsx](mobile/screen-settings.jsx) |
| **Auth** | Mobile-specific auth screens. | [RC CRM Auth Mobile.html](RC%20CRM%20Auth%20Mobile.html) |

### Bottom Sheets (Modals)
*Most mobile sheets are managed in [mobile/app.jsx](mobile/app.jsx) and use components from [mobile/screen-modals.jsx](mobile/screen-modals.jsx).*
- **FabPicker**: The "+" button menu.
- **New Record Sheets**: Lead, Task, Note, Event, Client, Property, Offer.
- **Convert Lead Sheet**: Transitioning leads to clients.
- **Notifications Sheet**: Full-screen notification list.
- **Note/Task Detail Sheets**: Viewing and editing specific items.
- **Quick Note**: Minimal note entry sheet.
