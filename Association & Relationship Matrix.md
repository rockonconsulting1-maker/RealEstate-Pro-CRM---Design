# Real Estate Pro CRM — Association & Relationship Matrix (v3)
## Conversations · Appointments · Tasks · Notes · Documents
## × Contacts · Opportunities · Custom Objects · Each Other

> **Sub-Account:** Real Estate Pro CRM - Dev | `locationId: jHEaG68TeCsXHXPhrVtU`  
> **v3 Updated:** 2026-07-02 — CRITICAL: Tasks confirmed as full object type (`key: task`) with 7 SYSTEM_DEFINED associations via `GET /associations/objectKey/task?includeInternalAssociations=true`. Previous v2 "UI panel only, not in API" was incorrect.

---

## ⚠️ v3 Critical Correction

| v2 (Incorrect) | v3 (Confirmed from network capture) |
|---|---|
| Task associations are a UI-only panel, not in the API | Tasks are a full object type (`key: task`). Their associations ARE in the Associations API — as SYSTEM_DEFINED internal associations |
| `GET /associations/relations/{taskId}` returns 0 because tasks don’t support API associations | Returns 0 because the tasks had ZERO relation records set up — the association schema exists and is fully queryable |
| Task associations not visible in standard `GET /associations/` | CORRECT — standard endpoint omits internal system associations. Must use `GET /associations/objectKey/task?includeInternalAssociations=true` |

---

