# Real Estate Pro CRM — Vibe AI Prompt Series

Paired with `TASKS.md`. Run prompts **in order**. Each prompt is self-contained: paste the **Standing Context** block once at the start of a session (or whenever context resets), then paste the numbered prompt.

**Design repo:** https://github.com/rockonconsulting1-maker/RealEstate-Pro-CRM---Design

---

## STANDING CONTEXT (paste first, every session)

```
PROJECT: Real Estate Pro CRM — production React web app. Desktop + Mobile responsive from ONE codebase.
LIVE DATA ONLY: All data comes from a GoHighLevel (GHL) sub-account via API (Private Integration Token) and Supabase (auth/profile/docs). NEVER ship mock data. The design repo's mobile/data.jsx is a SHAPE REFERENCE ONLY — use it to understand record shapes and UI content, then delete any temporary stubs before finishing a task.

STACK (locked): React 18, Vite, TypeScript strict, React Router v6, Tailwind + CSS-variable OKLCH tokens, shadcn/ui (Radix), TanStack Query v5, React Context, React Hook Form + Zod, lucide-react, recharts, date-fns, @supabase/supabase-js.

TWO REPOS — read the right doc for the task (AGENTS.md maps every task → doc across both):

BUILD REPO (this repo, writable — where the app is built). Companion docs to follow:
- PRD.md — product requirements (the what/why): scope, goals, non-goals, UX principles.
- TASKS.md — phased, ordered engineering build plan (the how). Every prompt below maps to a TASK id.
- PROMPT.md — this per-phase prompt series (paste Standing Context once, then the numbered prompt).
- design.md — design system SOURCE OF TRUTH: OKLCH tokens, type scale, spacing, primitives, patterns, prototype file map.
- GHL_Integration_Mapping.md — screen → GHL endpoint/field mapping (FOLLOW THIS for every data-wiring task).
- Real Estate Pro CRM — Full Integration Schema.md — consolidated GHL data schema for this repo (object catalog, data dictionary, associations, ERD); the SECTION_1..6 docs are its source.

DESIGN REPO (read-only reference): https://github.com/rockonconsulting1-maker/RealEstate-Pro-CRM---Design
Read via the URL; never write to it. Prototype code is shape/interaction reference only — NOT production code.
- SCREENS.md + "RC CRM Screen Inventory.html" — full screen/modal inventory (desktop, mobile, auth).
- RC CRM Desktop.html / RC CRM Mobile.html / RC CRM Auth Desktop.html / RC CRM Auth Mobile.html — prototype entry points to port.
- desktop/*.jsx — desktop implementations to port (shell.jsx, dashboard.jsx, contacts.jsx, leads.jsx, conversations.jsx, mls.jsx, modals.jsx, screens*.jsx) + styles.css.
- mobile/*.jsx — mobile implementations to port (app.jsx = TabBar/FAB shell, screen-*.jsx per screen, data.jsx = SHAPE REFERENCE ONLY) + styles.css.
- frontend-designs.md — per-screen field breakdowns (where present).
- SECTION_1..SECTION_6 (granular schema docs) + GoHighLevel__GHL__API_Integration.txt + Associations_Apis-*.md — GHL data dictionary & API/associations reference.
- Buyer-Seller-Journeys.md — pipeline stages, stage-mapped tasks & documents, client-portal plan.
- Supabase_Intergration_Docs.txt — Supabase auth/config reference.

GHL: base https://services.leadconnectorhq.com · headers: Authorization: Bearer <PIT>, Version header per GHL API 2.0 docs (2021-07-28), Content-Type/Accept application/json.
Custom objects: custom_objects.my_listings · custom_objects.properties (MLS) · custom_objects.real_estate_offer. Relations via Associations API.
Pipelines (resolve IDs at runtime by name, never hardcode): "Lead Nurture" (Leads), "Buyer"/"Buyer Transaction" and "Seller" (Clients).
PIT docs: https://marketplace.gohighlevel.com/docs/Authorization/PrivateIntegrationsToken

SUPABASE (auth only + profile/credentials/docs):
VITE_SUPABASE_URL=https://xdenkkphnhjjpdirvsii.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Gg-ck2dVMrtES3lTPb_xJQ_t4r6K3YI

ARCHITECTURE RULES:
1. All GHL calls go through src/lib/ghl/client.ts + typed services in src/lib/ghl/services/*. UI never fetches directly.
2. Query keys centralized in src/lib/queryKeys.ts.
3. Responsive: useSurface() hook — desktop ≥1024px (sidebar/topbar/split panes), mobile <1024px (TabBar/FAB/bottom sheets). Shared data hooks; per-surface view components only where layouts diverge.
4. Every screen ships loading skeletons, designed empty states, and retryable error states.
5. Mutations are optimistic with rollback where sensible (stage drags, toggles, sends).
6. TypeScript strict must pass. Zod-validate GHL responses at the service boundary.
7. Match design.md tokens exactly: tabular numerals for money/time, stage colors never fill cards, 44px mobile touch targets.

DEFINITION OF DONE for any prompt: desktop + mobile built, live GHL data wired, all listed filters/sorts/modals/tabs functional, states covered, typecheck clean.
```

---

# PHASE 0 — FOUNDATION

## Prompt P0.1 — Scaffold & tooling

```
TASK 0.1 from TASKS.md.

Scaffold the project:
1. Vite + React 18 + TypeScript (strict: true, noUncheckedIndexedAccess, exactOptionalPropertyTypes). Path alias "@/" → src.
2. Install and configure: react-router-dom@6, @tanstack/react-query + react-query-devtools + query persist packages, tailwindcss, shadcn/ui (init with CSS-variables mode), react-hook-form, zod, @hookform/resolvers, lucide-react, recharts, date-fns, @supabase/supabase-js, @tanstack/react-virtual.
3. ESLint + Prettier; scripts: dev, build, preview, typecheck, lint.
4. Env: .env.example with VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY (values in Standing Context), plus optional VITE_GHL_PIT / VITE_GHL_LOCATION_ID dev-only fallbacks (read only in dev mode). Never commit .env.
5. Folder structure:
   src/app (providers, router), src/routes, src/components/{ui,shared,desktop,mobile},
   src/features/{dashboard,leads,clients,contacts,listings,offers,transactions,mls,conversations,calendar,tasks,notes,docs,reports,team,settings},
   src/lib/{ghl/services,supabase}, src/hooks, src/types, src/styles.
6. Boot a placeholder App with QueryClientProvider + BrowserRouter + a "hello" route to prove the toolchain.

Acceptance: npm run dev/build/typecheck all pass; folder tree committed; no mock data anywhere.
```

## Prompt P0.2 — Design-system port

```
TASK 0.2 from TASKS.md.

Port the design system from the repo into the codebase:
References: design.md (§ tokens/typography/spacing/components), desktop/styles.css, mobile/styles.css, desktop/shell.jsx (primitives).

1. Create src/styles/tokens.css with the full OKLCH CSS-variable set from design.md + both styles.css files: --bg, --surface, --border(-2), --ink(-2/-3/-4), --brand(-soft), --success(-soft), --warn, --danger, stage color set, radii, shadows. Map every variable into tailwind.config (colors, borderRadius, boxShadow, fontFamily incl. mono for time/money).
2. Typography: implement the design.md type scale as Tailwind utilities/components; tabular-nums on all numeric displays.
3. Port shared primitives to src/components/shared with TypeScript props: Money (currency, compact option), Countdown (live ticking, danger under threshold), Spark (recharts sparkline), Avatar (initials fallback), StageDot, TempBadge (hot/warm/cold), RoleBadge (buyer/seller/investor/vendor/agent), StatusChip.
4. Shared state components: Skeleton variants (row, card, table, kpi), EmptyState (icon+title+body+action), ErrorState (message+Retry), Toaster setup; confirm dialog helper.
5. Dark mode scaffolding: `class` strategy, duplicate token block under `.dark`, ThemeProvider with light/dark/system (toggle wired later in Settings). design.md §2: "Dark mode is first-class."
6. Enforce: 44×44 mobile hit targets utility, visible focus rings, stage-vs-semantic color rule documented in a comment header.

Acceptance: a /design-preview dev-only route rendering all primitives in both themes; visual match to the repo prototypes.
```

