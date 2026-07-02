// other-screens.jsx — Clients kanban, Properties, Offers, Calendar, Tasks
const O_M = window.MOCK; const O_I = window.Icon;
const { Avatar: OAv, Money: OMoney, Countdown: OCD } = window.RC;

// ============ Clients (kanban + list, buyer & seller) ============
function Clients({ goto }) {
  const [pipe, setPipe]               = React.useState('buyer');
  const [view, setView]               = React.useState('kanban');
  const [groupByStage, setGroupByStage] = React.useState(false);

  // Reset list state when switching pipelines
  React.useEffect(() => { setGroupByStage(false); }, [pipe]);
  // Reset group when leaving list view
  React.useEffect(() => { if (view !== 'list') setGroupByStage(false); }, [view]);

  const SELLER_LANES = [
    { name: 'Pre-Listing',      color: '#CC5DE8', total: 2, value: '$2.9M',
      cards: [
        { name: 'Aya Fujimori',     role: 'seller', tag: 'CMA pending', dom: 5,  value: '$1.45M' },
        { name: 'Park Household',   role: 'seller', tag: 'Staging',     dom: 11, value: '$1.44M' },
      ]},
    { name: 'Active on Market', color: '#FAB005', total: 2, value: '$2.9M',
      cards: [
        { name: 'Chen Duplex',      role: 'seller', tag: 'DOM 6',       dom: 6,  value: '$1.295M' },
        { name: 'Reese Investment', role: 'seller', tag: 'Price drop',  dom: 18, value: '$1.64M' },
      ]},
    { name: 'Offer Review',     color: '#F76707', total: 1, value: '$879k',
      cards: [
        { name: '42 Sorauren Ave',  role: 'seller', tag: '2 offers',    dom: 11, value: '$879k' },
      ]},
    { name: 'Under Contract',   color: '#F03E3E', total: 1, value: '$1.58M',
      cards: [
        { name: 'Tran Listing',     role: 'seller', tag: 'Firm',        dom: 22, value: '$1.58M' },
      ]},
    { name: 'Closed',           color: '#40C057', total: 1, value: '$920k',
      cards: [
        { name: 'Navarro Estate',   role: 'seller', tag: 'Closed Apr 9', dom: 61, value: '$920k' },
      ]},
  ];

  const activeLanes = pipe === 'buyer' ? O_M.clientLanes : SELLER_LANES;

  // Flatten all cards for list view
  const listItems = activeLanes.flatMap(lane =>
    lane.cards.map(c => ({ ...c, stage: lane.name, stageColor: lane.color }))
  );

  const ClientRow = ({ c, showStage }) => (
    <tr style={{ cursor: 'pointer' }} onClick={() => goto(c.role === 'seller' ? 'clientDetailSeller' : 'clientDetail')}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <OAv name={c.name} role={c.role} size={26} />
          <span className="name">{c.name}</span>
        </div>
      </td>
      {showStage && (
        <td>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="dot" style={{ background: c.stageColor }} />{c.stage}
          </span>
        </td>
      )}
      <td><span className="badge">{c.tag}</span></td>
      <td className="num tnum">{c.dom}</td>
      <td className="num tnum" style={{ fontWeight: 600 }}>{c.value}</td>
      <td><O_I name="chevron" size={14} color="var(--ink-4)" /></td>
    </tr>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div className="page-head">
        <div><div className="sub">Active deals</div><h1>Clients</h1></div>
        <div className="actions">
          <div className="seg">
            <button data-active={pipe === 'buyer'}  onClick={() => setPipe('buyer')}>Buyer pipeline</button>
            <button data-active={pipe === 'seller'} onClick={() => setPipe('seller')}>Seller pipeline</button>
          </div>
          <span className="meta tnum">11 active · $13.8M</span>
          <div className="seg">
            <button data-active={view === 'kanban'} onClick={() => setView('kanban')} title="Kanban view">
              <O_I name="board" size={14} />
            </button>
            <button data-active={view === 'list'} onClick={() => setView('list')} title="List view">
              <O_I name="list" size={14} />
            </button>
          </div>
          {view === 'list' && (
            <button
              className="btn sm"
              style={groupByStage ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : {}}
              onClick={() => setGroupByStage(g => !g)}
            >
              <O_I name="list" size={14} color={groupByStage ? '#fff' : undefined} />
              Group by Stage
            </button>
          )}
          <button className="btn sm"><O_I name="filter" size={14} />Filter</button>
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('client')}><O_I name="plus" size={14} color="#fff" />New client</button>
        </div>
      </div>

      {/* ── Kanban ──────────────────────────────────────────────── */}
      {view === 'kanban' && (
        <div className="kanban" style={{ flex: 1 }}>
          {activeLanes.map(lane => (
            <div key={lane.name} className="lane-col">
              <div className="lane-col-head">
                <span className="dot" style={{ background: lane.color }} />
                <span className="name">{lane.name}</span>
                <span className="count tnum">{lane.total}</span>
                <div className="spacer" />
                <span className="lane-money">{lane.value}</span>
              </div>
              <div className="lane-cards">
                {lane.cards.map((c, i) => (
                  <div key={i} className="kard" onClick={() => goto(c.role === 'seller' ? 'clientDetailSeller' : 'clientDetail')}>
                    <div className="kard-h">
                      <OAv name={c.name} role={c.role} size={28} />
                      <div className="flex-1"><div className="kard-name truncate">{c.name}</div><div className="kard-sub">{c.tag} · DOM {c.dom}</div></div>
                    </div>
                    <div style={{ marginTop: 10 }}><div className="ph" data-label={c.tag.toLowerCase() + ' property'} style={{ height: 60, borderRadius: 6 }} /></div>
                    <div className="kard-foot">
                      <span className="badge">{c.tag}</span><div style={{ flex: 1 }} />
                      <span className="money tnum" style={{ fontSize: 13 }}>{c.value}</span>
                    </div>
                  </div>
                ))}
                {lane.cards.length === 0 && <div style={{ padding: 14, color: 'var(--ink-4)', fontSize: 12, textAlign: 'center' }}>Empty lane</div>}
              </div>
              <button className="lane-add">+ Add client</button>
            </div>
          ))}
        </div>
      )}

      {/* ── List · flat ─────────────────────────────────────────── */}
      {view === 'list' && !groupByStage && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Client</th>
                <th>Stage</th>
                <th>Tag</th>
                <th className="num">DOM</th>
                <th className="num">Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listItems.map((c, i) => <ClientRow key={i} c={c} showStage={true} />)}
            </tbody>
          </table>
        </div>
      )}

      {/* ── List · grouped by stage ─────────────────────────────── */}
      {view === 'list' && groupByStage && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activeLanes.filter(lane => lane.cards.length > 0).map(lane => (
            <div key={lane.name} className="card" style={{ overflow: 'hidden' }}>
              <div className="card-head">
                <span className="dot" style={{ background: lane.color }} />
                <h2 style={{ marginLeft: 6 }}>{lane.name}</h2>
                <div style={{ flex: 1 }} />
                <span className="meta tnum">{lane.cards.length} client{lane.cards.length !== 1 ? 's' : ''}</span>
                <span className="meta tnum" style={{ marginLeft: 10 }}>{lane.value}</span>
              </div>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Tag</th>
                    <th className="num">DOM</th>
                    <th className="num">Value</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lane.cards.map((c, i) => (
                    <ClientRow key={i} c={{ ...c, stage: lane.name, stageColor: lane.color }} showStage={false} />
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Client Detail (full page) ============
function ClientDetail({ goto }) {
  const [tab, setTab] = React.useState('Overview');
  const stages = ['Needs Analysis', 'Property Search', 'Offer Submitted', 'Under Contract', 'Closed'];
  const cur = 2;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <button className="btn ghost sm" onClick={() => goto('clients')}><O_I name="chevron" size={14} /><span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>›</span> All clients</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm"><O_I name="share" size={14} />Share</button>
        <button className="btn sm"><O_I name="pen" size={14} />Edit</button>
        <button className="btn primary sm"><O_I name="phone" size={14} color="#fff" />Call client</button>
      </div>

      <div className="card card-pad">
        <div className="flex items-center gap-3">
          <OAv name="Marcus & Priya Chen" role="buyer" size={56} />
          <div className="flex-1">
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Marcus & Priya Chen</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="role buyer"><span className="dot" style={{ background: 'oklch(0.62 0.14 254)' }} />Buyer client</span>
              <span className="meta">· Last contact <span className="tnum">2h ago</span></span>
              <span className="meta">· DOM <span className="tnum">31</span></span>
              <span className="meta">· Owner Jordan Reyes</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="meta">Active offer</div>
            <div className="money tnum" style={{ fontSize: 22, marginTop: 2 }}><span className="sym">$</span>1,245,000</div>
          </div>
        </div>

        <div className="mt-4" style={{ marginTop: 20 }}>
          <div className="steps">
            {stages.map((s, i) => <div key={s} className={'step ' + (i < cur ? 'done' : i === cur ? 'cur' : '')} />)}
          </div>
          <div className="steps-labels">{stages.map(s => <span key={s}>{s}</span>)}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 18 }}>
          {[
            ['Budget',         '$1.2–1.4M'],
            ['Pre-approval',   'TD · $1.4M'],
            ['Active offers',  '1 · Submitted'],
            ['Showings done',  '14'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
              <div className="meta">{k}</div>
              <div className="tnum" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {['Overview', 'Properties', 'Offers', 'Tasks', 'Notes', 'Activity', 'Files'].map(t => (
          <button key={t} data-active={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head"><h2>Active offer · 128 Balsam Ave</h2><div style={{ flex: 1 }} /><span className="badge warn">Submitted · counter expected</span></div>
            <div style={{ padding: 18 }}>
              <div className="ph" data-label="hero · 128 Balsam Ave" style={{ height: 220, borderRadius: 8 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
                {[
                  ['List',        '$1,295,000'],
                  ['Offered',     '$1,245,000'],
                  ['Deposit',     '$65,000'],
                  ['Expires in',  '5h 40m'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="meta">{k}</div>
                    <div className="tnum" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h2>Open tasks</h2><div style={{ flex: 1 }} /><span className="meta tnum">3</span></div>
            <div>
              {[
                { txt: 'Confirm inspection booking', when: 'Today · 2:00 PM', tone: 'warn' },
                { txt: 'Send counter draft to listing', when: 'Today · 6:00 PM', tone: 'warn' },
                { txt: 'Update Marcus on counter terms', when: 'Tomorrow', tone: 'ok' },
              ].map((t, i) => (
                <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                  <input type="checkbox" />
                  <div>
                    <div className="lname">{t.txt}</div>
                    <div className="lsub">{t.when}</div>
                  </div>
                  <span className={'badge ' + (t.tone === 'warn' ? 'warn' : '')}>{t.tone === 'warn' ? 'Today' : 'Soon'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-head"><h2>Showings & activity</h2></div>
            <div className="tline">
              {[
                { t: 'Today 09:12', who: 'Marcus Chen', body: 'Confirmed 10:30 showing at 128 Balsam', kind: 'call' },
                { t: 'Apr 16', who: 'You', body: 'Submitted offer · $1.245M, 65k deposit, 14-day close', kind: 'stage' },
                { t: 'Apr 15', who: 'You', body: 'Showing #14 — 128 Balsam Ave', kind: 'note' },
                { t: 'Apr 12', who: 'You', body: 'Showing #13 — 18 Lower Jarvis', kind: 'note' },
              ].map((it, i) => (
                <div key={i} className="tline-row">
                  <div className="tline-t tnum">{it.t}</div>
                  <div className="tline-rail"><div className={'pip ' + (it.kind === 'note' ? 'brand' : it.kind === 'call' ? 'success' : 'warn')} /></div>
                  <div className="tline-text">
                    <div className="who">{it.who}</div>
                    <div className="body">{it.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab !== 'Overview' && (
        <div className="card card-pad" style={{ textAlign: 'center', color: 'var(--ink-3)', padding: '40px 20px' }}>
          <div style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{tab}</div>
          <div className="meta mt-1">Content for selected tab.</div>
        </div>
      )}
    </div>
  );
}

// ============ My Listings ============
function MyListings({ goto }) {
  const [groupByStage, setGroupByStage] = React.useState(false);

  const STAGES = [
    { name: 'Listing Prep',     color: '#CC5DE8' },
    { name: 'Active on Market', color: '#FAB005' },
    { name: 'Showings',         color: '#FD7E14' },
    { name: 'Offer Review',     color: '#F76707' },
    { name: 'Under Contract',   color: '#F03E3E' },
    { name: 'Closed',           color: '#40C057' },
  ];

  const stageGroups = STAGES.map(s => ({
    ...s,
    items: O_M.properties.filter(p => p.stage === s.name),
  })).filter(g => g.items.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <div>
          <div className="sub">Agent inventory · {O_M.properties.length} listings</div>
          <h1>My Listings</h1>
        </div>
        <div className="actions">
          <button
            className="btn sm"
            style={groupByStage ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : {}}
            onClick={() => setGroupByStage(g => !g)}
          >
            <O_I name="list" size={14} color={groupByStage ? '#fff' : undefined} />
            Group by Stage
          </button>
          <button className="btn sm"><O_I name="filter" size={14} />Filter</button>
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('property')}>
            <O_I name="plus" size={14} color="#fff" />New listing
          </button>
        </div>
      </div>

      {!groupByStage && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Photo</th>
                <th>Address</th>
                <th>Stage</th>
                <th className="num">Price</th>
                <th className="num">Beds</th>
                <th className="num">Baths</th>
                <th className="num">Sqft</th>
                <th className="num">DOM</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {O_M.properties.map(p => (
                <tr key={p.id} onClick={() => goto('propDetail')} style={{ cursor: 'pointer' }}>
                  <td><div className="ph" data-label="photo" style={{ width: 60, height: 44, borderRadius: 6 }} /></td>
                  <td>
                    <div className="name">{p.addr}</div>
                    <div className="sub">{p.city}</div>
                  </td>
                  <td><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="dot" style={{ background: p.color }} />{p.stage}</span></td>
                  <td className="num"><OMoney v={p.price} /></td>
                  <td className="num tnum">{p.beds}</td>
                  <td className="num tnum">{p.baths}</td>
                  <td className="num tnum">{p.sqft.toLocaleString()}</td>
                  <td className="num tnum">{p.dom}</td>
                  <td><O_I name="chevron" size={14} color="var(--ink-4)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {groupByStage && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {stageGroups.map(g => (
            <div key={g.name} className="card" style={{ overflow: 'hidden' }}>
              <div className="card-head">
                <span className="dot" style={{ background: g.color }} />
                <h2 style={{ marginLeft: 6 }}>{g.name}</h2>
                <div style={{ flex: 1 }} />
                <span className="meta tnum">{g.items.length} listing{g.items.length !== 1 ? 's' : ''}</span>
              </div>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Photo</th>
                    <th>Address</th>
                    <th className="num">Price</th>
                    <th className="num">Beds</th>
                    <th className="num">Baths</th>
                    <th className="num">Sqft</th>
                    <th className="num">DOM</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {g.items.map(p => (
                    <tr key={p.id} onClick={() => goto('propDetail')} style={{ cursor: 'pointer' }}>
                      <td><div className="ph" data-label="photo" style={{ width: 60, height: 44, borderRadius: 6 }} /></td>
                      <td>
                        <div className="name">{p.addr}</div>
                        <div className="sub">{p.city}</div>
                      </td>
                      <td className="num"><OMoney v={p.price} /></td>
                      <td className="num tnum">{p.beds}</td>
                      <td className="num tnum">{p.baths}</td>
                      <td className="num tnum">{p.sqft.toLocaleString()}</td>
                      <td className="num tnum">{p.dom}</td>
                      <td><O_I name="chevron" size={14} color="var(--ink-4)" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Offers ============
function Offers({ goto }) {
  const buckets = [
    { name: 'Submitted', items: O_M.offers.filter(o => o.status === 'Submitted'), color: '#74C0FC' },
    { name: 'Countered', items: O_M.offers.filter(o => o.status === 'Countered'), color: '#FAB005' },
    { name: 'Accepted',  items: O_M.offers.filter(o => o.status === 'Accepted'),  color: '#40C057' },
    { name: 'Expired',   items: O_M.offers.filter(o => o.status === 'Expired'),   color: '#F03E3E' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <div>
          <div className="sub">In flight</div>
          <h1>Offers</h1>
        </div>
        <div className="actions">
          <button className="btn sm"><O_I name="filter" size={14} />Group: Status</button>
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('offer')}><O_I name="plus" size={14} color="#fff" />New offer</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {buckets.map(b => (
          <div key={b.name} className="stat">
            <div className="lbl flex items-center gap-2"><span className="dot" style={{ background: b.color }} />{b.name}</div>
            <div className="val tnum">{b.items.length}</div>
            <div className="meta tnum">${b.items.reduce((s, o) => s + o.price, 0).toLocaleString()} total</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Property</th>
              <th>Client</th>
              <th>Side</th>
              <th>Status</th>
              <th className="num">Price</th>
              <th className="num">Deposit</th>
              <th>Expires</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {O_M.offers.map(o => (
              <tr key={o.id}>
                <td><div className="name">{o.addr}</div></td>
                <td>{o.client}</td>
                <td><span className={'role ' + (o.side === 'seller' ? 'seller' : 'buyer')}><span className="dot" style={{ background: o.side === 'seller' ? 'oklch(0.58 0.17 310)' : 'oklch(0.62 0.14 254)' }} />{o.side}</span></td>
                <td>
                  <span className={'badge ' + (o.status === 'Accepted' ? 'success' : o.status === 'Countered' ? 'warn' : o.status === 'Expired' ? 'danger' : 'info')}>{o.status}</span>
                </td>
                <td className="num"><OMoney v={o.price} /></td>
                <td className="num tnum">${o.deposit.toLocaleString()}</td>
                <td><OCD minutes={o.expMin} /></td>
                <td><O_I name="chevron" size={14} color="var(--ink-4)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ Calendar (Day / Week / Month / Agenda) ============
function Calendar({ goto }) {
  const [calView, setCalView] = React.useState('week');
  const [selEvent, setSelEvent] = React.useState(null);
  const days = ['Mon 14', 'Tue 15', 'Wed 16', 'Thu 17', 'Fri 18', 'Sat 19', 'Sun 20'];
  const todayIdx = 3;
  const events = [
    { day: 0, start: 9,    dur: 0.5,  kind: 'call',    t: '9:00 AM',  title: 'Team huddle',                  who: 'Team',    date: 'Mon Apr 14', client: 'Internal',           loc: 'Zoom' },
    { day: 1, start: 11,   dur: 1,    kind: 'showing',  t: '11:00 AM', title: 'Showing · 18 Lower Jarvis',    who: 'Public',  date: 'Tue Apr 15', client: 'Open house',          loc: '18 Lower Jarvis St' },
    { day: 2, start: 14,   dur: 1,    kind: 'inspect',  t: '2:00 PM',  title: 'Inspection · 77 Wellesley',    who: 'Tran',    date: 'Wed Apr 16', client: 'Tran Household',      loc: '77 Wellesley St E' },
    { day: 3, start: 10.5, dur: 0.75, kind: 'showing',  t: '10:30 AM', title: 'Showing · 128 Balsam',         who: 'Chen',    date: 'Thu Apr 17', client: 'Marcus & Priya Chen', loc: '128 Balsam Ave' },
    { day: 3, start: 12,   dur: 0.75, kind: 'consult',  t: '12:00 PM', title: 'Buyer consult · Okonkwo',      who: 'Sarah',   date: 'Thu Apr 17', client: 'Sarah Okonkwo',      loc: 'Office' },
    { day: 3, start: 14,   dur: 1.5,  kind: 'inspect',  t: '2:00 PM',  title: 'Inspection · 77 Wellesley',    who: 'Tran',    date: 'Thu Apr 17', client: 'Tran Household',      loc: '77 Wellesley St E' },
    { day: 3, start: 16.5, dur: 0.5,  kind: 'call',     t: '4:30 PM',  title: 'Listing prep call',            who: 'Aya',     date: 'Thu Apr 17', client: 'Aya Fujimori',       loc: 'Phone' },
    { day: 4, start: 10,   dur: 1,    kind: 'showing',  t: '10:00 AM', title: 'Open house · 18 Lower Jarvis', who: 'Public',  date: 'Fri Apr 18', client: 'Open house',          loc: '18 Lower Jarvis St' },
    { day: 4, start: 15,   dur: 1,    kind: 'offer',    t: '3:00 PM',  title: 'Offer review · Sorauren',      who: 'Okonkwo', date: 'Fri Apr 18', client: 'Sarah Okonkwo',      loc: '42 Sorauren Ave #3' },
    { day: 5, start: 13,   dur: 2,    kind: 'showing',  t: '1:00 PM',  title: 'Open house · 128 Balsam',      who: 'Public',  date: 'Sat Apr 19', client: 'Open house',          loc: '128 Balsam Ave' },
    { day: 6, start: 10,   dur: 0.5,  kind: 'call',     t: '10:00 AM', title: 'CMA prep · Aya',               who: 'Aya',     date: 'Sun Apr 20', client: 'Aya Fujimori',       loc: 'Phone' },
  ];
  const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i);
  const SLOT = 56;

  // Resolve sub-view components at render time (defined in screens2.jsx)
  const CalDay   = window.RC.CalendarDay;
  const CalMonth = window.RC.CalendarMonth;
  const CalAg    = window.RC.CalendarAgenda;
  const EvModal  = window.RC.EventDetailModal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <div><div className="sub">Week of April 14</div><h1>Calendar</h1></div>
        <div className="actions">
          <div className="seg">
            {['Day', 'Week', 'Month', 'Agenda'].map(v => (
              <button key={v} data-active={calView === v.toLowerCase()} onClick={() => setCalView(v.toLowerCase())}>{v}</button>
            ))}
          </div>
          <button className="btn sm"><O_I name="chevron" size={12} style={{ transform: 'scaleX(-1)' }} /></button>
          <button className="btn sm">Today</button>
          <button className="btn sm"><O_I name="chevron" size={12} /></button>
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('event')}><O_I name="plus" size={14} color="#fff" />New event</button>
        </div>
      </div>

      {calView === 'week' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          <div className="cal">
            <div style={{ background: 'var(--bg-sunk)', borderBottom: '1px solid var(--border-2)' }} />
            {days.map((d, i) => (
              <div key={d} className="cal-head" data-today={i === todayIdx}>
                <div>{d.split(' ')[0]}</div><div className="num">{d.split(' ')[1]}</div>
              </div>
            ))}
            <div className="cal-time">
              {HOURS.map(h => <div key={h} className="cal-time-slot">{((h % 12) || 12) + (h < 12 ? 'a' : 'p')}</div>)}
            </div>
            {days.map((d, di) => (
              <div key={di} className="cal-col" style={{ height: HOURS.length * SLOT, position: 'relative', background: di === todayIdx ? 'oklch(0.985 0.01 250 / 0.5)' : undefined }}>
                {events.filter(e => e.day === di).map((e, ei) => (
                  <div key={ei} className={'cal-event kind-' + e.kind} style={{ top: (e.start - 8) * SLOT, height: e.dur * SLOT - 4, cursor: 'pointer' }} onClick={() => setSelEvent(e)}>
                    <div className="et">{e.t}</div>
                    <div className="truncate" style={{ fontWeight: 600 }}>{e.title}</div>
                    <div className="truncate" style={{ opacity: 0.75 }}>{e.who}</div>
                  </div>
                ))}
                {di === todayIdx && (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: (9.7 - 8) * SLOT, borderTop: '2px solid var(--destructive)', zIndex: 4 }}>
                    <div style={{ position: 'absolute', left: -4, top: -5, width: 10, height: 10, borderRadius: 999, background: 'var(--destructive)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-head"><h2>Today · Apr 17</h2><div style={{ flex: 1 }} /><span className="meta tnum">4 events</span></div>
            <div className="tline">
              {events.filter(e => e.day === todayIdx).map((e, i) => (
                <div key={i} className="tline-row" style={{ cursor: 'pointer' }} onClick={() => setSelEvent(e)}>
                  <div className="tline-t tnum">{e.t}</div>
                  <div className="tline-rail"><div className={'pip ' + (e.kind === 'showing' ? 'brand' : e.kind === 'inspect' ? 'success' : e.kind === 'consult' ? 'warn' : '')} /></div>
                  <div className="tline-text"><div className="who">{e.title}</div><div className="body">{e.who}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {calView === 'day'    && CalDay   && <CalDay   events={events} HOURS={HOURS} SLOT={SLOT} onEventClick={setSelEvent} />}
      {calView === 'month'  && CalMonth && <CalMonth events={events} onEventClick={setSelEvent} />}
      {calView === 'agenda' && CalAg    && <CalAg    events={events} onEventClick={setSelEvent} />}
      {selEvent && EvModal && <EvModal event={selEvent} onClose={() => setSelEvent(null)} />}
    </div>
  );
}

// ============ Tasks (By due / By client / By property) ============
function Tasks({ goto }) {
  const [taskView, setTaskView] = React.useState('due');
  const [selTask, setSelTask] = React.useState(null);
  const TaskModal = window.RC.TaskDetailModal;

  const groups = [
    { name: 'Overdue',  tone: 'danger', items: O_M.tasks.filter(t => t.tone === 'danger') },
    { name: 'Today',    tone: 'warn',   items: O_M.tasks.filter(t => t.tone === 'warn')   },
    { name: 'Upcoming', tone: 'ok',     items: O_M.tasks.filter(t => t.tone === 'ok')     },
  ];

  // Group by client
  const byClient = {};
  O_M.tasks.forEach(t => { const k = t.contact || 'Unassigned'; if (!byClient[k]) byClient[k] = []; byClient[k].push(t); });

  // Group by property (infer from contact)
  const CPM = { 'Marcus': '128 Balsam Ave', 'Chen': '128 Balsam Ave', 'Tran': '77 Wellesley St E', 'Okonkwo': '42 Sorauren Ave #3', 'Sarah': '42 Sorauren Ave #3', 'Aya': 'Seller listing', 'Fujimori': 'Seller listing' };
  const byProp = {};
  O_M.tasks.forEach(t => {
    let prop = 'Unlinked';
    for (const [k, p] of Object.entries(CPM)) { if (t.contact && t.contact.includes(k)) { prop = p; break; } }
    if (!byProp[prop]) byProp[prop] = []; byProp[prop].push(t);
  });

  const TaskRow = ({ t }) => (
    <div className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto', cursor: 'pointer' }} onClick={() => setSelTask(t)}>
      <input type="checkbox" onClick={e => e.stopPropagation()} />
      <div><div className="lname">{t.text}</div><div className="lsub">{t.contact} · {t.when}</div></div>
      <O_I name="chevron" size={14} color="var(--ink-4)" />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <div><div className="sub">Inbox · {O_M.tasks.length} open</div><h1>Tasks</h1></div>
        <div className="actions">
          <div className="seg">
            <button data-active={taskView === 'due'}      onClick={() => setTaskView('due')}>By due</button>
            <button data-active={taskView === 'client'}   onClick={() => setTaskView('client')}>By client</button>
            <button data-active={taskView === 'property'} onClick={() => setTaskView('property')}>By property</button>
          </div>
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('task')}><O_I name="plus" size={14} color="#fff" />New task</button>
        </div>
      </div>

      {taskView === 'due' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {groups.map(g => (
            <div key={g.name} className="card">
              <div className="card-head">
                <span className={'badge ' + (g.tone === 'danger' ? 'danger' : g.tone === 'warn' ? 'warn' : '')}><span className="tnum">{g.items.length}</span></span>
                <h2 style={{ marginLeft: 4 }}>{g.name}</h2>
              </div>
              <div>
                {g.items.map(t => <TaskRow key={t.id} t={t} />)}
                {g.items.length === 0 && <div style={{ padding: 18, color: 'var(--ink-4)', fontSize: 12, textAlign: 'center' }}>Nothing here</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {taskView === 'client' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(byClient).map(([client, tasks]) => (
            <div key={client} className="card">
              <div className="card-head">
                <OAv name={client} role="buyer" size={24} />
                <h2 style={{ marginLeft: 8 }}>{client}</h2>
                <div style={{ flex: 1 }} />
                <span className="meta tnum">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
              </div>
              <div>{tasks.map(t => <TaskRow key={t.id} t={t} />)}</div>
            </div>
          ))}
        </div>
      )}

      {taskView === 'property' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(byProp).filter(([, t]) => t.length > 0).map(([prop, tasks]) => (
            <div key={prop} className="card">
              <div className="card-head">
                <O_I name="home" size={16} color="var(--ink-3)" />
                <h2 style={{ marginLeft: 8 }}>{prop}</h2>
                <div style={{ flex: 1 }} />
                <span className="meta tnum">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
              </div>
              <div>{tasks.map(t => <TaskRow key={t.id} t={t} />)}</div>
            </div>
          ))}
        </div>
      )}

      {selTask && TaskModal && <TaskModal task={selTask} onClose={() => setSelTask(null)} />}
    </div>
  );
}

// ============ Notes (Recent / By client / By tag + detail expand) ============
function Notes({ goto }) {
  const [notesView, setNotesView] = React.useState('recent');
  const [selNote, setSelNote] = React.useState(null);
  const NoteModal = window.RC.NoteDetailModal;

  const notes = [
    { who: 'Sarah Okonkwo',  body: 'Pre-approval from Scotia confirmed — 1.05M', tag: 'Lead',    when: 'Today 09:12' },
    { who: 'Marcus Chen',    body: 'Confirmed 10:30 showing. Likes the kitchen, worried about basement.', tag: 'Buyer', when: 'Today 08:47' },
    { who: 'Aya Fujimori',   body: 'Wants to list early May after staging. CMA range 1.45–1.55M.', tag: 'Seller', when: 'Yesterday' },
    { who: '42 Sorauren #3', body: 'Staging photos uploaded · waiting on MLS approval.', tag: 'Listing', when: 'Yesterday' },
    { who: 'Tran Household', body: 'Inspection booked for Apr 17 at 2pm. Waive deposit window.', tag: 'Closing', when: 'Apr 15' },
    { who: 'Camille Reese',  body: 'Investor — interested in duplex/triplex in Junction.', tag: 'Lead',    when: 'Apr 14' },
  ];

  const byClient = {}, byTag = {};
  notes.forEach(n => {
    if (!byClient[n.who]) byClient[n.who] = []; byClient[n.who].push(n);
    if (!byTag[n.tag])    byTag[n.tag]    = []; byTag[n.tag].push(n);
  });

  const NoteCard = ({ n }) => (
    <div className="card card-pad" style={{ cursor: 'pointer' }} onClick={() => setSelNote(n)}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-sunk)'}
      onMouseLeave={e => e.currentTarget.style.background = ''}>
      <div className="flex items-center gap-2"><span className="badge brand">{n.tag}</span><div style={{ flex: 1 }} /><span className="meta tnum">{n.when}</span></div>
      <div style={{ fontWeight: 600, marginTop: 10 }}>{n.who}</div>
      <div style={{ color: 'var(--ink-2)', marginTop: 6, fontSize: 13.5, lineHeight: 1.5 }}>{n.body}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <div><div className="sub">Recent · {notes.length}</div><h1>Notes</h1></div>
        <div className="actions">
          <div className="seg">
            <button data-active={notesView === 'recent'} onClick={() => setNotesView('recent')}>Recent</button>
            <button data-active={notesView === 'client'} onClick={() => setNotesView('client')}>By client</button>
            <button data-active={notesView === 'tag'}    onClick={() => setNotesView('tag')}>By tag</button>
          </div>
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('note')}><O_I name="plus" size={14} color="#fff" />New note</button>
        </div>
      </div>

      {notesView === 'recent' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {notes.map((n, i) => <NoteCard key={i} n={n} />)}
        </div>
      )}

      {notesView === 'client' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Object.entries(byClient).map(([client, cNotes]) => (
            <div key={client} className="card" style={{ overflow: 'hidden' }}>
              <div className="card-head">
                <OAv name={client} role="buyer" size={24} />
                <h2 style={{ marginLeft: 8 }}>{client}</h2>
                <div style={{ flex: 1 }} />
                <span className="meta tnum">{cNotes.length} note{cNotes.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cNotes.map((n, i) => (
                  <div key={i} onClick={() => setSelNote(n)} style={{ padding: '10px 12px', background: 'var(--bg-sunk)', borderRadius: 8, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-soft)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-sunk)'}>
                    <div className="flex items-center gap-2"><span className="badge brand" style={{ fontSize: 10 }}>{n.tag}</span><div style={{ flex: 1 }} /><span className="meta tnum" style={{ fontSize: 11 }}>{n.when}</span></div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.4 }}>{n.body}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {notesView === 'tag' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {Object.entries(byTag).map(([tag, tNotes]) => (
            <div key={tag} className="card" style={{ overflow: 'hidden' }}>
              <div className="card-head"><span className="badge brand">{tag}</span><div style={{ flex: 1 }} /><span className="meta tnum">{tNotes.length} note{tNotes.length !== 1 ? 's' : ''}</span></div>
              <div>
                {tNotes.map((n, i) => (
                  <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr', cursor: 'pointer' }} onClick={() => setSelNote(n)}>
                    <OAv name={n.who} role="buyer" size={24} />
                    <div><div className="lname">{n.who}</div><div className="lsub">{n.body.length > 58 ? n.body.slice(0, 58) + '…' : n.body}</div></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selNote && NoteModal && <NoteModal note={selNote} onClose={() => setSelNote(null)} />}
    </div>
  );
}

// ============ Property Detail (compact) ============
function PropDetail({ goto }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <button className="btn ghost sm" onClick={() => goto('props')}>‹ Properties</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm"><O_I name="share" size={14} />Share</button>
        <button className="btn sm"><O_I name="calendar" size={14} />Schedule showing</button>
        <button className="btn primary sm" onClick={() => window.RC.openModal?.('offer')}><O_I name="coins" size={14} color="#fff" />Add offer</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div>
          <div className="ph" data-label="hero · 128 Balsam Ave" style={{ height: 360, borderRadius: 10, border: '1px solid var(--border)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
            {[1,2,3,4].map(i => <div key={i} className="ph" data-label={'photo ' + i} style={{ height: 70, borderRadius: 6, border: '1px solid var(--border)' }} />)}
          </div>
        </div>
        <div className="card card-pad">
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>128 Balsam Ave</div>
          <div className="meta">The Beach · Toronto</div>
          <div className="flex items-center gap-2 mt-3">
            <span className="money tnum" style={{ fontSize: 24 }}><span className="sym">$</span>1,295,000</span>
            <span className="badge warn">Active · Offer review</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
            {[['Beds', '4'], ['Baths', '3'], ['Sqft', '2,340'], ['DOM', '6']].map(([k, v]) => (
              <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
                <div className="meta">{k}</div>
                <div className="tnum" style={{ fontSize: 16, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--border-2)', margin: '16px 0' }} />
          {[
            ['Listed', 'Apr 11, 2026'],
            ['MLS#',   'C8-211-0944'],
            ['Lot',    '24 × 132 ft'],
            ['Type',   'Detached · 2.5 storey'],
            ['Taxes',  '$8,420 / yr (2025)'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
              <div style={{ width: 90, fontSize: 12, color: 'var(--ink-3)' }}>{k}</div>
              <div style={{ flex: 1, fontSize: 13 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ Offer Detail ============
function OfferDetail({ goto }) {
  const [tab, setTab] = React.useState('Overview');
  const o = {
    addr: '128 Balsam Ave', city: 'The Beach · Toronto',
    client: 'Marcus & Priya Chen', side: 'buyer',
    status: 'Submitted', price: 1245000, listPrice: 1295000,
    deposit: 65000, expMin: 340, closing: 'Jun 6, 2026',
    conditions: 'Financing + Inspection', irrev: '5:00 PM Today', mls: 'E8912476',
  };
  const diff = o.listPrice - o.price;
  const diffPct = ((diff / o.listPrice) * 100).toFixed(1);
  const isBuyer = o.side === 'buyer';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <button className="btn ghost sm" onClick={() => goto('offers')}><O_I name="chevron" size={14} /> All offers</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm"><O_I name="share" size={14} />Share</button>
        <button className="btn sm"><O_I name="pen" size={14} />Edit</button>
        <button className="btn primary sm" onClick={() => window.RC.openModal?.('offer')}><O_I name="coins" size={14} color="#fff" />Counter offer</button>
      </div>

      <div className="card card-pad">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
              <span className={'badge ' + (o.status === 'Accepted' ? 'success' : o.status === 'Countered' ? 'warn' : o.status === 'Expired' ? 'danger' : 'info')}>{o.status}</span>
              <span className={'role ' + o.side}><span className="dot" style={{ background: isBuyer ? 'oklch(0.62 0.14 254)' : 'oklch(0.58 0.17 310)' }} />{isBuyer ? 'Buyer-side' : 'Seller-side'}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{o.addr}</div>
            <div className="meta">{o.city}</div>
            <div className="flex items-baseline gap-3 mt-2">
              <OMoney v={o.price} />
              <span className="meta" style={{ fontSize: 13 }}>vs list</span>
              <span className="money tnum" style={{ fontSize: 16, color: 'var(--ink-3)' }}><span className="sym" style={{ fontSize: 12 }}>$</span>{o.listPrice.toLocaleString()}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: diff > 0 ? 'var(--warning)' : 'var(--success)' }}>
                {diff > 0 ? `-$${diff.toLocaleString()} (${diffPct}% under)` : `+$${Math.abs(diff).toLocaleString()} over`}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="meta" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Irrevocable</div>
            <OCD minutes={o.expMin} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 18 }}>
          {[['Offer price', '$' + o.price.toLocaleString()], ['Deposit', '$' + o.deposit.toLocaleString()], ['Closing', o.closing], ['Conditions', o.conditions], ['Client', o.client]].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
              <div className="meta">{k}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 2, color: 'var(--ink)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {['Overview', 'Timeline', 'Documents'].map(t => (
          <button key={t} data-active={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head"><h2>Property · {o.addr}</h2><div style={{ flex: 1 }} /><a className="meta" style={{ color: 'var(--brand)', cursor: 'pointer' }} onClick={() => goto('propDetail')}>Open listing →</a></div>
            <div style={{ padding: 18 }}>
              <div className="ph" data-label={'hero · ' + o.addr} style={{ height: 200, borderRadius: 8 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
                {[['Beds','4'],['Baths','3'],['Sqft','2,340'],['DOM','6']].map(([k,v]) => (
                  <div key={k}><div className="meta">{k}</div><div className="tnum" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div></div>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-2)' }}>
                {[['MLS #', o.mls], ['List price', '$' + o.listPrice.toLocaleString()], ['Listed', 'Apr 11, 2026']].map(([k,v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--border-2)' }}>
                    <div style={{ width: 90, fontSize: 12, color: 'var(--ink-3)' }}>{k}</div>
                    <div style={{ flex: 1, fontSize: 13 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h2>Offer activity</h2></div>
            <div className="tline">
              {[
                { t: 'Today 17:00', who: 'You', body: 'Offer submitted at $1,245,000 with financing and inspection conditions.', kind: 'stage' },
                { t: 'Today 16:15', who: 'Marcus Chen', body: 'Reviewed and approved terms. Confirmed deposit amount.', kind: 'call' },
                { t: 'Today 14:30', who: 'You', body: 'Offer drafted — $1,245,000, Jun 6 close, 65k deposit.', kind: 'note' },
                { t: 'Apr 16 09:00', who: 'You', body: 'Showing #14 at 128 Balsam completed. Strong buyer interest.', kind: 'note' },
              ].map((it, i) => (
                <div key={i} className="tline-row">
                  <div className="tline-t tnum">{it.t}</div>
                  <div className="tline-rail"><div className={'pip ' + (it.kind === 'note' ? 'brand' : it.kind === 'call' ? 'success' : 'warn')} /></div>
                  <div className="tline-text"><div className="who">{it.who}</div><div className="body">{it.body}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Timeline' && (
        <div className="card">
          <div className="card-head"><h2>Full history</h2><div style={{ flex: 1 }} /><span className="meta tnum">4 events</span></div>
          <div className="tline">
            {[
              { t: 'Today 17:00', who: 'You', body: 'Offer submitted at $1,245,000. Financing + Inspection. Irrevocable until 5:00 PM.', kind: 'stage' },
              { t: 'Today 16:15', who: 'Marcus Chen', body: 'Reviewed terms via phone call (12 min). Agreed on deposit and conditions.', kind: 'call' },
              { t: 'Today 14:30', who: 'You', body: 'Offer drafted. Deposit $65,000 by wire on day of acceptance.', kind: 'note' },
              { t: 'Apr 16 09:00', who: 'You', body: 'Showing #14 at 128 Balsam. Clients very engaged — asked about schools and transit.', kind: 'note' },
            ].map((it, i) => (
              <div key={i} className="tline-row">
                <div className="tline-t tnum">{it.t}</div>
                <div className="tline-rail"><div className={'pip ' + (it.kind === 'note' ? 'brand' : it.kind === 'call' ? 'success' : 'warn')} /></div>
                <div className="tline-text"><div className="who">{it.who}</div><div className="body">{it.body}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Documents' && (
        <div className="card">
          <div className="card-head"><h2>Documents · 3</h2><div style={{ flex: 1 }} /><button className="btn sm"><O_I name="plus" size={13} />Upload</button></div>
          <div>
            {[
              { name: 'Offer — 128 Balsam Ave',      type: 'PDF', date: 'Today',       size: '204 KB' },
              { name: 'Schedule A — Conditions',      type: 'PDF', date: 'Today',       size: '44 KB'  },
              { name: 'Pre-approval Letter — Scotia', type: 'PDF', date: 'Apr 12 2026', size: '89 KB'  },
            ].map((f, i) => (
              <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                <div style={{ width: 36, height: 36, borderRadius: 7, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <O_I name="doc" size={16} color="var(--ink-3)" />
                </div>
                <div><div className="lname">{f.name}</div><div className="lsub">{f.type} · {f.date} · {f.size}</div></div>
                <O_I name="down" size={14} color="var(--ink-4)" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

window.RC.OfferDetail = OfferDetail;
window.RC.Clients = Clients;
window.RC.ClientDetail = ClientDetail;
window.RC.MyListings = MyListings;
window.RC.PropDetail = PropDetail;
window.RC.Offers = Offers;
window.RC.Calendar = Calendar;
window.RC.Tasks = Tasks;
window.RC.Notes = Notes;
