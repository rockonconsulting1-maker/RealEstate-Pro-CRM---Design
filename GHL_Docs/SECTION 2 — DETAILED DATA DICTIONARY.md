# SECTION 2 — DETAILED DATA DICTIONARY
📋 Master Legend
Data Type Reference
| Symbol | Storage Format | Notes |
| --- | --- | --- |
| TEXT | VARCHAR ≤255 | Short strings, codes, slugs |
| LARGE_TEXT | Unlimited text | Rich text, HTML, textarea |
| NUMBER | Decimal / Integer | Stored as float64 |
| CURRENCY | Decimal | Stored as major unit (e.g. 99.00); API uses MONETORY (platform typo — documented as-is) |
| DATE | YYYY-MM-DD | Date only, no time |
| DATETIME | ISO 8601 UTC | Full timestamp |
| BOOLEAN | true / false | — |
| PICKLIST | Enum string | Single-select; options enumerated below each table |
| MULTI-SELECT | string[] | Multiple selectable enum values |
| PHONE | E.164 string | e.g. +14035551234 |
| EMAIL | RFC 5321 string | Validated format |
| URL | Full URL string | http/https |
| FILE | URL reference | CDN URL to uploaded file |
| JSON | Nested object | Structure described inline |
| ARRAY[type] | Typed array | e.g. ARRAY[TEXT], ARRAY[ID] |
| ID | 24-char hex / UUID | Foreign key reference (ObjectId) |

Constraint Key
| Symbol | Meaning |
| --- | --- |
| R | Required on create |
| U | Unique within sub-account |
| S | System-generated / auto-set |
| RO | Read-only (cannot be user-modified) |
| IDX | Indexed — used in search/filter |
| D:x | Default value x |

## GROUP A — Core CRM Objects
## 2.1 — Contact (contact)
Description: The foundational record of the CRM. Every person — lead, prospect, or customer — is a Contact. All activities, conversations, tasks, appointments, opportunities, and transactions are ultimately linked to a Contact. Contacts are scoped to a locationId (sub-account) and can be linked to a Company (business) record.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Record ID | id | TEXT | — | S, U, RO, IDX | 24-char system-generated MongoDB ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account reference |
| First Name | firstName | TEXT | — | IDX | Contact's first name |
| Last Name | lastName | TEXT | — | IDX | Contact's last name |
| Full Name | name | TEXT | — | S, IDX | Auto-concatenated firstName + lastName |
| Primary Email | email | EMAIL | — | IDX | Primary email address |
| Email (Lowercase) | emailLowerCase | EMAIL | — | S, IDX | Lowercase version of email — used for deduplication |
| Primary Phone | phone | PHONE | — | IDX | Primary phone number (E.164 preferred) |
| Mobile Phone | mobile | PHONE | — | — | Secondary mobile/cell number |
| Address Line 1 | address1 | TEXT | — | — | Street address |
| Address Line 2 | address2 | TEXT | — | — | Apt, suite, unit number |
| City | city | TEXT | — | — | City |
| State / Province | state | TEXT | — | — | State or province |
| Country | country | TEXT | — | — | ISO 3166-1 alpha-2 country code (e.g. CA, US) |
| Postal / ZIP Code | postalCode | TEXT | — | — | Postal or ZIP code |
| Timezone | timezone | TEXT | — | — | IANA timezone string (e.g. America/Edmonton) |
| Company Name | companyName | TEXT | — | IDX | Employer / business name |
| Website | website | URL | — | — | Contact's personal or business website |
| Date of Birth | dob | DATE | — | — | Date of birth (YYYY-MM-DD) |
| Gender | gender | PICKLIST | See enum ↓ | — | Gender identity |
| Contact Type | type | PICKLIST | See enum ↓ | D:lead | Lead classification |
| Source | source | TEXT | — | — | Lead origin (free text or UTM source value; e.g. Google Ads, Referral) |
| Assigned To | assignedTo | ID | — | — | User ID of assigned sales rep |
| Linked Company ID | businessId | ID | — | — | Associated Company (business) record ID |
| Company Name (Denorm.) | businessName | TEXT | — | S | Auto-synced from linked Business record |
| DND — Master | dnd | BOOLEAN | — | D:false | Master Do Not Disturb flag — overrides all channels when true |
| DND Settings | dndSettings | JSON | — | — | Per-channel DND config (see DND structure below) |
| Inbound DND | inboundDndActive | BOOLEAN | — | D:false | Blocks inbound messages from reaching the inbox |
| Tags | tags | ARRAY[TEXT] | — | — | Array of tag strings applied to this contact |
| Custom Fields | customFields | ARRAY[JSON] | — | — | [{id, value}] — all custom field data for this contact |
| Followers | followers | ARRAY[ID] | — | — | User IDs of team members following this contact |
| Additional Emails | additionalEmails | ARRAY[EMAIL] | — | — | Up to 3 secondary email addresses |
| Additional Phones | additionalPhones | ARRAY[JSON] | — | — | [{label, phoneNumber, code}] additional phone numbers |
| Lead Keyword | keyword | TEXT | — | — | PPC or search keyword that generated this lead |
| Lead Medium | medium | TEXT | — | — | Traffic medium at first touch (e.g. organic, cpc) |
| Medium ID | mediumId | TEXT | — | — | Identifier for the medium source |
| Attribution Source | attributionSource | JSON | — | S | First-touch UTM + traffic attribution snapshot (see Attribution structure below) |
| Contact Score | contactScore | NUMBER | — | S, RO | Platform-computed engagement/lead score |
| Last Activity | lastActivity | DATETIME | — | S, RO | Most recent activity timestamp (message, appt., task, etc.) |
| Last Appointment | dateOfLastAppointment | DATETIME | — | S, RO | Most recent confirmed appointment timestamp |
| First Session | firstSessionActivityAt | DATETIME | — | S, RO | Timestamp of first tracked website visit or session |
| Last Session | lastSessionActivityAt | DATETIME | — | S, RO | Timestamp of most recent website session |
| Created At | dateAdded | DATETIME | — | S, RO | Record creation timestamp (UTC) |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp (UTC) |
| Created By | createdBy | JSON | — | S, RO | {userId, name} of the user or system that created the record |

Enum: gender

| Value | Label |
| --- | --- |
| male | Male |
| female | Female |
| other | Other |
| prefer_not_to_say | Prefer Not to Say |
| unknown | Unknown |

Enum: type

| Value | Label |
| --- | --- |
| lead | Lead |
| customer | Customer |

dndSettings JSON Structure

```json
dndSettings: {
  "Call":     { "status": "active|inactive", "message": string, "code": string },
  "Email":    { "status": "active|inactive", "message": string, "code": string },
  "SMS":      { "status": "active|inactive", "message": string, "code": string },
  "WhatsApp": { "status": "active|inactive", "message": string, "code": string },
  "GMB":      { "status": "active|inactive", "message": string, "code": string },
  "FB":       { "status": "active|inactive", "message": string, "code": string }
}
```
| Sub-field | Type | Values | Description |
| --- | --- | --- | --- |
| status | PICKLIST | active / inactive | Whether DND is on for this channel |
| message | TEXT | Any | Custom DND opt-out message |
| code | TEXT | Any | Internal code/reason for DND status |

attributionSource JSON Structure

| Sub-field | Type | Description |
| --- | --- | --- |
| url | URL | Landing page URL at first touch |
| campaign | TEXT | UTM campaign name |
| utmSource | TEXT | UTM source parameter |
| utmMedium | TEXT | UTM medium parameter |
| utmContent | TEXT | UTM content parameter |
| utmKeyword | TEXT | UTM keyword/term parameter |
| referrer | TEXT | Referring domain |
| campaignId | TEXT | Internal or ad-platform campaign ID |
| fbclid | TEXT | Facebook click identifier |
| gclid | TEXT | Google click identifier |
| fbc | TEXT | Facebook browser cookie |
| fbp | TEXT | Facebook pixel ID |
| medium | TEXT | Channel medium (mirrors top-level medium) |
| mediumId | TEXT | Medium-specific identifier |
| fbEventId | TEXT | Facebook Conversions API event ID |

## 2.2 — Company (business)
Description: Represents a business or organisation entity. Contacts can be linked to a Company via businessId. Companies hold firmographic data and can have their own custom fields.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Record ID | id | TEXT | — | S, U, RO, IDX | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Company Name | name | TEXT | — | R, IDX | Business/organisation name |
| Email | email | EMAIL | — | IDX | Primary business email |
| Phone | phone | PHONE | — | — | Primary business phone |
| Address | address | TEXT | — | — | Street address |
| City | city | TEXT | — | — | City |
| State / Province | state | TEXT | — | — | State or province |
| Country | country | TEXT | — | — | ISO 3166-1 alpha-2 country code |
| Postal / ZIP Code | postalCode | TEXT | — | — | Postal or ZIP code |
| Website | website | URL | — | — | Company website |
| Description | description | LARGE_TEXT | — | — | Business description |
| Annual Revenue | revenue | NUMBER | — | — | Annual revenue (numeric, no currency formatting) |
| Employee Count | employees | NUMBER | — | — | Number of employees |
| Industry | industry | TEXT | — | — | Industry / sector (free text) |
| Custom Fields | customFields | ARRAY[JSON] | — | — | [{id, value}] custom field data |
| Created At | dateAdded | DATETIME | — | S, RO | Record creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.3 — Opportunity (opportunity)
Description: A sales deal tracked through pipeline stages. Each Opportunity belongs to a Pipeline and is linked to a primary Contact. Contact data is denormalized into Opportunity for indexed searching. Opportunities support tags, custom fields, and follower tracking.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Record ID | id | TEXT | — | S, U, RO, IDX | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Opportunity Name | name | TEXT | — | R, IDX | Deal name (e.g. "123 Main St — Buyer") |
| Pipeline ID | pipelineId | ID | — | R | Linked Pipeline record |
| Pipeline Stage ID | pipelineStageId | ID | — | R | Current stage within the pipeline |
| Status | status | PICKLIST | See enum ↓ | D:open | Deal outcome status |
| Monetary Value | monetaryValue | NUMBER | — | — | Deal value (in sub-account default currency) |
| Source | source | TEXT | — | — | Lead origin for this opportunity |
| Assigned To | assignedTo | ID | — | — | User ID of the assigned rep |
| Lost Reason | lostReason | TEXT | — | — | Reason the deal was lost (free text) |
| Tags | tags | ARRAY[TEXT] | — | — | Tag strings for segmentation |
| Followers | followers | ARRAY[ID] | — | — | User IDs following this opportunity |
| Contact ID | contact.id | ID | — | R, IDX | Primary linked Contact record ID |
| Contact Name | contact.name | TEXT | — | S, IDX | Denormalized from Contact |
| Contact Email | contact.email | EMAIL | — | S, IDX | Denormalized primary email |
| Contact Phone | contact.phone | PHONE | — | S, IDX | Denormalized primary phone |
| Company Name | contact.companyName | TEXT | — | S, IDX | Denormalized company/business name |
| Custom Fields | customFields | ARRAY[JSON] | — | — | [{id, value}] custom field values |
| Last Stage Change | lastStageChangeAt | DATETIME | — | S, RO | When the stage was last moved |
| Last Status Change | lastStatusChangeAt | DATETIME | — | S, RO | When status (won/lost/etc.) last changed |
| Created At | dateAdded | DATETIME | — | S, RO | Record creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |
| Created By | createdBy | ID | — | S, RO | User ID who created this opportunity |

