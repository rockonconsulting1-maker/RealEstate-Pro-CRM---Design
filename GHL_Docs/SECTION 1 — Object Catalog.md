# SECTION 1 — Object Catalog
The CRM platform organises all data into two tiers:

| Tier | Description |
| --- | --- |
| First-Class Objects | Full record support in the Objects module — Contacts, Companies, Opportunities, and all Custom Objects. Have associations, searchable properties, primary display properties, and unique constraints. |
| Supporting / Child Objects | Platform-native entities not exposed as "Objects" (Tasks, Notes, Appointments, Conversations, Messages, etc.). Always belong to a parent object. Accessible via dedicated API namespaces. |

## 1A — First-Class Objects (Objects-API)
These 7 objects are registered in the Objects module for this sub-account:

#	Object Name	API Key	Type	Primary Display Property	Required Field(s)	Unique Field(s)	Description
| 1 | Contact | contact | SYSTEM_DEFINED | contact.email | contact.email | — | Master person/lead record. Central hub for all CRM activity. |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | Company | business | SYSTEM_DEFINED | business.name | business.name | — | Business or organisation entity linked to contacts. |
| 3 | Opportunity | opportunity | SYSTEM_DEFINED | opportunity.name | opportunity.name | — | Sales deal tracked through pipeline stages. |
| 4 | Offer | custom_objects.real_estate_offer | USER_DEFINED | offer_id | offer_id | — | Buyer/seller offer negotiations, contingencies, and deal history. |
| 5 | Property (MLS) | custom_objects.properties | USER_DEFINED | mls | mls | mls ✅ | Master MLS database for comps, buyer matching, and market analysis. |
| 6 | My Listings | custom_objects.my_listings | USER_DEFINED | mls_number | mls_number | — | Agent's personal listings synced from Realtor.ca/MLS. |
| 7 | Transaction | custom_objects.transactions | USER_DEFINED | transaction_id | transaction_id | — | Deal hub for commissions, closing coordination, and reporting. |

## 1B — Supporting / Child Standard Objects
These objects are native to the platform but live in separate API namespaces. They don't appear in the Objects module but hold critical data.

📋 CRM & People
#	Object	Belongs To	Description
| 8 | Task | Contact, Opportunity | To-do action items assigned to a contact and/or user. Due dates, priorities, completion states. |
| --- | --- | --- | --- |
| 9 | Note | Contact, Opportunity | Free-text notes attached to a record. Supports rich text. |
| 10 | Tag | Contact, Opportunity | Flat-label taxonomy applied to contacts/opportunities for segmentation and filtering. |
| 11 | Follower | Contact, Opportunity | User assigned to "follow" a record (gets notified on activity). |

📅 Calendar & Scheduling
#	Object	Belongs To	Description
| 12 | Calendar | Sub-Account | Calendar configuration (booking rules, availability, team calendars). |
| --- | --- | --- | --- |
| 13 | Appointment | Contact, Calendar | A booked time slot linked to a contact and a calendar. |
| 14 | Calendar Group | Sub-Account | Logical grouping of multiple calendars. |
| 15 | Block Slot | Calendar | A time window manually blocked on a calendar. |

💬 Conversations & Messaging
#	Object	Belongs To	Description
| 16 | Conversation | Contact | A multi-channel thread grouping all messages with a contact. One conversation per contact per channel type. |
| --- | --- | --- | --- |
| 17 | Message | Conversation | An individual message unit. Can be SMS, Email, Call, Facebook DM, Instagram DM, GMB, WhatsApp, Live Chat. |
| 18 | Call | Contact, Conversation | Phone call record with recording, duration, direction, and disposition. |
| 19 | Email Message | Conversation | Outbound or inbound email thread item. |
| 20 | SMS Message | Conversation | Outbound or inbound SMS/MMS thread item. |

🤖 Automation
#	Object	Belongs To	Description
| 21 | Workflow | Sub-Account | Automation rules triggered by events (contact actions, date/time, webhooks, etc.). |
| --- | --- | --- | --- |
| 22 | Campaign | Sub-Account | Drip-campaign style message sequences (legacy automation). |
| 23 | Trigger Link | Sub-Account | Trackable URL that fires a workflow/tag action when clicked. |

📊 Sales Pipelines
#	Object	Belongs To	Description
| 24 | Pipeline | Sub-Account | A named sales pipeline (e.g. "Buyer Pipeline", "Seller Pipeline"). |
| --- | --- | --- | --- |
| 25 | Pipeline Stage | Pipeline | An ordered stage within a pipeline (e.g. "Offer Submitted", "Under Contract"). |

