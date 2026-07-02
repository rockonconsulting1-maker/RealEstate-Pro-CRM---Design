# RC CRM — Frontend Design Breakdown

Detailed inventory of screens, pages, and components for both Desktop and Mobile surfaces of the RC CRM.

---

## 1. Global Shell Components

### 1.1 Desktop Shell (`desktop/shell.jsx`)
- **Sidebar**: Primary navigation grouped by Dashboard, Pipeline (Leads, Clients, Contacts), Listings (My Listings, Offers, MLS), Communicate (Conversations), Manage (Calendar, Tasks, Notes, Documents), and Insights. Includes an agent profile switcher in the footer.
- **Topbar**: Breadcrumbs, Global Command Search (`⌘K`), Saved Views toggle, Notification bell (with dot badge), and "New" Quick Add button.
- **Global Search (`SearchDropdown`)**: Dropdown UI for search results categorized by Lead, Client, Property, and Offer. Shows Recent searches and "Jump to" shortcuts when empty.

### 1.2 Mobile Shell (`mobile/app.jsx`)
- **TopBar**: Screen title, Notification bell, and Agent avatar (link to Settings). Includes inline search/filter triggers for list screens.
- **TabBar**: 6-column blurred bottom navigation: Dash, Leads, Clients, Contacts, Calendar, Tasks.
- **FAB (Floating Action Button)**: "Plus" button for Quick Add, parked above the tab bar.
- **Action Bar**: Contextual sticky footer for detail screens (e.g., Client/Prop Detail) with actions like Call, Text, Note, Appt, or Share.
- **Search Screen**: Full-screen modal with input, recent searches, and browse categories.

---

## 2. Desktop Screens

### 2.1 Dashboard (`desktop/dashboard.jsx`)
- **KPI Grid**: 4 cards showing Active Leads, Active Deals, Pipeline value, and Closed MTD with trend deltas and sparklines.
- **Next Appointment Hero**: Split card. Left: "Next up" details (Time, Type, Address, Contact, Drive time). Right: Map placeholder with pins.
- **Attention List**: Row-based cues for Overdue tasks, New leads, and Expiring offers.
- **Pipeline Funnel**: Vertical bar chart of leads/clients at each stage.
- **Pending Offers**: Mini-list of active offers with Address, Price, and Expiry countdown.
- **New Leads Table**: Leads from the last 48h (Name, Role, Stage, Budget, Temp, Age).
- **Activity Timeline**: Unified history with day separators and type-coded pips (Note, Call, Stage move).

### 2.2 Leads (`desktop/leads.jsx`)
- **View Switcher**: Toggle between List and Board (Kanban).
- **List View (Master-Detail)**:
  - **Left Pane**: Search/Filters + scrollable list (Name, Stage, Budget, Temp badge, Age).
  - **Right Pane**: Tabbed Detail view (Buyer/Seller Info, Properties, Appts, Tasks, Notes, Conversations, Activity, Files).
- **Board View (Kanban)**: 6 lanes (New, Contacted, Engaged, Nurturing, Appt Set, Signed). Cards show Name, Role, Tag, Value, and Age.

### 2.3 Clients (`desktop/screens.jsx` / `desktop/screens2.jsx`)
- **Pipeline Toggle**: Switch between Buyer and Seller pipelines.
- **Kanban View**: Stage-based lanes (Needs Analysis to Closed for Buyers; Pre-listing to Closed for Sellers).
- **List View**: Flat table or Grouped by Stage. Fields: Client, Stage, Tag, DOM, Value.

### 2.4 My Listings (`desktop/screens.jsx`)
- **Inventory Table**: List of active property records. Fields: Photo, Address, Stage, Price, Beds/Baths, Sqft, DOM. Supports "Group by Stage" view.

### 2.5 MLS Properties (`desktop/mls.jsx`)
- **Search UI**: Location/MLS# input + Filters for Beds, Baths, Type, and Max Price.
- **Results Table**: Photo, Address, MLS#, Type, Price, Beds/Baths, Sqft, DOM, Status badge.

