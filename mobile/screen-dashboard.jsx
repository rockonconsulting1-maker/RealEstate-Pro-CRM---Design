// screens.jsx — all 7 mobile screens for RC CRM
const M = window.MOCK;
const I = window.Icon;

// ============ PRIMITIVES ============
function TopBar({ title, sub, onSearch, showSearch = true, noSearchField = false }) {
  return (
    <div className="topbar">
      <div className="topbar-row">
        <div style={{ flex: 1 }}>
          {sub && <div className="sub">{sub}</div>}
          <h1>{title}</h1>
        </div>
        <button className="icon-btn" aria-label="notifications" onClick={() => window.openSheet?.('notifications')}>
          <I name="bell" size={18} />
          <span className="dot-badge" />
        </button>
        <div className="avatar av-buyer" style={{ width: 36, height: 36, fontSize: 12, cursor: 'pointer' }} onClick={() => window.gotoScreen?.('settings')}>{M.agent.initials}</div>
      </div>
      {showSearch && !noSearchField && (
        <div className="search" onClick={() => window.openSearch?.()}>
          <I name="search" size={16} color="currentColor" />
          <input placeholder={"Search " + title.toLowerCase() + "…"} readOnly style={{ cursor: 'pointer' }} />
          <I name="sliders" size={16} />
        </div>
      )}
    </div>
  );
}

