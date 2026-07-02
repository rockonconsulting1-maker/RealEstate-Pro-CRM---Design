# SECTION 4 — Associations & Relationships Matrix
## 4.0 — Legend & Mechanisms
4.0.1 — Cardinality Notation
| Symbol | Meaning | Example |
| --- | --- | --- |
| 1 → M | One-to-Many | One Contact has many Tasks |
| M → 1 | Many-to-One | Many Opportunities belong to one Pipeline |
| 1 → 1 | One-to-One | One accepted Offer maps to one Transaction |
| M ↔ M | Many-to-Many | Many Contacts interested in many Properties |
| embed | Embedded / Nested | Pipeline Stages are embedded inside Pipeline |

4.0.2 — Relationship Enforcement Mechanisms
The platform enforces relationships through four distinct mechanisms:

| Mechanism | Description | Example |
| --- | --- | --- |
| Hard Foreign Key | A field on one record stores the id of another record. Platform enforces referential integrity. | task.contactId → contact.id |
| Denormalized Copy | A field stores a copy of a related record's value at write time. Not updated automatically on source change. | opportunity.contact.name (copied from contact) |
| Embedded Array | Related records are stored inside the parent document as a nested array. | pipeline.stages[] — stages have no independent existence |
| Associations API | Explicit many-to-many link records created via the Associations API. Bidirectional, schema-defined. | contact ↔ custom_objects.properties |

## 4.1 — Master Relationships Matrix
Every object-to-object relationship in the sub-account, with foreign key, cardinality, mechanism, and cascade notes.