Enum: status

| Value | Label | Description |
| --- | --- | --- |
| open | Open | Deal is active and in progress |
| won | Won | Deal successfully closed |
| lost | Lost | Deal was lost to a competitor or abandoned |
| abandoned | Abandoned | Contact disengaged; deal paused indefinitely |

## GROUP B — Real Estate Custom Objects (Live API Schema — Real Estate Pro CRM Dev)
These tables include the actual Field ID, Field Key, and all platform metadata pulled directly from your sub-account's Objects API on July 1, 2026.

## 2.4 — Offer (custom_objects.real_estate_offer)
Object ID: 6a44a1e75fd80c971d76b5f0
Description: Tracks buyer and seller offer negotiations, contingencies, financing type, possession timelines, and deal history. Primary display: offer_id. Required: offer_id.
Searchable Properties: offer_id, property_address, mls_number

| Field ID | Field Name | Field Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- | --- |
| dO5iKzhSrRJrIQFYEVOB | Offer ID | custom_objects.real_estate_offer.offer_id | TEXT | — | R, IDX | Unique identifier for this offer (e.g. OFF-2026-001) |
| n2fOf8lWD8Ln0HR1tesS | Property Address | custom_objects.real_estate_offer.property_address | TEXT | — | IDX | Civic address of the subject property |
| A2PQQ875LuwQagaFYgUi | MLS Number | custom_objects.real_estate_offer.mls_number | TEXT | — | IDX | MLS listing number this offer applies to |
| fSS35Mo3pGSKUYGo2h2I | Legal Description | custom_objects.real_estate_offer.legal_description | LARGE_TEXT | — | — | Full legal property description |
| tBtXWvnAJIqduRD0VhqI | Purchase Price | custom_objects.real_estate_offer.purchase_price | CURRENCY | — | — | Offered purchase price |
| wl3o4mY7QjINClIAdvLi | Deposit Amount | custom_objects.real_estate_offer.deposit_amount | CURRENCY | — | — | Initial deposit submitted with offer |
| hMa3mSFhfabEMbOS5Gss | Additional Deposit | custom_objects.real_estate_offer.additional_deposit | CURRENCY | — | — | Second deposit due upon condition removal |
| kqYEREK0veXQM2tKlwCV | Counter Offer Price | custom_objects.real_estate_offer.counter_price | CURRENCY | — | — | Counter-offer price (if countered) |
| qwax2V7R3lqBfcU7Nssu | Commission Amount | custom_objects.real_estate_offer.commission_amount | CURRENCY | — | — | Total commission tied to this offer |
| yFf8ncQQ9Ptyb9FUe7Nb | Commission Split | custom_objects.real_estate_offer.commission_split | TEXT | — | — | Commission split description (e.g. 2.5% / 1.5%) |
| FSL7LVLZe9Ib8hlsFRz8 | Offer Status | custom_objects.real_estate_offer.status | PICKLIST | See enum ↓ | — | Current negotiation status |
| hF7ky0TrvtUYXLDhhnlZ | Offer Type | custom_objects.real_estate_offer.offer_type | PICKLIST | See enum ↓ | — | Direction / type of this offer |
| 1oslui0yBG7IPzJqIDB4 | Financing Type | custom_objects.real_estate_offer.financing_type | PICKLIST | See enum ↓ | — | Buyer's financing method |
| hap4p13I2eQRHhhpHUOz | Offer Date | custom_objects.real_estate_offer.offer_date | DATE | — | — | Date the offer was written |
| UTCcaUijY5kpobo752ie | Offer Expiry | custom_objects.real_estate_offer.expiry_date | DATE | — | — | Irrevocability deadline for the offer |
| 8nnLD72E94aFD98rGfWX | Possession Date | custom_objects.real_estate_offer.possession_date | DATE | — | — | Requested possession/closing date |
| bbBK9MoAFVIKDh1cyFQ6 | Closing Date | custom_objects.real_estate_offer.closing_date | DATE | — | — | Actual or target closing date |
| xrJYkxYmVvd4XbPdLyOH | Conditions Deadline | custom_objects.real_estate_offer.conditions_deadline | DATE | — | — | Date by which all conditions must be waived |
| s96UqBcmhU9wDyoP1fV7 | Conditions | custom_objects.real_estate_offer.conditions | LARGE_TEXT | — | — | List of conditions (e.g. financing, inspection, sale of property) |
| rlzIWzfeSPo3r0Lumun6 | Contingencies | custom_objects.real_estate_offer.contingencies | LARGE_TEXT | — | — | Contingency clauses requiring resolution before closing |
| yYLZnGCKSZkeMEVuLYwa | Terms & Conditions | custom_objects.real_estate_offer.terms_conditions | LARGE_TEXT | — | — | Full terms and conditions of the offer |
| CF7waEmBeFJ67cL6TGTV | Included Chattels | custom_objects.real_estate_offer.included_chattels | LARGE_TEXT | — | — | Items included in the sale (appliances, fixtures, etc.) |
| HR7qNngxIHHc8ugS1B6k | Excluded Fixtures | custom_objects.real_estate_offer.excluded_fixtures | LARGE_TEXT | — | — | Fixtures the seller is retaining |
| MxH0Zpds55SDxyN3I9Bi | Notes / Addendums | custom_objects.real_estate_offer.notes | LARGE_TEXT | — | — | Additional notes, addendums, or special clauses |
| jhPHsrKgACWou2Ffmeki | Offer Submitted By | custom_objects.real_estate_offer.submitted_by | TEXT | — | — | Name or brokerage of the submitting agent |
| ZGAV3sDd41sTGgGQ7CxG | Documents Ref | custom_objects.real_estate_offer.documents_ref | TEXT | — | — | Comma-separated Supabase Storage document UUIDs linked to this offer |

Enum: status (Offer Status)

| Value | Label |
| --- | --- |
| pending | Pending |
| accepted | Accepted |
| countered | Countered |
| rejected | Rejected |
| closed | Closed |
| expired | Expired |

Enum: offer_type

| Value | Label |
| --- | --- |
| buyer_offer | Buyer Offer (Sent) |
| seller_offer | Seller Offer (Received) |
| counter_offer | Counter-Offer |

Enum: financing_type

| Value | Label |
| --- | --- |
| conventional | Conventional |
| cmhc_insured | CMHC Insured |
| cash | Cash |
| private | Private |
| other | Other |

## 2.5 — Property MLS (custom_objects.properties)
Object ID: 6a44a1e75fd80c02ec76b5ef
Description: Master MLS property database for comparables, buyer-property matching, and market analysis. mls is the unique identifier and is enforced as unique within the sub-account.
Searchable Properties: mls, full_address, property_name
Unique Field: custom_objects.properties.mls

