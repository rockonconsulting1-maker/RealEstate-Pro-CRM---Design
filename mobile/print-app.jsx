// print-app.jsx — Renders all 26 screens, one per page, for PDF export.

const DETAIL_SCREENS_PRINT = ['clientDetail','clientDetailBuyer','clientDetailSeller','propDetail','offerDetail','leadDetailBuyer','leadDetailSeller','calEventDetail'];

function Frame({ screen }) {
  const goto = () => {};
  let content = null;
  if (screen === 'dash')                  content = <window.Dashboard goto={goto} />;
  else if (screen === 'leads')            content = <window.Leads view="list"  onViewChange={() => {}} goto={goto} />;
  else if (screen === 'leadsBoard')       content = <window.Leads view="board" onViewChange={() => {}} goto={goto} />;
  else if (screen === 'leadDetailBuyer')  content = <window.LeadDetailBuyer goto={goto} />;
  else if (screen === 'leadDetailSeller') content = <window.LeadDetailSeller goto={goto} />;
  else if (screen === 'clients')          content = <window.Clients view="kanban" onViewChange={() => {}} goto={goto} />;
  else if (screen === 'clientDetail')     content = <window.Clients view="detail" roleVariant="vendor" goto={goto} />;
  else if (screen === 'clientDetailBuyer')  content = <window.ClientDetailBuyer goto={goto} />;
  else if (screen === 'clientDetailSeller') content = <window.ClientDetailSeller goto={goto} />;
  else if (screen === 'props')            content = <window.Properties view="list" onViewChange={() => {}} goto={goto} />;
  else if (screen === 'propsBoard')       content = <window.PropertiesBoard goto={goto} />;
  else if (screen === 'propsMap')         content = <window.Properties view="map"  onViewChange={() => {}} goto={goto} />;
  else if (screen === 'propDetail')       content = <window.PropDetail goto={goto} />;
  else if (screen === 'offers')           content = <window.Offers goto={goto} />;
  else if (screen === 'offersByProp')     content = <window.OffersByProperty goto={goto} />;
  else if (screen === 'calendar')         content = <window.CalendarScreen goto={goto} />;
  else if (screen === 'calDay')           content = <window.CalendarDay goto={goto} />;
  else if (screen === 'calWeek')          content = <window.CalendarWeek goto={goto} />;
  else if (screen === 'calMonth')         content = <window.CalendarMonth goto={goto} />;
  else if (screen === 'calEventDetail')   content = <window.CalendarEventDetail goto={goto} />;
  else if (screen === 'tasks')            content = <window.Tasks goto={goto} />;
  else if (screen === 'tasksByProperty')  content = <window.TasksGrouped groupBy="property" goto={goto} />;
  else if (screen === 'tasksByClient')    content = <window.TasksGrouped groupBy="client" goto={goto} />;
  else if (screen === 'notesByClient')    content = <window.Notes groupBy="client" goto={goto} />;
  else if (screen === 'notesByContact')   content = <window.Notes groupBy="contact" goto={goto} />;
  else if (screen === 'notesByTag')       content = <window.Notes groupBy="tag" goto={goto} />;

  const isDetail = DETAIL_SCREENS_PRINT.includes(screen);

  const tab =
    screen === 'dash' ? 'dash' :
    screen.startsWith('lead') ? 'leads' :
    screen.startsWith('client') ? 'clients' :
    screen.startsWith('prop') ? 'props' :
    screen.startsWith('offer') ? 'offers' :
    screen.startsWith('cal') ? 'dash' :
    (screen.startsWith('task') || screen.startsWith('note')) ? 'tasks' : 'dash';

  return (
    <div className="frame-wrap">
      <window.IOSDevice width={393} height={852} dark={false}>
        <div className="app">
          <div className="app-status-spacer" />
          <div className="app-scroll">{content}</div>
          {!isDetail && <window.TabBar active={tab} onTab={() => {}} />}
          {['clientDetail','clientDetailBuyer','clientDetailSeller'].includes(screen) && (
            <div className="actionbar">
              <button className="primary"><window.Icon name="phone" size={18} /><span>Call</span></button>
              <button><window.Icon name="message" size={18} /><span>Text</span></button>
              <button><window.Icon name="note" size={18} /><span>Note</span></button>
              <button><window.Icon name="calendar" size={18} /><span>Appt</span></button>
            </div>
          )}
          {screen === 'propDetail' && (
            <div className="actionbar">
              <button><window.Icon name="share" size={18} /><span>Share</span></button>
              <button><window.Icon name="calendar" size={18} /><span>Showing</span></button>
              <button className="primary"><window.Icon name="coins" size={18} /><span>Add offer</span></button>
              <button><window.Icon name="note" size={18} /><span>Note</span></button>
            </div>
          )}
        </div>
      </window.IOSDevice>
    </div>
  );
}

