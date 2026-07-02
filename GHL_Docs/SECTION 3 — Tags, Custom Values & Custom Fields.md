# SECTION 3 — Tags, Custom Values & Custom Fields
## 3.1 — Tags
What Tags Are
Tags are flat-label strings applied directly to Contact and Opportunity records for segmentation, filtering, workflow triggering, and reporting. They have no schema of their own — a tag is simply a string value stored in the record's tags array field.

```javascript
contact.tags = ["buyer", "lethbridge", "pre-approved", "hot-lead"]
```
```javascript
opportunity.tags = ["referral", "over-500k", "possession-60-days"]
```
How Tags Are Stored
| Characteristic | Detail |
| --- | --- |
| Storage model | Embedded ARRAY[TEXT] on the Contact or Opportunity document |
| Uniqueness | Per-record (no duplicates on same record); same tag string can exist on any number of records |
| Case sensitivity | Tags are case-insensitive at the query level (stored as-entered; filtered lowercase) |
| Length limit | ~255 characters per tag string |
| Max tags per record | No hard limit documented; practical limit ~500 |
| Sub-account scoping | Tags exist only within the sub-account that created them |
| Tag registry | No formal tag table — the tag "exists" as soon as it is applied to any record |
| Deletion cascade | Removing a tag string from one record does not affect other records; the string ceases to "exist" only when removed from all records |

Tag Operations
| Operation | Trigger |
| --- | --- |
| Add tag | Manual UI, Workflow action, API POST /contacts/{id}/tags, Bulk Action, Form submission mapping |
| Remove tag | Manual UI, Workflow action, API DELETE /contacts/{id}/tags |
| Trigger on tag | Workflow trigger: "Tag Added" or "Tag Removed" — fires when a specific tag is applied or removed |
| Filter/search by tag | Contact search, Smart List conditions, Opportunity filter |
| Bulk tag | Bulk Action → Add/Remove Tag across a filtered contact list |

Tag Usage Across Objects
| Object | Has Tags | Notes |
| --- | --- | --- |
| Contact | ✅ | Primary tag surface; tags are indexed for search |
| Opportunity | ✅ | Independent tag array from Contact tags |
| Conversation | ✅ (read-only) | Denormalized from linked Contact — not set directly |
| My Listings (Custom) | ✅ (as TEXT field) | custom_objects.my_listings.tags — stored as comma-separated TEXT, not array |
| All other objects | ❌ | No native tag support |

Common Real Estate Tag Conventions (suggested)
| Category | Example Tags |
| --- | --- |
| Buyer Stage | buyer-lead, pre-approved, actively-searching, under-contract-buyer, closed-buyer |
| Seller Stage | seller-lead, listing-appointment, active-listing, under-contract-seller, closed-seller |
| Lead Source | google-ads, facebook, referral, open-house, realtor-ca, yard-sign, past-client |
| Price Range | under-300k, 300k-500k, 500k-750k, 750k-1m, over-1m |
| Property Interest | single-family, condo, acreage, investment, commercial |
| Geography | lethbridge, picture-butte, taber, coaldale |
| Engagement | hot-lead, warm-lead, cold-lead, dnc, re-engage |
| Finance Status | cash-buyer, pre-approved, needs-pre-approval, private-financing |
| Misc | vip, newsletter, past-client, investor, relocating |

## 3.2 — Custom Values (Merge Tags)
What Custom Values Are
Custom Values are global key-value pairs scoped to a sub-account. They function as merge tags — reusable variables that can be inserted into any email template, SMS body, workflow message, or document using the {{custom_values.key}} syntax.

They solve the problem of maintaining business-wide variables in one place rather than hardcoding them across hundreds of templates.

Storage Model
| Characteristic | Detail |
| --- | --- |
| Storage location | Dedicated customValues collection, scoped to locationId |
| Reference syntax | {{custom_values.fieldKey}} — e.g. {{custom_values.office_address}} |
| Value type | Plain text (no rich text, no HTML) |
| Nesting | Flat — no parent/child hierarchy |
| Uniqueness | fieldKey is unique within the sub-account |
| Resolution | Resolved at send/render time by the platform's template engine |

Custom Value vs. Contact/Opportunity Merge Tags
| Merge Tag Type | Syntax | Scope | Changes When |
| --- | --- | --- | --- |
| Custom Value | {{custom_values.office_address}} | Sub-account global | Changed in Settings → Custom Values |
| Contact Field | {{contact.first_name}} | Per-contact | Contact record is updated |
| Opportunity Field | {{opportunity.name}} | Per-opportunity | Opportunity record is updated |
| User Field | {{user.full_name}} | Per-assigned user | User profile is updated |
| Appointment Field | {{appointment.start_time}} | Per-appointment | Appointment is rescheduled |

Common Real Estate Custom Values (suggested)
| fieldKey | Example Value | Use Case |
| --- | --- | --- |
| office_address | 123 Main St, Lethbridge, AB T1J 0A1 | Email footers, contracts |
| office_phone | +14035551234 | Templates, signatures |
| agent_name | Jane Smith | All outbound communications |
| brokerage_name | ABC Realty Inc. | Legal docs, emails |
| brokerage_license | AB-12345 | Required on contracts |
| realtor_ca_url | https://www.realtor.ca/agent/jane | Marketing emails |
| calendly_url | https://booking.example.com | Call-to-action links |
| instagram_url | https://instagram.com/janesmith_re | Email footers |
| facebook_url | https://facebook.com/janesmithrealty | Email footers |
| office_hours | Mon–Fri 9am–6pm MT | Auto-reply messages |
| gst_number | 123456789RT0001 | Invoices |
| e_and_o_insurer | Westport Insurance | Contract disclosures |