#	From Object	Relationship	To Object	Cardinality	Foreign Key / Link	Mechanism	Cascade / Notes
| R01 | Contact | belongs to | Company (Business) | M → 1 | contact.businessId → business.id | Hard FK | contact.businessName is denormalized copy of business.name |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R02 | Contact | has many | Opportunity | 1 → M | opportunity.contact.id → contact.id | Hard FK | Deleting contact does not auto-delete opportunities |
| R03 | Contact | has many | Task | 1 → M | task.contactId → contact.id | Hard FK | Tasks are orphaned if contact deleted |
| R04 | Contact | has many | Note | 1 → M | note.contactId → contact.id | Hard FK | Notes are orphaned if contact deleted |
| R05 | Contact | has many | Appointment | 1 → M | appointment.contactId → contact.id | Hard FK | — |
| R06 | Contact | has many | Conversation | 1 → M | conversation.contactId → contact.id | Hard FK | One conversation per contact per channel type (enforced by dedup) |
| R07 | Contact | has many | Form Submission | 1 → M | formSubmission.contactId → contact.id | Hard FK | Contact auto-created or matched on submit |
| R08 | Contact | has many | Survey Submission | 1 → M | surveySubmission.contactId → contact.id | Hard FK | — |
| R09 | Contact | has many | Order | 1 → M | order.contactId → contact.id | Hard FK | order.contactSnapshot is denormalized at purchase time |
| R10 | Contact | has many | Invoice | 1 → M | invoice.contactId → contact.id | Hard FK | invoice.contactDetails is denormalized at invoice time |
| R11 | Contact | has many | Review Request | 1 → M | reviewRequest.contactId → contact.id | Hard FK | — |
| R12 | Contact | may have | Review | 1 → M | review.contactId → contact.id | Soft FK | Review may not match any contact (unrecognized reviewer) |
| R13 | Contact | has many | Document / Contract | 1 → M | document.contactId → contact.id | Hard FK | — |
| R14 | Contact | has many | Membership Access | 1 → M | membershipAccess.contactId → contact.id | Hard FK | — |
| R15 | Contact | enrolled in | Workflow | M ↔ M | Platform enrollment record (internal) | Enrollment table | Contact can be in multiple workflows simultaneously |
| R16 | Contact | enrolled in | Campaign | M ↔ M | Platform enrollment record (internal) | Enrollment table | Legacy drip campaign enrollment |
| R17 | Contact | assigned to | User | M → 1 | contact.assignedTo → user.id | Hard FK | Nullable — unassigned contacts allowed |
| R18 | Contact | followed by | User | M ↔ M | contact.followers[] → user.id | Embedded array FK | Multi-user follower list |
| R19 | Contact | linked to | Offer (Custom) | 1 → M | Associations API | Associations API | Buyer or seller contact on an offer |
| R20 | Contact | linked to | Property MLS (Custom) | M ↔ M | Associations API | Associations API | Contact interested in / associated with a property |
| R21 | Contact | linked to | My Listings (Custom) | M ↔ M | Associations API | Associations API | Agent's client linked to their listing |
| R22 | Contact | linked to | Transaction (Custom) | 1 → M | Associations API | Associations API | Buyer or seller on a transaction |
| R23 | Company | has many | Contact | 1 → M | contact.businessId → business.id | Hard FK (reverse R01) | — |
| R24 | Opportunity | belongs to | Pipeline | M → 1 | opportunity.pipelineId → pipeline.id | Hard FK | Deleting pipeline would orphan opportunities |
| R25 | Opportunity | belongs to | Pipeline Stage | M → 1 | opportunity.pipelineStageId → pipelineStage.id | Hard FK | Stage is embedded in pipeline; references pipelineStage.id |
| R26 | Opportunity | linked to | Contact | M → 1 | opportunity.contact.id → contact.id | Hard FK + denorm | contact.name, contact.email, contact.phone, contact.companyName are denormalized |
| R27 | Opportunity | assigned to | User | M → 1 | opportunity.assignedTo → user.id | Hard FK | Nullable |
| R28 | Opportunity | followed by | User | M ↔ M | opportunity.followers[] → user.id | Embedded array FK | — |
| R29 | Opportunity | has many | Task | 1 → M | task.opportunityId → opportunity.id | Soft FK | Less common; tasks are primarily contact-scoped |
| R30 | Opportunity | has many | Note | 1 → M | note.opportunityId → opportunity.id | Soft FK | — |
| R31 | Opportunity | linked to | Offer (Custom) | 1 → M | Associations API | Associations API | An opportunity can have multiple offer rounds |
| R32 | Opportunity | linked to | Transaction (Custom) | 1 → 1 | Associations API | Associations API | Won opportunity → one closed transaction |
| R33 | Opportunity | linked to | Property MLS (Custom) | M → 1 | Associations API | Associations API | Opportunity is for a specific MLS property |
| R34 | Opportunity | linked to | My Listings (Custom) | M → 1 | Associations API | Associations API | Opportunity is for one of agent's listings |
| R35 | Pipeline | contains | Pipeline Stage | 1 → M | pipelineStage.pipelineId (embedded in pipeline.stages[]) | Embedded | Stages have no independent existence outside pipeline |
| R36 | Pipeline | has many | Opportunity | 1 → M | opportunity.pipelineId → pipeline.id | Hard FK (reverse R24) | — |
| R37 | Pipeline Stage | has many | Opportunity | 1 → M | opportunity.pipelineStageId → pipelineStage.id | Hard FK (reverse R25) | — |
| R38 | Task | belongs to | Contact | M → 1 | task.contactId → contact.id | Hard FK | — |
| R39 | Task | assigned to | User | M → 1 | task.assignedTo → user.id | Hard FK | Nullable |
| R40 | Note | belongs to | Contact | M → 1 | note.contactId → contact.id | Hard FK | — |
| R41 | Note | authored by | User | M → 1 | note.userId → user.id | Hard FK | — |
| R42 | Appointment | belongs to | Contact | M → 1 | appointment.contactId → contact.id | Hard FK | — |
| R43 | Appointment | belongs to | Calendar | M → 1 | appointment.calendarId → calendar.id | Hard FK | — |
| R44 | Appointment | assigned to | User | M → 1 | appointment.userId → user.id | Hard FK | The team member conducting the meeting |
| R45 | Appointment | belongs to | Calendar Group | M → 1 | appointment.groupId → calendarGroup.id | Soft FK | Nullable; set for round-robin bookings |
| R46 | Calendar | belongs to | Calendar Group | M → 1 | calendar.groupId → calendarGroup.id | Hard FK | Nullable |
| R47 | Calendar | has many | Appointment | 1 → M | appointment.calendarId → calendar.id | Hard FK (reverse R43) | — |
| R48 | Calendar | has many | Block Slot | 1 → M | blockSlot.calendarId → calendar.id | Hard FK | — |
| R49 | Calendar | uses | Form | M → 1 | calendar.formId → form.id | Soft FK | Intake form shown at booking; nullable |
| R50 | Calendar | staffed by | User | M ↔ M | calendar.teamMembers[].userId → user.id | Embedded array FK | Multiple users per calendar (round-robin / collective) |
| R51 | Calendar Group | has many | Calendar | 1 → M | calendar.groupId → calendarGroup.id | Hard FK (reverse R46) | — |
| R52 | Conversation | belongs to | Contact | M → 1 | conversation.contactId → contact.id | Hard FK | conversation.fullName, email, phone are denormalized from contact |
| R53 | Conversation | assigned to | User | M → 1 | conversation.userId → user.id | Hard FK | Nullable |
| R54 | Conversation | has many | Message | 1 → M | message.conversationId → conversation.id | Hard FK | — |
| R55 | Message | belongs to | Conversation | M → 1 | message.conversationId → conversation.id | Hard FK | — |
| R56 | Message | sent by | User | M → 1 | message.userId → user.id | Soft FK | Null for inbound messages and automated sends |
| R57 | Form | has many | Form Submission | 1 → M | formSubmission.formId → form.id | Hard FK | — |
| R58 | Form | creates / matches | Contact | 1 → M | formSubmission.contactId → contact.id | Trigger (platform logic) | Contact auto-created/matched on submit |
| R59 | Form | used by | Calendar | 1 → M | calendar.formId → form.id | Soft FK (reverse R49) | — |
| R60 | Survey | has many | Survey Submission | 1 → M | surveySubmission.surveyId → survey.id | Hard FK | — |
| R61 | Workflow | enrolls | Contact | M ↔ M | Platform enrollment record | Internal table | Platform tracks active/completed/error status per contact |
| R62 | Workflow | triggered by | Trigger Link | M ↔ M | Workflow trigger config (JSON) | Config reference | A trigger link can fire multiple workflows |
| R63 | Trigger Link | fires | Workflow | M ↔ M | Workflow trigger config (JSON) | Config reference | — |
| R64 | Funnel | has many | Funnel Page | 1 → M | funnelPage.funnelId → funnel.id | Hard FK | Ordered by sequence |
| R65 | Funnel / Website | generates | Order | 1 → M | order.sourceMeta.funnelId → funnel.id | Soft FK (denorm) | Via order.sourceType = funnel |
| R66 | Blog Site | has many | Blog Post | 1 → M | blogPost.blogId → blogSite.id | Hard FK | — |
| R67 | Product | has many | Product Price | 1 → M | productPrice.productId → product.id | Hard FK | — |
| R68 | Product | appears in | Order | M ↔ M | order.items[].productId → product.id | Embedded denorm | Line items store productId + snapshot of name/price |
| R69 | Product Price | used in | Order | M ↔ M | order.items[].priceId → productPrice.id | Embedded denorm | — |
| R70 | Product Price | used in | Invoice | M ↔ M | invoice.items[].priceId → productPrice.id | Embedded denorm | — |
| R71 | Order | belongs to | Contact | M → 1 | order.contactId → contact.id | Hard FK | — |
| R72 | Order | has many | Order Fulfillment | 1 → M | orderFulfillment.orderId → order.id | Hard FK | Typically 1:1 but split fulfillment is supported |
| R73 | Order | uses | Coupon | M → 1 | order.couponId → coupon.id | Soft FK | Nullable |
| R74 | Invoice | belongs to | Contact | M → 1 | invoice.contactId → contact.id | Hard FK | — |
| R75 | Invoice | generated by | Invoice Schedule | M → 1 | invoice.scheduleId → invoiceSchedule.id | Soft FK | Nullable for one-time invoices |
| R76 | Invoice Schedule | belongs to | Contact | M → 1 | invoiceSchedule.contactId → contact.id | Hard FK | — |
| R77 | Invoice Schedule | generates | Invoice | 1 → M | Reverse of R75 | Platform scheduler | — |
| R78 | Membership Offer | bundles | Course | M ↔ M | membershipOffer.courseIds[] → course.id | Embedded array FK | One offer can bundle multiple courses |
| R79 | Membership Offer | grants | Membership Access | 1 → M | membershipAccess.offerId → membershipOffer.id | Hard FK | — |
| R80 | Membership Access | belongs to | Contact | M → 1 | membershipAccess.contactId → contact.id | Hard FK | — |
| R81 | Membership Access | grants access to | Membership Offer | M → 1 | membershipAccess.offerId → membershipOffer.id | Hard FK (reverse R79) | — |
| R82 | Course | has many | Course Category | 1 → M | courseCategory.courseId → course.id | Hard FK | Ordered by courseCategory.order |
| R83 | Course Category | has many | Course Post (Lesson) | 1 → M | coursePost.categoryId → courseCategory.id | Hard FK | Ordered by coursePost.order |
| R84 | Media Folder | has many | Media File | 1 → M | mediaFile.folderId → mediaFolder.id | Soft FK | Nullable (null = root level) |
| R85 | Media Folder | has many | Media Folder | 1 → M | mediaFolder.parentId → mediaFolder.id | Self-referential FK | Recursive folder hierarchy |
| R86 | Custom Field | defines schema for | Contact | M → 1 | customField.objectKey = "contact" | Config reference | — |
| R87 | Custom Field | defines schema for | Opportunity | M → 1 | customField.objectKey = "opportunity" | Config reference | — |
| R88 | Custom Field | defines schema for | Custom Object | M → 1 | customField.objectKey = "custom_objects.{key}" | Config reference | — |
| R89 | Custom Field | grouped by | Custom Field Folder | M → 1 | customField.parentId → customFieldFolder.id | Soft FK | Nullable; UI grouping only |
| R90 | Review | linked to | Contact | M → 1 | review.contactId → contact.id | Soft FK | Nullable — unmatched reviews allowed |
| R91 | Review Request | sent to | Contact | M → 1 | reviewRequest.contactId → contact.id | Hard FK | — |
| R92 | Document | sent to | Contact | M → 1 | document.contactId → contact.id | Hard FK | — |
| R93 | Document | created from | Document Template | M → 1 | document.templateId → documentTemplate.id | Soft FK | Nullable |
| R94 | Offer (Custom) | linked to | Property MLS (Custom) | M → 1 | Associations API | Associations API | An offer is made on one MLS property |
| R95 | Offer (Custom) | linked to | Transaction (Custom) | 1 → 1 | Associations API | Associations API | Accepted offer progresses into one transaction |
| R96 | Offer (Custom) | linked to | My Listings (Custom) | M → 1 | Associations API | Associations API | Offer on agent's own listing |
| R97 | My Listings (Custom) | linked to | Property MLS (Custom) | 1 → 1 | Associations API | Associations API | Agent's listing = an MLS property record |
| R98 | Transaction (Custom) | linked to | Property MLS (Custom) | M → 1 | Associations API | Associations API | Transaction is for a specific property |
| R99 | Transaction (Custom) | linked to | My Listings (Custom) | M → 1 | Associations API | Associations API | Transaction from agent's own listing |
| R100 | User | owns | Calendar | 1 → M | calendar.teamMembers[].userId → user.id | Embedded array FK | — |
| R101 | User | assigned | Task | 1 → M | task.assignedTo → user.id | Hard FK (reverse R39) | — |
| R102 | User | authored | Note | 1 → M | note.userId → user.id | Hard FK (reverse R41) | — |
| R103 | User | assigned | Conversation | 1 → M | conversation.userId → user.id | Hard FK (reverse R53) | — |
| R104 | User | assigned | Opportunity | 1 → M | opportunity.assignedTo → user.id | Hard FK (reverse R27) | — |
| R105 | User | assigned | Contact | 1 → M | contact.assignedTo → user.id | Hard FK (reverse R17) | — |

