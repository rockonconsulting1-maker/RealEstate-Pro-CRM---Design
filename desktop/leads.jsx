// leads.jsx — Desktop Leads master-detail + Kanban
const L_M = window.MOCK; const L_I = window.Icon;
const { Avatar: LAv, Money: LMoney } = window.RC;

const ALL_LEADS = L_M.newLeads.concat([
  { id: 'l6', name: 'Camille Reese',   role: 'buyer',  stage: 'Contacted', color: '#74C0FC', budget: '$1.9–2.2M',  temp: 'Hot',  ago: '5h' },
  { id: 'l7', name: 'Mateo Vargas',    role: 'buyer',  stage: 'Nurturing', color: '#9775FA', budget: '$500–600k',  temp: 'Warm', ago: '1w' },
  { id: 'l8', name: 'Ines Alvarez',    role: 'seller', stage: 'Proposal',  color: '#E64980', budget: 'Leslieville', temp: 'Hot',  ago: '2d' },
  { id: 'l9', name: 'Tobias Klein',    role: 'buyer',  stage: 'Engaged',   color: '#339AF0', budget: '$2.0–2.4M',  temp: 'Warm', ago: '3d' },
  { id: 'l10',name: 'Hilda Park',      role: 'seller', stage: 'Pre-Listing', color: '#ADB5BD', budget: 'High Park', temp: 'Cold', ago: '4d' },
]);