## Prompt P0.3 — Responsive shell & navigation

```
TASK 0.3 from TASKS.md.

Build the app shell. References: desktop/shell.jsx (Sidebar/Topbar), mobile/app.jsx (TabBar/FAB/bezel logic — ignore the bezel, port the patterns), design.md layout specs.

1. useSurface() hook: 'desktop' ≥1024px else 'mobile' (matchMedia, SSR-safe). <SurfaceSwitch desktop={..} mobile={..}/> helper.
2. Route tree (React Router v6, all lazy + Suspense skeletons):
   /auth/* (Phase 1) · / (dashboard) · /leads, /leads/:id · /clients, /clients/:id · /contacts, /contacts/:id · /listings, /listings/:id · /offers, /offers/:id · /transactions, /transactions/:id · /mls, /mls/:id · /conversations, /conversations/:id · /calendar · /tasks · /notes · /docs · /reports · /team · /settings/* · 404.
3. DESKTOP shell: fixed Sidebar (logo, grouped nav exactly per Core Functions list, active inset-bar indicator, collapse toggle persisted) + Topbar (global search input → opens search overlay, breadcrumbs from route, Quick Add button (menu stub), notifications bell (popover stub), avatar menu: Profile, Settings, Sign out).
4. MOBILE shell: bottom TabBar (Dashboard, Leads, Clients, Calendar, More) with safe-area padding; More opens a sheet listing every remaining module; FAB (+) opens FabPicker sheet grid (Lead, Client, Listing, Offer, Task, Note, Event) — tiles route to creation sheets (stubs now, wired in module phases).
5. Bottom-sheet primitive (Radix Dialog styled as sheet w/ drag handle) reused by all mobile modals.
6. Scroll restoration, document titles per route, ErrorBoundary per route.

Acceptance: navigating every route on both surfaces shows shell + skeleton placeholder; nav states match prototype screenshots; typecheck clean.
```

---

# PHASE 1 — AUTH & INTEGRATION LAYER

## Prompt P1.1 — Supabase auth pages (all 6 screens, both surfaces)

```
TASK 1.1 from TASKS.md.

Implement the complete auth flow with Supabase. References: RC CRM Auth Desktop.html and RC CRM Auth Mobile.html in the repo — match layout, copy, and interactions exactly.

1. src/lib/supabase/client.ts singleton from env vars.
2. Routes under /auth: sign-in, sign-up, forgot-password, check-email, reset-password, password-changed, confirm (token_hash handler).
3. SIGN IN (B): email+password, show/hide eye toggle, inline errors, submit → signInWithPassword; desktop layout = left brand panel (tagline, feature list, stage dots) + right form card; mobile = full-screen with RC mark header. Links: Forgot password, Create account.
4. CREATE ACCOUNT (B): first+last name (2-col grid desktop), email, brokerage, phone, password with LIVE strength meter (Weak/Fair/Strong bar exactly like prototype), confirm password, ToS checkbox required → signUp with options.data {first_name,last_name,brokerage,phone} → route to check-email.
5. FORGOT (B): email → resetPasswordForEmail(redirectTo /auth/reset-password) → check-email variant copy.
6. CHECK EMAIL (B): mail icon circle, redacted email, Resend (30s cooldown), back link.
7. RESET (B): new+confirm with strength meter → updateUser({password}) → password-changed.
8. PASSWORD CHANGED (B): check icon circle, "Sign in" CTA.
9. All forms: React Hook Form + Zod (email format, pw ≥8 chars, match), disabled/loading button states, error toast on Supabase errors mapped to friendly copy.

Acceptance: full round-trip works against the live Supabase project; both surfaces pixel-faithful to the auth prototypes.
```

## Prompt P1.2 — Session guards & credential storage (Supabase SQL included)

```
TASK 1.2 from TASKS.md.

1. AuthProvider: getSession on boot + onAuthStateChange; expose {session, user, loading, signOut}.
2. <ProtectedRoute>: unauthenticated → /auth/sign-in?next=…; authed users hitting /auth/* → /.
3. Create supabase/migrations/0001_profiles_credentials.sql and run it in the Supabase SQL editor:

-- profiles
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  first_name text, last_name text, brokerage text, phone text,
  avatar_url text, gci_goal numeric, created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, first_name, last_name, brokerage, phone)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name',
          new.raw_user_meta_data->>'brokerage', new.raw_user_meta_data->>'phone');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- GHL credentials (v1: browser reads these to call GHL directly; v2 moves to Edge Function proxy)
create table public.ghl_credentials (
  user_id uuid primary key references auth.users on delete cascade,
  pit_token text not null, location_id text not null,
  default_calendar_id text, updated_at timestamptz default now()
);
alter table public.ghl_credentials enable row level security;
create policy "own creds" on public.ghl_credentials for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

4. useGhlCredentials(): fetch once after login (React Query, staleTime Infinity, memory only — never persist the PIT to localStorage); expose {pit, locationId, isConfigured, refresh}.
5. Post-login gate: if !isConfigured, redirect to /settings/integrations (setup wizard built in P1.5); otherwise run bootstrap (P1.4).

Acceptance: new signup creates a profile row; credentials CRUD works under RLS; unauthenticated access to any app route redirects.
```

## Prompt P1.3 — GHL API client & typed services

```
TASK 1.3 from TASKS.md.

References: GoHighLevel__GHL__API_Integration.txt (endpoint tables), SECTION_2 data dictionary (field keys/types), GHL_Integration_Mapping.md.

1. src/lib/ghl/client.ts: ghlFetch<T>(path, {method, body, query}) →
   - base https://services.leadconnectorhq.com
   - headers: Authorization Bearer (from useGhlCredentials via a module-level credential store set at bootstrap), Version per GHL 2.0 docs, JSON accept/content-type
   - error normalization: GhlError{status, code, message}; 401 → emit 'ghl:unauthorized' event (global banner + route to Integrations); 429 → wait Retry-After or exp backoff, max 3; 5xx → single retry
   - token-bucket rate limiter (≈10 req/s) + in-flight dedupe by method+path+body hash.
2. Services (each: typed functions + Zod schema parse + params typed):
   contacts.ts (list/search w/ query+page, get, create, update, delete, tags add/remove, tasks CRUD, notes CRUD, appointments list)
   opportunities.ts (search {pipelineId, q, page, filters}, get, create, update, updateStatus, delete, pipelines list)
   objects.ts (generic: searchRecords(schemaKey, {query, page, pageLimit, searchAfter, filters}), getRecord, createRecord, updateRecord, deleteRecord) + thin wrappers: myListings, mlsProperties, offers
   associations.ts (getKeys, relationsByRecord(recordId, objectKey?), createRelation, deleteRelation)
   conversations.ts (list, messages(id), sendMessage(typed per channel), markRead)
   calendars.ts (calendars list, events by range, appointment get/create/update/delete)
   tasksGlobal.ts (POST /locations/{locationId}/tasks/search)
   users.ts, customFields.ts, customValues.ts, tags.ts, locations.ts (get location), medias.ts (upload/list)
3. src/types/ghl.ts: exported inferred types (Contact, Opportunity, Pipeline, Stage, ListingRecord, PropertyRecord, OfferRecord, Conversation, Message, Appointment, GhlTask, GhlNote, GhlUser). Custom-object records: helper to strip the `custom_objects.<key>.` prefix into clean typed fields.
4. validateCredentials(pit, locationId) → GET /locations/{id}, returns {ok, locationName}.

Acceptance: a dev-only /ghl-smoke route that runs validateCredentials + one search per service against the live sub-account and renders raw counts. Remove after verification in P18.3.
```