// 26 screens — grouped, with per-screen description + design note.
const PRINT_GROUPS = [
  {
    key: 'dashboard', num: '01', name: 'Dashboard',
    desc: 'The morning-of home screen. Hero countdown, attention triage, fresh leads, pending offers, and a filterable activity timeline. Designed against the two-second rule.',
    screens: [
      { id: 'dash', title: 'Dashboard', desc: 'Next appointment is hero. Stats use tabular numerals; new-lead and pending-offer rails sit below the hero so the agent never has to swipe to know what is on fire.', notes: 'Money is always tabular lining figures. The hero is the only element with strong visual weight on this screen.' },
    ],
  },
  {
    key: 'leads', num: '02', name: 'Leads',
    desc: 'A four-screen flow for new prospects: list, kanban, and two role-specific detail pages. Buyer leads need pre-approval and properties; seller leads need timeline and motivation.',
    screens: [
      { id: 'leads',            title: 'Leads — List', desc: 'Filter chips for temperature and role. Each card shows role badge, GHL stage dot, temperature, budget, and last-contact age. Inline call/text with swipe-to-complete.', notes: 'Swipe right reveals Done; swipe left reveals Reschedule / Delete. Stage colors come from GoHighLevel.' },
      { id: 'leadsBoard',       title: 'Leads — Kanban', desc: 'Six pipeline lanes with stage dot, count, and total value in tabular numerals. Lanes are vertically stacked and collapsible — the brief\'s mobile-first kanban pattern.', notes: 'Lane color is identity only — never fills the card. Semantic and stage colors never mix.' },
      { id: 'leadDetailBuyer',  title: 'Lead detail — Buyer', desc: 'Tabs: Buyer Info, Properties, Appointments, Tasks, Notes, Activity. Buyer Info surfaces budget, mortgage status, must-haves, deal-breakers, and timeline.', notes: 'The Properties tab is unique to buyer leads — it shows interest level on saved listings, not vendor service history.' },
      { id: 'leadDetailSeller', title: 'Lead detail — Seller', desc: 'Tabs: Seller Info, Property, Comparables, Tasks, Notes, Activity. Seller Info surfaces motivation, target price, urgency, and competing agents.', notes: 'Comparables tab pre-loads CMA candidates so the agent walks into the listing presentation prepared.' },
    ],
  },
  {
    key: 'clients', num: '03', name: 'Clients',
    desc: 'Four screens covering active clients across pipeline view and three role-specific details. Buyers, sellers, and vendors each have their own card body, tabs, and quick actions.',
    screens: [
      { id: 'clients',            title: 'Clients — Kanban', desc: 'Five buyer-transaction lanes with count, value, and DOM on every card. A segmented control toggles to the seller pipeline. Summary "11 active · $13.8M" lives in the top meta.', notes: 'Buyer and seller pipelines are physically different stage sets — never merged into one wider board.' },
      { id: 'clientDetailBuyer',  title: 'Client detail — Buyer', desc: 'Pipeline step dots from Pre-Approval → Closing. Tabs include Properties (saved + viewed), Offers, Tasks, Notes, Activity. Sticky action bar: Call · Text · Note · Appt.', notes: 'Step dots replace numeric progress — they show momentum without quantifying it.' },
      { id: 'clientDetailSeller', title: 'Client detail — Seller', desc: 'Six-stage seller pipeline (Pre-Listing → Closed) with offer comparison built into the Offers tab. The header shows list price, current high offer, and DOM.', notes: 'Incoming offers sort by net proceeds, not headline price — the brief\'s "money looks like money" rule.' },
      { id: 'clientDetail',       title: 'Client detail — Vendor', desc: 'Vendors get a different card body: Service Type / Priority / Last Used / Preferred Comm. No Opportunities or Properties tabs.', notes: 'Role-aware cards are derived from contact metadata — agents never set the role manually.' },
    ],
  },
  {
    key: 'properties', num: '04', name: 'Properties',
    desc: 'Four views of the listing book: list, board, map, and a deep detail page. The map is the differentiator — pins colored by stage, with a slide-up mini-card on tap.',
    screens: [
      { id: 'props',       title: 'Properties — List', desc: 'Cards with photo placeholder, stage dot, address, DOM, and a large price. List / Board / Map are a single segmented control at the top.', notes: 'Photo placeholders, never stock. Price uses tabular lining numerals at 28px.' },
      { id: 'propsBoard',  title: 'Properties — Board', desc: 'Collapsible lanes by stage with photo thumbnails, address, DOM, and price per card. Lane headers show count and total value.', notes: 'The board is for portfolio-level thinking; the map is for spatial thinking; the list is for fast scanning.' },
      { id: 'propsMap',    title: 'Properties — Map', desc: 'Pins colored by stage, price in the pin body. Tap a pin to select — it darkens and a mini-card slides in with stats and actions.', notes: 'On a real phone this becomes a Mapbox/Apple Maps layer with clustering at zoom-out.' },
      { id: 'propDetail',  title: 'Property detail', desc: 'A 40%-viewport photo carousel sits above a dense info strip. The Offers tab is a horizontally scrollable comparison table — two swipes compares any two offers.', notes: 'Sticky action bar: Share · Showing · Add offer (primary) · Note. The primary action is always Add offer.' },
    ],
  },
  {
    key: 'offers', num: '05', name: 'Offers',
    desc: 'Two list views of all live offers — by status (default) and by property. Countdowns are always visible, color-coded, and use tabular numerals.',
    screens: [
      { id: 'offers',       title: 'Offers — By status', desc: 'Active negotiations pinned up top. Every card surfaces price, deposit, side (buyer/seller), and a CountdownBadge — green, amber, red, or black "Expired".', notes: 'The countdown is the screen\'s urgency cue. Destructive tone, no loud alarms.' },
      { id: 'offersByProp', title: 'Offers — By property', desc: 'Same offer cards, regrouped under their property. Each property header shows offer count, active count, and the high-water price.', notes: 'This view is for sellers staring at competing bids — the comparison is the work.' },
    ],
  },
  {
    key: 'calendar', num: '06', name: 'Calendar',
    desc: 'Five views — agenda is the default because that is how agents actually read their day. Day, Week, Month, and Event detail are accessible via a segmented control.',
    screens: [
      { id: 'calendar',       title: 'Calendar — Agenda', desc: 'Infinite scrollable agenda. Between consecutive events, a DriveTimePill shows "≈ 18 min drive". When travel + buffer exceeds the gap, it goes amber and says "tight".', notes: 'Drive-time is computed live from the event addresses. Agents trust the pill — they don\'t read addresses to estimate.' },
      { id: 'calDay',         title: 'Calendar — Day', desc: 'Hour-by-hour timeline with colored event blocks (showing/consult/inspect/call/offer) and a live "now" indicator that scrolls into view on load.', notes: 'Colors match event kind, not stage — the brief allows this overlap because they don\'t collide on the same surface.' },
      { id: 'calWeek',        title: 'Calendar — Week', desc: 'Seven-column grid with event blocks. Tap any event to open Event Detail; tap any empty slot to begin a new appointment.', notes: 'Week view is read-only on mobile — drag-to-reschedule is a desktop-only affordance.' },
      { id: 'calMonth',       title: 'Calendar — Month', desc: 'Standard month grid with dot indicators per event kind. A mini-agenda below shows events for the selected day in full detail.', notes: 'Month is overview-only; tapping a day populates the mini-agenda rather than navigating.' },
      { id: 'calEventDetail', title: 'Calendar — Event detail', desc: 'Drive-time warning if applicable, contact, address, pre-meeting notes, and a post-meeting note field that saves to the contact\'s timeline.', notes: 'Pre / post notes are the difference between an appointment and a deal moving forward.' },
    ],
  },
  {
    key: 'tasks', num: '07', name: 'Tasks',
    desc: 'Three views — Today + Overdue (default), grouped by property, and grouped by client. Overdue is always first and always destructive-toned.',
    screens: [
      { id: 'tasks',           title: 'Tasks — Today + Overdue', desc: 'Overdue section is pinned to the top in destructive tone. Swipe right → Complete; swipe left → Reschedule / Delete. Tap the circle to complete optimistically.', notes: 'The default filter is the brief\'s most opinionated decision: "today + overdue" beats "all open" because it matches what the agent is actually deciding about.' },
      { id: 'tasksByProperty', title: 'Tasks — By property', desc: 'Tasks regrouped under their attached property. Each group header shows the address, listing photo thumbnail, and count of overdue tasks.', notes: 'Used when the agent is preparing for a showing — they want every loose thread on this listing in one place.' },
      { id: 'tasksByClient',   title: 'Tasks — By client', desc: 'Tasks regrouped under their attached client. Each group header shows the client name, role badge, and an overdue count.', notes: 'Used when the agent is about to call a client — quick scan of every open commitment.' },
    ],
  },
  {
    key: 'notes', num: '08', name: 'Notes',
    desc: 'Three filter views over the same note pool — by client, by contact, by tag. Notes are first-class objects, not buried inside contact records.',
    screens: [
      { id: 'notesByClient',  title: 'Notes — By client', desc: 'Filter chips narrow to a single client. Each note shows date, body, and tag chips. The FAB opens a new-note sheet.', notes: 'Notes default to the active client when one is selected — no mode-switching to capture a thought.' },
      { id: 'notesByContact', title: 'Notes — By contact', desc: 'Same shape, regrouped under contact rather than client. Useful when the contact spans multiple deals.', notes: 'A contact can be a buyer this year and a seller next year. The note continuity matters.' },
      { id: 'notesByTag',     title: 'Notes — By tag', desc: 'Filter chips narrow by tag — financing, showing, offer, callback, follow-up. Tap any chip to focus that tag.', notes: 'Tags are flat by design — no hierarchy, no required taxonomy. Agents tag what they need to find.' },
    ],
  },
];