## 4.2 — Per-Object Relationship Summary
A quick-reference view showing all relationships from each major object:

Contact — Relationship Hub
Contact (1)
├──► Company / Business     [M→1]  contact.businessId
├──► User (assigned)        [M→1]  contact.assignedTo
├──► User (followers)       [M↔M]  contact.followers[]
├──► Opportunity            [1→M]  opportunity.contact.id
├──► Task                   [1→M]  task.contactId
├──► Note                   [1→M]  note.contactId
├──► Appointment            [1→M]  appointment.contactId
├──► Conversation           [1→M]  conversation.contactId
├──► Form Submission        [1→M]  formSubmission.contactId
├──► Survey Submission      [1→M]  surveySubmission.contactId
├──► Order                  [1→M]  order.contactId
├──► Invoice                [1→M]  invoice.contactId
├──► Invoice Schedule       [1→M]  invoiceSchedule.contactId
├──► Review Request         [1→M]  reviewRequest.contactId
├──► Review                 [1→M]  review.contactId (soft)
├──► Document / Contract    [1→M]  document.contactId
├──► Membership Access      [1→M]  membershipAccess.contactId
├──► Workflow               [M↔M]  enrollment record (internal)
├──► Campaign               [M↔M]  enrollment record (internal)
├──► Offer (Custom)         [1→M]  Associations API
├──► Property MLS (Custom)  [M↔M]  Associations API
├──► My Listings (Custom)   [M↔M]  Associations API
└──► Transaction (Custom)   [1→M]  Associations API
Company — Relationship Summary
Company (1)
└──► Contact                [1→M]  contact.businessId (reverse)
Opportunity — Relationship Summary
Opportunity (1)
├──► Contact                [M→1]  opportunity.contact.id (+ denorm)
├──► Pipeline               [M→1]  opportunity.pipelineId
├──► Pipeline Stage         [M→1]  opportunity.pipelineStageId
├──► User (assigned)        [M→1]  opportunity.assignedTo
├──► User (followers)       [M↔M]  opportunity.followers[]
├──► Offer (Custom)         [1→M]  Associations API
├──► Transaction (Custom)   [1→1]  Associations API
├──► Property MLS (Custom)  [M→1]  Associations API
└──► My Listings (Custom)   [M→1]  Associations API
Pipeline — Relationship Summary
Pipeline (1)
├──► Pipeline Stage         [1→M]  embedded in pipeline.stages[] (R35)
└──► Opportunity            [1→M]  opportunity.pipelineId (reverse) (R36)
Custom Objects — Cross-Object Relationship Map
Contact ──────────────────────────────────────────────┐
    │  [1→M] Associations API                         │
    ▼                                                 │
  Offer (real_estate_offer)                           │
    │  [M→1] Associations API                         │
    ├──► Property MLS (properties) ◄──────────────────┤
    │       [1→1]                                     │  [M↔M]
    │       My Listings (my_listings) ◄───────────────┤
    │                                                 │
    ▼  [1→1] Associations API                        │
  Transaction (transactions)                          │
    ├──► Contact                [M→1] Assoc. API ◄───┘
    ├──► Opportunity            [1→1] Assoc. API
    ├──► Property MLS           [M→1] Assoc. API
    └──► My Listings            [M→1] Assoc. API