## Prompt P1.4 — Query architecture, bootstrap & performance layer

```
TASK 1.4 from TASKS.md. This is the speed/UX backbone — implement fully.

1. QueryClient: defaults {staleTime 60s, gcTime 24h, retry: smart (no retry on 4xx)}; persistQueryClient → localStorage, maxAge 24h, buster = app version; DO NOT persist any query whose key includes 'credentials'.
2. src/lib/queryKeys.ts factory: ghl.pipelines(), ghl.schemas(), ghl.fields(), ghl.assocKeys(), ghl.users(), ghl.tags(), ghl.contacts(params), ghl.contact(id), ghl.opps(params), ghl.opp(id), ghl.records(schema, params), ghl.record(schema, id), ghl.relations(recordId), ghl.conversations(params), ghl.messages(id), ghl.events(range), ghl.tasks(params), ghl.notes(contactId), sb.profile(), sb.creds(), sb.docs(params).
3. useBootstrap(): after credentials load, Promise.all → pipelines(+stages), the 3 custom-object schemas, custom field definitions, association keys, calendars, users, tags. staleTime 24h. Branded splash (logo + progress) until settled; partial-failure = app loads with per-widget errors, full auth failure = Integrations.
4. PipelineRegistry (context/module): byName('lead'|'buyer'|'seller') → {pipelineId, stages[{id,name,position,color}]}; stageLabel(stageId); stagePosition(stageId). Match names case-insensitively with sensible fallbacks ("Lead Nurture Pipeline", "Buyer Pipeline"/"Buyer Transaction", "Seller Pipeline"); surface a Settings warning if a pipeline can't be resolved.
5. Prefetch utils: usePrefetchOnHover(queryKey, fn) for desktop nav items + list rows; route loaders prefetch page-1 for the target module.
6. seedDetailCache(listKey→items, detailKeyFn): after any list query, setQueryData for each record's detail key.
7. optimisticMutation helper: {queryKey, updater, mutationFn} with cancel/snapshot/rollback/invalidate.
8. VirtualizedTable + VirtualizedList components (TanStack Virtual) used by all long lists; useGhlInfinite(schemaOrService, params) wrapping searchAfter cursors.
9. staleTime tiers constant: SCHEMA 24h, LIST 60s, DETAIL 30s, MESSAGES 15s (+refetchInterval 15s while thread mounted).

Acceptance: cold login shows splash then instant dashboard shell; second visit paints lists from persisted cache then revalidates; React Query devtools shows seeded detail caches.
```

## Prompt P1.5 — Settings ▸ Integrations (PIT onboarding)

```
TASK 1.5 from TASKS.md.

Build /settings/integrations on both surfaces (also the first-run gate).

1. Setup wizard state (not configured): explainer of Private Integration Tokens with steps to create one in GHL (Settings → Private Integrations → New, select scopes) + link https://marketplace.gohighlevel.com/docs/Authorization/PrivateIntegrationsToken. Scope checklist rendered: contacts r/w, opportunities r/w, objects/schema r, objects/record r/w, associations r/w, conversations r/w + message w, calendars r/w + events r/w, users r, locations r, custom fields/values r, tags r/w, medias r/w, tasks r/w, notes r/w.
2. Form: Location ID (text), PIT (password input w/ show toggle). "Test connection" → validateCredentials → success card shows live location name; failure shows mapped error (bad token / wrong location / missing scope hint from status).
3. Save → upsert public.ghl_credentials → refresh credential store → trigger bootstrap → route to dashboard (first-run) or toast (edit).
4. Connected state: masked token (••••last4), location name, last validated timestamp, Re-test, Replace token, Disconnect (delete row, confirm).
5. Security copy: token stored in your Supabase account (RLS-protected), only transmitted from your session to GHL; v2 will proxy via Edge Functions.

Acceptance: brand-new user goes sign-up → confirm → wizard → live dashboard without touching code or env files.
```

---
# PHASE 2 — DASHBOARD

## Prompt P2.1 — Desktop Dashboard

```
TASK 2.1 from TASKS.md. References: desktop/dashboard.jsx (port composition + styling), GHL_Integration_Mapping.md §2.

Build /(dashboard) desktop view — every widget LIVE:
1. NEXT UP hero: soonest upcoming appointment (calendars.eventsByRange(now → +7d), sort asc, first). Title, event-type chip (tag), start time + live Countdown, client chip → contact/lead/client detail, location line, Confirm/Reschedule quick actions. Empty: "No upcoming appointments" + New Event CTA.
2. KPI GRID (each card = one cached count query; clickable → pre-filtered module route):
   - Active Leads: opportunities.search(lead pipeline, status open) total
   - Active Clients: buyer+seller pipelines open totals summed
   - Under Contract: opportunities at stage position ≥ "Under Contract" (PipelineRegistry)
   - Pending Offers: offers.search(status in submitted/pending) total
   - New Leads (7d): lead pipeline, createdAt ≥ now-7d
   - Closings this month: offers accepted w/ closing_date in current month (fallback: opportunities w/ closing custom field)
3. NEEDS ATTENTION: overdue tasks (tasksGlobal.search dueDate<now, incompleted), stale leads (lastActivity > 7d in lead pipeline), offers w/ irrevocable_until < 48h, today's unconfirmed appointments. Each row deep-links; per-section counts.
4. NEW LEADS: 5 newest lead-pipeline opportunities — name, source, TempBadge, age.
5. PENDING OFFERS: 5 offers — price (Money), property address, StatusChip, irrevocable Countdown.
6. ACTIVITY FEED: merge (client-side, sorted desc, capped 30) recent notes + completed tasks + appointments created + opportunity stage changes if available; FUNCTIONAL filter chips (All/Notes/Tasks/Events/Stage) — chips filter the merged array.
7. 3-column responsive-within-desktop grid per prototype; every widget: skeleton, empty, error+retry independently.

Acceptance: with a live sub-account, all numbers/lists are real; KPI clicks land on correctly pre-filtered pages (wire filters via router search params even if modules are still stubs).
```

## Prompt P2.2 — Mobile Dashboard + Global Search screen