### 2.6 Offers (`desktop/screens.jsx`)
- **Status Stats**: Count and sum for Submitted, Countered, Accepted, and Expired.
- **Offers Table**: Property, Client, Side (Buyer/Seller), Status, Price, Deposit, Expiry.

### 2.7 Calendar (`desktop/screens.jsx` / `desktop/screens2.jsx`)
- **Views**: Agenda, Day, Week (8-col grid), Month.
- **Event Detail Popover**: Details of appointment with Quick Actions.

### 2.8 Communications (`desktop/conversations.jsx`)
- **Inbox**: Split view. Left: Thread list with channel indicators (SMS, Email, WhatsApp). Right: Active thread with message bubbles and a multi-channel composer.

---

## 3. Mobile Screens

### 3.1 Dashboard (`mobile/screen-dashboard.jsx`)
- **Now Ribbon**: Top card for immediate next event with drive-time alert.
- **Stats Carousel**: Horizontal scroll of KPI cards.
- **Needs Attention**: Collapsed card rows for urgent items.
- **New Leads / Pending Offers**: Card-based lists optimized for vertical scroll.

### 3.2 Leads (`mobile/screen-leads.jsx`)
- **List View**: Cards with swipe actions (Done, Delete). Shows Avatar, Role, Stage, Budget, Temp.
- **Kanban View**: Vertical stack of collapsible lanes.

### 3.3 Client/Lead Detail (`mobile/screen-client-detail.jsx` etc.)
- **Header**: Avatar, Role chip, DOM, Last Contact.
- **Progress**: Visual step indicator or progress bar for pipeline stage.
- **Metrics**: 2x2 grid of key fields (Budget, Pre-approval, etc.).
- **Tabs**: Horizontally scrollable tab bar for sub-sections.
- **Role Variants**: Specific layouts for Buyer, Seller, Both (Combined), and Vendor.

### 3.4 Properties & Offers (`mobile/screen-props-offers.jsx`)
- **Property Detail**: Swipeable photo gallery hero. Tabs for Overview, Contacts, Offers, Appts, etc.
- **Offer Detail**: Large Price display + Expiry countdown header. Contextual Action Bar for "Amend", "Counter", or "Accept".

### 3.5 Calendar (`mobile/screen-calendar-full.jsx`)
- **Agenda View**: List of events with "Drive Time" callouts between consecutive appointments.
- **Day/Week/Month**: Responsive grids with tap-to-view event detail.

---

## 4. Modals & Forms

### 4.1 Creation Modals (`desktop/modals.jsx` / `mobile/screen-modals.jsx`)
- **Quick Add / Fab Picker**: Grid of icons to start any new record flow.
- **Common Data Fields**:
  - **Lead**: Full Name, Role (Buyer/Seller/Investor), Phone, Email, Target Area/Budget, Source, Temperature, Notes.
  - **Client**: Full Name, Type, Stage, Phone, Email, Budget/Address.
  - **Property**: Address, City, List Price, Beds, Baths, Sqft, Type, Stage, Seller Client, MLS#.
  - **Offer**: Side (Buyer/Seller), Property link, Client link, Offer Price, Deposit, Closing Date, Irrevocable Time, Conditions, Status.
  - **Task**: Text, Due Date/Time, Client/Property link, Priority.
  - **Note**: Body, Client/Lead link, Tags.
  - **Event**: Type (Showing, Consult, etc.), Title, Date, Time, Duration, Client/Property link.

### 4.2 Record Operations
- **Convert Lead**: Modal to select Client Type (Buyer/Seller) and Starting Stage. Transfers all history to the new Client profile.
- **Notifications**:
  - **Desktop**: Floating popover from the topbar.
  - **Mobile**: Bottom sheet with "Mark all read" and list of unread events.
