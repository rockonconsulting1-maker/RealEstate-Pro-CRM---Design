# SECTION 5 — Overall Schema  Architecture Overview
## 5.1 — Multi-Tenancy Hierarchy
The platform is a multi-tenant SaaS system with a strict two-level tenant hierarchy. Every piece of data ultimately belongs to one node in this tree:

┌──────────────────────────────────────────────────────────┐
│                    PLATFORM (SaaS Layer)                  │
│              Shared infrastructure, shared code           │
└──────────────────────────┬───────────────────────────────┘
                           │ 1
                           ▼ M
┌──────────────────────────────────────────────────────────┐
│                  AGENCY  (companyId)                      │
│  Billing owner · Plan management · Snapshot library       │
│  User pool · Rebilling config · White-label domain        │
└──────────────────────────┬───────────────────────────────┘
                           │ 1
                           ▼ M
┌──────────────────────────────────────────────────────────┐
│              SUB-ACCOUNT  (locationId)  ◄── YOU ARE HERE  │
│  All CRM data lives here · Complete operational unit      │
│  Contacts · Pipelines · Calendars · Automations           │
│  Custom Objects · Conversations · Commerce · Reporting    │
└──────────────────────────────────────────────────────────┘
Tenant Isolation Guarantees
| Guarantee | Mechanism |
| --- | --- |
| Data isolation | Every document in every collection carries locationId; all API queries are automatically filtered by the authenticated sub-account's locationId |
| No cross-sub-account reads | Standard API requests cannot read another sub-account's data, even within the same agency |
| No cross-agency reads | Agency-level APIs cannot reach into peer agency data |
| User scoping | A User record references a specific locationId; multi-location users have a separate user record per sub-account (or an agency-level user with location permissions) |
| Custom Object scoping | Object schemas and all records are locationId-scoped — a custom object defined in one sub-account is invisible to all others |

## 5.2 — Database Technology Stack
The platform is built on a polyglot persistence architecture. Different data types are stored in the most appropriate engine:

┌─────────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE LAYER                        │
├─────────────────┬───────────────────────────────────────────────┤
│  MongoDB        │  Primary document store — all CRM records      │
│  (Atlas)        │  Contacts, Opportunities, Conversations,       │
│                 │  Custom Objects, Workflows, Invoices, etc.     │
├─────────────────┼───────────────────────────────────────────────┤
│  Redis          │  Cache layer — sessions, rate-limit counters,  │
│                 │  hot config data, enrollment state,            │
│                 │  conversation unread counts                    │
├─────────────────┼───────────────────────────────────────────────┤
│  Elasticsearch  │  Full-text search index — contact search,      │
│  (or similar)   │  conversation search, record search across     │
│                 │  objects                                       │
├─────────────────┼───────────────────────────────────────────────┤
│  Cloud Storage  │  Media files, form uploads, document           │
│  (GCS / S3)     │  attachments, recording files — CDN-served     │
├─────────────────┼───────────────────────────────────────────────┤
│  Message Queue  │  Async processing — email sends, SMS queues,  │
│  (Pub/Sub)      │  workflow execution, webhook delivery,         │
│                 │  bulk actions, report generation               │
├─────────────────┼───────────────────────────────────────────────┤
│  Time-Series    │  Reporting metrics — dashboard stats,          │
│  / Analytics DB │  funnel analytics, appointment counts,         │
│                 │  revenue aggregations                          │
└─────────────────┴───────────────────────────────────────────────┘
## 5.3 — MongoDB Document Architecture
5.3.1 — Primary Collections
Each major object type maps to a MongoDB collection. All collections share the same isolation pattern: locationId on every document, used as the primary partition key in all queries.