Calendar — Relationship Summary
Calendar (1)
├──► Calendar Group         [M→1]  calendar.groupId
├──► User (team members)    [M↔M]  calendar.teamMembers[].userId
├──► Form (intake)          [M→1]  calendar.formId (optional)
├──► Appointment            [1→M]  appointment.calendarId (reverse)
└──► Block Slot             [1→M]  blockSlot.calendarId (reverse)
Commerce — Relationship Chain
Product (1)
└──► Product Price          [1→M]  productPrice.productId
         └──► Order         [M↔M]  order.items[].priceId (denorm)
         └──► Invoice       [M↔M]  invoice.items[].priceId (denorm)

Order (1)
├──► Contact                [M→1]  order.contactId
├──► Order Fulfillment      [1→M]  orderFulfillment.orderId
├──► Coupon                 [M→1]  order.couponId (optional)
└──► Product / Price        [M↔M]  order.items[] (denorm line items)

Invoice (1)
├──► Contact                [M→1]  invoice.contactId
├──► Invoice Schedule       [M→1]  invoice.scheduleId (optional)
└──► Product / Price        [M↔M]  invoice.items[] (denorm line items)
Memberships — Relationship Chain
Membership Offer (1)
├──► Course                 [M↔M]  membershipOffer.courseIds[]
│       └──► Course Category [1→M]  courseCategory.courseId
│                └──► Course Post [1→M]  coursePost.categoryId
└──► Membership Access      [1→M]  membershipAccess.offerId
         └──► Contact       [M→1]  membershipAccess.contactId
