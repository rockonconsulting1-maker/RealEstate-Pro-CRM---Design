# RC CRM — Mock Data & Relationships

Comprehensive inventory of all mock data entities, their schemas, and the relationships between them.

---

## 1. Core Data Entities (`mobile/data.jsx`)

The primary source of truth for the application's state, shared across both Desktop and Mobile prototypes.

### 1.1 Leads
- **Schema**: `{ id, name, role (buyer/seller), stage, color, budget, temp (Hot/Warm/Cold), ago }`
- **Mock Records**:
  - `Sarah Okonkwo`: Buyer lead · New Lead · $900k–1.1M · Warm
  - `Derrick Bailey`: Buyer lead · Contacted · $1.4–1.7M · Hot
  - `Aya Fujimori`: Seller lead · Pre-Listing · Bloor West · Warm
- **Relationships**:
  - Leads are the source for **Clients** via the "Convert Lead" flow.

### 1.2 Clients
- **Schema**: `{ name, role, tag, dom (Days on Market), value }` (Organized into `clientLanes`)
- **Mock Records**:
  - `Marcus & Priya Chen`: Buyer · Offer submitted · 31 DOM · $1.245M
  - `Tran Household`: Buyer · Under contract · 45 DOM · $1.58M
  - `James & Kira Morton`: Both (Buyer + Seller) · Simultaneous transaction (Specialized in `screens4.jsx`).
- **Relationships**:
  - Linked to **Properties** (Buying/Selling).
  - Linked to **Offers** (Buyer-side/Seller-side).
  - Linked to **Conversations** (Thread participants).

### 1.3 Properties
- **Schema**: `{ id, addr, city, beds, baths, sqft, price, stage, color, dom }`
- **Mock Records**:
  - `128 Balsam Ave`: Active on Market · $1,295,000 · 4 bd · 3 ba
  - `42 Sorauren Ave #3`: Offer Review · $879,000 · 2 bd · 2 ba
  - `77 Wellesley St E`: Under Contract · $1,580,000 · 3 bd · 2 ba

### 1.4 Offers
- **Schema**: `{ id, addr, client, price, deposit, status, expMin (Expiry Minutes), side (buyer/seller) }`
- **Mock Records**:
  - `of1`: 128 Balsam Ave · Chen · $1,245,000 · Submitted · 340m exp.
  - `of2`: 42 Sorauren Ave #3 · Okonkwo · $879,000 · Countered · 3m exp.
- **Relationships**:
  - **Foreign Key**: `addr` matches `Property.addr`.
  - **Foreign Key**: `client` matches `Client.name` (partial/last name matches).

### 1.5 Calendar & Appointments
- **Schema**: `{ t (Time), end, title, who, kind (showing/consult/inspect/call/offer), drive (Drive time), tight (bool) }`
- **Relationships**:
  - `who` links to **Client.name** or **Lead.name**.
  - `title` often contains the **Property.addr**.

### 1.6 Tasks
- **Schema**: `{ id, text, when, tone (danger/warn/ok), contact }`
- **Relationships**:
  - `contact` links to **Client.name** or **Lead.name**.

---

## 2. Extended & Local Mock Data

### 2.1 Conversations (`mobile/screen-conversations.jsx` / `desktop/conversations.jsx`)
- **Schema**: `{ id, name, type (Lead/Client/Contact), channel (Phone/Email/SMS/Messenger), time, unread, thread: [{ dir (in/out), time, body }] }`
- **Mock Records**:
  - `Sarah Okonkwo`: Lead · Email · "Pre-approval update"
  - `Marcus & Priya Chen`: Client · Group SMS · "Saturday showing"
- **Relationships**:
  - Linked to **Leads** or **Clients** by name.

### 2.2 Contacts Directory (`mobile/screen-contacts.jsx` / `desktop/contacts.jsx`)
- **Schema**: `{ name, role (buyer/seller/lead/vendor/partner), sub, phone, email, source, tags }`
- **Mock Records**:
  - `Baraka Waweru`: Vendor · Inspector · preferred
  - `Kwame Boateng`: Partner · Mortgage broker · Scotia
- **Relationships**:
  - Vendors and Partners are distinct from the Pipeline (Leads/Clients).

### 2.3 MLS Database (`desktop/mls.jsx`)
- **Schema**: `{ id, addr, city, mls, price, beds, baths, sqft, type, dom, status }`
- **Mock Records**:
  - 24 results for Toronto Region listings (Detached, Semi-detached, Condo).
- **Relationships**:
  - External properties that can be added to a client's "Toured" or "Suggested" list.

---

## 3. Relationship Matrix

| Entity | Primary Relationship | Secondary Relationship |
| :--- | :--- | :--- |
| **Lead** | -> **Client** (Convert) | -> **Tasks** (by Contact) |
| **Client** | -> **Offer** (Buyer/Seller) | -> **Property** (Address match) |
| **Property** | -> **Offer** (Subject) | -> **Calendar** (Showing address) |
| **Offer** | -> **Client** (Participant) | -> **Property** (Subject) |
| **Task** | -> **Client/Lead** (Assigned to) | -> **Property** (Optional context) |
| **Conversation** | -> **Client/Lead/Contact** | |
| **Calendar** | -> **Client/Lead** (Who) | -> **Property** (Where) |