const KPIS = [
  { k: '26', b: 'Total screens',  s: 'Across 8 product groups' },
  { k: '8',  b: 'Product groups', s: 'Dashboard · Leads · Clients · Properties · Offers · Calendar · Tasks · Notes' },
  { k: '6',  b: 'Bottom tabs',    s: 'Hard ceiling per DESIGN.md § 8.1' },
  { k: '3',  b: 'Role variants',  s: 'Buyer · Seller · Vendor — body, tabs, and actions adapt' },
  { k: '1',  b: 'Radius token',   s: '10 px everywhere — cards, chips, inputs' },
  { k: '0',  b: 'Stock photos',   s: 'Placeholders only outside real property imagery' },
];

function PrintApp() {
  // Flatten groups into a stream of pages: cover → for each group: divider + screens.
  return (
    <div className="pages">
      {/* Cover */}
      <section className="page cover">
        <div className="brand">RC CRM · Mobile Prototype</div>
        <h1>Calm, human, thumb-first.</h1>
        <div className="sub">
          A real-estate CRM that sits on GoHighLevel and feels like relief after a day in the portals.
          Designed for independent agents in the car between showings — the two-second rule, money that looks
          like money, urgency colored but never loud. iPhone 15 · light mode · one accent.
        </div>
        <div className="grid">
          {KPIS.map((k, i) => (
            <div key={i}>
              <span className="k">{k.k}</span>
              <span><b>{k.b}</b>{k.s}</span>
            </div>
          ))}
        </div>
      </section>

      {PRINT_GROUPS.map(g => (
        <React.Fragment key={g.key}>
          {/* Group divider */}
          <section className="page group-divider">
            <div className="gd-num">{g.num}</div>
            <div className="gd-name">{g.name}</div>
            <div className="gd-desc">{g.desc}</div>
          </section>

          {/* Screen pages */}
          {g.screens.map((s, i) => (
            <section key={s.id} className="page">
              <div>
                <div className="kicker">{g.num}.{String(i + 1).padStart(2,'0')} · {g.name}</div>
                <h2>{s.title}</h2>
                <div className="desc">{s.desc}</div>
                <div className="notes"><b>Design note.</b> {s.notes}</div>
                <div className="meta-row">
                  <span>· Inter / JetBrains Mono</span>
                  <span>· oklch palette</span>
                  <span>· Radius 10px</span>
                </div>
              </div>
              <Frame screen={s.id} />
            </section>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PrintApp />);

// Auto-print once fonts + JSX are ready
(async () => {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}
  await new Promise(r => setTimeout(r, 1500));
  window.print();
})();
