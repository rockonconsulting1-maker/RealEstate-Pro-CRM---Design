// screen-tasks-notes.jsx — Tasks (by Property, by Client) + Notes (by Client, Contact, Tag)
const { useState: useStateTN } = React;

const M_TN = window.MOCK;

// ─── TASKS ──────────────────────────────────────────────────────────
const ALL_TASKS = [
  { id: 't1', text: 'Send CMA draft to Aya Fujimori', when: 'Overdue · yesterday', tone: 'danger', contact: 'Aya Fujimori', prop: '88 Willow Park Rd', client: 'Aya Fujimori' },
  { id: 't2', text: 'Follow up on Scotia pre-approval', when: 'Today, 11:00 AM', tone: 'warn', contact: 'Sarah Okonkwo', prop: null, client: 'Sarah Okonkwo' },
  { id: 't3', text: 'Confirm inspection w/ Tran household', when: 'Today, 2:00 PM', tone: 'warn', contact: 'Tran Household', prop: '77 Wellesley St E', client: 'Tran Household' },
  { id: 't4', text: 'Prep feedback email for 42 Sorauren', when: 'Today, 4:30 PM', tone: 'ok', contact: '42 Sorauren #3', prop: '42 Sorauren Ave #3', client: null },
  { id: 't5', text: 'Draft counter for Okonkwo offer', when: 'Today, 6:00 PM', tone: 'warn', contact: 'Aya Fujimori', prop: '88 Willow Park Rd', client: 'Aya Fujimori' },
  { id: 't6', text: 'Thank-you note to Navarro family', when: 'Tomorrow', tone: 'ok', contact: 'Navarro', prop: null, client: 'Navarro' },
  { id: 't7', text: 'Update 128 Balsam MLS photos', when: 'Fri Apr 18', tone: 'ok', contact: '128 Balsam', prop: '128 Balsam Ave', client: null },
  { id: 't8', text: 'Reschedule lender call for Chen', when: 'Fri Apr 18', tone: 'ok', contact: 'Marcus & Priya Chen', prop: '128 Balsam Ave', client: 'Marcus & Priya Chen' },
  { id: 't9', text: 'Review Sorauren staging invoice', when: 'Mon Apr 20', tone: 'ok', contact: '42 Sorauren #3', prop: '42 Sorauren Ave #3', client: null },
];