| Collection Name | Primary Object | Partition Key | Approx. Document Size |
| --- | --- | --- | --- |
| contacts | Contact | locationId | Medium (5–50 KB with custom fields) |
| businesses | Company | locationId | Small (2–10 KB) |
| opportunities | Opportunity | locationId | Medium (5–30 KB with denorm) |
| pipelines | Pipeline + Stages | locationId | Small (1–5 KB, stages embedded) |
| tasks | Task | locationId | Small (< 2 KB) |
| notes | Note | locationId | Small–Medium (1–10 KB) |
| appointments | Appointment | locationId | Small (2–5 KB) |
| calendars | Calendar | locationId | Medium (5–20 KB with config) |
| calendarGroups | Calendar Group | locationId | Small |
| conversations | Conversation | locationId | Small (2–5 KB, denorm preview only) |
| messages | Message | locationId | Small–Medium (varies by channel) |
| workflows | Workflow | locationId | Medium–Large (5–200 KB, action/trigger JSON) |
| campaigns | Campaign (Legacy) | locationId | Small–Medium |
| triggerLinks | Trigger Link | locationId | Tiny |
| forms | Form | locationId | Medium (field config JSON) |
| formSubmissions | Form Submission | locationId | Small–Medium |
| surveys | Survey | locationId | Medium |
| surveySubmissions | Survey Submission | locationId | Small–Medium |
| funnels | Funnel | locationId | Small |
| funnelPages | Funnel Page | locationId | Large (page builder content JSON) |
| emailTemplates | Email Template | locationId | Medium–Large (HTML body) |
| socialPosts | Social Post | locationId | Small–Medium |
| products | Product | locationId | Small–Medium |
| productPrices | Product Price | locationId | Small |
| orders | Order | locationId | Medium (line items + snapshots) |
| orderFulfillments | Order Fulfillment | locationId | Small |
| invoices | Invoice | locationId | Medium (line items + snapshots) |
| invoiceSchedules | Invoice Schedule | locationId | Small–Medium |
| coupons | Coupon | locationId | Small |
| membershipOffers | Membership Offer | locationId | Small |
| courses | Course | locationId | Small–Medium |
| courseCategories | Course Category | locationId | Small |
| coursePosts | Course Post / Lesson | locationId | Medium–Large (content JSON) |
| membershipAccess | Membership Access | locationId | Tiny |
| mediaFiles | Media File | locationId | Tiny (metadata only; file in GCS) |
| mediaFolders | Media Folder | locationId | Tiny |
| customFields | Custom Field (schema) | locationId | Small |
| customFieldFolders | Custom Field Folder | locationId | Tiny |
| customValues | Custom Value | locationId | Tiny |
| users | User | locationId | Small–Medium (permissions JSON) |
| reviews | Review | locationId | Small |
| reviewRequests | Review Request | locationId | Tiny |
| documents | Document / Contract | locationId | Medium–Large (content JSON) |
| documentTemplates | Document Template | locationId | Medium–Large |
| snapshots | Snapshot | locationId | Small (metadata; content in GCS) |
| objects | Custom Object Schema | locationId | Small–Medium |
| objectRecords | Custom Object Records | locationId | Small–Medium |
| associations | Association Records | locationId | Tiny |
| tags | Tag Registry (implicit) | locationId | None — tags stored in-document |

5.3.2 — Document Schema Patterns
The platform uses three distinct document schema patterns depending on the object type:

Pattern A — Fixed-Schema Document (Standard Objects: Contact, Opportunity, etc.)
All standard field names are hardcoded on the document. Custom field values are appended as a heterogeneous array.