function TabBar({ active, onTab }) {
  const tabs = [
    { id: 'dash',   label: 'Dash',     icon: 'home' },
    { id: 'leads',  label: 'Leads',    icon: 'users' },
    { id: 'clients',label: 'Clients',  icon: 'briefcase' },
    { id: 'contacts', label: 'Contacts', icon: 'contact' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' },
    { id: 'tasks',  label: 'Tasks',    icon: 'check' },
  ];
  return (
    <nav className="tabbar">
      {tabs.map(t => (
        <button key={t.id} className="tab" data-active={active === t.id} onClick={() => onTab(t.id)}>
          <I name={t.icon} size={20} color={active === t.id ? 'var(--brand)' : 'var(--ink-3)'} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

function Money({ v, sym = '$' }) {
  const str = typeof v === 'number' ? v.toLocaleString('en-US') : v;
  return <span className="money tnum"><span className="sym">{sym}</span>{str}</span>;
}

function Countdown({ minutes }) {
  if (minutes === null || minutes === undefined) return <span className="countdown ok">—</span>;
  if (minutes < 0) return <span className="countdown expired">EXPIRED</span>;
  const tone = minutes <= 60 ? 'danger' : minutes <= 24 * 60 ? 'warn' : 'ok';
  let text;
  if (minutes < 60) text = minutes + 'm';
  else if (minutes < 24 * 60) text = Math.round(minutes / 60) + 'h ' + (minutes % 60) + 'm';
  else text = Math.floor(minutes / 1440) + 'd ' + Math.floor((minutes % 1440) / 60) + 'h';
  return <span className={'countdown ' + tone}>{text}</span>;
}

function Avatar({ name, role }) {
  const initials = (name || '').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const cls = role === 'seller' ? 'av-seller' : role === 'past' ? 'av-past' : role === 'vendor' ? 'av-vendor' : role === 'soi' ? 'av-soi' : 'av-buyer';
  return <div className={'avatar ' + cls}>{initials}</div>;
}

// ============ DASHBOARD ============
function Dashboard({ goto }) {
  const a = M.nextAppointment;
  return (
    <>
      <TopBar title="Good morning, Jordan" sub="Friday, April 17" noSearchField />

      {/* Next Appointment Hero */}
      <div className="section">
        <div className="card card-pad" style={{ background: 'linear-gradient(180deg, oklch(0.97 0.01 260), var(--surface))' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
            <span className="badge info">Next up</span>
            <span className="meta tnum">in {a.minutesUntil} min</span>
            <div style={{ flex: 1 }} />
            <span className="countdown warn"><I name="clock" size={11} />{a.minutesUntil}m</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05 }} className="tnum">
            {a.when.replace('Today, ', '')}
          </div>
          <div style={{ color: 'var(--ink-2)', fontSize: 15, marginTop: 4, fontWeight: 500 }}>
            {a.address} · <span className="muted">{a.city}</span>
          </div>
          <div className="flex items-center gap-3 mt-4" style={{ paddingTop: 12, borderTop: '1px solid var(--border-2)' }}>
            <Avatar name={a.contactName} role="buyer" />
            <div style={{ flex: 1 }}>
              <div className="row-title">{a.contactName}</div>
              <div className="meta">Buyer client · Showing</div>
            </div>
            <div className="badge" style={{ gap: 5 }}>
              <I name="car" size={12} />
              <span className="tnum">≈ {a.drive} min</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button style={btn.primary}><I name="arrowRight" size={14} />Navigate</button>
            <button style={btn.ghost}><I name="phone" size={14} />Call</button>
          </div>
        </div>
      </div>

      {/* Stats scroll */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '8px 16px 4px', scrollbarWidth: 'none' }}>
        {M.stats.map((s, i) => (
          <div key={i} className="card card-pad" style={{ flex: 'none', minWidth: 140, padding: 14 }}>
            <div className="meta">{s.label}</div>
            <div className="mt-1" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
              <span className="tnum">{s.value}</span>
            </div>
            <div className="mt-1 flex items-center gap-1" style={{ color: 'oklch(0.44 0.12 150)', fontSize: 12, fontWeight: 500 }}>
              <I name="arrowUp" size={12} /><span className="tnum">{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Attention */}
      <div className="section">
        <div className="section-h"><h2>Needs your attention</h2></div>
        <div style={{ padding: '0 16px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            {M.attention.map((a, i) => (
              <div key={a.id} className="row" style={{ borderBottom: i < M.attention.length - 1 ? '1px solid var(--border-2)' : 0 }}>
                <span className={'badge ' + (a.tone === 'danger' ? 'danger' : a.tone === 'warn' ? 'warn' : 'info')} style={{ fontSize: 14, fontWeight: 700, minWidth: 28, justifyContent: 'center' }}>
                  <span className="tnum">{a.count}</span>
                </span>
                <div style={{ flex: 1 }}>
                  <div className="row-title">{a.label}</div>
                  <div className="row-sub">{a.kind === 'overdue' ? 'Review and reschedule' : a.kind === 'newleads' ? 'Respond in under 5 min' : 'Expiring within 24h'}</div>
                </div>
                <I name="chevron" size={16} color="var(--ink-4)" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New leads */}
      <div className="section">
        <div className="section-h">
          <h2>New leads · last 48h</h2>
          <a className="link">See all →</a>
        </div>
        <div style={{ padding: '0 16px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            {M.newLeads.slice(0, 4).map((l, i) => (
              <div key={l.id} className="row" style={{ borderBottom: i < 3 ? '1px solid var(--border-2)' : 0 }}>
                <Avatar name={l.name} role={l.role} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center gap-2">
                    <span className="row-title truncate">{l.name}</span>
                    {l.temp === 'Hot' && <I name="flame" size={12} color="oklch(0.55 0.2 25)" />}
                  </div>
                  <div className="row-sub flex items-center gap-2">
                    <span className="dot" style={{ backgroundColor: l.color }} />
                    <span>{l.stage}</span>
                    <span style={{ color: 'var(--ink-4)' }}>·</span>
                    <span className="tnum">{l.budget}</span>
                  </div>
                </div>
                <span className="meta tnum">{l.ago}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending offers */}
      <div className="section">
        <div className="section-h">
          <h2>Pending offers</h2>
          <a className="link">See all →</a>
        </div>
        <div style={{ padding: '0 16px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            {M.pendingOffers.map((o, i) => (
              <div key={o.id} className="row" style={{ borderBottom: i < M.pendingOffers.length - 1 ? '1px solid var(--border-2)' : 0, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row-title truncate">{o.address}</div>
                  <div className="row-sub">{o.client} · {o.status}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><Money v={o.price} /></div>
                  <div className="mt-1"><Countdown minutes={o.expMin} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="section">
        <div className="section-h">
          <h2>Recent activity</h2>
        </div>
        <div className="chips" style={{ padding: '0 16px 12px' }}>
          {['All', 'Notes', 'Calls', 'Stage', 'Appts'].map((c, i) => (
            <button key={c} className="chip" data-active={i === 0}>{c}</button>
          ))}
        </div>
        <div style={{ padding: '0 16px 16px' }}>
          {M.activity.map(group => (
            <div key={group.day} style={{ marginBottom: 12 }}>
              <div className="meta" style={{ margin: '8px 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>{group.day}</div>
              <div className="card" style={{ overflow: 'hidden' }}>
                {group.items.map((it, i) => (
                  <div key={i} className="row" style={{ borderBottom: i < group.items.length - 1 ? '1px solid var(--border-2)' : 0, alignItems: 'flex-start' }}>
                    <div style={{ width: 42, color: 'var(--ink-3)', fontSize: 12, fontFamily: 'var(--mono)' }} className="tnum">{it.t}</div>
                    <div style={{ flex: 1 }}>
                      <div className="row-title" style={{ fontSize: 14 }}>{it.who}</div>
                      <div className="row-sub">{it.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const btn = {
  primary: { background: 'var(--ink)', color: '#fff', border: 0, padding: '10px 14px', borderRadius: 10, fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' },
  ghost:   { background: 'transparent', color: 'var(--ink-2)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 10, fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
};

// ============ SEARCH SCREEN ============
function SearchScreen({ onClose }) {
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);

  const ALL = [
    ...M.newLeads.map(l => ({ type: 'Lead',     name: l.name,  sub: l.stage + ' · ' + l.budget,           icon: 'users',     screen: 'leads'               })),
    { type: 'Client',   name: 'Marcus & Priya Chen', sub: 'Buyer · Offer submitted',                        icon: 'briefcase', screen: 'clientDetailBuyer'  },
    { type: 'Client',   name: 'Tran Household',       sub: 'Buyer · Under contract',                         icon: 'briefcase', screen: 'clientDetailBuyer'  },
    { type: 'Client',   name: 'Aya Fujimori',          sub: 'Seller · 128 Balsam Ave',                       icon: 'briefcase', screen: 'clientDetailSeller' },
    ...M.properties.map(p => ({ type: 'Property', name: p.addr, sub: p.city + ' · $' + (p.price / 1000).toFixed(0) + 'k', icon: 'map',  screen: 'propDetail'  })),
    ...M.offers.map(o => ({ type: 'Offer', name: o.addr, sub: o.client + ' · ' + o.status, icon: 'doc', screen: 'offerDetail' })),
  ];

  const RECENT = ['128 Balsam Ave', 'Marcus Chen', 'Aya Fujimori'];
  const lq = q.toLowerCase().trim();
  const filtered = lq ? ALL.filter(r => (r.name + ' ' + r.sub).toLowerCase().includes(lq)) : [];
  const groups = {};
  filtered.forEach(r => { (groups[r.type] = groups[r.type] || []).push(r); });
  const ORDER = ['Lead', 'Client', 'Property', 'Offer'];

  const handleSelect = sc => {
    onClose();
    window.gotoScreen?.(sc);
  };

  React.useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);

  return (
    <>
      {/* Search header */}
      <div className="topbar" style={{ paddingBottom: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="search" style={{ flex: 1, margin: 0 }}>
            <I name="search" size={16} color="currentColor" />
            <input
              ref={inputRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search everything…"
              style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'var(--font)', fontSize: 15, color: 'var(--ink)', outline: 'none', minWidth: 0 }}
            />
            {q && (
              <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', padding: '0 4px', fontSize: 18, lineHeight: 1, fontFamily: 'var(--font)' }}>×</button>
            )}
          </div>
          <button onClick={onClose} style={{ fontSize: 14, fontWeight: 500, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', padding: '0 0 0 4px', flexShrink: 0 }}>Cancel</button>
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: '4px 16px 32px' }}>
        {!lq ? (
          <>
            <div className="meta" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11, margin: '10px 0 8px' }}>Recent searches</div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {RECENT.map((r, i) => (
                <div key={r} className="row" style={{ borderBottom: i < RECENT.length - 1 ? '1px solid var(--border-2)' : 0, cursor: 'pointer' }} onClick={() => setQ(r)}>
                  <I name="search" size={15} color="var(--ink-4)" />
                  <span style={{ flex: 1, color: 'var(--ink-2)' }}>{r}</span>
                  <I name="arrowRight" size={14} color="var(--ink-4)" />
                </div>
              ))}
            </div>
            <div className="meta" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11, margin: '18px 0 8px' }}>Browse</div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {[['leads','Leads','users'],['clients','Clients','briefcase'],['props','Properties','map'],['offers','Offers','doc']].map(([sc, lbl, ico], i, arr) => (
                <div key={sc} className="row" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-2)' : 0, cursor: 'pointer' }} onClick={() => handleSelect(sc)}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-sunk)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <I name={ico} size={16} color="var(--ink-3)" />
                  </div>
                  <span style={{ flex: 1, color: 'var(--ink)', fontWeight: 500 }}>{lbl}</span>
                  <I name="chevron" size={16} color="var(--ink-4)" />
                </div>
              ))}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
            No results for “<strong style={{ color: 'var(--ink-2)' }}>{q}</strong>”
          </div>
        ) : (
          ORDER.filter(t => groups[t]).map(type => (
            <div key={type}>
              <div className="meta" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11, margin: '16px 0 8px' }}>{type}s</div>
              <div className="card" style={{ overflow: 'hidden' }}>
                {groups[type].map((r, i) => (
                  <div key={i} className="row" onClick={() => handleSelect(r.screen)}
                    style={{ borderBottom: i < groups[type].length - 1 ? '1px solid var(--border-2)' : 0, cursor: 'pointer' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-sunk)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <I name={r.icon} size={16} color="var(--ink-3)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row-title truncate">{r.name}</div>
                      <div className="row-sub">{r.sub}</div>
                    </div>
                    <I name="chevron" size={16} color="var(--ink-4)" />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

window.Dashboard = Dashboard;
window.TopBar = TopBar;
window.TabBar = TabBar;
window.Avatar = Avatar;
window.Money = Money;
window.Countdown = Countdown;
window.SearchScreen = SearchScreen;
window.btn = btn;