📢 Marketing
#	Object	Belongs To	Description
| 26 | Email Template | Sub-Account | Reusable HTML email template stored in the email builder. |
| --- | --- | --- | --- |
| 27 | SMS Template | Sub-Account | Reusable SMS body text template. |
| 28 | Social Post | Sub-Account | Scheduled or published social media post (Facebook, Instagram, LinkedIn, TikTok, GMB). |

📝 Lead Capture
#	Object	Belongs To	Description
| 29 | Form | Sub-Account | Lead capture form with field mapping to contact properties. |
| --- | --- | --- | --- |
| 30 | Form Submission | Form, Contact | Individual form fill response, linked to a contact. |
| 31 | Survey | Sub-Account | Multi-step survey with conditional logic. |
| 32 | Survey Submission | Survey, Contact | Individual survey response. |

🌐 Sites & Pages
#	Object	Belongs To	Description
| 33 | Funnel | Sub-Account | A multi-step marketing funnel (landing page → thank you → upsell). |
| --- | --- | --- | --- |
| 34 | Funnel Page | Funnel | Individual page within a funnel with step ordering and stats. |
| 35 | Website | Sub-Account | Full website (multiple pages, nav, custom domain). |
| 36 | Blog Site | Sub-Account | Blog configuration (domain, author settings, categories). |
| 37 | Blog Post | Blog Site | Individual article with SEO fields, content, and publication status. |
| 38 | Redirect | Funnel / Website | URL redirect rule (301/302) for funnel or website domain. |

💰 Payments & Commerce
#	Object	Belongs To	Description
| 39 | Product | Sub-Account | A sellable item (one-time, subscription, or free). |
| --- | --- | --- | --- |
| 40 | Product Price | Product | Price variant for a product (amount, currency, billing interval). |
| 41 | Order | Contact, Product | A purchase record linking a contact to one or more products. |
| 42 | Order Fulfillment | Order | Shipping/fulfillment details for a physical product order. |
| 43 | Invoice | Contact | A payable invoice issued to a contact. Supports one-time and recurring. |
| 44 | Invoice Schedule | Contact | Recurring invoice schedule (weekly, monthly, yearly). |
| 45 | Coupon | Sub-Account | Discount code applicable to products/orders. |
| 46 | Payment Provider | Sub-Account | Payment processor config (Stripe, NMI, Authorize.net, Square). |

🎓 Memberships & Courses
#	Object	Belongs To	Description
| 47 | Offer (Membership) | Sub-Account | A membership offer bundling one or more courses with pricing. |
| --- | --- | --- | --- |
| 48 | Course | Offer | A structured learning course with categories and posts. |
| 49 | Course Category | Course | Top-level grouping of lessons within a course. |
| 50 | Course Post (Lesson) | Course Category | Individual lesson/video/text content unit. |
| 51 | Membership Access | Contact, Offer | A contact's enrollment record for a specific membership offer. |

📁 Media & Files
#	Object	Belongs To	Description
| 52 | Media File | Sub-Account | Image, video, PDF, or audio file in the media library. |
| --- | --- | --- | --- |
| 53 | Media Folder | Sub-Account | Folder organizing media files in the library. |

🛠️ Schema & Configuration
#	Object	Belongs To	Description
| 54 | Custom Field | Sub-Account | A user-defined field definition that extends Contact, Opportunity, or other objects. |
| --- | --- | --- | --- |
| 55 | Custom Field Folder | Sub-Account | Folder grouping custom fields for UI organization. |
| 56 | Custom Value | Sub-Account | A global key-value snippet (e.g. {{business.address}}) for use in templates. |
| 57 | User | Sub-Account | A platform user with a role and permissions within the sub-account. |
| 58 | Business (Location) | Sub-Account | The sub-account's own business profile (name, address, logo, timezone). |
| 59 | Snapshot | Sub-Account | A point-in-time backup package of sub-account configuration. |

⭐ Reputation
#	Object	Belongs To	Description
| 60 | Review | Sub-Account, Contact | A Google / other platform review linked to the business. |
| --- | --- | --- | --- |
| 61 | Review Request | Contact | A sent review request with status (sent, opened, reviewed). |

📑 Documents
#	Object	Belongs To	Description
| 62 | Document / Contract | Contact | A proposal or contract sent for e-signature. |
| --- | --- | --- | --- |
| 63 | Document Template | Sub-Account | Reusable template for proposals/contracts. |

## 1C — Object Count Summary
| Category | Count |
| --- | --- |
| First-Class Objects (Objects API) | 7 |
| Supporting Standard Objects | 56 |
| Total tracked objects | 63 |
| Custom Objects in this account | 4 |
| System-Defined Objects | 3 |