| Field ID | Field Name | Field Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- | --- |
| mtLjRTIwAouSQ9JyW5Np | MLS# | custom_objects.properties.mls | TEXT | — | R, U, IDX | MLS listing number — primary key |
| urH4G7YSp0M0NWSQ2MV2 | Property Name | custom_objects.properties.property_name | TEXT | — | IDX | Friendly property name or unit label |
| bd4yyBt6JdUnHsxejVfs | Property Status | custom_objects.properties.property_status | PICKLIST | See enum ↓ | — | Current MLS listing status |
| yU8VSmKb12yVu3etIoUs | Property Type | custom_objects.properties.property_type | PICKLIST | See enum ↓ | — | Primary property classification |
| rLrabG9mA9M3mBPOg5Ra | Property Sub-type | custom_objects.properties.sub_type | PICKLIST | See enum ↓ | — | Detailed property sub-classification |
| vJcBEGnOUDAI9jbM2rrm | Full Address | custom_objects.properties.full_address | TEXT | — | IDX | Complete civic address |
| 2WVypTy4WVOmBaVbka02 | City | custom_objects.properties.city | TEXT | — | — | City |
| K8UCKnqLlLl588t1rTPF | Province | custom_objects.properties.province | TEXT | — | — | Province / State |
| qVrkYkJrje9d8KgKVVYR | Postal Code | custom_objects.properties.postal | TEXT | — | — | Canadian postal code |
| 3altlkebRGkgsRXTaaYS | Latitude | custom_objects.properties.latitude | NUMBER | — | — | GPS latitude coordinate |
| dfXSCpyFiRopfyA8aciK | Longitude | custom_objects.properties.longitude | NUMBER | — | — | GPS longitude coordinate |
| c4kzR0EcUjmKhfpcKXtQ | List Price | custom_objects.properties.list_price | CURRENCY | — | — | Listed asking price |
| Ztb83EJJveFRqLsEKvjs | Sold Price | custom_objects.properties.sold_price | CURRENCY | — | — | Final sold/accepted price |
| 6h1qAa4mhzYvu7e8J66J | HOA/Condo Fees | custom_objects.properties.condo_fees | CURRENCY | — | — | Monthly HOA or condo maintenance fees |
| 5jQmyYYcpbZxLSNVrMAi | Tax Assessment | custom_objects.properties.tax_assessment | CURRENCY | — | — | Municipal tax assessment value |
| czX8z1G4yFJWF4DYklay | Bedrooms | custom_objects.properties.bedrooms | NUMBER | — | — | Total number of bedrooms |
| CcaAIni9MxT3eJMWfylg | Bathrooms | custom_objects.properties.bathrooms | NUMBER | — | — | Total number of bathrooms (inc. partial) |
| l0rothtiLCIqeMWlFzao | Square Footage | custom_objects.properties.square_footage | NUMBER | — | — | Total interior area in sq ft |
| nEWf3BYfZUNKr83EYqHV | Lot Size | custom_objects.properties.lot_size | NUMBER | — | — | Lot area (sq ft or acres — label to clarify) |
| u2gghudi2JMmGqwKQf00 | Year Built | custom_objects.properties.year_built | NUMBER | — | — | Year of original construction |
| qcas4sEjHSQl9jBXQD2Y | Garage | custom_objects.properties.garage | PICKLIST | See enum ↓ | — | Garage type / configuration |
| Bw7z03zq6GNVyp6ibKjc | Basement | custom_objects.properties.basement | PICKLIST | See enum ↓ | — | Basement finish level |
| IH4GK6S6fOqtVQXJcmbF | Heating Type | custom_objects.properties.heating_type | PICKLIST | See enum ↓ | — | Primary heating system |
| O2YfPVq0qeMfZzGQ3uI2 | Features / Amenities | custom_objects.properties.features_amenities | LARGE_TEXT | — | — | Comma-separated or prose feature list |
| fBTRvn2wFv7aK1hsih1v | Listing Date | custom_objects.properties.listing_date | DATE | — | — | Date listed on MLS |
| fIOUJOmJyou8PDP57azr | Listing Expiry | custom_objects.properties.listing_expiry | DATE | — | — | Date the listing agreement expires |
| Ffsm3AF8PbNorHh4k66W | Sold Date | custom_objects.properties.sold_date | DATE | — | — | Date the property sold / closed |
| 28ij44TBVeG8dSdydqbT | Days on Market | custom_objects.properties.days_on_market | NUMBER | — | — | Cumulative days listed on MLS |
| irQVy9MZ219S6ISTv9CN | Property Images | custom_objects.properties.property_images | FILE | — | — | Uploaded property photo(s) |
| roeXS8PveQUTNnTpDFTC | Listing URL | custom_objects.properties.listing_url | TEXT | — | — | Link to MLS or public listing page |
| rrktDR0OZ2QmqrHUtXaf | Property Notes | custom_objects.properties.property_notes | LARGE_TEXT | — | — | Internal agent notes about the property |
| x4JQZZJvET1O9h2KTHfo | Feature Highlights | custom_objects.properties.feature_highlights | LARGE_TEXT | — | — | Marketing-ready feature copy for listings |
| ZX737UeKdRrxG0ZHQ786 | Documents Ref | custom_objects.properties.documents_ref | TEXT | — | — | Comma-separated Supabase Storage document UUIDs |

Enum: property_status

| Value | Label |
| --- | --- |
| active | Active |
| pending | Pending |
| sold | Sold |
| expired | Expired |
| withdrawn | Withdrawn |
| coming_soon | Coming Soon |

Enum: property_type

| Value | Label |
| --- | --- |
| single_family | Single Family |
| condo | Condo |
| townhouse | Townhouse |
| multifamily | Multi-Family |
| land | Land |
| commercial | Commercial |

Enum: sub_type

| Value | Label |
| --- | --- |
| detached | Detached |
| semi_detached | Semi-Detached |
| row_house | Row House |
| stacked | Stacked |
| suite | Suite |
| other | Other |

Enum: garage

| Value | Label |
| --- | --- |
| none | None |
| single_attached | Single Attached |
| double_attached | Double Attached |
| triple_attached | Triple Attached |
| single_detached | Single Detached |
| double_detached | Double Detached |

Enum: basement

| Value | Label |
| --- | --- |
| none | None |
| unfinished | Unfinished |
| partially_finished | Partially Finished |
| fully_finished | Fully Finished |

Enum: heating_type

| Value | Label |
| --- | --- |
| forced_air | Forced Air |
| baseboard | Baseboard |
| radiant | Radiant |
| boiler | Boiler |
| geothermal | Geothermal |

## 2.6 — My Listings (custom_objects.my_listings)
Object ID: 6a44b1692c3079662fdd9736
Description: Agent's personal active listings, synced from Realtor.ca / MLS for inventory management and marketing automation.
Primary Display: mls_number | Required: mls_number

| Field ID | Field Name | Field Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- | --- |
| RZlVHiTOKsr3jTA3Pk9a | MLS Number | custom_objects.my_listings.mls_number | TEXT | — | R, IDX | MLS listing number |
| 76ETTLr2pWvbtDGmKz5B | Listing Key | custom_objects.my_listings.listing_key | TEXT | — | — | Internal or Realtor.ca API listing key |
| HFWGOC1b0Awaymcbfxik | Listing Status | custom_objects.my_listings.listing_status | PICKLIST | See enum ↓ | — | Current listing lifecycle status |
| gD3Qe8QPeK7kcSSkN2eN | Listing Date | custom_objects.my_listings.listing_date | DATE | — | — | Date listed on MLS |
| mfRsz9JwbgnHHl1AbVYe | Days on Market | custom_objects.my_listings.days_on_market | NUMBER | — | — | Cumulative DOM counter |
| McTus5ypNDMXD6alFHFB | Listing Price | custom_objects.my_listings.listing_price | CURRENCY | — | — | Listed asking price |
| fcEuxD1AYRW91Smo7StF | Realtor.ca URL | custom_objects.my_listings.realtor_url | TEXT | — | — | Public Realtor.ca listing URL |
| oA5288iIXn3y0k0YFnrz | Last Synced | custom_objects.my_listings.last_synced | DATE | — | — | Timestamp of last Realtor.ca / MLS sync |
| n8F7PWx0vw08PnHdpB79 | Notes | custom_objects.my_listings.notes | LARGE_TEXT | — | — | Agent notes for this listing |
| z0N1r5YffPkHj3sP9Rp5 | Tags | custom_objects.my_listings.tags | TEXT | — | — | Comma-separated tags for filtering |
| gQYj8J4j26Emk9coFYmW | Property Address | custom_objects.my_listings.property_address | TEXT | — | — | Civic address |
| YJGEDWZs9u2hOIrTfF0U | City | custom_objects.my_listings.city | TEXT | — | — | City |
| PuVHLgYzSybydNPOVPym | Province | custom_objects.my_listings.province | TEXT | — | — | Province |
| IMllDDp7mnJUbUORFAV6 | Postal Code | custom_objects.my_listings.postal_code | TEXT | — | — | Postal code |
| OwNJUyYRod4dVxKtUvnP | Property Type | custom_objects.my_listings.property_type | PICKLIST | See enum ↓ | — | Property classification |
| 8RMabh0rLMyF9dIXpW1h | Sub-type | custom_objects.my_listings.sub_type | PICKLIST | See enum ↓ | — | Detailed sub-type |
| pdLPmrG6im3VvwC0WCIB | Bedrooms | custom_objects.my_listings.bedrooms | NUMBER | — | — | Bedroom count |
| tYWErsg0eizWxWcylcDx | Bathrooms | custom_objects.my_listings.bathrooms | NUMBER | — | — | Bathroom count |
| XFaxGvTUgbcv7ZmK2gGd | Square Footage | custom_objects.my_listings.square_footage | NUMBER | — | — | Interior sq ft |
| KgdDpqDF7J73wbjYNrZL | Lot Size | custom_objects.my_listings.lot_size | NUMBER | — | — | Lot size (sq ft or acres) |
| pdTMMhwEMDVu3naRlKmn | Year Built | custom_objects.my_listings.year_built | NUMBER | — | — | Year of construction |
| mHRe8tap4ZIuFna7CxKc | Photos URL | custom_objects.my_listings.photos_url | TEXT | — | — | URL or JSON array of listing photo URLs |
| kMT5ZvOFntDbAYIvZH94 | Agent Name | custom_objects.my_listings.agent_name | TEXT | — | — | Listing agent name |
| LfFdzQhDS9e3YuPYBb0m | Brokerage | custom_objects.my_listings.brokerage | TEXT | — | — | Brokerage name |
| 0pRIOXbRyhKtB0FzTNdD | Open House Date | custom_objects.my_listings.open_house_date | DATE | — | — | Next scheduled open house date |
| MsXNPMFyD9FfPSuYuYP3 | Listing Description | custom_objects.my_listings.listing_description | LARGE_TEXT | — | — | Public marketing description |

Enum: listing_status

| Value | Label |
| --- | --- |
| active | Active |
| sold | Sold |
| expired | Expired |
| withdrawn | Withdrawn |
| pending | Pending |

Enum: property_type

| Value | Label |
| --- | --- |
| house | House |
| condo | Condo |
| townhouse | Townhouse |
| land | Land |
| commercial | Commercial |

Enum: sub_type

| Value | Label |
| --- | --- |
| detached | Detached |
| semi_detached | Semi-Detached |
| row_house | Row House |
| stacked | Stacked |
| suite | Suite |

## 2.7 — Transaction (custom_objects.transactions)
Object ID: 6a44b1696a2c18dc4bd8dd08
Description: The deal hub — tracks the full financial lifecycle of a closed real estate deal including commissions, critical dates, and closing coordination.
Primary Display: transaction_id | Required: transaction_id