function TaskRow({ task, done, onDone, onOpen, isOpen }) {
  return (
    <div onClick={() => window.openSheet?.('taskDetail')} style={{ display: 'flex', gap: 12, padding: '12px 14px', borderBottom: '1px solid var(--border-2)', background: done ? 'oklch(0.97 0.03 150 / 0.5)' : 'var(--surface)', cursor: 'pointer' }}>
      <button
        onClick={onDone}
        style={{ width: 22, height: 22, borderRadius: 999, border: '1.5px solid ' + (done ? 'var(--success)' : 'var(--border)'), background: done ? 'var(--success)' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginTop: 1 }}
      >
        {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: done ? 'var(--ink-3)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.4 }}>{task.text}</div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={'countdown ' + task.tone}>{task.when}</span>
          {task.contact && <span className="meta">· {task.contact}</span>}
        </div>
      </div>
    </div>
  );
}

function TasksGrouped({ groupBy, goto }) {
  const [done, setDone] = useStateTN({});
  const [groupBy2, setGroupBy2] = useStateTN(groupBy);
  const [filter, setFilter] = useStateTN('All');

  const byProp = {};
  const byClient = {};
  ALL_TASKS.forEach(t => {
    const pk = t.prop || '(no property)';
    const ck = t.client || '(no client)';
    if (!byProp[pk]) byProp[pk] = [];
    if (!byClient[ck]) byClient[ck] = [];
    byProp[pk].push(t);
    byClient[ck].push(t);
  });

  const groups = groupBy2 === 'property' ? byProp : byClient;

  return (
    <>
      <window.TopBar title="Tasks" />
      <div style={{ padding: '0 16px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="meta">Group by</span>
        <div className="seg">
          <button data-active={groupBy2 === 'today'} onClick={() => setGroupBy2('today')}>Due</button>
          <button data-active={groupBy2 === 'property'} onClick={() => setGroupBy2('property')}>Property</button>
          <button data-active={groupBy2 === 'client'} onClick={() => setGroupBy2('client')}>Client</button>
        </div>
      </div>

      {groupBy2 === 'today' ? (
        <window.Tasks goto={goto} />
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Object.entries(groups).map(([name, tasks]) => (
            <div key={name}>
              <div className="flex items-center gap-2" style={{ padding: '0 4px 8px' }}>
                <window.Icon name={groupBy2 === 'property' ? 'home' : 'briefcase'} size={13} color="var(--ink-3)" />
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-2)' }}>{name}</span>
                <span className="meta tnum">{tasks.length}</span>
                <div style={{ flex: 1 }} />
                {tasks.filter(t => t.tone === 'danger').length > 0 && (
                  <span className="badge danger">{tasks.filter(t => t.tone === 'danger').length} overdue</span>
                )}
              </div>
              <div className="card" style={{ overflow: 'hidden' }}>
                {tasks.map((t, i) => (
                  <TaskRow key={t.id} task={t} done={done[t.id]} onDone={() => setDone(d => ({ ...d, [t.id]: !d[t.id] }))} />
                ))}
              </div>
            </div>
          ))}
          <div style={{ height: 60 }} />
        </div>
      )}

      <button className="fab"><window.Icon name="plus" size={22} color="#fff" /></button>
    </>
  );
}

// ─── NOTES ──────────────────────────────────────────────────────────
const ALL_NOTES = [
  { id: 'n1', date: 'Apr 17 · 09:12', body: 'Pre-approval from Scotia confirmed — $1.05M. Expires July 31, 2026. Kwame is the co-buyer.', tags: ['financing'], contact: 'Sarah Okonkwo', client: 'Sarah Okonkwo', prop: null },
  { id: 'n2', date: 'Apr 17 · 08:47', body: 'Chen called re 128 Balsam. Very interested — expect offer by EOD.', tags: ['offer', 'showing'], contact: 'Marcus Chen', client: 'Marcus & Priya Chen', prop: '128 Balsam Ave' },
  { id: 'n3', date: 'Apr 16 · 17:00', body: 'Submitted offer at $1,245,000 with financing and inspection conditions. Closing Jun 6.', tags: ['offer'], contact: 'Marcus & Priya Chen', client: 'Marcus & Priya Chen', prop: '128 Balsam Ave' },
  { id: 'n4', date: 'Apr 16 · 14:30', body: 'Staging invoice from Elm & Co — $2,400. Approved. Scheduled for Apr 21.', tags: ['staging', 'vendor'], contact: 'Aya Fujimori', client: 'Aya Fujimori', prop: '88 Willow Park Rd' },
  { id: 'n5', date: 'Apr 15 · 10:00', body: 'Intro call with Aya (14 min). Motivated seller, wants to list before summer. Listing pres scheduled Apr 22.', tags: ['listing'], contact: 'Aya Fujimori', client: 'Aya Fujimori', prop: '88 Willow Park Rd' },
  { id: 'n6', date: 'Apr 14 · 11:00', body: 'Buyer consult complete. Priorities: parking, finished basement, near Bloor West. Lease ends Jul 1.', tags: ['search', 'timeline'], contact: 'Sarah Okonkwo', client: 'Sarah Okonkwo', prop: null },
  { id: 'n7', date: 'Apr 13 · 15:20', body: 'Bailey offer expired on 128 Balsam at $1,210,000. Will relist strategy with vendors next week.', tags: ['offer', 'strategy'], contact: null, client: null, prop: '128 Balsam Ave' },
  { id: 'n8', date: 'Apr 9 · 09:00', body: 'Listing went live on MLS — E8912476. Photos look great. First showing booked for Apr 10.', tags: ['listing'], contact: 'Aya Fujimori', client: 'Aya Fujimori', prop: '88 Willow Park Rd' },
];

const ALL_TAGS = [...new Set(ALL_NOTES.flatMap(n => n.tags))].sort();
const ALL_CONTACTS = [...new Set(ALL_NOTES.map(n => n.contact).filter(Boolean))].sort();
const ALL_CLIENTS  = [...new Set(ALL_NOTES.map(n => n.client).filter(Boolean))].sort();

function NoteCard({ note }) {
  return (
    <div className="card card-pad" style={{ padding: 14, marginBottom: 8, cursor: 'pointer' }}
      onClick={() => { window._selectedNote = note; window.openSheet?.('noteDetail'); }}>
      <div className="meta tnum" style={{ marginBottom: 5 }}>{note.date}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink)' }}>{note.body}</div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {note.tags.map(tag => <span key={tag} className="badge brand">#{tag}</span>)}
        {note.prop && <span className="badge" style={{ fontSize: 10 }}>{note.prop}</span>}
      </div>
    </div>
  );
}