## 4.3 — Associations API Framework
The platform's Associations module enables formally defined, bidirectional relationships between any two objects (standard or custom). This is the mechanism used to link your custom real estate objects to each other and to Contacts/Opportunities.

Association Schema Fields
| Field | Type | Description |
| --- | --- | --- |
| id | TEXT | System-generated association record ID |
| locationId | ID | Sub-account scope |
| key | TEXT | Unique identifier for this relation type (e.g. contact_to_offer) |
| label | TEXT | Human-readable relation name (e.g. "Buyer Contact") |
| fromObjectKey | TEXT | Source object key (e.g. contact) |
| toObjectKey | TEXT | Target object key (e.g. custom_objects.real_estate_offer) |
| relationType | PICKLIST | See enum below |

Association Relation Types
| Relation Type | Description | Example |
| --- | --- | --- |
| ONE_TO_ONE | One source record links to one target record | Accepted Offer → one Transaction |
| ONE_TO_MANY | One source links to many targets | Contact → many Offers |
| MANY_TO_ONE | Many sources link to one target | Many Offers → one Property MLS |
| MANY_TO_MANY | Sources and targets link freely to each other | Contacts ↔ Properties (MLS) |

How Association Records Work
When an association record is created:

Association Record
├── fromObjectKey:  "contact"
├── toObjectKey:    "custom_objects.real_estate_offer"
├── fromRecordId:   "{contactId}"
├── toRecordId:     "{offerId}"
├── relationType:   "ONE_TO_MANY"
└── locationId:     "{locationId}"
Associations are stored independently from both parent records
Deleting a parent record does not automatically delete its association records
The Associations API supports fetching all records associated with a given record: GET /associations/{objectKey}/{recordId}
Associations are bidirectional — querying from either side returns the linked record
## 4.4 — Denormalization Map
Several fields across the platform store copies of data from related records at write time. These fields do not automatically sync when the source record changes and must be understood as point-in-time snapshots.