```
TASK 2.2 from TASKS.md. References: mobile/screen-dashboard.jsx.

1. "NOW" card: current-or-next appointment with live countdown; quick actions Call (tel:), Text (sms: or → conversation), Directions (maps URL from location).
2. KPI horizontal snap-scroll: same six live KPIs as P2.1 (shared hooks — do not refetch separately).
3. Needs-attention widget (top 4 + "view all"), New Leads (3), Pending Offers (3).
4. Activity feed with functional chips; pull-to-refresh (invalidate dashboard keys).
5. SEARCH SCREEN (opened from top search field): recent searches persisted (localStorage, max 8, clearable), "Browse by type" tiles (Leads/Clients/Contacts/Listings/Offers/Properties → module routes), debounced (300ms) live search fanning out to contacts.search + opportunities.search + myListings.search + offers.search, grouped results with type icons and highlighted match; tap → detail route.

Acceptance: dashboard usable one-handed; search returns live grouped results in <1s on warm cache.
```

# PHASE 3 — LEADS

## Prompt P3.1 — Leads list & Kanban (Desktop)

```
TASK 3.1 from TASKS.md. References: desktop/leads.jsx (port both views), GHL_Integration_Mapping.md §4.

Data: useGhlInfinite over opportunities.search {pipelineId: lead, limit 50}; contact fields denormalized on cards.
1. LIST VIEW: VirtualizedTable — columns Name (avatar+name), Role (RoleBadge from contact.type custom field), Stage (StageDot+label), Temp (TempBadge from temperature:* tag), Budget/Target (Money — buyer_budget or target_list_price), Source, Last Contact (relative), Age, Value. Sticky header; client-side column sort over loaded pages w/ sort indicator; row hover prefetches contact+opportunity detail; row click opens right detail pane AND sets /leads/:id.
2. FILTERS (all combine, reflected in URL search params): segmented All/Buyers/Sellers; Temp chips Hot/Warm/Cold (multi); Source select (distinct sources from tags/bootstrap); Assigned select (users); Stage multi-select. Debounced search box → q param.
3. KANBAN: columns = live lead-pipeline stages; column header stage dot + name + count + total value (tabular); dense cards (name, role avatar, temp, budget, age); horizontal scroll; DRAG-AND-DROP (dnd-kit): drop → optimistic stage move + PUT /opportunities/{id} {pipelineStageId}, rollback+toast on error.
4. List/Board toggle persisted (localStorage per user); result count + active-filter pills w/ clear-all.

Acceptance: filters/sorts/drag all hit live data; URL is shareable/restorable.
```

## Prompt P3.2 — Leads (Mobile)

```
TASK 3.2 from TASKS.md. References: mobile/screen-leads.jsx.

1. LIST: FilterChipRow (same filter model as P3.1, horizontally scrollable); SwipeRow cards (role badge, stage dot, temp, budget/target, last-contact age; inline call/text buttons):
   - swipe RIGHT reveals Done → opportunities.updateStatus(id,'won') optimistic
   - swipe LEFT reveals Reschedule (opens New Task/Event sheet prelinked) and Delete (confirm sheet → opportunities.delete)
2. BOARD: vertical stacked collapsible lanes (stage dot, count, total value in header); lane color = identity only, never card fill.
3. Segmented List/Board toggle; infinite scroll; pull-to-refresh; tap card → /leads/:id full-screen detail.

Acceptance: swipe gestures don't conflict with vertical scroll; all mutations optimistic w/ rollback.
```

## Prompt P3.3 — Lead Detail (both surfaces, Buyer & Seller variants)

```
TASK 3.3 from TASKS.md. References: desktop/leads.jsx (detail pane), mobile/screen-lead-detail.jsx, GHL_Integration_Mapping.md §5.

Data: parallel contacts.get + opportunities.get (seeded from list cache).
1. HEADER: avatar, name, RoleBadge, TempBadge (tap to cycle → tag swap mutation), inline STAGE SELECT (dropdown of lead stages → optimistic move), last contact, quick actions Call/Text/Email/Note (Note opens quick note sheet/modal).
2. BUYER TABS: Buyer Info · Properties · Appointments · Tasks · Notes · Activity · Files.
   Buyer Info: budget, pre-approval lender + status, must-haves, deal-breakers, timeline — each an inline-editable field (click → RHF input → save PUT /contacts/{id} customFields, optimistic) plus core phone/email/source/assignedTo/tags editors.
   Properties: associations.relationsByRecord(contactId → properties/my_listings) → property cards w/ interest-level control (relation metadata or custom field).
3. SELLER TABS: Seller Info (motivation, target price, urgency, competing agents, property address — inline editable) · Property · Comparables (MLS search pre-filtered to subject's city/type/beds as CMA candidates) · Tasks · Notes · Activity.
4. Tasks tab: list + complete toggle + New Task inline (contacts tasks CRUD). Notes tab: list + composer + edit/delete (notes CRUD). Appointments: contact appointments + New Event modal prelinked. Activity: merged notes/tasks/messages/appointments timeline desc. Files: documents linked to this contact (Phase 14 integration point — stub section with upload disabled until P14.1, labeled).
5. Mobile: tabs as horizontal scroll pills; sticky bottom action bar Call · Text · Note · Appt.

Acceptance: every field listed is editable and persists to GHL; buyer vs seller variant switches on contact.type.
```

## Prompt P3.4 — Lead modals & Convert flow

```
TASK 3.4 from TASKS.md. References: desktop/modals.jsx (New Lead, Convert Lead), mobile/screen-modals.jsx (lead sheet, convert sheet).

1. NEW LEAD (modal D / bottom sheet M): Name (first/last split on save), Role segmented (buyer/seller/investor), Phone, Email, Budget or Target price (label switches by role), Source select, Temperature segmented. Submit: contacts.create (+type custom field, temperature + role tags) → opportunities.create in lead pipeline stage 1 (name = contact name, monetaryValue = budget). Zod: name required, phone OR email required. Success: toast + route to new lead detail; list caches invalidated.
2. CONVERT LEAD (from lead detail + list row menu): choose pipeline (Buyer/Seller — preselect from role), starting stage select (live stages), monetary value (prefilled), keep-or-complete open tasks checkbox. Submit: opportunities.update move to target pipeline+stage (or create-new + close old as 'won' if API rejects cross-pipeline move — implement fallback), swap lifecycle tags (lead→client). Success routes to /clients/:id.
3. DELETE LEAD: confirm dialog → opportunities.delete (contact retained), toast w/ undo-not-possible copy.

Acceptance: full lead lifecycle create → nurture → convert works live end-to-end.
```

# PHASE 4 — CLIENTS

## Prompt P4.1 — Clients pipeline views

```
TASK 4.1 from TASKS.md. References: desktop/screens.jsx (Clients), mobile/screen-clients.jsx, GHL_Integration_Mapping.md §6, Buyer-Seller-Journeys.md (stage semantics).

1. Buyer/Seller segmented switcher — TWO distinct live stage sets (PipelineRegistry). Never merge boards.
2. DESKTOP Kanban: lanes = live stages; cards: name+avatar, value (Money), DOM (associated my_listings.days_on_market via relations — lazy per-card query, cached), status tag chip (opportunity tags e.g. Firm/Under Contract); dnd-kit drag → optimistic stage PUT.
3. DESKTOP List: columns Name, Stage, Status tag, Value, DOM, Closing date (custom field), Next milestone; sortable; filters stage/status-tag/assigned; URL params.
4. MOBILE: vertical collapsible Kanban; header meta line live aggregate "N active · $X.XM" (sum monetaryValue).
5. Header aggregates on both surfaces per selected pipeline.

Acceptance: switcher, drag, aggregates all live; deep link /clients?side=seller&view=list restores state.
```

## Prompt P4.2 — Client Detail — Buyer