| Field ID | Field Name | Field Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- | --- |
| yCezXubeMpBWhg7r2hJJ | Transaction ID | custom_objects.transactions.transaction_id | TEXT | — | R, IDX | Unique transaction identifier |
| NbF1aC3K2dX2c8L5pSmi | Transaction Type | custom_objects.transactions.transaction_type | PICKLIST | See enum ↓ | — | Deal category |
| qujP7Lt2jPyYvFbDMcee | Transaction Status | custom_objects.transactions.status | PICKLIST | See enum ↓ | — | Lifecycle stage of the transaction |
| pm6o5WyZV2WAFIcZgHWa | Brokerage(s) | custom_objects.transactions.brokerages | TEXT | — | — | Brokerage names involved (both sides) |
| A3J50CgK0T5ffE6w1ZRt | Commission Split Details | custom_objects.transactions.commission_split_details | LARGE_TEXT | — | — | Breakdown of how commission is split between parties |
| hW22YSmbGchyb9kN8Ulr | Post-Transaction Notes | custom_objects.transactions.post_transaction_notes | LARGE_TEXT | — | — | Notes after closing (referral requests, feedback, etc.) |
| RPqJT6ja8c3Gm47JgxaN | Referral Source | custom_objects.transactions.referral_source | TEXT | — | — | How this client/deal was referred |
| xXS2UUlZHxxVq1a5yHyh | Documents Ref | custom_objects.transactions.documents_ref | TEXT | — | — | Comma-separated document UUIDs linked to this transaction |
| 6CJqELt7b6LXvYxBmmHc | Contract / Sale Price | custom_objects.transactions.contract_price | CURRENCY | — | — | Final agreed sale/purchase price |
| AiLEIbeZxzeM4n3N6AtQ | Deposit / Escrow | custom_objects.transactions.deposit_escrow | CURRENCY | — | — | Total deposit held in trust/escrow |
| z5LTqqzgGFZytGOD4vaa | Commission Amount | custom_objects.transactions.commission_amount | CURRENCY | — | — | Total gross commission earned |
| MU62yWL1dZ9oj9wH8kie | Profit / Net | custom_objects.transactions.profit_net | CURRENCY | — | — | Net amount after splits and expenses |
| 7zIwasmNxSU7rb6kZt9O | Commission Rate (%) | custom_objects.transactions.commission_rate | NUMBER | — | — | Total commission rate as a percentage |
| 0U0iWcwjUJucByAF88Sn | Closing Date | custom_objects.transactions.closing_date | DATE | — | — | Official closing / possession date |
| Jx0ZEV3dcQ5q2MJaRkqS | Inspection Deadline | custom_objects.transactions.inspection_deadline | DATE | — | — | Date inspection condition must be resolved |
| kOAWZZfpB6uiHwYrpUWi | Appraisal Date | custom_objects.transactions.appraisal_date | DATE | — | — | Scheduled property appraisal date |
| SZXNHfeLTiotpfGpYnQS | Financing Deadline | custom_objects.transactions.financing_deadline | DATE | — | — | Date financing condition must be confirmed |
| MRnN77lkcpcu5X216sKJ | Final Walkthrough Date | custom_objects.transactions.final_walkthrough | DATE | — | — | Scheduled final walkthrough with buyer |

Enum: transaction_type

| Value | Label |
| --- | --- |
| sale | Sale |
| purchase | Purchase |
| lease | Lease |
| referral | Referral |

Enum: status (Transaction Status)

| Value | Label |
| --- | --- |
| under_contract | Under Contract |
| pending | Pending |
| closed | Closed |
| cancelled | Cancelled |
| failed | Failed |

## GROUP C — Pipelines
## 2.8 — Pipeline
Description: A named sales pipeline defining the stages a deal moves through. Each sub-account can have multiple pipelines (e.g. Buyer Pipeline, Seller Pipeline, Referral Pipeline).

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Pipeline ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Pipeline Name | name | TEXT | — | R | Display name (e.g. Buyer Pipeline) |
| Stages | stages | ARRAY[JSON] | — | — | Ordered array of embedded Pipeline Stage objects |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.9 — Pipeline Stage (embedded in Pipeline)
Description: An individual stage within a pipeline. Stages are ordered by position and opportunities move between them as deals progress.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Stage ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Stage Name | name | TEXT | — | R | Display name (e.g. Offer Submitted, Under Contract) |
| Position | position | NUMBER | — | R, D:0 | Zero-based sort order within the pipeline |
| Show in Funnel View | showInFunnel | BOOLEAN | — | D:true | Include in the funnel/column board view |
| Show in Pie Chart | showInPieChart | BOOLEAN | — | D:true | Include in pipeline reporting pie chart |

## GROUP D — Activity Objects
## 2.10 — Task
Description: An action item assigned to a user, linked to a Contact record. Tasks have due dates, statuses, and optional descriptions.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Task ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | R | Linked Contact record |
| Assigned To | assignedTo | ID | — | — | User ID responsible for completing the task |
| Title | title | TEXT | — | R | Task title / summary |
| Body | body | LARGE_TEXT | — | — | Task description or additional instructions |
| Due Date | dueDate | DATETIME | — | — | Task due date and time |
| Status | status | PICKLIST | completed / incompleted | D:incompleted | Completion state |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.11 — Note
Description: A free-text note attached to a Contact or Opportunity record. Notes support rich text and record which user authored them.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Note ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | R | Linked Contact record |
| Author User ID | userId | ID | — | S | User who wrote the note |
| Body | body | LARGE_TEXT | — | R | Note content (supports rich/HTML text) |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.12 — Appointment
Description: A booked time slot on a calendar, linked to a Contact. Appointments drive the scheduling workflow, confirmation messages, and no-show tracking.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Appointment ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Calendar ID | calendarId | ID | — | R | Linked Calendar |
| Contact ID | contactId | ID | — | — | Linked Contact |
| Assigned User ID | userId | ID | — | — | Team member the appointment is with |
| Group ID | groupId | ID | — | — | Calendar Group (round-robin context) |
| Title | title | TEXT | — | — | Appointment label (defaults to contact name + calendar name) |
| Notes | notes | LARGE_TEXT | — | — | Internal notes about this appointment |
| Start Time | startTime | DATETIME | — | R | Appointment start (ISO 8601) |
| End Time | endTime | DATETIME | — | R | Appointment end (ISO 8601) |
| Timezone | selectedTimezone | TEXT | — | — | IANA timezone of the booker |
| Status | status | PICKLIST | See enum ↓ | D:new | Attendance / outcome status |
| Address | address | TEXT | — | — | Physical location or virtual meeting link |
| Source | source | PICKLIST | See enum ↓ | — | How the appointment was created |
| Is Recurring | isRecurring | BOOLEAN | — | D:false | Whether part of a recurring series |
| Recurrence Rule | rrule | TEXT | — | — | iCal RRULE string (e.g. FREQ=WEEKLY;BYDAY=MO) |
| Ignore Date Range | ignoreDateRange | BOOLEAN | — | D:false | Bypass calendar date-range restrictions |
| Send Notifications | toNotify | BOOLEAN | — | D:true | Trigger confirmation/reminder messages |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

Enum: status

| Value | Label | Description |
| --- | --- | --- |
| new | New | Booked, not yet confirmed |
| confirmed | Confirmed | Contact confirmed attendance |
| cancelled | Cancelled | Appointment cancelled |
| showed | Showed | Contact attended |
| noshow | No Show | Contact did not attend |
| invalid | Invalid | Booking error or duplicate |

Enum: source

| Value | Label |
| --- | --- |
| widget | Booking Widget |
| external | External (manual import) |
| api | API / Integration |
| manual | Manually Created |

## 2.13 — Call (stored as Message meta for TYPE_CALL)
Description: Phone call records are stored as Message records with type = TYPE_CALL. Call-specific data lives in the meta field of the Message object. The table below documents the meta sub-fields for calls.

| Field Name | Meta Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| From Number | meta.fromNumber | PHONE | — | S | Originating phone number |
| To Number | meta.toNumber | PHONE | — | S | Destination phone number |
| Direction | meta.direction | PICKLIST | inbound / outbound | S | Call direction |
| Call Status | meta.callStatus | PICKLIST | See enum ↓ | S | Call outcome |
| Duration (sec) | meta.duration | NUMBER | — | S | Call duration in seconds |
| Recording URL | meta.recordingUrl | URL | — | S | Link to call recording audio file |
| Transcription | meta.transcription | LARGE_TEXT | — | S | AI-generated call transcription text |

Enum: callStatus

| Value | Label |
| --- | --- |
| completed | Completed |
| no-answer | No Answer |
| busy | Busy |
| failed | Failed |
| cancelled | Cancelled |
| voicemail | Voicemail |

## GROUP E — Calendar Objects
## 2.14 — Calendar
Description: A booking calendar configuration. Defines availability, team members, slot durations, buffers, booking windows, confirmation rules, and the public booking page URL slug.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Calendar ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Group ID | groupId | ID | — | — | Linked Calendar Group ID |
| Name | name | TEXT | — | R | Display name |
| Description | description | LARGE_TEXT | — | — | Shown on public booking page |
| URL Slug | slug | TEXT | — | R, U | Path segment for booking URL |
| Type | type | PICKLIST | See enum ↓ | — | Calendar scheduling model |
| Team Members | teamMembers | ARRAY[JSON] | — | — | [{userId, priority, weight}] |
| Slot Duration | slotDuration | NUMBER | — | D:30 | Appointment length in minutes |
| Slot Interval | slotInterval | NUMBER | — | D:30 | Minutes between available start times |
| Post-Appt Buffer | slotBuffer | NUMBER | — | D:0 | Buffer time after each appointment (minutes) |
| Pre-Appt Buffer | preBuffer | NUMBER | — | D:0 | Buffer time before each appointment (minutes) |
| Appts Per Slot | appoinmentPerSlot | NUMBER | — | D:1 | Max simultaneous bookings per time slot |
| Appts Per Day | appoinmentPerDay | NUMBER | — | — | Daily booking cap (null = unlimited) |
| Min Advance Notice | allowBookingAfter | NUMBER | — | D:0 | Minimum hours/days before a slot can be booked |
| Min Advance Unit | allowBookingAfterType | PICKLIST | hours / days / weeks / months | — | Unit for minimum advance notice |
| Booking Window | allowBookingFor | NUMBER | — | D:60 | How far ahead bookings are accepted |
| Booking Window Unit | allowBookingForType | PICKLIST | days / weeks / months | — | Unit for booking window |
| Timezone | timezone | TEXT | — | — | IANA timezone for this calendar |
| Open Hours | openHours | JSON | — | — | Weekly availability: [{dayOfWeek, hours[{openHour, openMinute, closeHour, closeMinute}]}] |
| Linked Form ID | formId | ID | — | — | Intake form shown during booking |
| Auto-Confirm | autoConfirm | BOOLEAN | — | D:true | Automatically confirm bookings |
| Send Alerts | shouldSendAlerts | BOOLEAN | — | D:true | Send confirmation / reminder emails |
| Google Invites | googleInvitationEmails | BOOLEAN | — | D:false | Send Google Calendar invites to attendees |
| Allow Guests | allowGuestBooking | BOOLEAN | — | D:false | Allow booker to add additional attendees |
| Consent Label | consentLabel | TEXT | — | — | GDPR / CASL consent checkbox label |
| Enable Recurring | enableRecurring | BOOLEAN | — | D:false | Allow recurring appointment booking |
| Pixel ID | pixelId | TEXT | — | — | Meta Pixel ID for conversion tracking |
| Is Active | isActive | BOOLEAN | — | D:true | Whether calendar accepts new bookings |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