| Object | Denormalized Field | Source Field | Sync Behavior |
| --- | --- | --- | --- |
| Opportunity | contact.name | contact.firstName + lastName | Written on create/update; not auto-synced on contact name change |
| Opportunity | contact.email | contact.email | Written on create/update; not auto-synced |
| Opportunity | contact.phone | contact.phone | Written on create/update; not auto-synced |
| Opportunity | contact.companyName | contact.companyName | Written on create/update; not auto-synced |
| Contact | businessName | business.name | Auto-synced when linked Business name changes |
| Conversation | fullName | contact.name | Synced on conversation update |
| Conversation | email | contact.email | Synced on conversation update |
| Conversation | phone | contact.phone | Synced on conversation update |
| Conversation | tags | contact.tags | Synced on conversation update |
| Order | contactSnapshot | Full contact record | Frozen at purchase time — permanent snapshot |
| Invoice | contactDetails | Contact fields | Frozen at invoice creation — permanent snapshot |
| Invoice | businessDetails | Sub-account business info | Frozen at invoice creation — permanent snapshot |
| Message | contactId | Via conversation.contactId | Derived, not directly set |

## 4.5 — Relationship Integrity Rules
| Rule | Detail |
| --- | --- |
| Orphaned Tasks | If a Contact is deleted, linked Tasks remain but contactId becomes a dangling reference |
| Orphaned Notes | Same as Tasks — Notes are not cascade-deleted |
| Conversation Dedup | The platform enforces one Conversation per Contact per channel type — a second SMS to the same contact opens the existing conversation |
| Opportunity Contact | An Opportunity must have a linked Contact — the relationship is required at create time |
| Pipeline Stage integrity | Moving an Opportunity to a stage from a different Pipeline requires updating both pipelineId and pipelineStageId simultaneously |
| Membership Access uniqueness | One Contact can have multiple Access records (e.g. re-enroll after expiry) — uniqueness is NOT enforced |
| Custom Object uniqueness | Only custom_objects.properties.mls has a unique constraint enforced across all custom objects in this account |
| Association orphans | Deleting a Contact or Opportunity does not cascade-delete Associations API records — orphaned links must be manually cleaned |
| Invoice line item snapshots | Once an Invoice is sent, line item data is frozen. Updating the source Product Price does not alter the invoice |