function Leads({ view, setView, goto }) {
  const [filter, setFilter] = React.useState('All');
  const [selected, setSelected] = React.useState(ALL_LEADS[1]);
  const chips = ['All', 'Hot', 'Warm', 'Cold', 'Buyer', 'Seller', 'Investor'];
  const counts = { All: ALL_LEADS.length, Hot: 6, Warm: 14, Cold: 8, Buyer: 19, Seller: 7, Investor: 4 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div className="page-head">
        <div>
          <div className="sub">Pipeline · top of funnel</div>
          <h1>Leads</h1>
        </div>
        <div className="actions">
          <div className="seg">
            <button data-active={view === 'list'} onClick={() => setView('list')}><L_I name="list" size={14} />List</button>
            <button data-active={view === 'board'} onClick={() => setView('board')}><L_I name="board" size={14} />Kanban</button>
          </div>
          <button className="btn sm"><L_I name="filter" size={14} />Filter</button>
          <button className="btn sm" onClick={() => window.RC.openModal?.('convertLead')}><L_I name="convert" size={14} />Convert lead</button>
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('lead')}><L_I name="plus" size={14} color="#fff" />New lead</button>
        </div>
      </div>

      <div className="chips">
        {chips.map(c => (
          <button key={c} className="chip" data-active={filter === c} onClick={() => setFilter(c)}>
            {c} <span className="count">{counts[c]}</span>
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <div className="split" style={{ flex: 1, minHeight: 0 }}>
          <div className="split-pane">
            <div className="pane-head">
              <span className="meta">{ALL_LEADS.length} leads</span>
              <div style={{ flex: 1 }} />
              <span className="meta">Sort:</span>
              <button className="btn ghost sm">Newest first <L_I name="down" size={12} /></button>
            </div>
            <div className="pane-body">
              {ALL_LEADS.map(l => (
                <div key={l.id} className="lrow"
                  data-selected={selected && selected.id === l.id}
                  onClick={() => setSelected(l)}
                  style={{ gridTemplateColumns: 'auto 1fr auto auto' }}>
                  <LAv name={l.name} role={l.role} size={32} />
                  <div>
                    <div className="lname">{l.name}</div>
                    <div className="lsub">
                      <span className="dot" style={{ background: l.color }} />{l.stage}
                      <span style={{ color: 'var(--ink-4)' }}>·</span>
                      <span className="tnum">{l.budget}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {l.temp === 'Hot'  && <span className="badge danger"><L_I name="flame" size={10} />Hot</span>}
                    {l.temp === 'Warm' && <span className="badge warn">Warm</span>}
                    {l.temp === 'Cold' && <span className="badge">Cold</span>}
                    <div className="meta tnum mt-1">{l.ago} ago</div>
                  </div>
                  <L_I name="chevron" size={14} color="var(--ink-4)" />
                </div>
              ))}
            </div>
          </div>

          {/* Detail */}
          <LeadDetail lead={selected} goto={goto} />
        </div>
      ) : (
        <div className="kanban">
          {L_M.leadLanes.map(lane => (
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
                  <div key={i} className="kard" onClick={() => { window.RC.selectLead?.({ id: 'k' + i, name: c.name, role: c.role, stage: lane.name, color: lane.color, budget: c.value, temp: 'Warm', ago: c.ago }); goto('leadDetail'); }}>
                    <div className="kard-h">
                      <LAv name={c.name} role={c.role} size={28} />
                      <div className="flex-1">
                        <div className="kard-name truncate">{c.name}</div>
                        <div className="kard-sub">{c.tag}</div>
                      </div>
                    </div>
                    <div className="kard-foot">
                      <span className={'role ' + (c.role === 'seller' ? 'seller' : 'buyer')}>
                        <span className="dot" style={{ background: c.role === 'seller' ? 'oklch(0.58 0.17 310)' : 'oklch(0.62 0.14 254)' }} />
                        {c.role === 'seller' ? 'Seller' : 'Buyer'}
                      </span>
                      <div style={{ flex: 1 }} />
                      <span className="meta tnum">{c.value}</span>
                    </div>
                  </div>
                ))}
                {lane.cards.length === 0 && (
                  <div style={{ padding: 14, color: 'var(--ink-4)', fontSize: 12, textAlign: 'center' }}>
                    {lane.total} leads in this lane
                  </div>
                )}
              </div>
              <button className="lane-add">+ Add lead</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadDetail({ lead, goto }) {
  const infoTab = lead?.role === 'seller' ? 'Seller Info' : 'Buyer Info';
  const [tab, setTab] = React.useState(infoTab);
  React.useEffect(() => { setTab(lead?.role === 'seller' ? 'Seller Info' : 'Buyer Info'); }, [lead?.id]);
  if (!lead) return <div className="split-pane" />;
  const ConvTab = window.RC.ConversationsTab;

  const stages = ['New', 'Contacted', 'Engaged', 'Nurturing', 'Appt Set', 'Signed'];
  const curIdx = Math.max(0, stages.findIndex(s => lead.stage.startsWith(s) || lead.stage.includes(s)));

  return (
    <div className="split-pane">
      <div className="pane-head" style={{ gap: 14 }}>
        <LAv name={lead.name} role={lead.role} size={48} />
        <div className="flex-1">
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>{lead.name}</div>
          <div className="meta flex items-center gap-2" style={{ marginTop: 2 }}>
            <span className={'role ' + (lead.role === 'seller' ? 'seller' : 'buyer')}>
              <span className="dot" style={{ background: lead.role === 'seller' ? 'oklch(0.58 0.17 310)' : 'oklch(0.62 0.14 254)' }} />
              {lead.role === 'seller' ? 'Seller lead' : 'Buyer lead'}
            </span>
            <span>· Last contact <span className="tnum">{lead.ago} ago</span></span>
          </div>
        </div>
        <button className="icon-btn"><L_I name="phone" size={14} /></button>
        <button className="icon-btn"><L_I name="message" size={14} /></button>
        <button className="icon-btn"><L_I name="more" size={14} /></button>
      </div>

      <div className="pane-body" style={{ padding: 18 }}>
        {/* Stage stepper */}
        <div className="card card-pad" style={{ padding: 14 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <span className="dot" style={{ background: lead.color }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{lead.stage}</span>
            <div style={{ flex: 1 }} />
            <span className="meta tnum">{Math.round(((curIdx + 1) / stages.length) * 100)}% through pipeline</span>
          </div>
          <div className="steps">
            {stages.map((s, i) => (
              <div key={s} className={'step ' + (i < curIdx ? 'done' : i === curIdx ? 'cur' : '')} />
            ))}
          </div>
          <div className="steps-labels">
            {stages.map(s => <span key={s}>{s}</span>)}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginTop: 18 }}>
          {[infoTab, 'Properties', 'Appointments', 'Tasks', 'Notes', 'Conversations', 'Activity', 'Files'].map(t => (
            <button key={t} data-active={tab === t} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === infoTab && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
            <div className="card card-pad">
              {lead.role === 'seller' ? (<>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Property details</div>
                {[
                  ['Neighbourhood', lead.budget],
                  ['Address',       '42 Maple Ave — TBC'],
                  ['Type',          'Detached · 4 bed · 2 bath'],
                  ['Est. value',    '$1.2–1.45M'],
                  ['Sqft',          '~1,800 sqft'],
                  ['Timeline',      '90–120 days'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
                    <div style={{ width: 110, fontSize: 12, color: 'var(--ink-3)' }}>{k}</div>
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{v}</div>
                  </div>
                ))}
              </>) : (<>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Search criteria</div>
                {[
                  ['Budget', lead.budget],
                  ['Pre-approval', 'Scotia · $1.05M'],
                  ['Timeline', '60–90 days'],
                  ['Areas', 'Roncesvalles · Junction · Bloor West'],
                  ['Type', 'Detached · 3+ bed'],
                  ['Must-haves', 'Parking, ≥1200 sqft'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
                    <div style={{ width: 110, fontSize: 12, color: 'var(--ink-3)' }}>{k}</div>
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{v}</div>
                  </div>
                ))}
              </>)}
            </div>
            <div className="card card-pad">
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Contact</div>
              {[
                ['Email',     'sarah.okonkwo@example.com'],
                ['Phone',     '+1 (416) 555-0142'],
                ['Source',    'Zillow inquiry · Apr 15'],
                ['Owner',     'Jordan Reyes'],
                ['Tags',      'First-time · Pre-approved'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
                  <div style={{ width: 80, fontSize: 12, color: 'var(--ink-3)' }}>{k}</div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{v}</div>
                </div>
              ))}
              <div className="flex gap-2 mt-3" style={{ marginTop: 14 }}>
                <button className="btn primary sm" style={{ flex: 1 }}><L_I name="phone" size={13} color="#fff" />Call</button>
                <button className="btn sm" style={{ flex: 1 }}><L_I name="message" size={13} />Text</button>
                <button className="btn sm" style={{ flex: 1 }}><L_I name="calendar" size={13} />Book</button>
              </div>
            </div>

            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-head"><h2>Last 5 touches</h2><div style={{ flex: 1 }} /><a className="meta" style={{ color: 'var(--brand)', cursor: 'pointer' }}>Open activity →</a></div>
              <div className="tline">
                {[
                  { t: '09:12', who: lead.name, body: 'Pre-approval from Scotia confirmed — 1.05M', kind: 'note' },
                  { t: '08:47', who: lead.name, body: 'Replied: prefers Saturday showings', kind: 'call' },
                  { t: 'Apr 15', who: 'You', body: 'Sent 3 listings in Roncesvalles + Junction', kind: 'note' },
                  { t: 'Apr 15', who: 'You', body: 'Moved to Contacted', kind: 'stage' },
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

        {tab === 'Appointments' && (
          <div style={{ marginTop: 16 }}>
            <div className="card">
              <div className="card-head"><h2>Appointments</h2><div style={{ flex: 1 }} /><button className="btn sm" onClick={() => window.RC.openModal?.('event')}><L_I name="plus" size={13} />Book</button></div>
              <table className="tbl">
                <thead><tr><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead>
                <tbody>
                  {[
                    { date: 'Sat Apr 19', time: '10:30 AM', type: lead.role === 'seller' ? 'Listing presentation' : 'Showing — 128 Balsam', st: 'Upcoming',  tone: 'info'    },
                    { date: 'Mon Apr 14', time: '11:00 AM', type: lead.role === 'seller' ? 'Initial consultation' : 'Buyer consultation',   st: 'Completed', tone: 'success' },
                  ].map((a, i) => (
                    <tr key={i}>
                      <td className="tnum">{a.date}</td>
                      <td className="tnum" style={{ fontSize: 12.5 }}>{a.time}</td>
                      <td style={{ fontSize: 13 }}>{a.type}</td>
                      <td><span className={'badge ' + a.tone}>{a.st}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Properties' && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="meta">3 properties toured</span>
              <button className="btn sm"><L_I name="plus" size={13} />Add</button>
            </div>
            {[
              { addr: '128 Balsam Ave',   sub: 'The Beach · 4 bd · $1,295,000', badge: 'Offer sent', tone: 'info', date: 'Apr 16' },
              { addr: '44 Elm Grove Ave', sub: 'Roncesvalles · 3 bd · $1,050,000', badge: 'Shown', tone: '', date: 'Apr 9' },
              { addr: '19 Runnymede Rd',  sub: 'Junction · 3 bd · $979,000', badge: 'Declined', tone: '', date: 'Apr 5' },
            ].map((p, i) => (
              <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                <div className="ph" data-label="" style={{ width: 44, height: 44, borderRadius: 6 }} />
                <div><div className="lname">{p.addr}</div><div className="lsub">{p.sub} · {p.date}</div></div>
                <span className={'badge ' + p.tone}>{p.badge}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'Tasks' && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn primary sm" onClick={() => window.RC.openModal?.('task')}><L_I name="plus" size={13} color="#fff" />New task</button>
            </div>
            <div className="card">
              <div className="card-head"><span className="badge warn">2</span><h2 style={{ marginLeft: 6 }}>Open</h2></div>
              <div>
                {[
                  { text: 'Follow up on Scotia pre-approval', when: 'Today · 11:00 AM', tone: 'warn' },
                  { text: 'Confirm Saturday showing at 128 Balsam', when: 'Today · 3:00 PM', tone: 'warn' },
                  { text: 'Send neighbourhood comparison sheet', when: 'Tomorrow', tone: 'ok' },
                ].map((t, i) => (
                  <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                    <input type="checkbox" />
                    <div><div className="lname">{t.text}</div><div className="lsub">{t.when}</div></div>
                    <span className={'badge ' + (t.tone === 'warn' ? 'warn' : '')}>{t.tone === 'warn' ? 'Today' : 'Soon'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'Notes' && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn primary sm" onClick={() => window.RC.openModal?.('note')}><L_I name="plus" size={13} color="#fff" />New note</button>
            </div>
            {[
              { when: 'Today 09:12', tag: 'Financing', body: 'Pre-approval from Scotia confirmed — $1.05M. Expires July 31, 2026. Partner name is Kwame.' },
              { when: 'Apr 14 11:00', tag: 'Search', body: 'Buyer consult complete. Key priorities: parking, finished basement, near Bloor West Village. Lease ends July 1 — hard deadline.' },
            ].map((n, i) => (
              <div key={i} className="card card-pad">
                <div className="flex items-center gap-2"><span className="badge brand">{n.tag}</span><div style={{ flex: 1 }} /><span className="meta tnum">{n.when}</span></div>
                <div style={{ color: 'var(--ink-2)', marginTop: 8, fontSize: 13, lineHeight: 1.5 }}>{n.body}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Conversations' && ConvTab && <ConvTab name={lead.name} goto={goto} />}

        {tab === 'Activity' && (
          <div style={{ marginTop: 16 }}>
            <div className="card">
              <div className="card-head"><h2>Full activity history</h2><div style={{ flex: 1 }} /><span className="meta tnum">8 events</span></div>
              <div className="tline">
                {[
                  { t: 'Today 09:12',   who: lead.name, body: 'Pre-approval from Scotia confirmed — $1.05M. Expires July 31.', kind: 'note'  },
                  { t: 'Today 08:47',   who: lead.name, body: 'Replied: prefers Saturday showings.',                           kind: 'call'  },
                  { t: 'Apr 16',        who: 'You',     body: 'Offer submitted — 128 Balsam Ave at $1,245,000.',               kind: 'stage' },
                  { t: 'Apr 15 14:20',  who: 'You',     body: 'Moved to Contacted stage.',                                    kind: 'stage' },
                  { t: 'Apr 15',        who: 'You',     body: 'Sent 3 listings in Roncesvalles + Junction.',                  kind: 'note'  },
                  { t: 'Apr 14 11:00',  who: 'You',     body: 'Buyer consultation completed. Search parameters captured.',    kind: 'call'  },
                  { t: 'Apr 13 09:30',  who: 'You',     body: 'Lead received via Navarro referral. Emailed intro within 5 min.', kind: 'note' },
                  { t: 'Apr 13',        who: 'System',  body: 'Lead created.',                                                kind: 'stage' },
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

        {tab === 'Files' && (
          <div style={{ marginTop: 16 }}>
            <div className="card">
              <div className="card-head"><h2>Documents</h2><div style={{ flex: 1 }} /><button className="btn sm"><L_I name="plus" size={13} />Upload</button></div>
              <div>
                {[
                  { name: 'Buyer Representation Agreement', type: 'PDF', date: 'Apr 14 2026', size: '142 KB' },
                  { name: 'Pre-approval Letter — Scotia',   type: 'PDF', date: 'Today',       size: '89 KB'  },
                ].map((f, i) => (
                  <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 7, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <L_I name="doc" size={16} color="var(--ink-3)" />
                    </div>
                    <div><div className="lname">{f.name}</div><div className="lsub">{f.type} · {f.date} · {f.size}</div></div>
                    <L_I name="down" size={14} color="var(--ink-4)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── LeadDetail full-page (standalone, mirrors ClientDetail) ────────────────
function LeadDetailPage({ lead, goto }) {
  if (!lead) lead = ALL_LEADS[1];
  const infoTab = lead.role === 'seller' ? 'Seller Info' : 'Buyer Info';
  const [tab, setTab] = React.useState(infoTab);
  const tabs = [infoTab, 'Properties', 'Appointments', 'Tasks', 'Notes', 'Conversations', 'Activity', 'Files'];
  const ConvTab = window.RC.ConversationsTab;
  const stages = ['New', 'Contacted', 'Engaged', 'Nurturing', 'Appt Set', 'Signed'];
  const curIdx = Math.max(0, stages.findIndex(s => (lead.stage || '').startsWith(s) || (lead.stage || '').includes(s)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <button className="btn ghost sm" onClick={() => goto('leads')}><L_I name="chevron" size={14} /> All leads</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm"><L_I name="share" size={14} />Share</button>
        <button className="btn sm"><L_I name="pen" size={14} />Edit</button>
        <button className="btn sm" onClick={() => window.RC.openModal?.('convertLead')}><L_I name="convert" size={14} />Convert</button>
        <button className="btn primary sm"><L_I name="phone" size={14} color="#fff" />Call lead</button>
      </div>

      <div className="card card-pad">
        <div className="flex items-center gap-3">
          <LAv name={lead.name} role={lead.role} size={56} />
          <div className="flex-1">
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{lead.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={'role ' + (lead.role === 'seller' ? 'seller' : 'buyer')}>
                <span className="dot" style={{ background: lead.role === 'seller' ? 'oklch(0.58 0.17 310)' : 'oklch(0.62 0.14 254)' }} />
                {lead.role === 'seller' ? 'Seller lead' : 'Buyer lead'}
              </span>
              {lead.temp === 'Hot'  && <span className="badge danger"><L_I name="flame" size={10} />Hot</span>}
              {lead.temp === 'Warm' && <span className="badge warn">Warm</span>}
              {lead.temp === 'Cold' && <span className="badge">Cold</span>}
              <span className="meta">· Last contact <span className="tnum">{lead.ago} ago</span></span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="meta">{lead.role === 'seller' ? 'Target area' : 'Budget'}</div>
            <div className="tnum" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{lead.budget}</div>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div className="steps">{stages.map((s, i) => <div key={s} className={'step ' + (i < curIdx ? 'done' : i === curIdx ? 'cur' : '')} />)}</div>
          <div className="steps-labels">{stages.map(s => <span key={s}>{s}</span>)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 18 }}>
          {(lead.role === 'seller' ? [
            ['Stage',      lead.stage || 'Pre-Listing'],
            ['Timeline',   '90–120 days'],
            ['Est. value', '$1.2–1.45M'],
            ['Last touch', (lead.ago || '—') + ' ago'],
          ] : [
            ['Budget',       lead.budget],
            ['Pre-approval', 'Scotia · $1.05M'],
            ['Timeline',     '60–90 days'],
            ['Stage',        lead.stage || 'New Lead'],
          ]).map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
              <div className="meta">{k}</div>
              <div className="tnum" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t} data-active={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === infoTab && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="card card-pad">
            {lead.role === 'seller' ? (<>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Property details</div>
              {[
                ['Neighbourhood', lead.budget || '—'],
                ['Address',       '42 Maple Ave — TBC'],
                ['Type',          'Detached · 4 bed · 2 bath'],
                ['Est. value',    '$1.2–1.45M'],
                ['Sqft',          '~1,800 sqft'],
                ['Timeline',      '90–120 days'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
                  <div style={{ width: 110, fontSize: 12, color: 'var(--ink-3)' }}>{k}</div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{v}</div>
                </div>
              ))}
            </>) : (<>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Search criteria</div>
              {[
                ['Budget',       lead.budget || '—'],
                ['Pre-approval', 'Scotia · $1.05M'],
                ['Timeline',     '60–90 days'],
                ['Areas',        'Roncesvalles · Junction · Bloor West'],
                ['Type',         'Detached · 3+ bed'],
                ['Must-haves',   'Parking, ≥1200 sqft'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
                  <div style={{ width: 110, fontSize: 12, color: 'var(--ink-3)' }}>{k}</div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{v}</div>
                </div>
              ))}
            </>)}
          </div>
          <div className="card card-pad">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Contact</div>
            {[
              ['Email',  'sarah.okonkwo@example.com'],
              ['Phone',  '+1 (416) 555-0142'],
              ['Source', 'Zillow inquiry · Apr 15'],
              ['Owner',  'Jordan Reyes'],
              ['Tags',   'First-time · Pre-approved'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
                <div style={{ width: 80, fontSize: 12, color: 'var(--ink-3)' }}>{k}</div>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{v}</div>
              </div>
            ))}
            <div className="flex gap-2" style={{ marginTop: 14 }}>
              <button className="btn primary sm" style={{ flex: 1 }}><L_I name="phone" size={13} color="#fff" />Call</button>
              <button className="btn sm" style={{ flex: 1 }}><L_I name="message" size={13} />Text</button>
              <button className="btn sm" style={{ flex: 1 }}><L_I name="calendar" size={13} />Book</button>
            </div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-head"><h2>Last 5 touches</h2><div style={{ flex: 1 }} /><a className="meta" style={{ color: 'var(--brand)', cursor: 'pointer' }} onClick={() => setTab('Activity')}>Open activity →</a></div>
            <div className="tline">
              {[
                { t: '09:12',  who: lead.name, body: 'Pre-approval from Scotia confirmed — 1.05M', kind: 'note' },
                { t: '08:47',  who: lead.name, body: 'Replied: prefers Saturday showings', kind: 'call' },
                { t: 'Apr 15', who: 'You',     body: 'Sent 3 listings in Roncesvalles + Junction', kind: 'note' },
                { t: 'Apr 15', who: 'You',     body: 'Moved to Contacted', kind: 'stage' },
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

      {tab === 'Appointments' && (
        <div className="card">
          <div className="card-head"><h2>Appointments</h2><div style={{ flex: 1 }} /><button className="btn sm" onClick={() => window.RC.openModal?.('event')}><L_I name="plus" size={13} />Book</button></div>
          <table className="tbl">
            <thead><tr><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { date: 'Sat Apr 19', time: '10:30 AM', type: lead.role === 'seller' ? 'Listing presentation' : 'Showing — 128 Balsam Ave', st: 'Upcoming',  tone: 'info'    },
                { date: 'Mon Apr 14', time: '11:00 AM', type: lead.role === 'seller' ? 'Initial consultation' : 'Buyer consultation',       st: 'Completed', tone: 'success' },
              ].map((a, i) => (
                <tr key={i}>
                  <td className="tnum">{a.date}</td>
                  <td className="tnum" style={{ fontSize: 12.5 }}>{a.time}</td>
                  <td style={{ fontSize: 13 }}>{a.type}</td>
                  <td><span className={'badge ' + a.tone}>{a.st}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Properties' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="meta">3 properties toured</span>
            <button className="btn sm"><L_I name="plus" size={13} />Add</button>
          </div>
          {[
            { addr: '128 Balsam Ave',   sub: 'The Beach · 4 bd · $1,295,000',    badge: 'Offer sent', tone: 'info', date: 'Apr 16' },
            { addr: '44 Elm Grove Ave', sub: 'Roncesvalles · 3 bd · $1,050,000', badge: 'Shown',      tone: '',     date: 'Apr 9'  },
            { addr: '19 Runnymede Rd',  sub: 'Junction · 3 bd · $979,000',       badge: 'Declined',   tone: '',     date: 'Apr 5'  },
          ].map((p, i) => (
            <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
              <div className="ph" data-label="" style={{ width: 44, height: 44, borderRadius: 6 }} />
              <div><div className="lname">{p.addr}</div><div className="lsub">{p.sub} · {p.date}</div></div>
              <span className={'badge ' + p.tone}>{p.badge}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'Tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn primary sm" onClick={() => window.RC.openModal?.('task')}><L_I name="plus" size={13} color="#fff" />New task</button>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge warn">2</span><h2 style={{ marginLeft: 6 }}>Open</h2></div>
            <div>
              {[
                { text: 'Follow up on Scotia pre-approval',       when: 'Today · 11:00 AM', tone: 'warn' },
                { text: 'Confirm Saturday showing at 128 Balsam', when: 'Today · 3:00 PM',  tone: 'warn' },
                { text: 'Send neighbourhood comparison sheet',    when: 'Tomorrow',          tone: 'ok'   },
              ].map((t, i) => (
                <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                  <input type="checkbox" />
                  <div><div className="lname">{t.text}</div><div className="lsub">{t.when}</div></div>
                  <span className={'badge ' + (t.tone === 'warn' ? 'warn' : '')}>{t.tone === 'warn' ? 'Today' : 'Soon'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn primary sm" onClick={() => window.RC.openModal?.('note')}><L_I name="plus" size={13} color="#fff" />New note</button>
          </div>
          {[
            { when: 'Today 09:12',  tag: 'Financing', body: 'Pre-approval from Scotia confirmed — $1.05M. Expires July 31, 2026. Partner name is Kwame.' },
            { when: 'Apr 14 11:00', tag: 'Search',    body: 'Buyer consult complete. Key priorities: parking, finished basement, near Bloor West Village. Lease ends July 1 — hard deadline.' },
          ].map((n, i) => (
            <div key={i} className="card card-pad">
              <div className="flex items-center gap-2"><span className="badge brand">{n.tag}</span><div style={{ flex: 1 }} /><span className="meta tnum">{n.when}</span></div>
              <div style={{ color: 'var(--ink-2)', marginTop: 8, fontSize: 13, lineHeight: 1.5 }}>{n.body}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Conversations' && ConvTab && <ConvTab name={lead.name} goto={goto} />}

      {tab === 'Activity' && (
        <div className="card">
          <div className="card-head"><h2>Full activity history</h2><div style={{ flex: 1 }} /><span className="meta tnum">8 events</span></div>
          <div className="tline">
            {[
              { t: 'Today 09:12',  who: lead.name, body: 'Pre-approval from Scotia confirmed — $1.05M. Expires July 31.', kind: 'note'  },
              { t: 'Today 08:47',  who: lead.name, body: 'Replied: prefers Saturday showings.',                           kind: 'call'  },
              { t: 'Apr 16',       who: 'You',     body: 'Offer submitted — 128 Balsam Ave at $1,245,000.',               kind: 'stage' },
              { t: 'Apr 15 14:20', who: 'You',     body: 'Moved to Contacted stage.',                                    kind: 'stage' },
              { t: 'Apr 15',       who: 'You',     body: 'Sent 3 listings in Roncesvalles + Junction.',                  kind: 'note'  },
              { t: 'Apr 14 11:00', who: 'You',     body: 'Buyer consultation completed. Search parameters captured.',    kind: 'call'  },
              { t: 'Apr 13 09:30', who: 'You',     body: 'Lead received via Navarro referral. Emailed intro within 5 min.', kind: 'note' },
              { t: 'Apr 13',       who: 'System',  body: 'Lead created.',                                                kind: 'stage' },
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

      {tab === 'Files' && (
        <div className="card">
          <div className="card-head"><h2>Documents</h2><div style={{ flex: 1 }} /><button className="btn sm"><L_I name="plus" size={13} />Upload</button></div>
          <div>
            {[
              { name: 'Buyer Representation Agreement', type: 'PDF', date: 'Apr 14 2026', size: '142 KB' },
              { name: 'Pre-approval Letter — Scotia',   type: 'PDF', date: 'Today',       size: '89 KB'  },
            ].map((f, i) => (
              <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                <div style={{ width: 36, height: 36, borderRadius: 7, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <L_I name="doc" size={16} color="var(--ink-3)" />
                </div>
                <div><div className="lname">{f.name}</div><div className="lsub">{f.type} · {f.date} · {f.size}</div></div>
                <L_I name="down" size={14} color="var(--ink-4)" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

window.RC.Leads = Leads;
window.RC.LeadDetail = LeadDetail;
window.RC.LeadDetailPage = LeadDetailPage;