Enum: type

| Value | Label | Description |
| --- | --- | --- |
| RoundRobin_OptimizeForAvailability | Round Robin — Availability | Assigns to the first available team member |
| RoundRobin_OptimizeForEqualDistribution | Round Robin — Equal | Distributes evenly across team |
| EventCalendar | Event | Single-slot event (webinar, class) |
| CollectiveBookingCalendar | Collective | All team members required simultaneously |
| ServiceCalendar | Service | Service-based booking |
| ClassBookingCalendar | Class Booking | Group class with capacity limit |
| PersonalCalendar | Personal | Individual 1-on-1 booking page |

## 2.15 — Calendar Group
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Group ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Group display name |
| Description | description | TEXT | — | — | Group description |
| URL Slug | slug | TEXT | — | R, U | Booking group URL slug |
| Is Active | isActive | BOOLEAN | — | D:true | Whether group is bookable |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.16 — Block Slot
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Block Slot ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Calendar ID | calendarId | ID | — | R | Calendar to apply the block on |
| User ID | userId | ID | — | — | Specific team member to block (if round-robin) |
| Start Time | startTime | DATETIME | — | R | Block start time |
| End Time | endTime | DATETIME | — | R | Block end time |
| Title | title | TEXT | — | — | Internal label for this block (e.g. Vacation, Staff Meeting) |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |

## GROUP F — Conversations & Messaging
## 2.17 — Conversation
Description: A unified inbox thread grouping all messages between the sub-account and a Contact across all channels. One conversation typically exists per contact per channel type.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Conversation ID | id | TEXT | — | S, U, RO, IDX | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | R, IDX | Linked Contact |
| Assigned User | userId | ID | — | — | Team member assigned to this conversation |
| Channel Type | type | PICKLIST | See enum ↓ | — | Primary communication channel |
| Status | status | PICKLIST | See enum ↓ | D:unread | Read / interaction state |
| Unread Count | unreadCount | NUMBER | — | S, RO, D:0 | Number of unread inbound messages |
| Last Message Date | lastMessageDate | DATETIME | — | S, RO | Timestamp of most recent message |
| Last Message Preview | lastMessageBody | TEXT | — | S, RO | Truncated preview of most recent message |
| Last Message Type | lastMessageType | TEXT | — | S, RO | Channel of most recent message |
| Last Message Direction | lastMessageDirection | PICKLIST | inbound / outbound | S, RO | Direction of most recent message |
| Starred | starred | BOOLEAN | — | D:false | Pinned/starred in inbox |
| Inbox Label | inbox | TEXT | — | — | Inbox category label |
| Full Name (Denorm.) | fullName | TEXT | — | S, RO | Denormalized from Contact |
| Email (Denorm.) | email | EMAIL | — | S, RO | Denormalized from Contact |
| Phone (Denorm.) | phone | PHONE | — | S, RO | Denormalized from Contact |
| Tags (Denorm.) | tags | ARRAY[TEXT] | — | S, RO | Denormalized from Contact |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last update timestamp |

Enum: type (Channel)

| Value | Channel |
| --- | --- |
| TYPE_SMS | SMS / MMS |
| TYPE_EMAIL | Email |
| TYPE_PHONE | Voice Call |
| TYPE_VOICEMAIL | Voicemail |
| TYPE_GMB | Google My Business |
| TYPE_FB | Facebook Messenger |
| TYPE_INSTAGRAM | Instagram DM |
| TYPE_WHATSAPP | WhatsApp |
| TYPE_LIVE_CHAT | Live Chat Widget |
| TYPE_ACTIVITY_CONTACTS | Internal Activity Feed |

Enum: status

| Value | Label |
| --- | --- |
| all | All |
| read | Read |
| unread | Unread |
| starred | Starred |
| recents | Recents |

## 2.18 — Message
Description: An individual message unit within a Conversation. A Message can represent an SMS, email, call, voicemail, or social DM. Call-specific details live in the meta JSON field.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Message ID | id | TEXT | — | S, U, RO, IDX | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Conversation ID | conversationId | ID | — | R | Parent Conversation |
| Contact ID | contactId | ID | — | S | Derived from parent Conversation |
| Sender User ID | userId | ID | — | — | Sending team member (null for inbound or automated) |
| Channel Type | type | PICKLIST | See enum ↓ | R | Message channel type |
| Body | body | LARGE_TEXT | — | — | Message text content |
| Subject | subject | TEXT | — | — | Email subject line (email type only) |
| HTML Body | html | LARGE_TEXT | — | — | HTML email body (email type only) |
| Attachments | attachments | ARRAY[URL] | — | — | File attachment URLs |
| Delivery Status | status | PICKLIST | See enum ↓ | S | Message delivery / outcome status |
| Direction | direction | PICKLIST | inbound / outbound | S | Message direction |
| Scheduled At | scheduledAt | DATETIME | — | — | Future send time (if scheduled) |
| Source | source | TEXT | — | — | Origin (e.g. workflow, manual, api, campaign) |
| Provider Message ID | messageId | TEXT | — | S | External ID from carrier or email provider |
| Reply To Message ID | replyToMessageId | ID | — | — | Parent message ID (email threading) |
| Channel Metadata | meta | JSON | — | S | Channel-specific data (call details, read receipts, delivery metadata) |
| Created At | dateAdded | DATETIME | — | S, RO | Message send/receive timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last status update timestamp |

Enum: type (Message Channel)
(Same values as Conversation type enum above)

Enum: status

| Value | Label | Applies To |
| --- | --- | --- |
| pending | Pending | SMS, Email |
| scheduled | Scheduled | SMS, Email |
| sent | Sent | SMS, Email |
| delivered | Delivered | SMS |
| read | Read | SMS, Email, FB, IG |
| failed | Failed | All |
| undelivered | Undelivered | SMS |
| connected | Connected | Call |
| completed | Completed | Call |
| cancelled | Cancelled | SMS, Call |

## GROUP G — Automation
## 2.19 — Workflow
Description: An automation pipeline triggered by events (contact actions, dates, webhooks, etc.) and executing a sequence of actions (send email, update field, add tag, notify user, etc.). Workflows are the core automation engine.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Workflow ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Workflow display name |
| Status | status | PICKLIST | draft / published / archived | D:draft | Publication state |
| Version | version | NUMBER | — | S, D:1 | Increments each time the workflow is published |
| Triggers | triggers | ARRAY[JSON] | — | — | Array of trigger event configurations (type, filters, conditions) |
| Actions | actions | ARRAY[JSON] | — | — | Ordered array of action step configurations |
| Origin | origin | PICKLIST | personal / snapshot | D:personal | Whether created locally or from a snapshot push |
| Created At | createDate | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## 2.20 — Campaign (Legacy Drip)
Description: Legacy drip-campaign sequences (pre-Workflow). Still used for SMS/email sequences configured before the Workflow builder. Read-only from the API.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Campaign ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Campaign name |
| Status | status | PICKLIST | draft / active / paused / completed | D:draft | Campaign state |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.21 — Trigger Link
Description: A trackable URL that, when clicked by a contact, fires a configured workflow or adds/removes tags. Used for email CTAs, one-click opt-ins, and intent tracking.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Link ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Display name for this link |
| Redirect URL | redirectTo | URL | — | R | Destination URL after click is tracked |
| Query Key | queryKey | TEXT | — | S, U | Unique key embedded in the shareable tracking URL |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## GROUP H — Lead Capture
## 2.22 — Form
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Form ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Form display name |
| Fields | fields | ARRAY[JSON] | — | — | Ordered field configuration array |
| Is Active | isActive | BOOLEAN | — | D:true | Whether form accepts submissions |
| Submission Count | submissionCount | NUMBER | — | S, RO | Total submissions recorded |
| View Count | views | NUMBER | — | S, RO | Total page views recorded |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.23 — Form Submission
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Submission ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Form ID | formId | ID | — | R | Parent Form |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | S | Auto-created or matched Contact |
| Field Data | data | JSON | — | R | {fieldName: value} — all submitted field values |
| Page URL | pageUrl | URL | — | — | URL of the page where submission occurred |
| IP Address | ipAddress | TEXT | — | S | Submitter's IP address |
| User Agent | userAgent | TEXT | — | S | Submitter's browser user-agent string |
| Submitted At | dateAdded | DATETIME | — | S, RO | Submission timestamp |

## 2.24 — Survey
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Survey ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Survey display name |
| Pages | pages | ARRAY[JSON] | — | — | Ordered pages with questions and conditional logic |
| Is Active | isActive | BOOLEAN | — | D:true | Whether survey accepts responses |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.25 — Survey Submission
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Submission ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Survey ID | surveyId | ID | — | R | Parent Survey |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | S | Auto-matched or created Contact |
| Answers | answers | JSON | — | R | {questionId: answer} response map |
| Page URL | pageUrl | URL | — | — | Submission page URL |
| IP Address | ipAddress | TEXT | — | S | Submitter's IP address |
| Submitted At | dateAdded | DATETIME | — | S, RO | Submission timestamp |