```
TASK 4.2 from TASKS.md. References: desktop/screens3.jsx (buyer detail), mobile/screen-client-detail.jsx, GHL_Integration_Mapping.md §7.

1. Step-dot pipeline progress (live stage position, labels from registry); stage advance control w/ confirm.
2. Metric grid: Budget, Pre-Approval (lender + status), Active Offer (associated real_estate_offer where status=submitted → Money + link), Target close — live, editable where custom fields.
3. Tabs (D horizontal / M scroll pills): Overview (contact core + buyer custom fields, all inline-editable) · Properties (associated MLS/my_listings cards, interest level, remove-link action) · Offers (associated offers table → /offers/:id) · Appointments (contact appointments + New Event) · Conversations (embedded thread list filtered to contact → opens composer) · Tasks · Notes · Activity (merged) · Documents (Phase 14 slot).
4. Mobile sticky action bar: Call · Text · Note · Appt.

Acceptance: association-driven tabs render live relations; stage moves reflect on the Clients board immediately (shared cache).
```

## Prompt P4.3 — Client Detail — Seller

```
TASK 4.3 from TASKS.md. References: desktop/screens3.jsx (seller detail), mobile/screen-client-detail.jsx, GHL_Integration_Mapping.md §7.

1. Header stats: list price (associated my_listings.list_price), current HIGH offer (max over associated offers), DOM — live.
2. Six-stage seller progress (live stages).
3. OFFERS TAB — comparison table sorted by NET PROCEEDS default (offer price minus estimated condition/closing adjustments; document the heuristic in code): columns price, deposit, financing, conditions count, closing date, net; row actions Accept / Counter / Decline → offer record status PUT (Counter opens prefilled New Offer modal per P7.3).
4. Other tabs: Overview · Listing (associated my_listings record inline-editable) · Showings (calendar events matched to the listing property id/address) · Marketing (listing_views, saves, price history fields) · Tasks · Notes · Activity · Documents.

Acceptance: "money looks like money" — tabular Money everywhere; accepting an offer updates offer status + prompts stage advance.
```

## Prompt P4.4 — Client Detail — Both (dual buy+sell)

```
TASK 4.4 from TASKS.md. References: desktop/screens4.jsx, mobile/screen-client-detail-both.jsx (the "James & Kira Morton" pattern — generalize it).

1. Detection: contact has open opportunities in BOTH buyer and seller pipelines → route renders Both variant automatically.
2. DESKTOP: side-by-side dual columns (Buy side | Sell side), each with its own step dots, metrics, and per-side tabs; shared header.
3. MOBILE: Buy/Sell segmented tabs over the same detail chassis.
4. Combined Activity timeline across both opportunities; cross-link cards (sell listing ↔ buy search criteria).

Acceptance: generalized — works for ANY dual-role contact from live data, not a hardcoded name.
```

## Prompt P4.5 — Client modals

```
TASK 4.5 from TASKS.md. References: desktop/modals.jsx (New Client), mobile/screen-modals.jsx.

1. NEW CLIENT (modal/sheet): Name, Type segmented (buyer/seller — NO rentals anywhere), Stage select (live stages of chosen pipeline), Phone, Email, then conditional: buyer → Budget + Pre-approval status; seller → Property address + Target list price. Submit: contact (create or attach existing via duplicate check) + opportunity in chosen pipeline/stage + custom fields + lifecycle:client tag. Seller optionally creates a my_listings record + listing_to_contact relation (checkbox "Create listing record").
2. CLOSE actions on client detail menu: Mark Won / Lost / Abandoned → updateStatus w/ confirm + reason note prompt (saved as note).

Acceptance: both creation paths verified live; duplicate email/phone warns and offers "use existing contact".
```

# PHASE 5 — CONTACTS

## Prompt P5.1 — Contacts directory

```
TASK 5.1 from TASKS.md. References: desktop/contacts.jsx, mobile/screen-contacts.jsx, GHL_Integration_Mapping.md §11.

1. Data: useGhlInfinite contacts.list (100/page); debounced server search (query param).
2. DESKTOP split pane: left virtualized directory grouped alphabetically w/ sticky letter headers; right detail (P5.2). Row: avatar, name, primary role tag chip, phone.
3. MOBILE: list w/ per-row quick Call (tel:) and Text buttons; alpha fast-scroll index rail.
4. FILTER CHIPS: All · Vendors (type:vendor) · SOI (type:soi) · RE Agents (type:agent) · Team (type:team) · Past Clients (lifecycle:past-client) · Leads · Clients — tag-based; combinable with search.
5. Sort menu: Name A–Z (default), Recently active, Newest.

Acceptance: 1k+ contacts scroll at 60fps (virtualized); chips map to live tag queries.
```

## Prompt P5.2 — Contact detail

```
TASK 5.2 from TASKS.md.

1. Header: avatar, name (editable), role TAG PICKER (multi-select from tag list; add/remove → contact tag mutations), source, DND indicators.
2. Sections/tabs: INFO (phone, email, address, DND toggles — inline editable) · VENDOR PANEL when type:vendor (Service Type, Priority, Last Used, Preferred Comm custom fields — per mobile vendor card design) · TASKS (CRUD) · NOTES (CRUD) · CONVERSATIONS (threads for contact + "New message") · ACTIVITY (merged) · RELATED (associations.relationsByRecord → opportunity/listing/offer cards w/ links).
3. Quick actions row: Call, Text (→ conversation composer), Email (mailto or email composer), Add note, Add task.

Acceptance: vendor variant switches on tags; Related tab shows live relations.
```

## Prompt P5.3 — Contact modals

```
TASK 5.3 from TASKS.md.

1. NEW CONTACT (modal/sheet): first/last name, phone, email, role tags multi-select, source, address. BEFORE create: duplicate check (contacts search by email then phone) — if hit, banner "Contact exists" w/ Open Existing / Create Anyway.
2. EDIT handled inline (P5.2). DELETE: confirm dialog warning about linked records → contacts.delete.

Acceptance: dedupe path verified; delete invalidates directory + any related caches.
```

# PHASE 6 — MY LISTINGS

## Prompt P6.1 — Listings inventory

```
TASK 6.1 from TASKS.md. References: desktop/screens.jsx (My Listings), mobile/screen-props-offers.jsx, GHL_Integration_Mapping.md §8.

1. Data: useGhlInfinite objects.searchRecords('custom_objects.my_listings'); field prefix-stripper from P1.3.
2. DESKTOP: card grid (photo from image_urls[0], address, MLS#, Money price, stage chip, beds/baths/sqft, DOM, views) ⇄ table toggle (same cols sortable).
3. MOBILE: card list w/ listing-stage strip; infinite scroll.
4. FILTERS: stage multi (Coming Soon/Active/Pending/Sold — live distinct listing_stage values), price min/max inputs, beds+/baths+ steppers, property type select. SORT: price ↑↓, DOM, newest. URL-param synced.
5. Optional STAGE BOARD view: lanes by listing_stage, drag → updateRecord listing_stage optimistic.

Acceptance: filters compose into the records/search body correctly; all three views live.
```

## Prompt P6.2 — Listing detail

```
TASK 6.2 from TASKS.md. References: desktop/screens3.jsx (property detail patterns), GHL_Integration_Mapping.md §9.

1. Hero: image carousel (image_urls, swipe on mobile), Money price, status chip, specs grid (beds/baths/sqft/type/year), public remarks.
2. Tabs: OVERVIEW (all record fields inline-editable → updateRecord) · OFFERS (associated offers sorted by net, same component as P4.3) · SHOWINGS (calendar events matched by property id/address custom field) · MARKETING (views/saves stats + price history list) · DOCUMENTS (Phase 14 slot filtered to this listing) · NOTES/TASKS (linked via seller contact) · SELLER (associated contact + opportunity cards).
3. Actions: Change stage, Price change (writes old price into price-history field + updates list_price), Add showing (New Event prefilled), Draft received offer (P7.3 prefilled).

Acceptance: edits persist to the live record; associations resolve seller + offers.
```

