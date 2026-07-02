// screen-props-offers.jsx — Properties, Offers
function Properties({ view, onViewChange, goto }) {
  const { TopBar, Money, btn } = window;
  const M = window.MOCK; const I = window.Icon;

  return (
    <>
      <TopBar title="My Listings" />
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', alignItems: 'center' }}>
        <div className="seg">
          <button data-active={view === 'list'} onClick={() => onViewChange('list')}>List</button>
          <button data-active={view === 'stages'} onClick={() => onViewChange('stages')}>Stages</button>
        </div>
        <div style={{ flex: 1 }} />
        <span className="meta tnum">{M.properties.length} listings</span>
      </div>

      {view === 'list' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {M.properties.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12 }} onClick={() => goto('propDetail')}>
              <div className="ph" data-label={'photo · ' + p.addr} style={{ width: 68, height: 68, borderRadius: 8, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{p.addr}</div>
                <div className="row-sub">{p.city}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                  {p.beds} bd · {p.baths} ba · <span className="tnum">{p.sqft.toLocaleString()}</span> sqft
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <span className="money tnum" style={{ fontSize: 14 }}><span className="sym">$</span>{p.price.toLocaleString()}</span>
                  <span className="badge"><span className="dot" style={{ backgroundColor: p.color }} />{p.stage}</span>
                  <div style={{ flex: 1 }} />
                  <span className="meta tnum" style={{ fontSize: 11 }}>DOM {p.dom}</span>
                </div>
              </div>
              <I name="chevron" size={14} color="var(--ink-3)" style={{ marginTop: 2 }} />
            </div>
          ))}
        </div>
      )}

      {view === 'stages' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { n: 'Pre-Listing',      c: '#ADB5BD' },
            { n: 'Listing Prep',     c: '#CC5DE8' },
            { n: 'Active on Market', c: '#FAB005' },
            { n: 'Showings',         c: '#FD7E14' },
            { n: 'Offer Review',     c: '#F76707' },
            { n: 'Under Contract',   c: '#F03E3E' },
            { n: 'Closed',           c: '#40C057' },
          ].map(lane => {
            const items = M.properties.filter(p => p.stage === lane.n);
            if (items.length === 0) return null;
            return (
              <div key={lane.n}>
                <div className="lane-head" style={{ marginBottom: 6 }}>
                  <span className="dot" style={{ backgroundColor: lane.c }} />
                  <span className="name">{lane.n}</span>
                  <span className="count tnum">{items.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {items.map(p => (
                    <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }} onClick={() => goto('propDetail')}>
                      <div className="ph" data-label="photo" style={{ width: 48, height: 48, borderRadius: 6, flex: 'none' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{p.addr}</div>
                        <div className="row-sub" style={{ fontSize: 11 }}>{p.city} · {p.beds} bd · {p.baths} ba</div>
                        <span className="money tnum" style={{ fontSize: 13 }}><span className="sym">$</span>{p.price.toLocaleString()}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div className="meta tnum" style={{ fontSize: 11, marginBottom: 4 }}>DOM {p.dom}</div>
                        <I name="chevron" size={13} color="var(--ink-3)" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}


function PropDetail({ goto }) {
  const { Money, Countdown, btn } = window;
  const I = window.Icon;
  const [photo, setPhoto] = React.useState(0);
  const [tab, setTab] = React.useState('Overview');
  const tabs = ['Overview', 'Contacts', 'Offers', 'Appts', 'Tasks', 'Notes', 'Activity', 'Files'];

  const p = { addr: '128 Balsam Ave', city: 'The Beach · Toronto', beds: 4, baths: 3, sqft: 2340, price: 1295000, stage: 'Active on Market', color: '#FAB005', dom: 6 };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', height: 300 }}>
          {['exterior front', 'living room', 'kitchen', 'primary bed', 'rear yard'].map((label, i) => (
            <div key={i} className="ph" data-label={label} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', height: 300 }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: 60, left: 14, right: 14, display: 'flex', alignItems: 'center' }}>
          <button className="icon-btn" onClick={() => goto('props')}><I name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} /></button>
          <div style={{ flex: 1 }} />
          <button className="icon-btn"><I name="share" size={14} /></button>
          <button className="icon-btn" style={{ marginLeft: 8 }}><I name="more" size={16} /></button>
        </div>
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
          {[0,1,2,3,4].map(i => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
          <span className="badge"><span className="dot" style={{ backgroundColor: p.color }} />{p.stage}</span>
          <span className="meta">DOM <span className="tnum">{p.dom}</span></span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{p.addr}</div>
        <div className="row-sub">{p.city}</div>
        <div className="mt-2 flex items-center gap-3">
          <span className="money tnum" style={{ fontSize: 26 }}><span className="sym">$</span>{p.price.toLocaleString()}</span>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'right', display: 'flex', gap: 14 }}>
            <div><div className="meta">Beds</div><div className="tnum" style={{ fontWeight: 600 }}>{p.beds}</div></div>
            <div><div className="meta">Baths</div><div className="tnum" style={{ fontWeight: 600 }}>{p.baths}</div></div>
            <div><div className="meta">Sqft</div><div className="tnum" style={{ fontWeight: 600 }}>{p.sqft.toLocaleString()}</div></div>
          </div>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border-2)' }}>
        <div className="chips" style={{ padding: '0 16px 0' }}>
          {tabs.map(t => (
            <button key={t} className="chip" data-active={tab === t} onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '10px 0', marginRight: 18 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {tab === 'Overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card card-pad">
              <div className="section-h" style={{ padding: 0, marginBottom: 10 }}><h2>Key details</h2></div>
              {[
                ['MLS #', 'E8912476'],
                ['Type', 'Detached · 2 storey'],
                ['Lot', '25 × 118 ft'],
                ['Taxes', '$6,482 (2025)'],
                ['Listed', 'Apr 11, 2026'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-2)' }}>
                  <div style={{ width: 90, fontSize: 13, color: 'var(--ink-3)' }}>{k}</div>
                  <div style={{ flex: 1, fontSize: 14 }} className="tnum">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'Offers' && (
          <div style={{ overflowX: 'auto', margin: '0 -16px', padding: '0 16px' }}>
            <div style={{ display: 'flex', gap: 10, minWidth: 'max-content' }}>
              {[
                { c: 'Bailey',  p: 1210000, d: 60000, cl: 'May 30', cd: -120, cond: 'Financing + Inspection', st: 'Expired'},
                { c: 'Chen',    p: 1245000, d: 65000, cl: 'Jun 6',  cd: 340,  cond: 'Financing',              st: 'Submitted'},
                { c: 'Navarro', p: 1255000, d: 80000, cl: 'May 24', cd: 22,   cond: 'Firm',                   st: 'Countered'},
              ].map((o, i) => (
                <div key={i} className="card" style={{ width: 210, padding: 14 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>{o.c}</div>
                    <div style={{ flex: 1 }} />
                    {o.st === 'Expired' ? <span className="badge">Expired</span> : o.st === 'Countered' ? <span className="badge warn">Countered</span> : <span className="badge info">Submitted</span>}
                  </div>
                  {[['Price', '$' + o.p.toLocaleString()], ['Deposit', '$' + o.d.toLocaleString()], ['Closing', o.cl], ['Conditions', o.cond]].map(([k, val]) => (
                    <div key={k} style={{ padding: '6px 0', borderBottom: '1px solid var(--border-2)' }}>
                      <div className="meta" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                      <div className="tnum" style={{ fontSize: 14, fontWeight: 600 }}>{val}</div>
                    </div>
                  ))}
                  <div className="mt-2"><Countdown minutes={o.cd} /></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'Contacts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { initials: 'AF', cls: 'av-seller', name: 'Aya Fujimori',        sub: 'Seller client' },
              { initials: 'JR', cls: 'av-buyer',  name: 'Jordan Reyes',        sub: 'Listing agent · Royal LePage' },
              { initials: 'MC', cls: 'av-buyer',  name: 'Marcus & Priya Chen', sub: 'Buyer client · active offer' },
              { initials: 'DN', cls: 'av-vendor', name: 'Dermot Navarro',      sub: 'Buyer client · countered' },
              { initials: 'LS', cls: 'av-vendor', name: 'Lena Schultz',        sub: 'Stager · The Staging Co.' },
            ].map((c, i) => (
              <div key={i} className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
                <div className={'avatar ' + c.cls} style={{ width: 44, height: 44, fontSize: 14 }}>{c.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div className="row-sub">{c.sub}</div>
                </div>
                <button className="icon-btn"><I name="phone" size={14} /></button>
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Add contact</button>
          </div>
        )}

        {tab === 'Appts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { t: 'Sat Apr 19 · 10:30 AM', title: 'Showing — Chen',    status: 'Upcoming',  tone: 'info'    },
              { t: 'Sat Apr 19 · 1:00 PM',  title: 'Open house',         status: 'Upcoming',  tone: 'info'    },
              { t: 'Thu Apr 17 · 10:30 AM', title: 'Showing — Chen',    status: 'Completed', tone: 'success' },
              { t: 'Tue Apr 15 · 2:30 PM',  title: 'Showing — Navarro', status: 'Completed', tone: 'success' },
              { t: 'Sun Apr 13 · 1:00 PM',  title: 'Open house',         status: 'Completed', tone: 'success' },
              { t: 'Fri Apr 11 · 11:00 AM', title: 'Showing — Bailey',  status: 'Completed', tone: 'success' },
            ].map((a, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <span className={'badge ' + a.tone}>{a.status}</span>
                  <span className="meta tnum">{a.t}</span>
                </div>
                <div className="row-title">{a.title}</div>
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Schedule showing</button>
          </div>
        )}

        {tab === 'Tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { text: 'Confirm inspection booking with Baraka',     when: 'Today, 2:00 PM', tone: 'warn',   done: false },
              { text: 'Upload final staging photos to MLS',         when: 'Today, 5:00 PM', tone: 'warn',   done: false },
              { text: 'Review counter offer terms with Aya',        when: 'Thu Apr 17',     tone: 'ok',     done: false },
              { text: 'Prepare open-house sign placements',         when: 'Fri Apr 18',     tone: 'ok',     done: false },
              { text: 'Send showing feedback summary to Aya',       when: 'Completed',      tone: 'ok',     done: true  },
              { text: 'Submit MLS listing to board',                when: 'Completed',      tone: 'ok',     done: true  },
            ].map((t, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'flex-start', opacity: t.done ? 0.5 : 1 }}>
                <div style={{ width: 20, height: 20, borderRadius: 999, border: t.done ? 0 : '1.5px solid var(--border)', background: t.done ? 'var(--success)' : 'transparent', marginTop: 1, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: t.done ? 'var(--ink-3)' : 'var(--ink)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</div>
                  <div className="mt-1"><span className={'countdown ' + (t.done ? 'ok' : t.tone)}>{t.when}</span></div>
                </div>
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Add task</button>
          </div>
        )}

        {tab === 'Notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { date: 'Today', text: 'Buyers are motivated — counter at $1.26M should close. Aya confirmed she is open to it if close date is Jun 6 or earlier.', tags: ['offer'] },
              { date: 'Apr 13', text: 'Open house went well — 22 groups through. Three strong prospects. Offer deadline set for Apr 17 at 5 PM.', tags: ['open-house'] },
              { date: 'Apr 11', text: 'Listed at $1,295,000. Aya confirmed flexibility on closing date. Staging looks great — MLS showing strong early traffic.', tags: ['listing'] },
              { date: 'Apr 9',  text: 'Staging complete. Lena did excellent work with the living room and primary bed. Photography booked for Apr 10 AM.', tags: ['staging'] },
            ].map((n, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="meta tnum" style={{ marginBottom: 6 }}>{n.date}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55 }}>{n.text}</div>
                <div className="flex gap-2 mt-2">{n.tags.map(tag => <span key={tag} className="badge brand">#{tag}</span>)}</div>
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Add note</button>
          </div>
        )}

        {tab === 'Activity' && (
          <div className="card card-pad">
            {[
              { t: 'Today, 09:00',   kind: 'stage', text: '3rd offer received — M. Navarro at $1,255,000 firm.' },
              { t: 'Apr 17, 10:30',  kind: 'appt',  text: 'Showing #14 — Marcus & Priya Chen. Very strong interest.' },
              { t: 'Apr 16, 17:00',  kind: 'stage', text: 'Offer submitted — Chen at $1,245,000, financing + inspection.' },
              { t: 'Apr 15, 14:30',  kind: 'stage', text: 'Offer submitted — Bailey at $1,210,000 (expired).' },
              { t: 'Apr 13, 13:00',  kind: 'appt',  text: 'Open house — 22 groups through, very strong weekend.' },
              { t: 'Apr 11, 09:00',  kind: 'stage', text: 'Listing went live on MLS at $1,295,000.' },
            ].map((a, i, arr) => {
              const dot = { note: 'var(--brand)', call: 'var(--success)', appt: 'var(--brand)', stage: 'var(--ink-3)' }[a.kind] || 'var(--ink-3)';
              const last = i === arr.length - 1;
              return (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: last ? 0 : '1px solid var(--border-2)', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0, paddingTop: 3 }}>
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

        {tab === 'Files' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'Listing Agreement — Fujimori', type: 'PDF', date: 'Apr 9',  size: '318 KB' },
              { name: 'MLS Listing Sheet',             type: 'PDF', date: 'Apr 11', size: '94 KB'  },
              { name: 'Home Inspection Report',        type: 'PDF', date: 'Apr 17', size: '1.2 MB' },
              { name: 'Staging Photos (14 images)',    type: 'ZIP', date: 'Apr 10', size: '22 MB'  },
            ].map((f, i) => (
              <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <I name="doc" size={16} color="var(--ink-3)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div>
                  <div className="row-sub">{f.type} · {f.date} · {f.size}</div>
                </div>
                <I name="down" size={16} color="var(--ink-3)" />
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Upload document</button>
          </div>
        )}
      </div>
      <div style={{ height: 120 }} />
    </>
  );
}

function Offers({ goto }) {
  const { TopBar, Money, Countdown } = window;
  const M = window.MOCK; const I = window.Icon;
  const [group, setGroup] = React.useState('Status');

  const statuses = {
    'Active negotiations': M.offers.filter(o => o.status === 'Countered' || (o.expMin !== null && o.expMin > 0 && o.expMin < 1440)),
    'Submitted': M.offers.filter(o => o.status === 'Submitted' && (o.expMin === null || o.expMin >= 1440)),
    'Accepted':  M.offers.filter(o => o.status === 'Accepted'),
    'Expired':   M.offers.filter(o => o.status === 'Expired'),
  };

  return (
    <>
      <TopBar title="Offers" />
      <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="meta">Group by</span>
        <div className="seg">
          <button data-active={group === 'Status'} onClick={() => setGroup('Status')}>Status</button>
          <button data-active={false} onClick={() => goto('offersByProp')}>Property</button>
          <button data-active={false} onClick={() => goto('offersByClient')}>Client</button>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.entries(statuses).map(([name, list]) => (
          <div key={name}>
            <div className="flex items-center gap-2" style={{ padding: '4px 4px 8px' }}>
              {name === 'Active negotiations' && <I name="flame" size={14} color="oklch(0.55 0.2 25)" />}
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-2)' }}>
                {name}
              </div>
              <span className="count tnum" style={{ color: 'var(--ink-3)', fontSize: 12 }}>{list.length}</span>
            </div>
            {list.length === 0 ? (
              <div className="card card-pad meta" style={{ textAlign: 'center' }}>None</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map(o => (
                  <div key={o.id} className="card card-pad" style={{ padding: 14 }} onClick={() => goto('offerDetail')}>
                    <div className="flex items-center gap-3">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center gap-2">
                          <div className="row-title truncate">{o.addr}</div>
                          <span className="badge" style={{ fontSize: 10 }}>{o.side === 'buyer' ? 'BUYER-SIDE' : 'SELLER-SIDE'}</span>
                        </div>
                        <div className="row-sub">{o.client} · {o.status}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Money v={o.price} />
                        <div className="mt-1"><Countdown minutes={o.expMin} /></div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2" style={{ paddingTop: 10, borderTop: '1px solid var(--border-2)' }}>
                      <span className="meta">Deposit <span className="tnum" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>${o.deposit.toLocaleString()}</span></span>
                      <div style={{ flex: 1 }} />
                      {o.status !== 'Expired' && o.status !== 'Accepted' && (
                        <button style={{ padding: '6px 10px', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--ink-2)' }}>
                          Update status
                        </button>
                      )}
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

window.Properties = Properties;
window.PropDetail = PropDetail;
window.Offers = Offers;

// ============ Offer Detail ============
function OfferDetail({ goto }) {
  const I = window.Icon;
  const [tab, setTab] = React.useState('Details');
  const tabs = ['Details', 'Timeline', 'Contacts', 'Documents'];

  const offer = {
    addr: '128 Balsam Ave', city: 'The Beach · Toronto',
    client: 'Marcus & Priya Chen', side: 'buyer',
    status: 'Submitted', price: 1245000, listPrice: 1295000,
    deposit: 65000, expMin: 340, closing: 'Jun 6, 2026',
    conditions: 'Financing + Inspection', irrev: '5:00 PM Today', mls: 'E8912476',
  };
  const diff = offer.listPrice - offer.price;
  const diffPct = ((diff / offer.listPrice) * 100).toFixed(1);
  const isBuyer = offer.side === 'buyer';

  function KV({ k, v, last }) {
    return (
      <div style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: last ? 0 : '1px solid var(--border-2)' }}>
        <div style={{ width: 110, fontSize: 13, color: 'var(--ink-3)', flexShrink: 0 }}>{k}</div>
        <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{v}</div>
      </div>
    );
  }

  return (
    <>
      <div className="topbar" style={{ paddingBottom: 6 }}>
        <div className="topbar-row">
          <button className="icon-btn" onClick={() => goto('offers')}><I name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} /></button>
          <div style={{ flex: 1 }} />
          <button className="icon-btn"><I name="share" size={14} /></button>
          <button className="icon-btn" style={{ marginLeft: 6 }}><I name="more" size={16} /></button>
        </div>
      </div>

      <div style={{ padding: '0 16px 14px' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
          <span className={'badge ' + (offer.status === 'Accepted' ? 'success' : offer.status === 'Countered' ? 'warn' : offer.status === 'Expired' ? 'danger' : 'info')}>{offer.status}</span>
          <span className={'role ' + (isBuyer ? 'buyer' : 'seller')}>
            <span className="dot" style={{ background: isBuyer ? 'oklch(0.62 0.14 254)' : 'oklch(0.58 0.17 310)' }} />
            {isBuyer ? 'Buyer-side' : 'Seller-side'}
          </span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{offer.addr}</div>
        <div className="row-sub" style={{ marginTop: 2 }}>{offer.city}</div>

        <div className="flex items-start gap-3 mt-3">
          <div>
            <div className="meta" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Offer price</div>
            <div className="money tnum" style={{ fontSize: 26 }}><span className="sym">$</span>{offer.price.toLocaleString()}</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'right' }}>
            <div className="meta" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Irrevocable</div>
            <window.Countdown minutes={offer.expMin} />
          </div>
        </div>

        <div style={{ marginTop: 10, padding: '9px 12px', background: 'var(--bg-sunk)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="meta" style={{ fontSize: 12 }}>List</span>
          <span className="money tnum" style={{ fontSize: 13, color: 'var(--ink-2)' }}><span className="sym" style={{ fontSize: 11 }}>$</span>{offer.listPrice.toLocaleString()}</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: diff > 0 ? 'var(--warning)' : 'var(--success)' }}>
            {diff > 0 ? `-$${diff.toLocaleString()} (${diffPct}% under)` : `+$${Math.abs(diff).toLocaleString()} over`}
          </span>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border-2)' }}>
        <div className="chips" style={{ padding: '0 12px', mask: 'none', WebkitMask: 'none' }}>
          {tabs.map(t => (
            <button key={t} className="chip" onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '10px 0', marginRight: 16, fontWeight: tab === t ? 600 : 500 }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, paddingBottom: 120 }}>
        {tab === 'Details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card card-pad">
              <div className="section-h" style={{ padding: 0, marginBottom: 10 }}><h2>Offer terms</h2></div>
              <KV k="Offer price" v={'$' + offer.price.toLocaleString()} />
              <KV k="Deposit" v={'$' + offer.deposit.toLocaleString()} />
              <KV k="Closing date" v={offer.closing} />
              <KV k="Conditions" v={offer.conditions} />
              <KV k="Irrevocable" v={offer.irrev} last />
            </div>
            <div className="card card-pad">
              <div className="section-h" style={{ padding: 0, marginBottom: 10 }}><h2>Property</h2></div>
              <KV k="Address" v={offer.addr + ', The Beach'} />
              <KV k="List price" v={'$' + offer.listPrice.toLocaleString()} />
              <KV k="MLS #" v={offer.mls} last />
            </div>
          </div>
        )}

        {tab === 'Timeline' && (
          <div className="card card-pad">
            {[
              { t: 'Today, 17:00', kind: 'note', text: 'Offer submitted at $1,245,000 with financing and inspection conditions.' },
              { t: 'Today, 16:15', kind: 'call', text: 'Reviewed terms with Marcus. Agreed on deposit amount.' },
              { t: 'Today, 14:30', kind: 'stage', text: 'Offer drafted — $1,245,000, Jun 6 close, 65k deposit.' },
              { t: 'Apr 16, 09:00', kind: 'appt', text: 'Showing #14 completed. Strong buyer interest confirmed.' },
            ].map((a, i, arr) => {
              const dot = { note: 'var(--brand)', call: 'var(--success)', stage: 'var(--ink-3)', appt: 'var(--warning)' }[a.kind] || 'var(--ink-3)';
              const last = i === arr.length - 1;
              return (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: last ? 0 : '1px solid var(--border-2)', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0, paddingTop: 3 }}>
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

        {tab === 'Contacts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { initials: 'AF', cls: 'av-seller', name: 'Aya Fujimori', sub: 'Seller client' },
              { initials: 'JR', cls: 'av-buyer',  name: 'Jordan Reyes', sub: 'Listing agent · Royal LePage' },
              { initials: 'MC', cls: 'av-buyer',  name: 'Marcus & Priya Chen', sub: "Buyer client (active offer)" },
            ].map((c, i) => (
              <div key={i} className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
                <div className={'avatar ' + c.cls} style={{ width: 44, height: 44, fontSize: 14 }}>{c.initials}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{c.name}</div><div className="row-sub">{c.sub}</div></div>
                <button className="icon-btn"><I name="phone" size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {tab === 'Documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'Offer — 128 Balsam Ave',       type: 'PDF', date: 'Today',       size: '204 KB' },
              { name: 'Pre-approval Letter — Scotia',  type: 'PDF', date: 'Apr 12 2026', size: '89 KB'  },
              { name: 'Schedule A — Conditions',       type: 'PDF', date: 'Today',       size: '44 KB'  },
            ].map((f, i) => (
              <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <I name="doc" size={16} color="var(--ink-3)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div>
                  <div className="row-sub">{f.type} · {f.date} · {f.size}</div>
                </div>
                <I name="down" size={16} color="var(--ink-3)" />
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Upload document</button>
          </div>
        )}

        {tab === 'Appts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { t: 'Sat Apr 19 · 10:30 AM', title: 'Showing — Chen',   status: 'Upcoming',  tone: 'info'    },
              { t: 'Sat Apr 19 · 1:00 PM',  title: 'Open house',        status: 'Upcoming',  tone: 'info'    },
              { t: 'Thu Apr 17 · 10:30 AM', title: 'Showing — Chen',   status: 'Completed', tone: 'success' },
              { t: 'Tue Apr 15 · 2:30 PM',  title: 'Showing — Navarro', status: 'Completed', tone: 'success' },
              { t: 'Sun Apr 13 · 1:00 PM',  title: 'Open house',        status: 'Completed', tone: 'success' },
            ].map((a, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <span className={'badge ' + a.tone}>{a.status}</span>
                  <span className="meta tnum">{a.t}</span>
                </div>
                <div className="row-title">{a.title}</div>
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Schedule showing</button>
          </div>
        )}

        {tab === 'Tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { text: 'Confirm inspection booking with Baraka', when: 'Today, 2:00 PM', tone: 'warn' },
              { text: 'Upload final staging photos to MLS',     when: 'Today, 5:00 PM', tone: 'warn' },
              { text: 'Review counter offer terms with Aya',    when: 'Thu Apr 17',     tone: 'ok'   },
              { text: 'Prepare open-house sign placements',     when: 'Fri Apr 18',     tone: 'ok'   },
            ].map((t, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: 999, border: '1.5px solid var(--border)', marginTop: 1, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{t.text}</div>
                  <div className="mt-1"><span className={'countdown ' + t.tone}>{t.when}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { date: 'Today', text: 'Buyers are motivated. Counter at $1.26M should close the deal — Aya confirmed she is open to it if the close date is Jun 6 or earlier.', tags: ['offer'] },
              { date: 'Apr 13', text: 'Open house went well — 22 groups through. Three strong prospects. Offer deadline set for Apr 17 at 5 PM.', tags: ['showing'] },
              { date: 'Apr 11', text: 'Listed at $1,295,000. Aya confirmed flexibility on closing date. Staging photos look great — MLS showing strong early traffic.', tags: ['listing'] },
            ].map((n, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="meta tnum" style={{ marginBottom: 6 }}>{n.date}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55 }}>{n.text}</div>
                <div className="flex gap-2 mt-2">{n.tags.map(tag => <span key={tag} className="badge brand">#{tag}</span>)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actionbar">
        {offer.status === 'Submitted' && <>
          <button><I name="pen" size={18} /><span>Amend</span></button>
          <button><I name="phone" size={18} /><span>Call agent</span></button>
          <button className="primary" style={{ background: 'var(--destructive)', borderColor: 'var(--destructive)' }}><I name="more" size={18} /><span>Withdraw</span></button>
          <button><I name="note" size={18} /><span>Note</span></button>
        </>}
        {offer.status === 'Countered' && <>
          <button><I name="phone" size={18} /><span>Call agent</span></button>
          <button className="primary"><I name="coins" size={18} /><span>Counter back</span></button>
          <button><I name="check" size={18} /><span>Accept</span></button>
          <button><I name="more" size={18} /><span>More</span></button>
        </>}
        {offer.status !== 'Submitted' && offer.status !== 'Countered' && <>
          <button><I name="share" size={18} /><span>Share</span></button>
          <button><I name="note" size={18} /><span>Note</span></button>
          <button className="primary"><I name="coins" size={18} /><span>New offer</span></button>
          <button><I name="more" size={18} /><span>More</span></button>
        </>}
      </div>
    </>
  );
}

window.OfferDetail = OfferDetail;

// ============ Offers by Client ============
function OffersByClient({ goto }) {
  const { TopBar, Money, Countdown } = window;
  const M = window.MOCK; const I = window.Icon;

  const byClient = {};
  M.offers.forEach(o => {
    if (!byClient[o.client]) byClient[o.client] = [];
    byClient[o.client].push(o);
  });

  return (
    <>
      <TopBar title="Offers" />
      <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="meta">Group by</span>
        <div className="seg">
          <button data-active={false} onClick={() => goto('offers')}>Status</button>
          <button data-active={false} onClick={() => goto('offersByProp')}>Property</button>
          <button data-active={true}>Client</button>
        </div>
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.entries(byClient).map(([client, offers]) => {
          const hasActive = offers.some(o => o.status !== 'Expired');
          return (
            <div key={client}>
              <div className="flex items-center gap-2" style={{ padding: '0 4px 8px' }}>
                <I name="user" size={13} color="var(--ink-3)" />
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{client}</div>
                <span className="meta tnum">{offers.length} offer{offers.length > 1 ? 's' : ''}</span>
                {hasActive && <span className="badge brand">Active</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {offers.map((o, i) => (
                  <div key={i} className="card card-pad" style={{ padding: 14 }} onClick={() => goto('offerDetail')}>
                    <div className="flex items-center gap-3">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center gap-2">
                          <div className="row-title truncate">{o.addr}</div>
                          <span className="badge" style={{ fontSize: 10 }}>{o.side === 'buyer' ? 'BUYER' : 'SELLER'}</span>
                        </div>
                        <div className="row-sub">{o.status}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Money v={o.price} />
                        <div className="mt-1"><Countdown minutes={o.expMin} /></div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-2)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {[['Deposit','$'+o.deposit.toLocaleString()],['Side',o.side],['Status',o.status]].map(([k,v]) => (
                        <div key={k}>
                          <div className="meta" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, marginTop: 1 }} className="tnum">{v}</div>
                        </div>
                      ))}
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

window.OffersByClient = OffersByClient;