// contacts collection — Pattern A
{
  "_id":          "6a44a1e75fd80c02ec76b5ef",
  "locationId":   "jHEaG68TeCsXHXPhrVtU",
  "firstName":    "Sarah",
  "lastName":     "Mitchell",
  "email":        "sarah@example.com",
  "emailLowerCase": "sarah@example.com",
  "phone":        "+14035559821",
  "address1":     "42 Wheatland Blvd",
  "city":         "Lethbridge",
  "state":        "AB",
  "country":      "CA",
  "postalCode":   "T1K 2R9",
  "timezone":     "America/Edmonton",
  "type":         "lead",
  "source":       "Google Ads",
  "assignedTo":   "wvGkgfDNGMxsCIm6yT3U",
  "dnd":          false,
  "dndSettings": {
    "SMS":   { "status": "inactive", "message": "", "code": "" },
    "Email": { "status": "inactive", "message": "", "code": "" },
    "Call":  { "status": "inactive", "message": "", "code": "" }
  },
  "tags":         ["buyer", "pre-approved", "lethbridge", "under-500k"],
  "followers":    ["wvGkgfDNGMxsCIm6yT3U"],
  "customFields": [
    { "id": "cf_buyer_budget",    "value": "450000" },
    { "id": "cf_preferred_area",  "value": "north-lethbridge" },
    { "id": "cf_possession_pref", "value": "60_days" }
  ],
  "attributionSource": {
    "utmSource": "google", "utmMedium": "cpc",
    "campaign": "lethbridge-buyers-2026"
  },
  "contactScore": 72,
  "dateAdded":    "2026-05-14T18:30:00.000Z",
  "dateUpdated":  "2026-07-01T05:13:11.000Z"
}
Pattern B — Flexible Properties Map (Custom Object Records)
Custom Object records use a flat properties map keyed by the full fieldKey dot-notation string. This avoids schema migrations when new fields are added — new fields simply appear as new keys on the map.

// objectRecords collection — Pattern B
{
  "_id":        "6a44b169abc123def456",
  "locationId": "jHEaG68TeCsXHXPhrVtU",
  "objectKey":  "custom_objects.real_estate_offer",
  "properties": {
    "custom_objects.real_estate_offer.offer_id":       "OFF-2026-041",
    "custom_objects.real_estate_offer.property_address": "42 Wheatland Blvd, Lethbridge",
    "custom_objects.real_estate_offer.mls_number":     "A2189234",
    "custom_objects.real_estate_offer.purchase_price": "447500",
    "custom_objects.real_estate_offer.deposit_amount": "10000",
    "custom_objects.real_estate_offer.status":         "accepted",
    "custom_objects.real_estate_offer.offer_type":     "buyer_offer",
    "custom_objects.real_estate_offer.financing_type": "cmhc_insured",
    "custom_objects.real_estate_offer.offer_date":     "2026-06-28",
    "custom_objects.real_estate_offer.possession_date":"2026-09-01",
    "custom_objects.real_estate_offer.closing_date":   "2026-09-01",
    "custom_objects.real_estate_offer.conditions_deadline": "2026-07-10",
    "custom_objects.real_estate_offer.conditions":     "Financing, Home Inspection",
    "custom_objects.real_estate_offer.commission_amount": "13425"
  },
  "dateAdded":  "2026-06-28T14:22:00.000Z",
  "dateUpdated": "2026-07-01T05:13:11.000Z"
}
Pattern C — Embedded Sub-Documents (Compound Objects: Pipeline, Order, Invoice)
Some objects embed their child records directly to avoid separate collection reads for the most common access pattern.

// pipelines collection — Pattern C (stages embedded)
{
  "_id":        "pipe_buyer_southern_ab",
  "locationId": "jHEaG68TeCsXHXPhrVtU",
  "name":       "Buyer Pipeline — Southern AB",
  "stages": [
    { "id": "s1", "name": "New Inquiry",        "position": 0 },
    { "id": "s2", "name": "Pre-Approval",        "position": 1 },
    { "id": "s3", "name": "Property Search",     "position": 2 },
    { "id": "s4", "name": "Offer Submitted",     "position": 3 },
    { "id": "s5", "name": "Under Contract",      "position": 4 },
    { "id": "s6", "name": "Conditions Removed",  "position": 5 },
    { "id": "s7", "name": "Closed / Possession", "position": 6 }
  ],
  "dateAdded":  "2026-05-01T00:00:00.000Z",
  "dateUpdated": "2026-07-01T05:13:09.000Z"
}
## 5.4 — Custom Object Schema Architecture
Custom Objects use a two-layer schema — the object definition is stored separately from its records:

