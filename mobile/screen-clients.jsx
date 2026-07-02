// screen-clients.jsx — Clients kanban + detail
function Clients({ view, onViewChange, goto, roleVariant }) {
  const { TopBar, Avatar, Money, btn } = window;
  const M = window.MOCK; const I = window.Icon;
  const [pipe, setPipe] = React.useState('buyer');
  const [selected, setSelected] = React.useState(null);

  if (view === 'detail') {
    return <ClientDetail goto={goto} roleVariant={roleVariant} />;
  }

  return (
    <>
      <TopBar title="Clients" />
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', alignItems: 'center' }}>
        <div className="seg">
          <button data-active={pipe === 'buyer'}  onClick={() => setPipe('buyer')}>Buyer</button>
          <button data-active={pipe === 'seller'} onClick={() => setPipe('seller')}>Seller</button>
        </div>
        <div style={{ flex: 1 }} />
        <span className="meta tnum">11 active · $13.8M</span>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {M.clientLanes.map(lane => (
          <div key={lane.name} className="lane">
            <div className="lane-head">
              <span className="dot" style={{ backgroundColor: lane.color }} />
              <span className="name">{lane.name}</span>
              <span className="count tnum">{lane.total}</span>
              <div className="spacer" />
              <span className="money tnum" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{lane.value}</span>
            </div>
            {lane.cards.length > 0 && (
              <div className="lane-body">
                {lane.cards.map((c, i) => (
                  <div key={i} className="lane-card" onClick={() => goto(c.role === 'seller' ? 'clientDetailSeller' : c.role === 'vendor' ? 'clientDetail' : 'clientDetailBuyer')} style={{ cursor: 'pointer' }}>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} role={c.role} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="row-title truncate" style={{ fontSize: 14 }}>{c.name}</div>
                        <div className="row-sub tnum">{c.tag} · DOM {c.dom}</div>
                      </div>
                      <div className="money tnum" style={{ fontSize: 14 }}>{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function ClientDetail({ goto, roleVariant }) {
  const { Avatar, Money, Countdown, btn } = window;
  const I = window.Icon;

  // roleVariant: 'buyer_lead' | 'seller_client' | 'vendor'
  const variants = {
    buyer_lead: {
      name: 'Sarah Okonkwo', role: 'buyer',
      roleLabel: 'Buyer lead', roleCls: 'buyer', roleDot: 'oklch(0.62 0.14 254)',
      stage: 'Contacted', stageColor: '#74C0FC', stagePct: 18,
      metrics: [
        { k: 'Budget',        v: '$900k–1.1M' },
        { k: 'Pre-approval',  v: 'Scotia · $1.05M' },
        { k: 'Timeline',      v: '60–90 days' },
        { k: 'Temperature',   v: 'Warm' },
      ],
      tabs: ['Buyer Info', 'Properties', 'Tasks', 'Notes', 'Activity'],
    },
    seller_client: {
      name: 'Aya Fujimori', role: 'seller',
      roleLabel: 'Seller client', roleCls: 'seller', roleDot: 'oklch(0.58 0.17 310)',
      stage: 'Active on Market', stageColor: '#FAB005', stagePct: 55,
      metrics: [
        { k: 'Listed property', v: '88 Willow Pk Rd' },
        { k: 'List price',      v: '$1.495M' },
        { k: 'Days on market',  v: '11' },
        { k: 'Incoming offers', v: '2 · 1 pending' },
      ],
      tabs: ['Seller Info', 'Property', 'Offers', 'Tasks', 'Notes', 'Activity'],
    },
    vendor: {
      name: 'Elm & Co. Stagers', role: 'vendor',
      roleLabel: 'Vendor', roleCls: 'vendor', roleDot: 'oklch(0.55 0.08 260)',
      stage: 'Preferred', stageColor: '#40C057', stagePct: 100,
      metrics: [
        { k: 'Service type', v: 'Staging' },
        { k: 'Priority',     v: 'Preferred' },
        { k: 'Last used',    v: '88 Willow · Apr 8' },
        { k: 'Preferred by', v: 'SMS' },
      ],
      tabs: ['Details', 'Engagements', 'Notes', 'Activity'],
    },
  };
  const v = variants[roleVariant] || variants.buyer_lead;
  const [tab, setTab] = React.useState(v.tabs[0]);
  React.useEffect(() => setTab(v.tabs[0]), [roleVariant]);

  return (
    <>
      <div className="topbar">
        <div className="topbar-row">
          <button className="icon-btn" onClick={() => goto('clients')}><I name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} /></button>
          <div style={{ flex: 1 }} />
          <button className="icon-btn"><I name="pen" size={14} /></button>
          <button className="icon-btn"><I name="more" size={16} /></button>
        </div>
      </div>

      {/* Header card */}
      <div style={{ padding: '0 16px' }}>
        <div className="flex items-center gap-3">
          <div className="avatar av-buyer" style={{ width: 56, height: 56, fontSize: 18 }}>
            {v.name.split(' ').map(s => s[0]).slice(0, 2).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{v.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={'role ' + v.roleCls}><span className="dot" style={{ background: v.roleDot }} />{v.roleLabel}</span>
              <span className="meta">· Last contact <span className="tnum">3d ago</span></span>
            </div>
          </div>
        </div>

        {/* Pipeline progress */}
        <div className="mt-4">
          <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
            <span className="dot" style={{ backgroundColor: v.stageColor }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>{v.stage}</span>
            <div style={{ flex: 1 }} />
            <span className="meta tnum">{v.stagePct}% through</span>
          </div>
          <div className="progress"><span style={{ width: v.stagePct + '%', background: v.stageColor }} /></div>
        </div>

        {/* Metrics grid */}
        <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {v.metrics.map((m, i) => (
            <div key={i} className="card card-pad" style={{ padding: 12 }}>
              <div className="meta" style={{ fontSize: 11 }}>{m.k}</div>
              <div className="mt-1 tnum" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ marginTop: 20, borderBottom: '1px solid var(--border-2)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 }}>
        <div className="chips" style={{ padding: '12px 16px', mask: 'none', WebkitMask: 'none' }}>
          {v.tabs.map(t => (
            <button key={t} className="chip" data-active={tab === t} onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '4px 0', marginRight: 18 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: 16 }}>
        {tab === v.tabs[0] && roleVariant === 'buyer_lead' && (
          <div className="card card-pad">
            <div className="section-h" style={{ padding: 0, marginBottom: 10 }}><h2>Search requirements</h2></div>
            {[
              ['Areas',      'Roncesvalles · Bloor West · Junction'],
              ['Type',       'Detached · 3+ bed'],
              ['Must-haves', 'Parking, ≥1200 sqft'],
              ['Nice-to-have', 'Fenced yard, ensuite'],
              ['Notes',      'Showing-ready weekends only. Partner works shifts.'],
            ].map(([k, val]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-2)' }}>
                <div style={{ width: 110, fontSize: 13, color: 'var(--ink-3)' }}>{k}</div>
                <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)' }}>{val}</div>
              </div>
            ))}
          </div>
        )}

        {tab === v.tabs[0] && roleVariant === 'seller_client' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="ph" data-label="hero photo · 88 Willow Pk Rd" style={{ height: 140 }} />
              <div className="card-pad">
                <div style={{ fontSize: 16, fontWeight: 600 }}>88 Willow Pk Rd</div>
                <div className="row-sub">Leslieville · 3 bd · 2 ba · 1,840 sqft</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="money tnum" style={{ fontSize: 18 }}><span className="sym">$</span>1,495,000</span>
                  <span className="badge warn">Active</span>
                  <span className="meta">DOM <span className="tnum">11</span></span>
                </div>
              </div>
            </div>
            <div className="card card-pad">
              <div className="section-h" style={{ padding: 0, marginBottom: 10 }}><h2>Incoming offers · 2</h2></div>
              {[{ c: 'Bailey', p: 1410000, cd: 340, st: 'Countered' },
                { c: 'Chen',   p: 1455000, cd: 22,  st: 'Submitted' }].map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i === 0 ? '1px solid var(--border-2)' : 0 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{o.c}</div>
                    <div className="row-sub">{o.st}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Money v={o.p} />
                    <div className="mt-1"><Countdown minutes={o.cd} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === v.tabs[0] && roleVariant === 'vendor' && (
          <div className="card card-pad">
            <div className="section-h" style={{ padding: 0, marginBottom: 10 }}><h2>Vendor details</h2></div>
            {[
              ['Company',   'Elm & Co. Stagers'],
              ['Contact',   'Priya Elm'],
              ['Phone',     '+1 (416) 555-0184'],
              ['Areas',     'Toronto + GTA East'],
              ['Rates',     '$2,400 / 6-wk stage'],
              ['Insured',   'Yes · $2M liability'],
            ].map(([k, val]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-2)' }}>
                <div style={{ width: 90, fontSize: 13, color: 'var(--ink-3)' }}>{k}</div>
                <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)' }}>{val}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Vendor: Engagements ── */}
        {tab === 'Engagements' && roleVariant === 'vendor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { prop: '128 Balsam Ave',    type: 'Staging',       date: 'Apr 9–11',  status: 'Completed', tone: 'success', fee: '$3,200' },
              { prop: '42 Sorauren Ave #3', type: 'Staging',      date: 'Mar 20–22', status: 'Completed', tone: 'success', fee: '$2,800' },
              { prop: '88 Willow Park Rd', type: 'Staging quote', date: 'Apr 18',    status: 'Pending',   tone: 'warn',    fee: '$3,500 est.' },
            ].map((e, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                  <span className={'badge ' + e.tone}>{e.status}</span>
                  <span className="meta tnum" style={{ flex: 1 }}>{e.date}</span>
                  <span className="money tnum" style={{ fontSize: 14 }}>{e.fee}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.prop}</div>
                <div className="row-sub">{e.type}</div>
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Log engagement</button>
          </div>
        )}

        {/* ── Vendor: Notes ── */}
        {tab === 'Notes' && roleVariant === 'vendor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { date: 'Apr 9 · 08:30',  text: 'Staging at 128 Balsam complete. Elm & Co. did excellent work — turnaround in 2 days, great communication. Will use again.', tags: ['staging', 'referral-ready'] },
              { date: 'Mar 20 · 09:00', text: 'Staged 42 Sorauren in 1 day. Priced fairly. They can accommodate rush jobs with 48h notice — useful for tight listing timelines.', tags: ['staging'] },
              { date: 'Feb 12',          text: 'Initial meeting with Elm & Co. — preferred vendor terms confirmed. 15% agent referral discount on repeat listings.', tags: ['terms'] },
            ].map((n, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="meta tnum" style={{ marginBottom: 6 }}>{n.date}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55 }}>{n.text}</div>
                <div className="flex gap-2 mt-2">
                  {n.tags.map(tag => <span key={tag} className="badge brand">#{tag}</span>)}
                </div>
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Add note</button>
          </div>
        )}

        {/* ── Vendor: Activity ── */}
        {tab === 'Activity' && roleVariant === 'vendor' && (
          <div className="card card-pad">
            {[
              { t: 'Apr 11 · 16:00', kind: 'note',  text: 'Staging at 128 Balsam completed and invoiced — $3,200.' },
              { t: 'Apr 9 · 08:30',  kind: 'appt',  text: 'Staging crew arrived at 128 Balsam Ave for 2-day setup.' },
              { t: 'Apr 7 · 10:00',  kind: 'call',  text: 'Confirmed staging dates and scope for 128 Balsam.' },
              { t: 'Mar 22 · 17:00', kind: 'note',  text: '42 Sorauren staging completed — $2,800 invoiced.' },
              { t: 'Mar 20 · 09:00', kind: 'appt',  text: 'Staging at 42 Sorauren Ave #3 — single-day turnaround.' },
              { t: 'Feb 12 · 11:00', kind: 'stage', text: 'Added as preferred vendor. Referral discount confirmed.' },
            ].map((a, i, arr) => {
              const dot = { note: 'var(--brand)', call: 'var(--success)', appt: 'var(--warning)', stage: 'var(--ink-3)' }[a.kind] || 'var(--ink-3)';
              const last = i === arr.length - 1;
              return (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: last ? 0 : '1px solid var(--border-2)', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0, paddingTop: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 999, background: dot }} />
                    {!last && <div style={{ width: 1, flex: 1, background: 'var(--border-2)', marginTop: 4, minHeight: 20 }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>{a.text}</div>
                    <div className="meta tnum" style={{ marginTop: 2 }}>{a.t}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fallback for non-vendor secondary tabs */}
        {tab !== v.tabs[0] && roleVariant !== 'vendor' && (
          <div className="card card-pad" style={{ textAlign: 'center', color: 'var(--ink-3)', padding: '32px 16px' }}>
            <div style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{tab}</div>
            <div className="meta mt-1">Content shown here for selected tab.</div>
          </div>
        )}

        <div style={{ height: 120 }} />
      </div>
    </>
  );
}

window.Clients = Clients;
window.ClientDetail = ClientDetail;