## Prompt P6.3 — Listing modals

```
TASK 6.3 from TASKS.md. References: desktop/modals.jsx (New Property), mobile/screen-modals.jsx (Listing sheet).

NEW LISTING: address, MLS#, list price, stage, beds, baths, sqft, property type, seller contact picker (search contacts; optional create-inline). Submit: createRecord my_listings + createRelation listing_to_contact. Zod validation; success → listing detail.

Acceptance: record + relation verified in live account.
```

# PHASE 7 — OFFERS

## Prompt P7.1 — Offers table/list

```
TASK 7.1 from TASKS.md. References: desktop/screens.jsx (Offers), mobile/screen-props-offers.jsx, GHL_Integration_Mapping.md §10, SECTION_5 offer record example (field keys).

1. Data: useGhlInfinite offers search. Strip prefixes → typed OfferRecord {offer_id, property_address, mls_number, purchase/offer_price, deposit_amount, status, offer_type, financing_type, offer_date, possession_date, closing_date, conditions_deadline, conditions, commission_amount, irrevocable_until}.
2. DESKTOP table: Offer ID, Property, Parties (associated buyer/seller contact chips — lazy relation fetch), Price (Money), Deposit, StatusChip (Pending/Accepted/Declined/Countered), Irrevocable (live Countdown, danger <24h row highlight), Closing, Conditions deadline. Sortable.
3. MOBILE: offer cards (address, price, status, irrevocable countdown, closing).
4. Filters: status multi, offer_type (buyer_offer/received), date range (offer_date), property search. Sorts: price, irrevocable soonest (default), closing date.

Acceptance: countdown urgency styling live; relations resolve party names.
```

## Prompt P7.2 — Offer detail

```
TASK 7.2 from TASKS.md.

1. TERMS panel: all offer fields (Money for amounts, dates via date-fns), inline-editable while status is Pending/Countered.
2. NEGOTIATION TIMELINE: counter chain — render linked offer records (parent_offer_id field if present, else history array field); each entry: price, date, by-whom, delta vs previous.
3. ASSOCIATED: property card (offer_to_property relation), buyer contact, seller contact (offer_to_contact w/ role) — all linked.
4. CONDITIONS checklist: parse conditions field into toggleable items w/ deadline Countdown; toggle persists (structured field or notes fallback — document choice).
5. ACTIONS: Accept (status→accepted + prompt to advance client stage), Decline (reason prompt → note), Counter (opens New Offer prefilled, links parent, sets this one countered), Withdraw.

Acceptance: full accept/counter/decline flow persists and reflects on Seller client detail Offers tab (shared cache invalidation).
```

## Prompt P7.3 — Offer modals

```
TASK 7.3 from TASKS.md. References: desktop/modals.jsx (New Offer), mobile/screen-modals.jsx (Offer sheet).

NEW OFFER (modal/sheet): Property picker (typeahead over my_listings + MLS properties), Buyer contact picker, offer price, deposit, financing type select (per SECTION_5 enum e.g. cmhc_insured/conventional/cash), offer date (default today), irrevocable until (datetime), possession + closing dates, conditions multi-select (Financing, Inspection, Sale of Property, Condo Docs…) + conditions deadline, commission. Submit: createRecord + relations offer_to_property + offer_to_contact(buyer) (+seller from listing association). Counter mode: prefill from parent + parent link.

Acceptance: created offer appears in Offers table, property detail, and client detail without refresh (invalidation).
```

# PHASE 8 — TRANSACTIONS

## Prompt P8.1 — Transactions list

```
TASK 8.1 from TASKS.md. (Derived surface — no new GHL object.)

1. Data: opportunities in buyer + seller pipelines where stage position ≥ the pipeline's "Under Contract" stage (PipelineRegistry.stagePosition), status open or won-this-period; join accepted offer (associations) for contract price + dates.
2. Views (B): table (D) / cards (M): Client, Side badge (Buy/Sell), Property address, Contract price, Conditions deadline (Countdown), Closing (Countdown), Possession, Status chip (Conditional/Firm from tags), Commission.
3. Filters: side, closing month select, status; default sort closing date asc.
4. Widgets above list: "Closing this week" and "Conditions due (7d)" strips.

Acceptance: promotion is automatic — moving a client into Under Contract makes them appear here.
```

## Prompt P8.2 — Transaction detail

```
TASK 8.2 from TASKS.md.

1. MILESTONE tracker: Under Contract → Conditions → Firm → Clear to Close → Closed, mapped to live stage names; advance = opportunity stage move.
2. CRITICAL DATES panel: conditions deadline, financing deadline, closing, possession — each w/ Countdown + edit.
3. PARTIES: client, co-op agent, lawyer, lender, inspector — associated contacts w/ add/remove party (relation + role tag).
4. Tabs: Overview · Conditions checklist (shared component from P7.2) · Documents (P14 slot) · Tasks · Notes · Activity.
5. COMMISSION CALCULATOR card: sale price (from accepted offer), rate %, brokerage split %, referral fee, desk fee → net take-home (Money, computed live, persisted to opportunity custom fields).

Acceptance: calculator persists; milestone advance updates Clients board + Transactions list.
```

# PHASE 9 — PROPERTIES (MLS)

## Prompt P9.1 — MLS search

```
TASK 9.1 from TASKS.md. References: desktop/mls.jsx, mobile/screen-mls.jsx, GHL_Integration_Mapping.md §8.

1. Data: useGhlInfinite objects.searchRecords('custom_objects.properties') w/ searchAfter; debounced q.
2. DESKTOP: advanced filter bar (city typeahead, price min/max, beds+, baths+, type, status) + grid/table toggle; result count; SAVED SEARCHES: name current filter set → persisted to Supabase (table `saved_searches` user_id/name/params jsonb, RLS owner) rendered as chips.
3. MOBILE: filter bottom sheet + card feed infinite scroll; active-filter pill row.
4. Sorts: price ↑↓, newest, DOM.

Acceptance: saved searches restore exact params; pagination cursors correct (no dupes/gaps).
```

## Prompt P9.2 — MLS Property detail

```
TASK 9.2 from TASKS.md. References: desktop/screens3.jsx property detail, GHL_Integration_Mapping.md §9.

1. Carousel, Money price, status, specs, public remarks (read-mostly; edit gated behind an "agent-managed" flag).
2. Sections: OFFERS (associated) · SHOWINGS (events filtered by property) · DOCUMENTS · INTERESTED BUYERS (contact relations w/ interest level).
3. Actions: LINK TO BUYER (contact picker → createRelation + interest level) · DRAFT OFFER (P7.3 prefilled with property) · ADD SHOWING (New Event prefilled type=showing + property).

Acceptance: linking a buyer makes the property appear on that client's Properties tab instantly.
```

# PHASE 10 — CONVERSATIONS

## Prompt P10.1 — Inbox