┌──────────────────────────────────────────────────────────┐
│  objects collection  (Object Schema Registry)            │
│  ─────────────────────────────────────────────────────   │
│  _id:          "6a44b1692c3079662fdd9736"                │
│  locationId:   "jHEaG68TeCsXHXPhrVtU"                   │
│  key:          "custom_objects.my_listings"              │
│  type:         "USER_DEFINED"                            │
│  labels:       { singular: "Listing", plural: "My Listings" } │
│  requiredProperties:   ["custom_objects.my_listings.mls_number"] │
│  searchableProperties: ["custom_objects.my_listings.mls_number"] │
│  primaryDisplayProperty: "custom_objects.my_listings.mls_number" │
│  uniqueProperties: []                                    │
└─────────────────────────┬────────────────────────────────┘
                          │ 1 schema → M field definitions
                          ▼
┌──────────────────────────────────────────────────────────┐
│  customFields collection  (Field Schema Definitions)     │
│  ─────────────────────────────────────────────────────   │
│  [{ id, fieldKey, name, dataType, options, position,     │
│     objectKey: "custom_objects.my_listings", ... }]      │
└─────────────────────────┬────────────────────────────────┘
                          │ field schema defines shape of ↓
                          ▼
┌──────────────────────────────────────────────────────────┐
│  objectRecords collection  (Actual Data Records)         │
│  ─────────────────────────────────────────────────────   │
│  _id, locationId, objectKey, dateAdded, dateUpdated      │
│  properties: {                                           │
│    "custom_objects.my_listings.mls_number": "A2189234",  │
│    "custom_objects.my_listings.listing_price": "529000", │
│    "custom_objects.my_listings.bedrooms": "4",           │
│    ...                                                   │
│  }                                                       │
└──────────────────────────────────────────────────────────┘
Custom Object Storage Characteristics
| Characteristic | Detail |
| --- | --- |
| Schema flexibility | Adding a new field to an object requires only inserting a new customFields doc — no migration of existing records needed |
| New field on old records | Old records simply lack the new key in properties — treated as null / empty |
| Type enforcement | Enforced at the API/application layer on write, not at the MongoDB document level |
| Unique constraint | Enforced via a partial unique index: {locationId, objectKey, "properties.{fieldKey}"} — only for fields in uniqueProperties[] (e.g. custom_objects.properties.mls) |
| Primary display | primaryDisplayProperty tells the UI which properties key to use as the record title |
| Search | searchableProperties are synced to the search index (Elasticsearch) for full-text lookup |
| Max custom objects | Platform limit: varies by plan; typically 5–20 custom object schemas per sub-account |
| Max fields per object | No hard documented limit; practical limit ~200 fields |

## 5.5 — Index Strategy
5.5.1 — Universal Indexes (all collections)
Every collection carries these indexes as a baseline:

| Index | Fields | Type | Purpose |
| --- | --- | --- | --- |
| Primary | _id | Unique | MongoDB default ObjectId index |
| Tenant Partition | locationId | Single | Filter all queries to sub-account |
| Recency | (locationId, dateAdded) | Compound | Sorted list / recent records queries |
| Update recency | (locationId, dateUpdated) | Compound | Changed-since queries, sync operations |

5.5.2 — Contact-Specific Indexes
| Index | Fields | Type | Purpose |
| --- | --- | --- | --- |
| Email dedup | (locationId, emailLowerCase) | Compound | Prevent duplicate contacts; submission matching |
| Phone lookup | (locationId, phone) | Compound | Inbound call/SMS contact matching |
| Assignment | (locationId, assignedTo) | Compound | "My contacts" filtered views |
| Tag filter | (locationId, tags) | Compound multikey | Tag-based segmentation queries |
| Name search | (locationId, name) | Compound text | Full-text contact name search |
| Score sort | (locationId, contactScore) | Compound | Lead score leaderboard |
| Last activity | (locationId, lastActivity) | Compound | Recently active / inactive filters |
| Business link | (locationId, businessId) | Compound | Fetch all contacts for a company |

5.5.3 — Opportunity-Specific Indexes
| Index | Fields | Type | Purpose |
| --- | --- | --- | --- |
| Pipeline view | (locationId, pipelineId, pipelineStageId) | Compound | Kanban board query |
| Status filter | (locationId, status) | Compound | Won/lost/open reporting |
| Contact link | (locationId, contact.id) | Compound | All opportunities for a contact |
| Assignment | (locationId, assignedTo) | Compound | Rep-specific pipeline views |
| Monetary sort | (locationId, monetaryValue) | Compound | Revenue-sorted pipeline views |