function Notes({ groupBy: initGroupBy, goto }) {
  const [groupBy, setGroupBy] = useStateTN(initGroupBy || 'client');
  const [activeFilter, setActiveFilter] = useStateTN(null);

  let groups = {};
  if (groupBy === 'client') {
    ALL_CLIENTS.forEach(c => { groups[c] = ALL_NOTES.filter(n => n.client === c); });
    groups['(no client)'] = ALL_NOTES.filter(n => !n.client);
    if (groups['(no client)'].length === 0) delete groups['(no client)'];
  } else if (groupBy === 'contact') {
    ALL_CONTACTS.forEach(c => { groups[c] = ALL_NOTES.filter(n => n.contact === c); });
    groups['(no contact)'] = ALL_NOTES.filter(n => !n.contact);
    if (groups['(no contact)'].length === 0) delete groups['(no contact)'];
  } else {
    ALL_TAGS.forEach(tag => { groups['#' + tag] = ALL_NOTES.filter(n => n.tags.includes(tag)); });
  }

  const filtered = activeFilter
    ? { [activeFilter]: groups[activeFilter] || [] }
    : groups;

  const filterOptions = Object.keys(groups);

  return (
    <>
      <window.TopBar title="Notes" />
      <div style={{ padding: '0 16px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="meta">Group by</span>
        <div className="seg">
          <button data-active={groupBy === 'client'}  onClick={() => { setGroupBy('client');  setActiveFilter(null); }}>Client</button>
          <button data-active={groupBy === 'contact'} onClick={() => { setGroupBy('contact'); setActiveFilter(null); }}>Contact</button>
          <button data-active={groupBy === 'tag'}     onClick={() => { setGroupBy('tag');     setActiveFilter(null); }}>Tag</button>
        </div>
        <div style={{ flex: 1 }} />
        <span className="meta tnum">{ALL_NOTES.length} notes</span>
      </div>

      {/* Filter strip */}
      <div className="chips" style={{ paddingBottom: 12 }}>
        <button className="chip" data-active={!activeFilter} onClick={() => setActiveFilter(null)}>All</button>
        {filterOptions.map(opt => (
          <button key={opt} className="chip" data-active={activeFilter === opt} onClick={() => setActiveFilter(opt === activeFilter ? null : opt)}>
            {opt}
            <span className="count tnum">{groups[opt]?.length}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.entries(filtered).map(([name, notes]) => (
          <div key={name} style={{ marginBottom: 10 }}>
            <div className="flex items-center gap-2" style={{ padding: '0 4px 8px' }}>
              <window.Icon name={groupBy === 'client' ? 'briefcase' : groupBy === 'contact' ? 'user' : 'note'} size={13} color="var(--ink-3)" />
              <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-2)' }}>{name}</span>
              <span className="meta tnum">{notes.length}</span>
            </div>
            {notes.map(n => <NoteCard key={n.id} note={n} />)}
          </div>
        ))}
        <div style={{ textAlign: 'center', padding: '16px 0 60px', color: 'var(--ink-4)', fontSize: 12 }}>
          {ALL_NOTES.length} notes total
        </div>
      </div>

      <button className="fab"><window.Icon name="pen" size={20} color="#fff" /></button>
    </>
  );
}

// ─── Properties Board (full lanes with cards) ────────────────────────
const M_PROPS = window.MOCK;

function PropertiesBoard({ goto }) {
  const [collapsed, setCollapsed] = useStateTN({});

  const lanes = [
    { name: 'Pre-Listing', color: '#ADB5BD', cards: [
      { addr: '901 Queen St W', city: 'Trinity–Bell.', beds: 1, baths: 1, price: 649000, dom: 2 },
    ]},
    { name: 'Listing Prep', color: '#CC5DE8', cards: [
      { addr: '88 Willow Park Rd', city: 'Leslieville', beds: 3, baths: 2, price: 1495000, dom: 0 },
    ]},
    { name: 'Active on Market', color: '#FAB005', cards: [
      { addr: '128 Balsam Ave', city: 'The Beach', beds: 4, baths: 3, price: 1295000, dom: 6 },
      { addr: '18 Lower Jarvis', city: 'Harbourfront', beds: 2, baths: 2, price: 999000, dom: 9 },
      { addr: '44 Elm Grove', city: 'Roncesvalles', beds: 3, baths: 2, price: 1099000, dom: 4 },
    ]},
    { name: 'Offer Review', color: '#F76707', cards: [
      { addr: '42 Sorauren Ave #3', city: 'Roncesvalles', beds: 2, baths: 2, price: 879000, dom: 11 },
    ]},
    { name: 'Under Contract', color: '#F03E3E', cards: [
      { addr: '77 Wellesley St E', city: 'Cabbagetown', beds: 3, baths: 2, price: 1580000, dom: 22 },
    ]},
    { name: 'Closed', color: '#40C057', cards: [
      { addr: '14 Bellwoods Ave', city: 'Trinity–Bell.', beds: 4, baths: 3, price: 1820000, dom: 61 },
      { addr: '52 Pape Ave', city: 'Riverdale', beds: 3, baths: 2, price: 1050000, dom: 43 },
    ]},
  ];

  return (
    <>
      <window.TopBar title="Properties" />
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', alignItems: 'center' }}>
        <div className="seg">
          <button onClick={() => goto('props')}>List</button>
          <button data-active={true}>Board</button>
          <button onClick={() => goto('propsMap')}>Map</button>
        </div>
        <div style={{ flex: 1 }} />
        <span className="meta tnum">{lanes.reduce((a, l) => a + l.cards.length, 0)} listings</span>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lanes.map(lane => {
          const isCollapsed = collapsed[lane.name];
          return (
            <div key={lane.name} className="lane">
              <div className="lane-head" onClick={() => setCollapsed(c => ({ ...c, [lane.name]: !c[lane.name] }))} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <span className="dot" style={{ backgroundColor: lane.color }} />
                <span className="name">{lane.name}</span>
                <span className="count tnum">{lane.cards.length}</span>
                <div className="spacer" />
                <window.Icon name="down" size={14} color="var(--ink-4)" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 150ms' }} />
              </div>
              {!isCollapsed && lane.cards.length > 0 && (
                <div className="lane-body">
                  {lane.cards.map((c, i) => (
                    <div key={i} className="lane-card" onClick={() => goto('propDetail')} style={{ cursor: 'pointer' }}>
                      <div className="flex items-center gap-3">
                        <div className="ph" data-label="photo" style={{ width: 52, height: 52, borderRadius: 8, flex: 'none' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="row-title truncate" style={{ fontSize: 14 }}>{c.addr}</div>
                          <div className="row-sub">{c.city} · {c.beds}bd · {c.baths}ba</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="money tnum" style={{ fontSize: 14 }}><span className="sym">$</span>{c.price.toLocaleString()}</span>
                            {c.dom > 0 && <span className="meta tnum">DOM {c.dom}</span>}
                          </div>
                        </div>
                        <window.Icon name="chevron" size={14} color="var(--ink-4)" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!isCollapsed && lane.cards.length === 0 && (
                <div style={{ padding: '12px 14px', color: 'var(--ink-4)', fontSize: 13, textAlign: 'center' }}>Empty lane</div>
              )}
            </div>
          );
        })}
        <div style={{ height: 80 }} />
      </div>

      <button className="fab"><window.Icon name="plus" size={22} color="#fff" /></button>
    </>
  );
}

// ─── Offers by property ──────────────────────────────────────────────
function OffersByProperty({ goto }) {
  const [group, setGroup] = useStateTN('property');
  const M = window.MOCK; const I = window.Icon;

  const byProp = {};
  M.offers.forEach(o => {
    if (!byProp[o.addr]) byProp[o.addr] = [];
    byProp[o.addr].push(o);
  });

  return (
    <>
      <window.TopBar title="Offers" />
      <div style={{ padding: '0 16px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="meta">Group by</span>
        <div className="seg">
          <button data-active={group === 'status'} onClick={() => goto('offers')}>Status</button>
          <button data-active={group === 'property'} onClick={() => setGroup('property')}>Property</button>
          <button data-active={group === 'client'} onClick={() => goto('offersByClient')}>Client</button>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.entries(byProp).map(([prop, offers]) => {
          const totalVal = offers.reduce((s, o) => s + o.price, 0);
          const hasActive = offers.some(o => o.status !== 'Expired');
          return (
            <div key={prop}>
              <div className="flex items-center gap-2" style={{ padding: '0 4px 8px' }}>
                <window.Icon name="home" size={13} color="var(--ink-3)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', truncate: true }}>{prop}</div>
                </div>
                <span className="meta tnum">{offers.length} offer{offers.length > 1 ? 's' : ''}</span>
                {hasActive && <span className="badge brand">Active</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {offers.map((o, i) => (
                  <div key={i} className="card card-pad" style={{ padding: 14 }} onClick={() => goto('offerDetail')}>
                    <div className="flex items-center gap-3">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2">
                          <div className="row-title">{o.client}</div>
                          <span className="badge" style={{ fontSize: 10 }}>{o.side === 'buyer' ? 'BUYER' : 'SELLER'}</span>
                        </div>
                        <div className="row-sub">{o.status}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <window.Money v={o.price} />
                        <div className="mt-1"><window.Countdown minutes={o.expMin} /></div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-2)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {[['Deposit', '$' + o.deposit.toLocaleString()], ['Side', o.side], ['Status', o.status]].map(([k, v]) => (
                          <div key={k}>
                            <div className="meta" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 1 }} className="tnum">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ height: 60 }} />
      </div>
    </>
  );
}

window.TasksGrouped = TasksGrouped;
window.Notes = Notes;
window.PropertiesBoard = PropertiesBoard;
window.OffersByProperty = OffersByProperty;