```
TASK 10.1 from TASKS.md. References: desktop/conversations.jsx, mobile/screen-conversations.jsx, GHL_Integration_Mapping.md §12.

1. Data: conversations.list — rows: contact avatar+fullName, channel icon (sms/email/fb-messenger/whatsapp/webchat via type), lastMessageBody preview (1 line), relative time, unread count badge, starred flag. Sort lastMessageDate desc; refetchInterval 15s while mounted.
2. Filters: channel chips (All/SMS/Email/Messenger/WhatsApp/Webchat), Unread toggle, Starred toggle, contact search.
3. DESKTOP: split-pane inbox|thread; keyboard ↑↓ navigation. MOBILE: list → full-screen thread w/ back.
4. Open thread → markRead mutation (optimistic badge clear).

Acceptance: unread badges live-update; channel icons match design.
```

## Prompt P10.2 — Thread & composer

```
TASK 10.2 from TASKS.md.

1. Messages: conversations.messages(id) infinite (older-page up-scroll); bubbles by direction; channel-specific renders per mobile design: email (subject + collapsible body), call logs (duration + outcome), review, group SMS; day dividers; delivery/read status ticks where provided.
2. COMPOSER: channel switcher limited to channels present/available for the contact; textarea autosize; attachment button (medias.upload → attach URL) for sms/email; email adds subject field; TEMPLATES dropdown (custom values merge-fields rendered w/ live contact data).
3. SEND: sendMessage typed per channel → optimistic bubble (pending state) → reconcile; failure = red retry state.
4. LOG CALL action (type: call, duration + outcome fields). Contact context header links to their lead/client/contact detail; thread auto-scrolls to newest.

Acceptance: send SMS + email verified against live account; optimistic pending→sent transition smooth.
```

# PHASE 11 — CALENDAR

## Prompt P11.1 — Calendar views

```
TASK 11.1 from TASKS.md. References: desktop/screens2.jsx (calendar views), mobile/screen-calendar-full.jsx, screen-cal-tasks.jsx, GHL_Integration_Mapping.md §13.

1. Data: calendars.eventsByRange keyed per visible range (month fetch feeds week/day slices from cache); status colors confirmed/showed/noshow; type chips from tags (Showing/Consult/Inspect/Offer/Call).
2. DESKTOP: Week time-grid (default, 7col × hours, now-line, drag event = reschedule optimistic PUT, drag-resize = duration), Day, Month (event pills + overflow "+N"), Agenda list. View switcher + Today + prev/next + mini month picker popover.
3. MOBILE: Agenda-first default, Day / Week / Month grids, horizontal swipe between days, date strip header.
4. CONFLICT BANNER (design.md §11.10): overlap detection in visible range → banner listing conflicts + one-click Reschedule (opens event edit at conflicting slot).
5. Click/tap event → Event Detail modal/sheet (P11.2).

Acceptance: drag-reschedule persists; conflicts detected on live data; range caching prevents refetch when toggling views.
```

## Prompt P11.2 — Event modals

```
TASK 11.2 from TASKS.md. References: desktop/modals.jsx (Event Detail, New Event), mobile/screen-modals.jsx.

1. EVENT DETAIL: kind chip, time + duration, client chip (link), property chip (link), location (maps link), notes; actions Edit · Add note · status set Confirmed/Showed/No-show (appointment PUT) · Cancel event (confirm).
2. NEW EVENT: type segmented (showing/consult/inspect/offer/call), title (auto-suggest from type+client), date + time + duration, client picker, PROPERTY picker shown only for showing/inspect/offer types (per prototype conditional), calendar select (bootstrap list, default from creds), location. → appointment create; appears in calendar + dashboard instantly.
3. RESCHEDULE sheet (mobile) = date/time editor shortcut.

Acceptance: conditional property field matches prototype; created events feed Dashboard "Next up".
```

# PHASE 12 — TASKS

## Prompt P12.1 — Tasks views

```
TASK 12.1 from TASKS.md. References: mobile/screen-cal-tasks.jsx (Today+Overdue), screen-tasks-notes.jsx (group-by), desktop/screens.jsx, GHL_Integration_Mapping.md §14, design.md §11.11.

1. Data: tasksGlobal.search (location-wide) + contact-scoped CRUD for mutations; enrich rows w/ contact name (batched contact lookups, cached).
2. Filter chips: All / Today / Overdue / Upcoming / Completed. GROUP-BY control: None / Client / Property / Tag (client-side over loaded set, collapsible groups).
3. Row: checkbox (optimistic complete), title, due (relative, red overdue), priority badge (priority:* tag), client chip, property chip.
4. DESKTOP EXTRAS (design.md §11.11): (a) BULK-EDIT table toggle — multi-select checkboxes → toolbar Complete / Reschedule (date picker) / Delete, batched mutations w/ progress; (b) TODAY SCHEDULER mini-calendar strip above list — drag unscheduled (no-time) today tasks onto hour slots → sets dueDate time.
5. Sorts: due (default), priority, created. Mobile: swipe-complete on rows.

Acceptance: bulk ops + scheduler drag persist; grouping headers show live counts.
```

## Prompt P12.2 — Task modals

```
TASK 12.2 from TASKS.md. References: desktop/modals.jsx, mobile/screen-modals.jsx (New Task, Task Detail).

1. NEW TASK: title, due quick-picks (Today/Tomorrow/Next week) + custom datetime, body, client/lead picker (required by GHL contactId), property link (custom association or body ref — document approach), priority segmented (tag), assignee select.
2. TASK DETAIL/EDIT: editable title, complete toggle, due, priority, client, property, body, Delete (confirm).

Acceptance: created tasks appear in Dashboard Needs-Attention when overdue.
```

# PHASE 13 — NOTES

## Prompt P13.1 — Notes feed & groups

```
TASK 13.1 from TASKS.md. References: mobile/screen-tasks-notes.jsx (notes grouping), desktop/screens.jsx (notes feed).

1. Data strategy (GHL notes are contact-scoped): fetch notes for recently-active contacts (contacts.list sorted by activity, first N pages) in a batched parallel pass; merge desc; cache 60s; "Load more contacts" extends. Label the feed "Recent notes".
2. Feed row: body preview, author (users map), linked contact chip, tags, relative time; click → Note Detail modal/sheet.
3. Group-by: Client / Property (from tag or linked record) / Tag; text search over loaded notes.
4. MOBILE Quick Note sheet: body + linked-to contact picker only (fast path).

Acceptance: feed loads under 1.5s warm; groups collapse w/ counts.
```

## Prompt P13.2 — Note modals

```
TASK 13.2 from TASKS.md. References: desktop/modals.jsx, mobile/screen-modals.jsx (New Note, Note Detail).

1. NEW NOTE: body (autofocus textarea), client/lead picker, tags input → POST /contacts/{id}/notes.
2. NOTE DETAIL/EDIT: editable body, linked-to selector (moving = create on new contact + delete on old, confirm), tags, Delete (confirm).

Acceptance: notes surface immediately on the linked record's Notes tab + Activity.
```

# PHASE 14 — DOCS (Document Vault)

## Prompt P14.1 — Vault (full build)