5.5.4 — Conversation & Message Indexes
| Index | Fields | Type | Purpose |
| --- | --- | --- | --- |
| Contact inbox | (locationId, contactId, type) | Compound | Open conversation by contact + channel |
| Inbox sort | (locationId, lastMessageDate) | Compound | Inbox sorted by most recent |
| Unread filter | (locationId, status, unreadCount) | Compound | Unread inbox view |
| Assignment | (locationId, userId) | Compound | Assigned-to-me inbox view |
| Message thread | (conversationId, dateAdded) | Compound | Load message thread in order |

5.5.5 — Custom Object Indexes
| Index | Fields | Type | Purpose |
| --- | --- | --- | --- |
| Object partition | (locationId, objectKey) | Compound | All records for a given object type |
| Primary display | (locationId, objectKey, "properties.{primaryDisplayProperty}") | Compound | Search by primary key (e.g. MLS#) |
| Unique constraint | (locationId, objectKey, "properties.{uniqueFieldKey}") | Unique partial | Enforce unique fields (e.g. mls on Properties) |
| Searchable fields | Synced to Elasticsearch | Search index | Full-text search across searchableProperties |

5.5.6 — Association Indexes
| Index | Fields | Type | Purpose |
| --- | --- | --- | --- |
| From-object lookup | (locationId, fromObjectKey, fromRecordId) | Compound | All associations FROM a given record |
| To-object lookup | (locationId, toObjectKey, toRecordId) | Compound | All associations TO a given record |
| Relation type filter | (locationId, fromObjectKey, toObjectKey) | Compound | All links between two object types |

## 5.6 — Sub-Account Data Isolation Model (Deep Dive)
┌──────────────────────────────────────────────────────────────┐
│                  MONGODB CLUSTER                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               contacts  collection                      │  │
│  │  { _id, locationId: "AAA", email: ... }  ← Sub-Acct A  │  │
│  │  { _id, locationId: "BBB", email: ... }  ← Sub-Acct B  │  │
│  │  { _id, locationId: "CCC", email: ... }  ← Sub-Acct C  │  │
│  │  { _id, locationId: "jHE", email: ... }  ← YOUR ACCT   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  All sub-accounts share the SAME physical collection.        │
│  Isolation is enforced by:                                   │
│  1. `locationId` on every document                          │
│  2. API middleware that injects `locationId` into every      │
│     query automatically from the authenticated token         │
│  3. No raw database access is exposed to sub-account users   │
└──────────────────────────────────────────────────────────────┘
Isolation Enforcement Points
| Layer | Mechanism | What It Prevents |
| --- | --- | --- |
| Authentication | OAuth 2.0 / API key scoped to locationId | Unauthenticated access |
| API Middleware | Auto-injects { locationId } filter into every query | Cross-sub-account data reads |
| Application layer | Business logic validates locationId on all write operations | Writing to another sub-account's records |
| Custom Object API | All requests require locationId as a query parameter | Schema and record cross-contamination |
| Search index | Elasticsearch documents are indexed with locationId; searches are always scoped | Cross-sub-account search results |
| Webhook delivery | Webhook payloads are generated per sub-account event; no cross-account fan-out | Accidental data exposure via webhooks |

## 5.7 — Event-Driven Architecture
The platform processes most operations asynchronously through an event and message queue system. This is critical for understanding data freshness and eventual consistency:

USER ACTION  ──►  API  ──►  MongoDB (write)
                    │
                    └──►  Event published to Message Queue
                                    │
                    ┌───────────────┼──────────────────┐
| ▼ | ▼ | ▼ |
| --- | --- | --- |
| Workflow Engine | SMS/Email Sender | Webhook Dispatcher |
| (evaluate trigger | (carrier API, | (POST to configured |
| conditions, run | email provider) | endpoint URLs) |

              action steps)
                    │
                    ▼
             Database (further writes: tag added, field updated, etc.)
                    │
                    ▼
             Search Index Sync (Elasticsearch reindex)
Eventual Consistency Points
| Operation | Consistency Model | Typical Lag |
| --- | --- | --- |
| Contact create → Workflow trigger fires | Eventual (queue-based) | < 5 seconds |
| Tag added → Smart List membership updates | Eventual | < 30 seconds |
| Form submitted → Contact created → Conversation started | Eventual | < 10 seconds |
| Search index sync after record update | Eventual | 1–60 seconds |
| Conversation unreadCount update | Near real-time (Redis counter) | < 1 second |
| Bulk action on 10,000 contacts | Eventual (batched queue) | Minutes |
| Reporting dashboard metrics | Near real-time to delayed (materialized views) | 5 min – 24 hr |

## 5.8 — API Layer Architecture
┌────────────────────────────────────────────────────────────┐
│                      API GATEWAY                           │
│  Rate limiting · Auth validation · Request routing         │
└───────────────────────────┬────────────────────────────────┘
                            │
          ┌─────────────────┼──────────────────┐
| ▼ | ▼ | ▼ |
| --- | --- | --- |

   ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐
   │  Public API  │  │ Internal API │  │  Webhook Engine  │
   │  (v1, v2)   │  │ (reporting,  │  │  (outbound HTTP  │
   │  REST/JSON   │  │  automation) │  │   POST to URL)   │
   └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘
          │                │                   │
          └────────────────┼───────────────────┘
                           ▼
               ┌───────────────────────┐
               │   Service Microservices│
               │  contacts · opps ·    │
               │  conversations ·      │
               │  calendars · billing  │
               │  custom-objects ·     │
               │  workflows · etc.     │
               └───────────┬───────────┘
                           │
               ┌───────────┴───────────┐
| ▼ | ▼ |
| --- | --- |
| MongoDB (Atlas) | Redis Cache |

API Versioning
| Version | Status | Notes |
| --- | --- | --- |
| v1 | Active (legacy) | Original REST endpoints; some fields missing vs v2 |
| v2 | Active (current) | Full field coverage including dndSettings, additionalEmails, attribution, custom objects |
| v3 (emerging) | Partial | Objects / Associations API — new endpoint namespace |

Rate Limiting (per sub-account)
| API Tier | Limit | Window |
| --- | --- | --- |
| Standard reads | 100 req/s | Per sub-account |
| Standard writes | 40 req/s | Per sub-account |
| Bulk operations | 10 req/s | Per sub-account |
| Search queries | 50 req/s | Per sub-account |
| Webhooks (inbound) | No enforced limit (platform-side) | — |

## 5.9 — Custom Field Value Storage — Full Internal Flow
WRITE FLOW (setting a custom field on a contact)

User sets "Buyer Budget" = $450,000 via UI or API
          │
          ▼
API receives: PATCH /contacts/{id}
  body: { customFields: [{ id: "cf_buyer_budget", value: "450000" }] }
          │
          ▼
Application layer:
  1. Validates `cf_buyer_budget` exists in `customFields` collection
     for `objectKey = "contact"` and this `locationId`
  2. Validates value matches `dataType = MONETORY` (numeric string)
  3. Validates no unique constraint violation
          │
          ▼
MongoDB upsert into contacts document:
  { $set: { "customFields.$[elem].value": "450000" },
    arrayFilters: [{ "elem.id": "cf_buyer_budget" }] }
  OR
  { $push: { customFields: { id: "cf_buyer_budget", value: "450000" } } }
  (if field not yet present on this contact)
          │
          ▼
Search index sync → "cf_buyer_budget" value indexed if field is searchable
          │
          ▼
Event published → Workflow engine evaluates triggers
  e.g. "Custom Field Changed: Buyer Budget > 400000 → Add tag 'over-400k'"
## 5.10 — Data Retention & Archival
| Data Category | Retention Policy | Notes |
| --- | --- | --- |
| Contact records | Indefinite (until deleted) | Manual deletion or bulk purge |
| Conversation messages | Indefinite | No automatic purge |
| Call recordings | Plan-dependent (typically 30–90 days hosted) | URLs may expire; download recommended |
| Form submissions | Indefinite | Stored until sub-account deleted |
| Workflow execution logs | Typically 30–90 days | Not permanently retained |
| Reporting data (raw events) | Varies by metric type | Aggregated views retained longer |
| Media files (GCS/S3) | Indefinite (while sub-account active) | Billed by storage used |
| Snapshot packages | Per expiresAt on the record | permanent snapshots do not expire |
| Invoice / Order records | Indefinite | Financial records — not auto-deleted |
| Custom Object records | Indefinite | Deleted manually or via API |
| Association records | Indefinite (orphan risk on parent delete) | Must be manually cleaned if parent deleted |

## 5.11 — Sub-Account Schema Summary Diagram
| SUB-ACCOUNT | (locationId: jHEaG68TeCsXHXPhrVtU) |
| --- | --- |

│
├── PEOPLE & CRM
│   ├── contacts[]              (Pattern A — fixed schema + customFields[])
│   ├── businesses[]            (Pattern A — fixed schema + customFields[])
│   └── opportunities[]         (Pattern A — fixed schema + denorm contact data)
│
├── PIPELINES
│   └── pipelines[]             (Pattern C — stages[] embedded)
│
├── ACTIVITIES
│   ├── tasks[]
│   ├── notes[]
│   ├── appointments[]
│   └── blockSlots[]
│
├── CALENDARS
│   ├── calendars[]             (Pattern A — openHours{} embedded config)
│   └── calendarGroups[]
│
├── COMMUNICATIONS
│   ├── conversations[]         (Pattern A — denorm contact preview)
│   └── messages[]              (Pattern A — meta{} varies by channel)
│
├── AUTOMATION
│   ├── workflows[]             (Pattern C — triggers[], actions[] embedded)
│   ├── campaigns[]
│   └── triggerLinks[]
│
├── LEAD CAPTURE
│   ├── forms[]                 (Pattern C — fields[] embedded)
│   ├── formSubmissions[]       (Pattern B — data{} map)
│   ├── surveys[]               (Pattern C — pages[] embedded)
│   └── surveySubmissions[]     (Pattern B — answers{} map)
│
├── MARKETING
│   ├── emailTemplates[]        (Large — HTML body)
│   └── socialPosts[]
│
├── SITES & PAGES
│   ├── funnels[]
│   ├── funnelPages[]           (Large — content{} page builder tree)
│   ├── websites[]
│   ├── blogSites[]
│   ├── blogPosts[]
│   └── redirects[]
│
├── COMMERCE
│   ├── products[]
│   ├── productPrices[]
│   ├── orders[]                (Pattern C — items[], snapshots embedded)
│   ├── orderFulfillments[]
│   ├── invoices[]              (Pattern C — items[], snapshots embedded)
│   ├── invoiceSchedules[]
│   ├── coupons[]
│   └── paymentProviders[]      (Secrets handled by provider; keys masked)
│
├── MEMBERSHIPS & COURSES
│   ├── membershipOffers[]
│   ├── courses[]
│   ├── courseCategories[]
│   ├── coursePosts[]
│   └── membershipAccess[]
│
├── MEDIA
│   ├── mediaFiles[]            (Metadata only; binary in GCS)
│   └── mediaFolders[]          (Self-referential parentId)
│
├── CUSTOM OBJECT SYSTEM
│   ├── objects[]               (Schema registry — 7 objects in this account)
│   ├── customFields[]          (Field definitions for all objects)
│   ├── customFieldFolders[]    (UI grouping)
│   └── objectRecords[]         (Pattern B — properties{} flat map)
│       ├── [objectKey: custom_objects.real_estate_offer]
│       ├── [objectKey: custom_objects.properties]
│       ├── [objectKey: custom_objects.my_listings]
│       └── [objectKey: custom_objects.transactions]
│
├── ASSOCIATIONS
│   └── associations[]          (from/to object + record + relation type)
│
├── CONFIGURATION
│   ├── customValues[]          (Global merge tag registry)
│   ├── users[]
│   └── snapshots[]
│
└── REPUTATION & DOCUMENTS
    ├── reviews[]
    ├── reviewRequests[]
    ├── documents[]             (Pattern C — content{}, signers[] embedded)
    └── documentTemplates[]