## GROUP I — Marketing
## 2.26 — Email Template
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Template ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Template display name |
| Subject | subject | TEXT | — | — | Default email subject line |
| HTML Body | html | LARGE_TEXT | — | R | Full HTML email body |
| Plain Text | plainText | LARGE_TEXT | — | — | Plain-text fallback version |
| Editor Type | type | PICKLIST | builder / html | D:builder | Which editor was used to create the template |
| Is Archived | isArchived | BOOLEAN | — | D:false | Whether hidden from active list |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.27 — Social Post
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Post ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Author User ID | userId | ID | — | S | Creating team member |
| Content | content | LARGE_TEXT | — | R | Post text content |
| Media URLs | mediaUrls | ARRAY[URL] | — | — | Attached image or video URLs |
| Platforms | platforms | MULTI-SELECT | See enum ↓ | R | Target social media platforms |
| Status | status | PICKLIST | See enum ↓ | D:draft | Publishing state |
| Scheduled At | scheduledAt | DATETIME | — | — | Scheduled publish date/time |
| Published At | publishedAt | DATETIME | — | S | Actual publish timestamp |
| Internal Tags | tags | ARRAY[TEXT] | — | — | Internal organizational tags |
| Error Details | errorDetails | JSON | — | S | Error information when status = failed |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

Enum: platforms (multi-select)

| Value | Platform |
| --- | --- |
| facebook | Facebook Page |
| instagram | Instagram Business |
| linkedin | LinkedIn Page or Profile |
| twitter | X (Twitter) |
| gmb | Google My Business |
| tiktok | TikTok |

Enum: status

| Value | Label |
| --- | --- |
| draft | Draft |
| scheduled | Scheduled |
| published | Published |
| failed | Failed |

## GROUP J — Sites & Pages
## 2.28 — Funnel
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Funnel ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Funnel display name |
| Type | type | PICKLIST | funnel / website | D:funnel | Asset category |
| Domain ID | domainId | ID | — | — | Connected custom domain |
| Public URL | url | URL | — | S | Auto-generated public URL |
| Page Count | pageCount | NUMBER | — | S, RO | Number of pages in this funnel |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.29 — Funnel Page
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Page ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Funnel ID | funnelId | ID | — | R | Parent Funnel |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Page display name |
| URL Slug | pathSlug | TEXT | — | R, U (within funnel) | URL path segment |
| Step Sequence | sequence | NUMBER | — | R | Step position in funnel order |
| Page Content | content | JSON | — | — | Page builder content tree |
| SEO Title | metaTitle | TEXT | — | — | <title> tag value |
| SEO Description | metaDescription | LARGE_TEXT | — | — | Meta description tag |
| SEO Keywords | keywords | TEXT | — | — | Legacy SEO keyword field |
| OG Image | ogImage | URL | — | — | Open Graph / social share image |
| Is Default | isDefault | BOOLEAN | — | D:false | Funnel entry page |
| Is Published | isPublished | BOOLEAN | — | D:false | Page live and visible |
| Pre-Launch Mode | isPreLaunch | BOOLEAN | — | D:false | Shows countdown timer |
| A/B Variants | splitTestVariants | JSON | — | — | Split test configuration |
| Header Scripts | headerCode | LARGE_TEXT | — | — | Custom HTML/JS injected in <head> |
| Footer Scripts | footerCode | LARGE_TEXT | — | — | Custom HTML/JS injected before </body> |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.30 — Website
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Website ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Website display name |
| Domain ID | domainId | ID | — | — | Connected custom domain |
| Public URL | url | URL | — | S | Auto-generated public URL |
| Page Count | pageCount | NUMBER | — | S, RO | Number of pages |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.31 — Blog Site
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Blog ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Blog display name |
| Description | description | LARGE_TEXT | — | — | Blog tagline or description |
| Domain ID | domainId | ID | — | — | Connected custom domain |
| URL Slug | slug | TEXT | — | R, U | Root path for the blog |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.32 — Blog Post
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Post ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Blog ID | blogId | ID | — | R | Parent Blog Site |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Title | title | TEXT | — | R, IDX | Article headline |
| Content | content | LARGE_TEXT | — | R | Full article body (rich text / HTML) |
| URL Slug | slug | TEXT | — | R, U (within blog) | URL path segment for this post |
| Status | status | PICKLIST | draft / published / archived | D:draft | Publication state |
| Author | author | TEXT | — | — | Author display name |
| Category IDs | categoryIds | ARRAY[ID] | — | — | Linked blog category IDs |
| Tags | tags | ARRAY[TEXT] | — | — | Topic/keyword tags |
| Featured Image | imageUrl | URL | — | — | Hero / featured image URL |
| SEO Title | metaTitle | TEXT | — | — | Custom <title> tag (defaults to post title) |
| SEO Description | metaDescription | LARGE_TEXT | — | — | Meta description tag |
| Published At | publishedAt | DATETIME | — | — | Scheduled or actual publish timestamp |
| Reading Time | readingTime | NUMBER | — | S, RO | Estimated reading time in minutes |
| Word Count | wordCount | NUMBER | — | S, RO | Total word count of content |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.33 — Redirect
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Redirect ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Source Domain | domain | TEXT | — | R | Domain the redirect applies to |
| Source Path | path | TEXT | — | R | URL path to redirect (e.g. /old-page) |
| Target URL | target | URL | — | R | Destination URL |
| Status Code | statusCode | PICKLIST | 301 / 302 | D:301 | 301 = permanent, 302 = temporary |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## GROUP K — Commerce
## 2.34 — Product
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Product ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R, IDX | Product display name |
| Description | description | LARGE_TEXT | — | — | Product marketing description |
| Type | type | PICKLIST | DIGITAL / PHYSICAL / SERVICE | — | Product delivery category |
| Image | image | URL | — | — | Primary product image URL |
| Statement Descriptor | statementDescriptor | TEXT | — | — | Text on customer bank statement (max 22 chars) |
| Is Taxable | isTaxable | BOOLEAN | — | D:false | Whether tax is collected at checkout |
| Available In Store | availableInStore | BOOLEAN | — | D:true | Show in storefront catalogue |
| Media | medias | ARRAY[JSON] | — | — | Additional product images/videos |
| Price IDs | prices | ARRAY[ID] | — | S | Linked Product Price record IDs |
| Tax IDs | taxes | ARRAY[ID] | — | — | Applied tax rule IDs |
| Variants | variants | JSON | — | — | Product variant options (e.g. colour, size) |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## 2.35 — Product Price
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Price ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Product ID | productId | ID | — | R, IDX | Parent Product |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Price Name | name | TEXT | — | R | Variant label (e.g. Monthly, Annual, One-Time) |
| Billing Type | type | PICKLIST | one_time / recurring | R | Billing model |
| Amount | amount | NUMBER | — | R | Price in major currency unit (e.g. 99.00) |
| Currency | currency | TEXT | — | R | ISO 4217 code (e.g. CAD, USD) |
| Recurring Config | recurring | JSON | — | — | {interval, intervalCount, trialPeriodDays} — required for type=recurring |
| Compare-At Price | compareAtPrice | NUMBER | — | — | Original / strikethrough price for display |
| Track Inventory | trackInventory | BOOLEAN | — | D:false | Enable inventory management |
| Inventory Count | inventoryCount | NUMBER | — | D:0 | Units available |
| Allow Out-of-Stock | allowOutOfStockPurchases | BOOLEAN | — | D:false | Continue selling when inventory reaches 0 |
| Is Active | isActive | BOOLEAN | — | D:true | Whether this price is purchasable |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

recurring JSON sub-fields:

| Sub-field | Type | Values | Description |
| --- | --- | --- | --- |
| interval | PICKLIST | day / week / month / year | Billing cycle unit |
| intervalCount | NUMBER | Any positive int | How many intervals per billing cycle |
| trialPeriodDays | NUMBER | 0 or positive int | Free trial period before first charge |

## 2.36 — Order
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Order ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | R | Purchasing contact |
| Order Status | status | PICKLIST | See enum ↓ | D:pending | Order lifecycle state |
| Fulfillment Status | fulfillmentStatus | PICKLIST | See enum ↓ | D:unfulfilled | Physical fulfillment state |
| Currency | currency | TEXT | — | R | ISO 4217 code |
| Total Amount | amount | NUMBER | — | S | Total charged amount |
| Amount Refunded | amountRefunded | NUMBER | — | S, D:0 | Total amount refunded |
| Subtotal | subtotal | NUMBER | — | S | Pre-discount, pre-tax total |
| Discount | discount | NUMBER | — | S, D:0 | Total discount amount applied |
| Tax | taxes | NUMBER | — | S, D:0 | Total tax collected |
| Line Items | items | ARRAY[JSON] | — | R | [{productId, priceId, name, qty, unitAmount, type}] |
| Payment Method | paymentMethod | JSON | — | S | {type, last4, brand} — masked payment info |
| Source Type | sourceType | PICKLIST | See enum ↓ | — | Where the order originated |
| Source Metadata | sourceMeta | JSON | — | — | Origin-specific context (funnelId, formId, etc.) |
| Coupon ID | couponId | ID | — | — | Applied Coupon record ID |
| Coupon Code | couponCode | TEXT | — | S | Applied coupon code string |
| Coupon Discount | couponDiscount | NUMBER | — | S | Discount amount from coupon |
| Shipping Address | shippingAddress | JSON | — | — | {firstName, lastName, address1, city, state, country, postalCode} |
| Billing Address | billingAddress | JSON | — | — | Same structure as shippingAddress |
| Contact Snapshot | contactSnapshot | JSON | — | S | Denormalized contact data at time of purchase |
| Payment Provider | paymentProviderType | TEXT | — | S | Payment processor used |
| Internal Notes | notes | LARGE_TEXT | — | — | Internal notes about this order |
| Attribution Data | trackingDetails | JSON | — | S | UTM / attribution at time of purchase |
| Live Mode | liveMode | BOOLEAN | — | S, D:false | true = real charge; false = test mode |
| Created At | createdAt | DATETIME | — | S, RO | Order creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

Enum: status

| Value | Label |
| --- | --- |
| pending | Pending |
| confirmed | Confirmed |
| completed | Completed |
| cancelled | Cancelled |
| refunded | Refunded |
| partial_refund | Partially Refunded |

Enum: fulfillmentStatus

| Value | Label |
| --- | --- |
| unfulfilled | Unfulfilled |
| partially_fulfilled | Partially Fulfilled |
| fulfilled | Fulfilled |
| voided | Voided |

Enum: sourceType