## Table of Contents
1. [Legend & Notation](#1-legend--notation)
2. [Linking Mechanisms — Four Systems](#2-linking-mechanisms--four-systems)
3. [Master Capability Matrix (v3)](#3-master-capability-matrix-v3)
4. [Conversations — Association Detail](#4-conversations--association-detail)
5. [Appointments — Association Detail](#5-appointments--association-detail)
6. [Tasks — Association Detail (v3 Corrected)](#6-tasks--association-detail-v3-corrected)
7. [Notes — Association Detail](#7-notes--association-detail)
8. [Documents — Association Detail](#8-documents--association-detail)
9. [Associations API — Full Definitions](#9-associations-api--full-definitions)
10. [Task Association Schema — Complete Reference](#10-task-association-schema--complete-reference)
11. [How to Create a Relation](#11-how-to-create-a-relation)
12. [How to Fetch Related Records](#12-how-to-fetch-related-records)
13. [Integrity Rules & Gotchas (v3)](#13-integrity-rules--gotchas-v3)
14. [Quick-Reference Association ID Lookup](#14-quick-reference-association-id-lookup)
15. [Full Entity Graph (v3)](#15-full-entity-graph-v3)

---

## 1. Legend & Notation

| Symbol | Meaning |
|---|---|
| ✅ **Direct FK** | Hard foreign key stored on the record (`contactId`, `calendarId`) |
| 🔗 **Assoc API (USER)** | USER_DEFINED relation via `POST /associations/relations` |
| 🔐 **Assoc API (SYSTEM)** | SYSTEM_DEFINED relation via `POST /associations/relations` using a system association ID |
| 📝 **Note relations[]** | Link via `relations[]` array on the Note document (confirmed live) |
| 👁️ **Contextual** | No direct link; surfaces in UI because both share a common parent |
| 🔧 **Workaround** | Indirect approach (`documents_ref` field, shared Contact) |
| ❌ **Not Supported** | No mechanism |

---

## 2. Linking Mechanisms — Four Systems

### System 1 — Hard Foreign Key (FK)
```
A field on one record stores the id of another record.
Examples:
  note.contactId        = "{contactId}"   [required]
  appointment.contactId = "{contactId}"   [required]
  task.contactId        = "{contactId}"   [OPTIONAL — standalone tasks supported]
Objects: Contact ← Notes, Appointments, Conversations, Documents, Tasks
```

### System 2 — Associations API: USER_DEFINED
```
Explicitly created relation records for custom associations.
Endpoint: POST /associations/relations
Visible in: GET /associations/?locationId={id}  (returns all USER_DEFINED)
Supports:
  Contact ↔ Contact
  Contact ↔ Custom Object (Offers, Properties, My Listings, Transactions)
  Custom Object ↔ Custom Object
  Opportunity ↔ Custom Object
  Opportunity ↔ Contact (system-defined but treated as standard)
  Business ↔ Contact (system-defined but treated as standard)
```

### System 3 — Associations API: SYSTEM_DEFINED Internal (Task Associations)
```
System-defined internal associations for the Task object.
NOT returned by GET /associations/ (standard endpoint).
Must query via: GET /associations/objectKey/task?includeInternalAssociations=true
Task object queryable via: POST /objects/task/records/search

All 7 task associations are SYSTEM_DEFINED with firstObjectKey: "task":
  TASK_CONTACT_ASSOCIATION
  TASK_OPPORTUNITY_ASSOCIATION
  TASK_BUSINESS_ASSOCIATION
  TASK_CUSTOM_OBJECTS.REAL_ESTATE_OFFER_ASSOCIATION
  TASK_CUSTOM_OBJECTS.PROPERTIES_ASSOCIATION
  TASK_CUSTOM_OBJECTS.MY_LISTINGS_ASSOCIATION
  TASK_CUSTOM_OBJECTS.TRANSACTIONS_ASSOCIATION

Creating a relation: POST /associations/relations
{ "associationId": "TASK_OPPORTUNITY_ASSOCIATION",
  "firstRecordId": "{taskId}",
  "secondRecordId": "{opportunityId}",
  "locationId": "..." }
```

### System 4 — Note `relations[]` Array
```json
// Stored directly on the Note document
{
  "id": "RvbtpxzbMGRuUuT2joAG",
  "contactId": "D2RJ1AcIqOHbbnTmsS2S",
  "relations": [
    { "objectKey": "contact",                          "recordId": "D2RJ1AcIqOHbbnTmsS2S" },
    { "objectKey": "opportunity",                      "recordId": "Ubqrcu63CqVuxGUFOh4X" },
    { "objectKey": "custom_objects.real_estate_offer", "recordId": "6a46af451e833951ef82d2af" },
    { "objectKey": "custom_objects.properties",        "recordId": "6a46aef1bd3802c746051fd8" },
    { "objectKey": "custom_objects.my_listings",       "recordId": "6a46aec7b91e5cfe535b4ba9" },
    { "objectKey": "custom_objects.transactions",      "recordId": "6a46af67da201e837a673d4e" }
  ]
}
// A single note simultaneously links to Contact + Opp + any Custom Objects
```

---

## 3. Master Capability Matrix (v3)

> Reads: “Can [Row] be directly associated to [Column]?”

| | Contact | Opportunity | My Listings | Properties MLS | Offer | Transaction | Company | Appointment | Task | Note | Document |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Conversation** | ✅ FK | 👁️ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Appointment** | ✅ FK (req) | 👁️ | ❌ | ❌ | ❌ | ❌ | ❌ | — | ❌ | ✅ Appt Notes | ❌ |
| **Task** | 🔐 SYSTEM (opt FK) | 🔐 SYSTEM | 🔐 SYSTEM | 🔐 SYSTEM | 🔐 SYSTEM | 🔐 SYSTEM | 🔐 SYSTEM | ❌ | — | ❌ | ❌ |
| **Note** | ✅ FK (req) + 📝 | 📝 relations[] | 📝 relations[] | 📝 relations[] | 📝 relations[] | 📝 relations[] | ❌ | ✅ Appt Notes | ❌ | — | ❌ |
| **Document** | ✅ FK (req) | 👁️ Workflow | 🔧 doc_ref | 🔧 doc_ref | 🔧 doc_ref | 🔧 doc_ref | ❌ | ❌ | ❌ | ❌ | — |
| **Contact** | — | 🔗 System Assoc | 🔗 USER | 🔗 USER | 🔗 USER | 🔗 USER | 🔐 System | ✅ FK | 🔐 SYSTEM | ✅ FK (req) | ✅ FK |
| **Opportunity** | 🔗 System Assoc | — | 🔗 USER | 🔗 USER | 🔗 USER | 🔗 USER | ❌ | 👁️ | 🔐 SYSTEM | 📝 relations[] | 👁️ |
| **My Listings** | 🔗 USER | 🔗 USER | — | 🔗 USER | 🔗 USER | 🔗 USER | ❌ | ❌ | 🔐 SYSTEM | 📝 relations[] | 🔧 doc_ref |
| **Properties MLS** | 🔗 USER | 🔗 USER | 🔗 USER | — | 🔗 USER | 🔗 USER | ❌ | ❌ | 🔐 SYSTEM | 📝 relations[] | 🔧 doc_ref |
| **Offer** | 🔗 USER | 🔗 USER | 🔗 USER | 🔗 USER | — | 🔗 USER | ❌ | ❌ | 🔐 SYSTEM | 📝 relations[] | 🔧 doc_ref |
| **Transaction** | 🔗 USER | 🔗 USER | 🔗 USER | 🔗 USER | 🔗 USER | — | ❌ | ❌ | 🔐 SYSTEM | 📝 relations[] | 🔧 doc_ref |
| **Company** | 🔐 System | ❌ | ❌ | ❌ | ❌ | ❌ | — | ❌ | 🔐 SYSTEM | ❌ | ❌ |

---

## 4. Conversations — Association Detail

| Links To | Mechanism | Required | Notes |
|---|---|---|---|
| Contact | Hard FK (`contactId`) | Yes | 1 per contact per channel |
| User | Hard FK (`userId`) | No | Assigned agent |

**Cannot be linked to:** Custom Objects, Opportunities, Tasks, Notes, Documents, Appointments.

**Contextual:** Surfaces in Opportunity view via the linked Contact's conversations tab.

```
GET  /conversations/{id}
POST /conversations/
POST /conversations/messages    # Send
GET  /conversations/{id}/messages
POST /conversations/search
```

---

## 5. Appointments — Association Detail

| Links To | Mechanism | Required |
|---|---|---|
| Contact | Hard FK (`contactId`) | Yes |
| Calendar | Hard FK (`calendarId`) | Yes |
| User | Hard FK (`assignedUserId`) | No |
| Calendar Group | Hard FK (`groupId`) | No |

**Notes on Appointments:** Appointment-scoped notes via `/calendars/events/appointments/{id}/notes`.  
**Surfaces in:** Opportunity view (via Contact FK).  
**Cannot link to:** Custom Objects directly, Tasks, Documents, Conversations, other Appointments.

```
POST /calendars/events/appointments
GET  /calendars/events/appointments/{id}
PUT  /calendars/events/appointments/{id}
DEL  /calendars/events/{id}
GET  /contacts/{contactId}/appointments
# Appointment Notes:
GET/POST /calendars/events/appointments/{id}/notes
PUT/DEL  /calendars/events/appointments/{id}/notes/{noteId}
```

---

## 6. Tasks — Association Detail (v3 Corrected)

### Task as a Full Object Type
- **Object key:** `task`
- **Searchable via:** `POST /objects/task/records/search`
- **Legacy per-contact:** `GET/POST /contacts/{contactId}/tasks[/{taskId}]`
- **contactId:** Optional — standalone tasks (no contact) are supported

### Task Associations — 7 SYSTEM_DEFINED (confirmed)

All queried via: `GET /associations/objectKey/task?locationId={id}&includeInternalAssociations=true`

| Association ID | Second Object | Cardinality | Max per Task | Max per Object |
|---|---|---|---|---|
| `TASK_CONTACT_ASSOCIATION` | `contact` | M:M | 10 | 1,000 |
| `TASK_OPPORTUNITY_ASSOCIATION` | `opportunity` | M:M | 10 | 25 |
| `TASK_BUSINESS_ASSOCIATION` | `business` | M:M | 10 | 10,000 |
| `TASK_CUSTOM_OBJECTS.REAL_ESTATE_OFFER_ASSOCIATION` | `custom_objects.real_estate_offer` | M:M | 10 | 1,000 |
| `TASK_CUSTOM_OBJECTS.PROPERTIES_ASSOCIATION` | `custom_objects.properties` | M:M | 10 | 1,000 |
| `TASK_CUSTOM_OBJECTS.MY_LISTINGS_ASSOCIATION` | `custom_objects.my_listings` | M:M | 10 | 1,000 |
| `TASK_CUSTOM_OBJECTS.TRANSACTIONS_ASSOCIATION` | `custom_objects.transactions` | M:M | 10 | 1,000 |

> ⚠️ The UI "Associated Objects" count display (e.g. `0/10`) directly maps to `firstObjectToSecondObjectMaxLimit: 10` on each association.

### Creating Task Relations

Use the standard `POST /associations/relations` endpoint with the task's SYSTEM_DEFINED association IDs:

```json
POST /associations/relations
{
  "locationId": "jHEaG68TeCsXHXPhrVtU",
  "associationId": "TASK_OPPORTUNITY_ASSOCIATION",
  "firstRecordId": "{taskId}",
  "secondRecordId": "{opportunityId}"
}
```

```json
POST /associations/relations
{
  "locationId": "jHEaG68TeCsXHXPhrVtU",
  "associationId": "TASK_CUSTOM_OBJECTS.REAL_ESTATE_OFFER_ASSOCIATION",
  "firstRecordId": "{taskId}",
  "secondRecordId": "{offerRecordId}"
}
```

### Fetching Task Relations

```
# Get all relations for a task
GET /associations/relations/{taskId}?locationId={id}&skip=0&limit=100

# Search tasks with their top relations
POST /objects/task/records/search
{ "locationId": "...", "includeTopRelations": true, "page": 1, "pageLimit": 20 }

# Get all tasks associated to an opportunity
GET /associations/relations/{opportunityId}?locationId={id}
# then filter for relations where associationId = "TASK_OPPORTUNITY_ASSOCIATION"
```

### API Reference
```
# Object API (modern)
POST /objects/task/records/search

# Legacy contact-scoped
GET/POST  /contacts/{contactId}/tasks
GET/PUT/DEL /contacts/{contactId}/tasks/{taskId}
PUT       /contacts/{contactId}/tasks/{taskId}/completed

# Location-level search
POST /locations/{locationId}/tasks/search

# Task association schema
GET /associations/objectKey/task?locationId={id}&includeInternalAssociations=true

# Task relations
GET /associations/relations/{taskId}?locationId={id}&skip=0&limit=100
```

---

## 7. Notes — Association Detail

### Hard FK (always required)
| Links To | Field | Required |
|---|---|---|
| Contact | `note.contactId` | Yes |
| User (Author) | `note.userId` | No |

### The `relations[]` Array (confirmed live)
Notes store direct multi-object associations in a `relations[]` array. Supported objectKey values:

| objectKey | Object |
|---|---|
| `contact` | Contact |
| `opportunity` | Opportunity |
| `custom_objects.real_estate_offer` | Offer |
| `custom_objects.properties` | Properties MLS |
| `custom_objects.my_listings` | My Listings |
| `custom_objects.transactions` | Transactions |

### Creating a Multi-Object Note
```json
POST /contacts/{contactId}/notes
{
  "body": "Offer reviewed, conditions: financing + inspection, deadline July 12.",
  "relations": [
    { "objectKey": "contact",    "recordId": "{contactId}" },
    { "objectKey": "opportunity", "recordId": "{opportunityId}" },
    { "objectKey": "custom_objects.real_estate_offer", "recordId": "{offerId}" },
    { "objectKey": "custom_objects.properties",        "recordId": "{propertyId}" }
  ]
}
```

### Appointment-Scoped Notes
Separate note type attached to a specific Appointment. Distinct from contact notes.

### API Reference
```
GET/POST /contacts/{contactId}/notes
GET/PUT/DEL /contacts/{contactId}/notes/{noteId}
GET/POST /calendars/events/appointments/{id}/notes
PUT/DEL  /calendars/events/appointments/{id}/notes/{noteId}
```

---

## 8. Documents — Association Detail

| Links To | Mechanism | Notes |
|---|---|---|
| Contact | Hard FK (`contactId`) | Required |
| Opportunity | Via Workflow only | No direct FK |
| Offers, Properties, Transactions | `documents_ref` TEXT field | Comma-sep external UUIDs |

```
GET  /proposals/documents
POST /proposals/documents/send
GET  /proposals/templates
POST /proposals/templates/send
```

---

## 9. Associations API — Full Definitions

### Standard Endpoint (returns USER_DEFINED + standard SYSTEM_DEFINED only)
```
GET /associations/?locationId={id}&skip=0&limit=200
```
Returns 24 associations for this sub-account.

### Internal Endpoint (required for task + other internal system associations)
```
GET /associations/objectKey/{objectKey}?locationId={id}&includeInternalAssociations=true
```
Example for tasks: `GET /associations/objectKey/task?locationId=jHEaG68TeCsXHXPhrVtU&includeInternalAssociations=true`

---

### SYSTEM_DEFINED Associations — Standard (2)
| Association ID | Object A | Object B | Cardinality | Limits |
|---|---|---|---|---|
| `OPPORTUNITIES_CONTACTS_ASSOCIATION` | opportunity | contact | M:M | 25 contacts/opp; 1000 opps/contact |
| `BUSINESSES_CONTACTS_ASSOCIATION` | business | contact | 1:M | 1 business/contact; 10000 contacts/business |

### SYSTEM_DEFINED Associations — Task Internal (7)
| Association ID | Task Label | Object Key | Object Label | Max/Task | Max/Object |
|---|---|---|---|---|---|
| `TASK_CONTACT_ASSOCIATION` | TASK_TO_CONTACT | `contact` | CONTACT_TO_TASK | 10 | 1,000 |
| `TASK_OPPORTUNITY_ASSOCIATION` | TASK_TO_OPPORTUNITY | `opportunity` | OPPORTUNITY_TO_TASK | 10 | 25 |
| `TASK_BUSINESS_ASSOCIATION` | TASK_TO_BUSINESS | `business` | BUSINESS_TO_TASK | 10 | 10,000 |
| `TASK_CUSTOM_OBJECTS.REAL_ESTATE_OFFER_ASSOCIATION` | TASK_TO_CUSTOM_OBJECTS.REAL_ESTATE_OFFER | `custom_objects.real_estate_offer` | CUSTOM_OBJECTS.REAL_ESTATE_OFFER_TO_TASK | 10 | 1,000 |
| `TASK_CUSTOM_OBJECTS.PROPERTIES_ASSOCIATION` | TASK_TO_CUSTOM_OBJECTS.PROPERTIES | `custom_objects.properties` | CUSTOM_OBJECTS.PROPERTIES_TO_TASK | 10 | 1,000 |
| `TASK_CUSTOM_OBJECTS.MY_LISTINGS_ASSOCIATION` | TASK_TO_CUSTOM_OBJECTS.MY_LISTINGS | `custom_objects.my_listings` | CUSTOM_OBJECTS.MY_LISTINGS_TO_TASK | 10 | 1,000 |
| `TASK_CUSTOM_OBJECTS.TRANSACTIONS_ASSOCIATION` | TASK_TO_CUSTOM_OBJECTS.TRANSACTIONS | `custom_objects.transactions` | CUSTOM_OBJECTS.TRANSACTIONS_TO_TASK | 10 | 1,000 |

### USER_DEFINED Associations — Contact ↔ Custom Object (12)
| ID | Key | Contact Label | Object | Object Label | Cardinality |
|---|---|---|---|---|---|
| `6a44a1e75fd80c377076b5f7` | `contact` | Contact | Properties MLS | (Interested) | M:M |
| `6a44a1e75fd80cf3c776b5fc` | `property_seller` | Seller | Properties MLS | Listed Property | M:M |
| `6a44a1e75fd80c24df76b5f8` | `offer_buyer` | Buyer | Offers | Real Estate Offer | M:M |
| `6a44a1e75fd80c75ec76b5f9` | `offer_seller` | Seller | Offers | Real Estate Offer | M:M |
| `6a44a1e75fd80c81f476b5fa` | `offer_buyer_agent` | Buyer Agent | Offers | Real Estate Offer | M:M |
| `6a44a1e75fd80c9cb876b5fb` | `offer_seller_agent` | Seller Agent | Offers | Real Estate Offer | M:M |
| `6a44bdb59b4cd00e4870cd01` | `my_listings_seller` | Seller | My Listings | Listing | M:M |
| `6a44bdb669b5d073081a3470` | `my_listings_buyer_lead` | Buyer Lead | My Listings | Listing | M:M |
| `6a44bdb8d33ea812501c6120` | `transaction_buyer` | Buyer | Transactions | Transaction | M:M |
| `6a44bdb9cf884446464e1bd7` | `transaction_seller` | Seller | Transactions | Transaction | M:M |
| `6a44bdb957744370cb858919` | `transaction_listing_agent` | Listing Agent | Transactions | Transaction | M:M |
| `6a44bdbacf8844d83d4e1bf0` | `transaction_selling_agent` | Selling Agent | Transactions | Transaction | M:M |

### USER_DEFINED Associations — Custom Object ↔ Custom Object / Opportunity (10)
| ID | Key | Object A | Label A | Object B | Label B | Cardinality |
|---|---|---|---|---|---|---|
| `6a44bdb669b5d06bf31a349b` | `my_listings_mls_property` | My Listings | Listing | Properties MLS | MLS Property | M:M |
| `6a44bdb7d33ea8be3a1c60a0` | `my_listings_offers` | My Listings | Listing | Offers | Offer | M:M |
| `6a44bdb79b4cd0063a70cd7c` | `my_listings_transactions` | My Listings | Listing | Transactions | Transaction | M:M |
| `6a44bdb8577443c36f858880` | `my_listings_opportunity` | My Listings | Listing | Opportunity | Opportunity | M:M |
| `6a44a1e75fd80c947876b5fd` | `opportunity` | Properties MLS | Opportunity | Opportunity | Opportunity | 1:1 |
| `6a44a1e75fd80c1b5576b5fe` | `offers_property` | Properties MLS | Offers | Offers | Property | M:1 |
| `6a44bdbafb63d03a178e89ee` | `transaction_property` | Properties MLS | Property | Transactions | Transaction | M:M |
| `6a44a1e75fd80cf36776b5ff` | `offers_opportunity` | Offers | Opportunity | Opportunity | Offers | 1:M |
| `6a44bdba7f183a65e04d7acd` | `transaction_offer` | Offers | Accepted Offer | Transactions | Transaction | M:M |
| `6a44bdbb7f183a57bd4d7b4a` | `transaction_opportunity` | Transactions | Transaction | Opportunity | Opportunity | M:M |

---

## 10. Task Association Schema — Complete Reference

### Endpoint Discovery
```
# Standard endpoint — does NOT include task associations
GET /associations/?locationId={id}&skip=0&limit=200
# Returns: 24 USER_DEFINED + standard SYSTEM_DEFINED associations
# Task associations: NOT INCLUDED

# Internal endpoint — REQUIRED for task associations
GET /associations/objectKey/task
    ?locationId={id}
    &includeInternalAssociations=true
    &relationsCount=false
# Returns: 7 SYSTEM_DEFINED task associations

# Object search endpoint for tasks
POST /objects/task/records/search
{ "locationId": "...",
  "page": 1,
  "pageLimit": 20,
  "includeTopRelations": true,
  "sort": [{"field": "properties.dueDate", "direction": "desc"}],
  "includeRecurringTaskConfigs": true
}
```

### Raw Schema (from network capture)
```json
[
  {
    "id": "TASK_CONTACT_ASSOCIATION",
    "associationType": "SYSTEM_DEFINED",
    "firstObjectKey": "task",
    "secondObjectKey": "contact",
    "firstObjectToSecondObjectMaxLimit": 10,
    "secondObjectToFirstObjectMaxLimit": 1000
  },
  {
    "id": "TASK_OPPORTUNITY_ASSOCIATION",
    "associationType": "SYSTEM_DEFINED",
    "firstObjectKey": "task",
    "secondObjectKey": "opportunity",
    "firstObjectToSecondObjectMaxLimit": 10,
    "secondObjectToFirstObjectMaxLimit": 25
  },
  {
    "id": "TASK_BUSINESS_ASSOCIATION",
    "associationType": "SYSTEM_DEFINED",
    "firstObjectKey": "task",
    "secondObjectKey": "business",
    "firstObjectToSecondObjectMaxLimit": 10,
    "secondObjectToFirstObjectMaxLimit": 10000
  },
  {
    "id": "TASK_CUSTOM_OBJECTS.REAL_ESTATE_OFFER_ASSOCIATION",
    "associationType": "SYSTEM_DEFINED",
    "firstObjectKey": "task",
    "secondObjectKey": "custom_objects.real_estate_offer",
    "firstObjectToSecondObjectMaxLimit": 10,
    "secondObjectToFirstObjectMaxLimit": 1000
  },
  {
    "id": "TASK_CUSTOM_OBJECTS.PROPERTIES_ASSOCIATION",
    "associationType": "SYSTEM_DEFINED",
    "firstObjectKey": "task",
    "secondObjectKey": "custom_objects.properties",
    "firstObjectToSecondObjectMaxLimit": 10,
    "secondObjectToFirstObjectMaxLimit": 1000
  },
  {
    "id": "TASK_CUSTOM_OBJECTS.MY_LISTINGS_ASSOCIATION",
    "associationType": "SYSTEM_DEFINED",
    "firstObjectKey": "task",
    "secondObjectKey": "custom_objects.my_listings",
    "firstObjectToSecondObjectMaxLimit": 10,
    "secondObjectToFirstObjectMaxLimit": 1000
  },
  {
    "id": "TASK_CUSTOM_OBJECTS.TRANSACTIONS_ASSOCIATION",
    "associationType": "SYSTEM_DEFINED",
    "firstObjectKey": "task",
    "secondObjectKey": "custom_objects.transactions",
    "firstObjectToSecondObjectMaxLimit": 10,
    "secondObjectToFirstObjectMaxLimit": 1000
  }
]
```

---

## 11. How to Create a Relation

### USER_DEFINED Associations (Custom Object / Contact / Opportunity links)
```json
POST /associations/relations
{
  "locationId": "jHEaG68TeCsXHXPhrVtU",
  "associationId": "{userDefinedAssociationId}",
  "firstRecordId": "{firstObjectRecord}",
  "secondRecordId": "{secondObjectRecord}"
}
```

### SYSTEM_DEFINED Task Relations
```json
// Link Task to Opportunity
POST /associations/relations
{
  "locationId": "jHEaG68TeCsXHXPhrVtU",
  "associationId": "TASK_OPPORTUNITY_ASSOCIATION",
  "firstRecordId": "{taskId}",
  "secondRecordId": "{opportunityId}"
}

// Link Task to Offer
{
  "associationId": "TASK_CUSTOM_OBJECTS.REAL_ESTATE_OFFER_ASSOCIATION",
  "firstRecordId": "{taskId}",
  "secondRecordId": "{offerRecordId}"
}

// Link Task to Property
{
  "associationId": "TASK_CUSTOM_OBJECTS.PROPERTIES_ASSOCIATION",
  "firstRecordId": "{taskId}",
  "secondRecordId": "{propertyRecordId}"
}

// Link Task to Transaction
{
  "associationId": "TASK_CUSTOM_OBJECTS.TRANSACTIONS_ASSOCIATION",
  "firstRecordId": "{taskId}",
  "secondRecordId": "{transactionRecordId}"
}

// Link Task to Contact
{
  "associationId": "TASK_CONTACT_ASSOCIATION",
  "firstRecordId": "{taskId}",
  "secondRecordId": "{contactId}"
}
```

### Note Multi-Object Relations
```json
POST /contacts/{contactId}/notes
{
  "body": "...",
  "relations": [
    { "objectKey": "contact",    "recordId": "{contactId}" },
    { "objectKey": "opportunity", "recordId": "{opportunityId}" },
    { "objectKey": "custom_objects.real_estate_offer", "recordId": "{offerId}" }
  ]
}
```

---

## 12. How to Fetch Related Records

### All relations for any record
```
GET /associations/relations/{recordId}?locationId={id}&skip=0&limit=100
# Works for: contactId, opportunityId, taskId, custom object recordId
# For task IDs — returns 0 if no relation records created yet (normal)
```

### All tasks for an Opportunity
```
GET /associations/relations/{opportunityId}?locationId={id}&skip=0&limit=100
# Filter response for: associationId = "TASK_OPPORTUNITY_ASSOCIATION"
# The returned recordIds are task IDs
```

### All tasks for a Custom Object
```
GET /associations/relations/{customObjectRecordId}?locationId={id}&skip=0&limit=100
# Filter for: associationId = "TASK_CUSTOM_OBJECTS.{OBJECT}_ASSOCIATION"
```

### Search Custom Objects by task relation
```json
POST /objects/custom_objects.real_estate_offer/records/search
{
  "locationId": "jHEaG68TeCsXHXPhrVtU",
  "filters": [{
    "field": "relations",
    "operator": "nested",
    "value": [
      { "field": "associationId", "operator": "eq",
        "value": "TASK_CUSTOM_OBJECTS.REAL_ESTATE_OFFER_ASSOCIATION" },
      { "field": "recordId", "operator": "eq", "value": "{taskId}" }
    ]
  }]
}
```

### Get all tasks (including standalone)
```json
POST /objects/task/records/search
{
  "locationId": "jHEaG68TeCsXHXPhrVtU",
  "page": 1,
  "pageLimit": 20,
  "includeTopRelations": true,
  "sort": [{"field": "properties.dueDate", "direction": "desc"}]
}
```

---

## 13. Integrity Rules & Gotchas (v3)

| Rule | Detail |
|---|---|
| **Task object key is `task`** | Tasks participate in the Objects API as `key: "task"`. Searchable via `POST /objects/task/records/search`. |
| **Task associations use internal endpoint** | `GET /associations/?locationId=...` does NOT return task associations. Must use `GET /associations/objectKey/task?includeInternalAssociations=true`. |
| **0 relations ≠ no support** | `GET /associations/relations/{taskId}` returning 0 means zero relation records created — NOT that the task can't be associated. |
| **Task contactId is optional** | Standalone tasks (no contactId) are supported. Confirmed: `LP5uIeptcgC7LjaYtbC6` has no contactId. |
| **Task max 10 links per object type** | Each task supports max 10 linked records per object type (Contacts, Opps, Offers, Properties, Listings, Transactions, Companies). |
| **Opportunity max 25 tasks** | `secondObjectToFirstObjectMaxLimit: 25` on `TASK_OPPORTUNITY_ASSOCIATION` — max 25 tasks per opportunity. |
| **Note contactId still required** | Even with `relations[]` multi-object linking, Notes still require a `contactId`. |
| **Orphaned tasks on Contact delete** | Tasks with `contactId` FK become orphaned if Contact deleted. Not cascade-deleted. |
| **Orphaned task relations** | Deleting a Contact, Opportunity, or Custom Object does NOT cascade-delete task relation records. |
| **Orphaned note relations** | Deleting a Custom Object record leaves dangling `relations[]` entries on notes pointing to it. |
| **Property MLS unique MLS#** | `custom_objects.properties.mls` is unique. Duplicate MLS# fails. |
| **Property ↔ Opportunity is 1:1** | Max 1 relation each side via `opportunity` USER_DEFINED association. |
| **Associations API: 1000 max relations** | Per association type per location (USER_DEFINED). Task system associations have their own per-object limits. |

---

## 14. Quick-Reference Association ID Lookup

### Task Associations (SYSTEM_DEFINED internal)
| Use Case | Association ID |
|---|---|
| Link Task → Contact | `TASK_CONTACT_ASSOCIATION` |
| Link Task → Opportunity | `TASK_OPPORTUNITY_ASSOCIATION` |
| Link Task → Company | `TASK_BUSINESS_ASSOCIATION` |
| Link Task → Offer | `TASK_CUSTOM_OBJECTS.REAL_ESTATE_OFFER_ASSOCIATION` |
| Link Task → Property MLS | `TASK_CUSTOM_OBJECTS.PROPERTIES_ASSOCIATION` |
| Link Task → My Listing | `TASK_CUSTOM_OBJECTS.MY_LISTINGS_ASSOCIATION` |
| Link Task → Transaction | `TASK_CUSTOM_OBJECTS.TRANSACTIONS_ASSOCIATION` |

### Standard Associations (USER_DEFINED)
| Use Case | Key | Association ID |
|---|---|---|
| Contact interested in Property | `contact` | `6a44a1e75fd80c377076b5f7` |
| Contact (Seller) → Property | `property_seller` | `6a44a1e75fd80cf3c776b5fc` |
| Contact (Buyer) → Offer | `offer_buyer` | `6a44a1e75fd80c24df76b5f8` |
| Contact (Seller) → Offer | `offer_seller` | `6a44a1e75fd80c75ec76b5f9` |
| Contact (Buyer Agent) → Offer | `offer_buyer_agent` | `6a44a1e75fd80c81f476b5fa` |
| Contact (Seller Agent) → Offer | `offer_seller_agent` | `6a44a1e75fd80c9cb876b5fb` |
| Contact (Seller) → My Listing | `my_listings_seller` | `6a44bdb59b4cd00e4870cd01` |
| Contact (Buyer Lead) → My Listing | `my_listings_buyer_lead` | `6a44bdb669b5d073081a3470` |
| Contact (Buyer) → Transaction | `transaction_buyer` | `6a44bdb8d33ea812501c6120` |
| Contact (Seller) → Transaction | `transaction_seller` | `6a44bdb9cf884446464e1bd7` |
| Contact (Listing Agent) → Transaction | `transaction_listing_agent` | `6a44bdb957744370cb858919` |
| Contact (Selling Agent) → Transaction | `transaction_selling_agent` | `6a44bdbacf8844d83d4e1bf0` |
| My Listing → MLS Property | `my_listings_mls_property` | `6a44bdb669b5d06bf31a349b` |
| My Listing → Offer | `my_listings_offers` | `6a44bdb7d33ea8be3a1c60a0` |
| My Listing → Transaction | `my_listings_transactions` | `6a44bdb79b4cd0063a70cd7c` |
| My Listing → Opportunity | `my_listings_opportunity` | `6a44bdb8577443c36f858880` |
| Property → Opportunity (1:1) | `opportunity` | `6a44a1e75fd80c947876b5fd` |
| Property → Offer (many per property) | `offers_property` | `6a44a1e75fd80c1b5576b5fe` |
| Property → Transaction | `transaction_property` | `6a44bdbafb63d03a178e89ee` |
| Offer → Opportunity | `offers_opportunity` | `6a44a1e75fd80cf36776b5ff` |
| Offer → Transaction | `transaction_offer` | `6a44bdba7f183a65e04d7acd` |
| Transaction → Opportunity | `transaction_opportunity` | `6a44bdbb7f183a57bd4d7b4a` |
| Opportunity → Contact (system) | `OPPORTUNITIES_CONTACTS_ASSOCIATION` | `OPPORTUNITIES_CONTACTS_ASSOCIATION` |
| Business → Contact (system) | `BUSINESSES_CONTACTS_ASSOCIATION` | `BUSINESSES_CONTACTS_ASSOCIATION` |

---

## 15. Full Entity Graph (v3)

```
┌──────────────────────────────────────────────────────────────────────┐
│          T A S K  (key: task — full object type)                   │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
    7 SYSTEM_DEFINED associations (via TASK_*_ASSOCIATION IDs)
    ┬─────────┬────────┬───────┬──────┬──────┬──────┬──────┐
    ▼        ▼        ▼       ▼      ▼      ▼      ▼      ▼
Contact  Opportunity  Company  Offer  Prop.  Listing  Trans.
(10/task  (10/task    (10/task (10/   (10/   (10/     (10/
 1000/   25/opp)     10k/co)  task)  task)  task)    task)
 contact)

┌──────────────────────────────────────────────────────────────────────┐
│              N O T E  (relations[] array)                         │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
    contactId (required) + relations[] simultaneous links:
    ┬─────────┬────────┬───────┬──────┬──────┬──────┐
    ▼        ▼        ▼       ▼      ▼      ▼
Contact  Opportunity  Offer  Prop.  Listing  Trans.

┌──────────────────────────────────────────────────────────────────────┐
│            Associations API Graph (USER + SYSTEM)                  │
│                                                                     │
│  Opportunity ◄── Contact (SYSTEM)                                 │
│  Opportunity ◄── Offer (USER: offers_opportunity 1:M)            │
│  Opportunity ◄── Property (USER: opportunity 1:1)                │
│  Opportunity ◄── My Listing (USER: my_listings_opportunity)      │
│  Opportunity ◄── Transaction (USER: transaction_opportunity)     │
│  Opportunity ◄── Task (SYSTEM: TASK_OPPORTUNITY_ASSOCIATION)     │
│                                                                     │
│  Contact ◄────── Task (SYSTEM: TASK_CONTACT_ASSOCIATION)       │
│  Offers ◄─────── Task (SYSTEM: TASK_CUSTOM_OBJECTS.REAL...)    │
│  Properties ◄─── Task (SYSTEM: TASK_CUSTOM_OBJECTS.PROPERTIES)  │
│  My Listings ◄── Task (SYSTEM: TASK_CUSTOM_OBJECTS.MY_LISTINGS)  │
│  Transactions ◄─ Task (SYSTEM: TASK_CUSTOM_OBJECTS.TRANSACTIONS)  │
│  Company ◄────── Task (SYSTEM: TASK_BUSINESS_ASSOCIATION)      │
│                                                                     │
│  My Listing ──►  Property / Offer / Transaction / Opportunity     │
│  Property ◄────  Offer / Transaction / Opportunity               │
│  Offer ───────►  Transaction / Opportunity                        │
│  Business ────►  Contact (SYSTEM: BUSINESSES_CONTACTS)           │
└──────────────────────────────────────────────────────────────────────┘
```

---

*v3 Updated 2026-07-02 from live network capture confirming Task object type (key: `task`) and 7 SYSTEM_DEFINED task associations.*  
*locationId: `jHEaG68TeCsXHXPhrVtU`*