```
TASK 14.1 from TASKS.md. References: mobile/screen-documents.jsx (stub → full), Screen Inventory suggestion S1, Buyer-Seller-Journeys.md §2 (document taxonomy).

1. SUPABASE: storage bucket `documents` (private) + table:
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  name text not null, category text not null,
  linked_record_type text, linked_record_id text, ghl_contact_id text,
  storage_path text not null, size bigint, mime text,
  created_at timestamptz default now()
);
RLS owner-only; storage policies owner-only by path prefix user_id/.
2. VAULT UI (B): category folders — Listing Agreements · Offer Docs · Inspection Reports · Client Files · MLS Sheets — plus doc-type tags from Buyer-Seller-Journeys §2.2; grid/list of docs (icon by mime, name, size, date, linked-record chip).
3. UPLOAD: drag-drop zone (D) / picker (M), multi-file, progress bars, category + link-to-record picker (client/listing/offer/transaction typeahead) → upload to storage + insert row + append doc UUID to the GHL record's documents_ref field where applicable.
4. Actions: preview (pdf/image inline viewer, others download), download (signed URL), rename, re-link, delete (confirm, removes storage + row + GHL ref).
5. Record-surface integration: the "Documents" tabs stubbed in Phases 3–9 now render this vault filtered by linked_record_id, with in-context upload.
6. Search + filter (category, record, mime) + sort (date/name).

Acceptance: upload→preview→appear-on-record round trip live; RLS verified (second user sees nothing).
```

# PHASE 15 — REPORTS

## Prompt P15.1 — Reports dashboard

```
TASK 15.1 from TASKS.md. Reference: Screen Inventory S2.

1. Date-range selector: This month / Quarter / YTD / Custom (all queries parameterized).
2. WIDGETS (recharts, tokens from design system, tabular numerals):
   - GCI vs annual goal: sum commission_amount of accepted offers (or transaction custom fields) in range vs profiles.gci_goal (editable inline) — progress bar + delta.
   - Deal volume by month: closed/won opportunities monetaryValue grouped by month — bar chart.
   - CONVERSION FUNNEL: Lead → Client → Under Contract → Closed counts in range — funnel/stacked bar with % between steps.
   - Average DOM: my_listings aggregate (sold in range).
   - SOURCE ATTRIBUTION: contacts created in range grouped by source — pie/bar toggle.
3. Aggregation approach: paged live queries reduced client-side; heavy results cached (staleTime 5m) keyed by range.
4. EXPORT: per-widget CSV of underlying rows (client-side blob).
5. Mobile: stacked single-column cards, horizontal-scroll charts.

Acceptance: numbers reconcile with module list counts for the same filters.
```

# PHASE 16 — TEAM

## Prompt P16.1 — Team

```
TASK 16.1 from TASKS.md.

1. Data: users.list (location users). If the PIT lacks users scope → graceful fallback to contacts tagged type:team, with an inline notice.
2. Directory (B): member cards — avatar, name, role, email, phone; click → member detail.
3. MEMBER DETAIL: live workload — assigned open leads count, active clients count (opportunity searches by assignedTo), open tasks count; lists linked to pre-filtered module routes.
4. REASSIGN: from a member detail, multi-select their opportunities → assign to another user (batched PUT, progress, optimistic).

Acceptance: counts match module filters; fallback path tested by revoking scope.
```

# PHASE 17 — SETTINGS

## Prompt P17.1 — Settings (all sections)

```
TASK 17.1 from TASKS.md. References: desktop/screens2.jsx (Settings), mobile/screen-settings.jsx.

Layout: desktop = left tab rail + panel; mobile = stacked sections (Profile · Preferences · Data pattern from prototype, expanded).
1. PROFILE & ACCOUNT: avatar upload (Supabase Storage avatars bucket, crop-to-square), first/last name, brokerage, phone (profiles upsert); email change (supabase.auth.updateUser w/ confirm-email notice); change password (current-session updateUser flow).
2. NOTIFICATIONS: toggles (New lead, Offer status changes, Task due, Appointment reminders, Message received) persisted to a profiles.notification_prefs jsonb column (migration included) — these gate the in-app notifications feed (P18.1).
3. DISPLAY: Theme Light/Dark/System (ThemeProvider from P0.2 — dark tokens must be complete), Density Comfortable/Compact, Default landing page select, Default calendar view select — persisted jsonb.
4. INTEGRATIONS: the P1.5 screen mounted here; connection status card.
5. DATA: Export my data (CSV: contacts, opportunities via paged fetch w/ progress), Clear local cache (queryClient.clear + persister purge), app version + build hash.
6. Sign out everywhere; DELETE ACCOUNT: type-to-confirm → delete ghl_credentials/profile rows + supabase user deletion request flow.

Acceptance: dark mode is complete and polished across ALL built screens (audit pass); prefs persist across devices.
```

# PHASE 18 — GLOBAL COMPLETION

## Prompt P18.1 — Quick Add + Notifications

```
TASK 18.1 from TASKS.md. References: desktop/modals.jsx (Quick Add trigger), mobile FabPicker + Notifications sheet.

1. DESKTOP Quick Add (topbar +): menu → New Lead / Client / Contact / Listing / Offer / Task / Note / Event — reuses every module modal (import, don't duplicate). Keyboard shortcut "c" then letter.
2. MOBILE FabPicker: verify all seven tiles open the real sheets; contextual default links (e.g. opened from a client detail → prelink that client).
3. NOTIFICATIONS (D popover / M full sheet): derived live feed — overdue tasks, offers with irrevocable <24h, unread conversations, today's appointments, new leads (24h) — respecting notification_prefs; rows deep-link; per-item mark-read + read-state persisted (localStorage keyed by item id+day); unread count badge on bell/tab.

Acceptance: every creation path in the app reachable within 2 taps/clicks from anywhere.
```

## Prompt P18.2 — Global Search (cmd+k)

```
TASK 18.2 from TASKS.md.

1. Desktop: cmd/ctrl+K opens command-palette style overlay; mobile: search screen from P2.2 upgraded to the same engine.
2. Engine: debounced parallel fan-out — contacts.search, opportunities.search (lead/buyer/seller labeled), myListings.search, properties.search, offers.search; grouped sections w/ type icons, match highlighting, top-3 per group + "See all in <module>" (routes w/ q param).
3. Keyboard: ↑↓ navigate, enter opens, esc closes; recent searches + quick actions (New Lead, New Task…) when query empty.

Acceptance: warm-cache results <500ms; every result type routes to the right detail.
```

## Prompt P18.3 — QA, polish & performance pass

```
TASK 18.3 from TASKS.md — final sweep before handoff.

1. INVENTORY AUDIT: walk SCREENS.md + "RC CRM Screen Inventory.html" line by line (50 mobile screens/sheets, 41 desktop screens/modals, auth set). Produce AUDIT.md checklist mapping each inventory row → implemented route/component. Fix gaps.
2. STATES AUDIT: every list/detail/widget has skeleton + empty + error-with-retry; every mutation has toast + optimistic/rollback where specified.
3. RESILIENCE: global 401 interceptor → credentials banner + Integrations route; offline banner (navigator.onLine + retry queue for reads); route-level ErrorBoundaries.
4. PERFORMANCE: verify code-splitting per route (bundle analyze), image lazy-loading, virtualization on all long lists, no query waterfalls on detail pages (parallelize), persisted-cache instant paint on reload.
5. ACCESSIBILITY: modal focus traps, DnD keyboard alternatives (stage-move via detail dropdown), 44px targets, contrast in both themes, aria-labels on icon buttons.
6. Remove /ghl-smoke and /design-preview from production builds (dev-only guards).
7. README.md: setup, env vars, Supabase migrations order, PIT creation guide w/ scopes, architecture overview, caching strategy summary, and V2 MIGRATION NOTES (swap ghlFetch transport to Supabase Edge Function proxy + webhook-driven cache invalidation — list the exact seams).

Acceptance: AUDIT.md fully checked; typecheck/lint/build clean; live end-to-end demo of each core function.
```