| Value | Label |
| --- | --- |
| funnel | Funnel / Landing Page |
| website | Website |
| invoice | Invoice |
| calendar | Calendar Booking |
| api | API / Integration |
| manual | Manually Created |
| store | Online Store |

## 2.37 — Order Fulfillment
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Fulfillment ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Order ID | orderId | ID | — | R | Parent Order |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Tracking Number | trackingNumber | TEXT | — | — | Carrier tracking number |
| Tracking URL | trackingUrl | URL | — | — | Direct package tracking URL |
| Shipping Carrier | shippingCarrier | TEXT | — | — | Carrier name (e.g. Canada Post, UPS, FedEx) |
| Tracking Status | trackingStatus | TEXT | — | S | Status string from carrier |
| Fulfilled Items | items | ARRAY[JSON] | — | — | [{productId, priceId, qty}] |
| Created At | createdAt | DATETIME | — | S, RO | Fulfillment creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## 2.38 — Invoice
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Invoice ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | R | Billing contact |
| Invoice Number | invoiceNumber | TEXT | — | S, U | Auto-generated sequential number |
| Internal Name | name | TEXT | — | R | Internal reference name |
| Customer Title | title | TEXT | — | — | Title shown to the customer |
| Currency | currency | TEXT | — | R | ISO 4217 code |
| Status | status | PICKLIST | See enum ↓ | D:draft | Invoice lifecycle status |
| Issue Date | issueDate | DATE | — | — | Date the invoice was issued |
| Due Date | dueDate | DATE | — | — | Payment due date |
| Line Items | items | ARRAY[JSON] | — | R | [{productId, priceId, name, description, qty, unitAmount, taxes, discount}] |
| Overall Discount | discount | JSON | — | — | `{type: percentage |
| Subtotal | subtotal | NUMBER | — | S | Sum of line items pre-discount/tax |
| Total | total | NUMBER | — | S | Final amount owed |
| Amount Paid | amountPaid | NUMBER | — | S, D:0 | Payments received |
| Amount Due | amountDue | NUMBER | — | S | Remaining balance |
| Taxes | taxes | ARRAY[JSON] | — | — | [{name, rate, amount}] tax breakdown |
| Terms / Notes | termsNotes | LARGE_TEXT | — | — | Payment instructions or terms |
| Attachments | attachments | ARRAY[URL] | — | — | Supporting file attachments |
| Business Snapshot | businessDetails | JSON | — | S | Denormalized business info at invoice time |
| Contact Snapshot | contactDetails | JSON | — | S | Denormalized contact info at invoice time |
| Live Mode | liveMode | BOOLEAN | — | S, D:false | Live or test payment environment |
| Sent At | sentAt | DATETIME | — | S | Timestamp when invoice was sent |
| Paid At | paidAt | DATETIME | — | S | Timestamp of full payment receipt |
| Voided At | voidedAt | DATETIME | — | S | Timestamp invoice was voided |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

Enum: status

| Value | Label |
| --- | --- |
| draft | Draft |
| sent | Sent |
| paid | Paid |
| void | Void |
| partially_paid | Partially Paid |
| overdue | Overdue |
| payment_processing | Payment Processing |

## 2.39 — Invoice Schedule
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Schedule ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | R | Billing contact |
| Name | name | TEXT | — | R | Schedule display name |
| Status | status | PICKLIST | See enum ↓ | D:draft | Schedule lifecycle state |
| Currency | currency | TEXT | — | R | ISO 4217 code |
| Amount Per Invoice | amount | NUMBER | — | R | Amount charged per cycle |
| Line Items | items | ARRAY[JSON] | — | — | Line items for each generated invoice |
| Frequency | frequency | PICKLIST | See enum ↓ | R | Billing recurrence |
| Day of Month | dayOfMonth | NUMBER | — | — | Day (1–31) for monthly/quarterly schedules |
| Day of Week | dayOfWeek | NUMBER | — | — | Day (0=Sun…6=Sat) for weekly schedules |
| Start Date | startDate | DATE | — | R | Date first invoice is generated |
| End Type | endType | PICKLIST | never / specific_date / number_of_occurrences | D:never | How the schedule terminates |
| End Date | endDate | DATE | — | — | Required when endType = specific_date |
| Max Occurrences | numberOfOccurrences | NUMBER | — | — | Required when endType = number_of_occurrences |
| Completed Cycles | occurrencesCompleted | NUMBER | — | S, RO, D:0 | Count of invoices generated |
| Next Invoice Date | nextScheduledDate | DATE | — | S | Next auto-generate date |
| Live Mode | liveMode | BOOLEAN | — | D:false | Live or test charge mode |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

Enum: status

| Value | Label |
| --- | --- |
| draft | Draft |
| active | Active |
| paused | Paused |
| completed | Completed |
| cancelled | Cancelled |

Enum: frequency

| Value | Label |
| --- | --- |
| daily | Daily |
| weekly | Weekly |
| monthly | Monthly |
| quarterly | Quarterly |
| semi_annual | Semi-Annual |
| annual | Annual |

## 2.40 — Coupon
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Coupon ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Internal coupon name |
| Code | code | TEXT | — | R, U | Customer-facing code (e.g. SPRING20) |
| Type | type | PICKLIST | percentage / fixed_amount | R | Discount calculation method |
| Amount | amount | NUMBER | — | R | Discount value (% or dollar amount) |
| Currency | currency | TEXT | — | — | ISO 4217 (required when type = fixed_amount) |
| Product Scope | productIds | ARRAY[ID] | — | — | Applicable product IDs (null = all products) |
| Max Uses | maxUses | NUMBER | — | — | Redemption cap (null = unlimited) |
| Times Used | timesUsed | NUMBER | — | S, RO, D:0 | Total redemptions to date |
| Expiry Date | expiryDate | DATETIME | — | — | Coupon expiration (null = no expiry) |
| Is Active | isActive | BOOLEAN | — | D:true | Whether the coupon can be applied |
| Minimum Order | minimumOrderAmount | NUMBER | — | — | Minimum cart total to qualify |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## 2.41 — Payment Provider
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Provider ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Label | name | TEXT | — | R | Display name for this connection |
| Processor Type | type | PICKLIST | stripe / nmi / authorize_net / square | R | Payment gateway provider |
| Is Default | isDefault | BOOLEAN | — | D:false | Default provider for checkout |
| Live Mode | liveMode | BOOLEAN | — | D:false | Live (true) or test (false) keys |
| Publishable Key | publishableKey | TEXT | — | RO | Public API key (display-masked in UI) |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## GROUP L — Memberships & Courses
## 2.42 — Membership Offer
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Offer ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Title | title | TEXT | — | R | Offer name shown to buyers |
| Description | description | LARGE_TEXT | — | — | Marketing description |
| Pricing Type | type | PICKLIST | free / one_time / subscription | R | Pricing model |
| Currency | currency | TEXT | — | — | ISO 4217 (required if type ≠ free) |
| Amount | amount | NUMBER | — | — | Price (required if type ≠ free) |
| Billing Interval | interval | PICKLIST | day / week / month / year | — | Subscription billing cycle unit |
| Interval Count | intervalCount | NUMBER | — | D:1 | Cycles per billing period |
| Trial Days | trialDays | NUMBER | — | D:0 | Free trial days before first charge |
| Course IDs | courseIds | ARRAY[ID] | — | — | Courses bundled in this offer |
| Is Published | isPublished | BOOLEAN | — | D:false | Whether offer is publicly purchasable |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## 2.43 — Course
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Course ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Title | title | TEXT | — | R, IDX | Course name |
| Description | description | LARGE_TEXT | — | — | Course overview / pitch |
| Thumbnail | thumbnailUrl | URL | — | — | Course cover image |
| Instructor Name | instructorName | TEXT | — | — | Instructor display name |
| Instructor Bio | instructorDescription | LARGE_TEXT | — | — | Instructor profile text |
| Category IDs | categoryIds | ARRAY[ID] | — | S | Ordered array of Course Category IDs |
| Is Published | isPublished | BOOLEAN | — | D:false | Whether students can access |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## 2.44 — Course Category (Chapter / Module)
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Category ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Course ID | courseId | ID | — | R | Parent Course |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Title | title | TEXT | — | R | Chapter/module name |
| Description | description | LARGE_TEXT | — | — | Category description |
| Display Order | order | NUMBER | — | R | Position within the course |
| Lesson IDs | postIds | ARRAY[ID] | — | S | Ordered lesson (post) IDs |
| Is Published | isPublished | BOOLEAN | — | D:false | Whether students can access this chapter |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## 2.45 — Course Post / Lesson
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Lesson ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Course ID | courseId | ID | — | R | Grandparent course |
| Category ID | categoryId | ID | — | R | Parent chapter/category |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Title | title | TEXT | — | R | Lesson title |
| Content Type | contentType | PICKLIST | See enum ↓ | R | Format of lesson content |
| Content | content | JSON | — | — | Rich text / embedded content tree |
| Video URL | videoUrl | URL | — | — | YouTube, Vimeo, or hosted video URL |
| Video Duration | videoDuration | NUMBER | — | — | Duration in seconds |
| Free Preview | isFreePreview | BOOLEAN | — | D:false | Accessible without membership purchase |
| Display Order | order | NUMBER | — | R | Position within the category |
| Is Published | isPublished | BOOLEAN | — | D:false | Whether lesson is accessible |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

Enum: contentType

| Value | Label |
| --- | --- |
| video | Video |
| text | Text / Rich Text |
| quiz | Quiz |
| assignment | Assignment |
| iframe | Embedded iframe |

## 2.46 — Membership Access
Description: Records a contact's enrollment in a specific Membership Offer. Tracks access state, type of access, and validity window.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Access ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | R | The enrolled member |
| Offer ID | offerId | ID | — | R | The Membership Offer granted |
| Status | status | PICKLIST | active / cancelled / expired / paused | D:active | Current access state |
| Access Type | accessType | PICKLIST | free / purchased / trial / gifted | S | How access was granted |
| Start Date | startDate | DATETIME | — | S | Access start timestamp |
| End Date | endDate | DATETIME | — | — | Access expiry (null = no expiry) |
| Created At | createdAt | DATETIME | — | S, RO | Enrollment creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## GROUP M — Media
## 2.47 — Media File
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| File ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| File Name | name | TEXT | — | R | File name including extension |
| CDN URL | url | URL | — | S, RO | Public CDN URL for this file |
| File Type | type | PICKLIST | image / video / audio / pdf / document / other | S | File category |
| File Size | fileSize | NUMBER | — | S, RO | Size in bytes |
| MIME Type | mimeType | TEXT | — | S, RO | e.g. image/jpeg, application/pdf |
| Folder ID | folderId | ID | — | — | Parent folder (null = root) |
| Width | width | NUMBER | — | S | Pixel width (images only) |
| Height | height | NUMBER | — | S | Pixel height (images only) |
| Alt Text | alt | TEXT | — | — | Alt text for accessibility and SEO |
| Source | source | PICKLIST | internal / external / unsplash | D:internal | Upload origin |
| Created At | createdAt | DATETIME | — | S, RO | Upload timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## 2.48 — Media Folder
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Folder ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Folder Name | name | TEXT | — | R | Display name |
| Parent Folder ID | parentId | ID | — | — | Parent folder (null = root level) |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## GROUP N — Configuration Objects
## 2.49 — Custom Field
Description: A user-defined field definition that extends the data model of Contact, Opportunity, or any Custom Object. Field values are stored on the target record's customFields array as {id, value} pairs.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Field ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Object Key | objectKey | TEXT | — | R | Which object this field belongs to (e.g. contact, opportunity, custom_objects.my_listings) |
| Field Key | fieldKey | TEXT | — | R, U | Dot-notation key (e.g. contact.preferred_area) |
| Display Name | name | TEXT | — | R | Label shown in UI and forms |
| Data Type | dataType | PICKLIST | See enum ↓ | R | Field type |
| Picklist Options | options | ARRAY[JSON] | — | — | [{key, label}] — required for SINGLE_OPTIONS / MULTIPLE_OPTIONS |
| Placeholder | placeholder | TEXT | — | — | Form field placeholder text |
| Description | description | LARGE_TEXT | — | — | Helper text shown under field in forms |
| Display Order | position | NUMBER | — | D:0 | Sort order within folder |
| Folder ID | parentId | ID | — | — | Parent Custom Field Folder ID |
| Show in Forms | showInForms | BOOLEAN | — | D:false | Expose in form builder |
| Required | required | BOOLEAN | — | D:false | Mandatory on form submission |
| Delete Protected | isDeleteProtected | BOOLEAN | — | D:false | Prevents accidental deletion |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

Enum: dataType

| API Value | Human Label | Notes |
| --- | --- | --- |
| TEXT | Short Text | VARCHAR ≤255 |
| LARGE_TEXT | Long Text / Textarea | Unlimited |
| NUMERICAL | Number | Integer or decimal |
| MONETORY | Currency | (Platform spelling) Monetary decimal |
| DATE | Date | YYYY-MM-DD |
| DATETIME | Date & Time | Full ISO 8601 |
| PHONE | Phone Number | Validated phone format |
| EMAIL | Email Address | Validated email format |
| URL | URL / Link | Validated URL |
| CHECKBOX | Checkbox / Boolean | true / false |
| SINGLE_OPTIONS | Single Select | Requires options array |
| MULTIPLE_OPTIONS | Multi-Select | Requires options array |
| FILE_UPLOAD | File Upload | CDN URL reference |
| RADIO | Radio Buttons | Single select, alternate display |
| SIGNATURE | Signature Capture | Digital signature field |

## 2.50 — Custom Field Folder
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Folder ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Folder Name | name | TEXT | — | R | Display name for this group |
| Object Key | objectKey | TEXT | — | R | Object scope (e.g. contact, opportunity) |
| Display Order | position | NUMBER | — | D:0 | Sort order in the field manager |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.51 — Custom Value (Merge Tag)
Description: A global key-value snippet accessible in templates and messages via {{custom_values.fieldKey}}. Used for business-wide variables like address, office hours, social links, etc.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Value ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Display Name | name | TEXT | — | R | Human-readable label |
| Merge Tag Key | fieldKey | TEXT | — | R, U | Key used in {{custom_values.fieldKey}} templates |
| Value | value | TEXT | — | R | The replacement text returned at merge time |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.52 — User
Description: A team member with access to this sub-account. Users have role-based permissions that control which features and data they can access.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| User ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Associated sub-account |
| First Name | firstName | TEXT | — | R | First name |
| Last Name | lastName | TEXT | — | R | Last name |
| Full Name | name | TEXT | — | S, IDX | Concatenated full name |
| Email | email | EMAIL | — | R, U | Login / contact email |
| Phone | phone | PHONE | — | — | Contact phone number |
| Extension | extension | TEXT | — | — | Phone extension |
| Role | role | PICKLIST | admin / user | R, D:user | Permission level in this sub-account |
| Permissions | permissions | JSON | — | — | Granular feature permission flags (see below) |
| Profile Photo | profilePhoto | URL | — | — | Avatar image URL |
| Default Calendar | calendarId | ID | — | — | The user's default calendar for bookings |
| Timezone | timezone | TEXT | — | — | IANA timezone identifier |
| Account Type | type | PICKLIST | account / agency | S | Platform account tier |
| Is Active | isActive | BOOLEAN | — | D:true | Whether user has active access |
| Created At | dateAdded | DATETIME | — | S, RO | Account creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

permissions JSON — Key Permission Flags

```json
{
  "contactsEnabled":          true,
  "opportunitiesEnabled":     true,
  "dashboardStatsEnabled":    true,
  "appointmentsEnabled":      true,
  "conversationsEnabled":     true,
  "callsEnabled":             true,
  "campaignsEnabled":         true,
  "campaignsReadOnly":        false,
  "workflowsEnabled":         true,
  "triggersEnabled":          true,
  "funnelsEnabled":           true,
  "websitesEnabled":          true,
  "marketingEnabled":         true,
  "bulkRequestsEnabled":      true,
  "invoicesEnabled":          true,
  "paymentsEnabled":          true,
  "exportPaymentsEnabled":    true,
  "reviewsEnabled":           true,
  "membershipEnabled":        true,
  "settingsEnabled":          true,
  "tagsEnabled":              true,
  "assignedDataOnly":         false,
  "phoneCallEnabled":         true,
  "adwordsReportingEnabled":  true,
  "agentReportingEnabled":    true,
  "userCommissionsEnabled":   true,
  "onlineListingsEnabled":    true,
  "communitiesEnabled":       true,
  "leadValueEnabled":         true
}
```

## GROUP O — Reputation
## 2.53 — Review
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Review ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | — | Matched Contact (if identifiable) |
| Platform | type | PICKLIST | GOOGLE / FACEBOOK | R | Review source platform |
| Star Rating | rating | NUMBER | — | S | Rating 1–5 |
| Review Text | review | LARGE_TEXT | — | S | Review content from the platform |
| Reviewer Name | reviewerName | TEXT | — | S | Name from the review platform |
| Reviewer Photo | reviewerPhoto | URL | — | S | Profile image from the review platform |
| Business Response | response | LARGE_TEXT | — | — | Your reply to the review |
| Internal Status | status | PICKLIST | new / responded / flagged | D:new | Internal review management state |
| Posted / Imported | dateAdded | DATETIME | — | S, RO | When review was posted or synced |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## 2.54 — Review Request
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Request ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | R | Contact being asked for a review |
| Channel | type | PICKLIST | email / sms | R | Delivery channel |
| Status | status | PICKLIST | sent / opened / reviewed / failed | S, D:sent | Request lifecycle state |
| Sent At | sentAt | DATETIME | — | S | Timestamp of delivery |
| Created At | dateAdded | DATETIME | — | S, RO | Creation timestamp |
| Updated At | dateUpdated | DATETIME | — | S, RO | Last modification timestamp |

## GROUP P — Documents & Snapshots
## 2.55 — Document / Contract
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Document ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Contact ID | contactId | ID | — | — | Primary recipient contact |
| Title | title | TEXT | — | R | Document display name |
| Type | type | PICKLIST | document / contract | R | Document category |
| Status | status | PICKLIST | See enum ↓ | D:draft | Signature lifecycle state |
| Template ID | templateId | ID | — | — | Source template (if created from one) |
| Content | content | JSON | — | — | Document content blocks |
| Signers | signers | ARRAY[JSON] | — | — | [{name, email, role, signedAt, signatureData}] |
| Expiry | expiresAt | DATETIME | — | — | Document signing deadline |
| Sent At | sentAt | DATETIME | — | S | When sent to signers |
| Viewed At | viewedAt | DATETIME | — | S | When first viewed by recipient |
| Signed At | signedAt | DATETIME | — | S | When fully executed by all signers |
| Completed At | completedAt | DATETIME | — | S | When all parties completed |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

Enum: status

| Value | Label |
| --- | --- |
| draft | Draft |
| sent | Sent |
| viewed | Viewed |
| signed | Signed |
| completed | Completed |
| declined | Declined |
| voided | Voided |

## 2.56 — Document Template
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Template ID | id | TEXT | — | S, |  |


## 2.56 — Document Template (continued)
| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Template ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Parent sub-account |
| Name | name | TEXT | — | R | Template display name |
| Content | content | JSON | — | R | Template content blocks (document builder tree) |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |

## 2.57 — Snapshot
Description: A portable package of sub-account configuration (workflows, funnels, pipelines, templates, custom fields, etc.) that can be shared and pushed to other sub-accounts.

| Field Name | API Key | Data Type | Enum Values | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| Snapshot ID | id | TEXT | — | S, U, RO | System-generated ObjectId |
| Sub-Account ID | locationId | ID | — | S, R, RO | Source sub-account |
| Name | name | TEXT | — | R | Snapshot display name |
| Type | type | PICKLIST | permanent / expirable | D:permanent | Whether the snapshot share link expires |
| Status | status | PICKLIST | pending / completed / failed | S, D:pending | Generation / processing status |
| Share Link | shareLink | URL | — | S, RO | Auto-generated URL to push this snapshot |
| Expires At | expiresAt | DATETIME | — | — | Expiry date/time (for type = expirable only) |
| Created At | createdAt | DATETIME | — | S, RO | Creation timestamp |
| Updated At | updatedAt | DATETIME | — | S, RO | Last modification timestamp |