## 3.3 — Custom Fields (Extended Data Model)
Architecture Overview
Custom Fields extend the built-in schema of any object (Contact, Opportunity, or a Custom Object) without requiring database schema changes. The platform uses a schema-on-write, EAV-adjacent pattern:

┌────────────────────────────────────┐
│     CustomField (schema record)    │
│  id: "abc123"                      │
│  objectKey: "contact"              │
│  fieldKey: "contact.buyer_budget"  │
│  name: "Buyer Budget"              │
│  dataType: "MONETORY"              │
└────────────────┬───────────────────┘
                 │ defines
                 ▼
┌────────────────────────────────────┐
│     Contact (data record)          │
│  customFields: [                   │
│    { id: "abc123",                 │
│      value: "450000" }             │
│  ]                                 │
└────────────────────────────────────┘
Storage Pattern
| Characteristic | Detail |
| --- | --- |
| Schema record | Stored in customFields collection (fieldKey, dataType, objectKey, locationId) |
| Value storage | Embedded in the target record's customFields: [{id, value}] array |
| ID reference | Values reference CustomField.id, NOT fieldKey |
| Value format | All values stored as strings; deserialized by the platform based on dataType |
| Null handling | Missing {id, value} entry = field is empty (not null in the array, just absent) |
| Folder grouping | Fields grouped into CustomFieldFolder records for UI organisation only (no data impact) |
| Cross-object isolation | A Contact custom field cannot be stored on an Opportunity (object key enforces scope) |

Value Serialization by Data Type
| Data Type | Stored As | Example Value String |
| --- | --- | --- |
| TEXT | Raw string | "Preferred agent: Jane" |
| LARGE_TEXT | Raw string | "Long note about buyer preferences..." |
| NUMERICAL | Numeric string | "4" or "2.5" |
| MONETORY | Numeric string | "450000" or "1250000.50" |
| DATE | YYYY-MM-DD string | "2026-09-15" |
| DATETIME | ISO 8601 string | "2026-09-15T14:30:00.000Z" |
| PHONE | Phone string | "+14035551234" |
| EMAIL | Email string | "buyer@email.com" |
| URL | URL string | "https://example.com/listing" |
| CHECKBOX | Boolean string | "true" or "false" |
| SINGLE_OPTIONS | Option key string | "pre_approved" |
| MULTIPLE_OPTIONS | JSON array string | ["pre_approved","cash_buyer"] |
| FILE_UPLOAD | CDN URL string | "https://cdn.example.com/file.pdf" |

Custom Field Scoping by Object
| Object Key | Where Field Values Are Stored |
| --- | --- |
| contact | Contact.customFields[] |
| opportunity | Opportunity.customFields[] |
| custom_objects.real_estate_offer | Offer record.properties{} |
| custom_objects.properties | Properties (MLS) record.properties{} |
| custom_objects.my_listings | My Listings record.properties{} |
| custom_objects.transactions | Transactions record.properties{} |

Note for Custom Objects: Records in user-defined custom objects use a flat properties map keyed by fieldKey (not the {id, value} array pattern used by Contact/Opportunity). The Custom Objects API accepts and returns field values as { "custom_objects.my_listings.bedrooms": 3 }.

Custom Field Key Namespace Rules
Field keys follow strict dot-notation namespacing:

| Object | Key Pattern | Example |
| --- | --- | --- |
| Contact | contact.{slug} | contact.buyer_budget |
| Opportunity | opportunity.{slug} | opportunity.commission_rate |
| Custom Object | custom_objects.{object_slug}.{field_slug} | custom_objects.my_listings.open_house_date |

{slug} must be lowercase, snake_case, alphanumeric + underscores only
Key is immutable after creation — renaming the display name does not change the key
Key is unique within the sub-account across all objects of the same type
Custom Field Merge Tag Syntax
Custom field values can be inserted into email templates, SMS bodies, and workflow messages:

| Object | Merge Tag Syntax |
| --- | --- |
| Contact custom field | {{contact.buyer_budget}} |
| Opportunity custom field | {{opportunity.commission_rate}} |
| Custom Object field | Not directly injectable via standard merge tags — access via workflow data mapping |

## 3.4 — Complete Tag & Data Extension Architecture Summary
SUB-ACCOUNT
│
├── Tags (flat strings on Contact + Opportunity records)
│   ├── Applied via: UI, Workflow, API, Bulk Action, Form
│   └── Trigger: "Tag Added" / "Tag Removed" workflow events
│
├── Custom Values (global merge tag registry)
│   ├── {{custom_values.KEY}} → resolved in all templates
│   └── Managed in: Settings → Custom Values
│
└── Custom Fields (object schema extension)
    ├── Schema: CustomField collection (fieldKey, dataType, objectKey)
    ├── Values: embedded in Contact.customFields[], Opportunity.customFields[]
    ├── Values (Custom Objects): flat properties{} map on record
    ├── Folders: CustomFieldFolder (UI grouping only)
    └── Merge: {{contact.field_key}}, {{opportunity.field_key}}