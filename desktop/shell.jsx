// shell.jsx — Desktop sidebar, topbar, icons. Uses window.MOCK + window.Icon from mobile/data.jsx
const M = window.MOCK;
const I = window.Icon;

// ---------- Money / Countdown / Avatar / Spark ----------
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
  else text = Math.floor(minutes / 1440) + 'd';
  return <span className={'countdown ' + tone}>{text}</span>;
}
function Avatar({ name, role, size = 30 }) {
  const initials = (name || '').split(' ').filter(Boolean).map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const cls = role === 'seller' ? 'av-seller' : role === 'past' ? 'av-past' : role === 'vendor' ? 'av-vendor' : role === 'soi' ? 'av-soi' : 'av-buyer';
  const fz = size <= 30 ? 11.5 : size <= 40 ? 13 : 18;
  return <div className={'avatar ' + cls} style={{ width: size, height: size, fontSize: fz }}>{initials}</div>;
}
function Spark({ data, color = 'var(--brand)' }) {
  const w = 110, h = 28;
  const max = Math.max(...data), min = Math.min(...data);
  const span = (max - min) || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 4) - 2;
    return x + ',' + y;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="spark" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

// ---------- Search corpus ----------
function buildCorpus() {
  return [
    ...M.newLeads.map(l => ({ type: 'Lead',     name: l.name,  sub: l.stage + ' · ' + l.budget,          icon: 'users',     screen: 'leads'      })),
    { type: 'Client',   name: 'Marcus & Priya Chen', sub: 'Buyer · Offer submitted',                       icon: 'briefcase', screen: 'clientDetail' },
    { type: 'Client',   name: 'Tran Household',       sub: 'Buyer · Under contract',                        icon: 'briefcase', screen: 'clientDetail' },
    { type: 'Client',   name: 'Aya Fujimori',          sub: 'Seller · 128 Balsam Ave',                      icon: 'briefcase', screen: 'clientDetail' },
    { type: 'Client',   name: 'Jules & Rory',           sub: 'Buyer · Needs analysis',                       icon: 'briefcase', screen: 'clientDetail' },
    ...M.properties.map(p => ({ type: 'Property', name: p.addr, sub: p.city + ' · $' + p.price.toLocaleString(), icon: 'map', screen: 'propDetail' })),
    ...M.offers.map(o => ({ type: 'Offer', name: o.addr, sub: o.client + ' · ' + o.status, icon: 'doc', screen: 'offerDetail' })),
  ];
}

// ---------- Search Dropdown ----------
function SearchDropdown({ q, onClose }) {
  const corpus = buildCorpus();
  const lq = q.toLowerCase().trim();
  const filtered = lq ? corpus.filter(r => (r.name + ' ' + r.sub).toLowerCase().includes(lq)) : [];
  const groups = {};
  filtered.forEach(r => { (groups[r.type] = groups[r.type] || []).push(r); });
  const ORDER = ['Lead', 'Client', 'Property', 'Offer'];
  const nav = sc => { window.RC.goto?.(sc); onClose(); };

  const hoverRow = {
    onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-sunk)',
    onMouseLeave: e => e.currentTarget.style.background = '',
  };

  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 6px)', right: 0,
      width: 460, background: 'var(--surface)',
      borderRadius: 12, border: '1px solid var(--border)',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,.08), 0 20px 48px -8px rgba(0,0,0,.22)',
      zIndex: 400, overflow: 'hidden',
    }}>
      {!lq ? (
        <>
          {/* Recent */}
          <div style={{ padding: '10px 14px 4px', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-3)' }}>Recent</div>
          {[['128 Balsam Ave', 'Property'], ['Marcus Chen', 'Client'], ['Sorauren offer', 'Offer']].map(([label, type], i) => (
            <div key={i} {...hoverRow} onClick={() => nav('propDetail')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', cursor: 'pointer' }}>
              <I name="search" size={13} color="var(--ink-4)" />
              <span style={{ flex: 1, fontSize: 13, color: 'var(--ink-2)' }}>{label}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-4)', fontFamily: 'var(--mono)' }}>{type}</span>
            </div>
          ))}
          {/* Jump to */}
          <div style={{ padding: '8px 14px 4px', borderTop: '1px solid var(--border-2)', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-3)' }}>Jump to</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: '4px 8px 10px' }}>
            {[['leads','Leads','users'],['clients','Clients','briefcase'],['myListings','My Listings','map'],['mlsProps','Properties','search'],['offers','Offers','doc'],['tasks','Tasks','check'],['calendar','Calendar','calendar']].map(([sc, lbl, ico]) => (
              <div key={sc} onClick={() => nav(sc)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--ink-2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-sunk)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <I name={ico} size={13} color="var(--ink-3)" />
                <span>{lbl}</span>
              </div>
            ))}
          </div>
        </>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '28px 14px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
          No results for <strong style={{ color: 'var(--ink-2)' }}>"{q}"</strong>
        </div>
      ) : (
        <div style={{ maxHeight: 440, overflowY: 'auto' }}>
          {ORDER.filter(t => groups[t]).map((type, ti) => (
            <div key={type}>
              <div style={{
                padding: (ti === 0 ? '10px' : '8px') + ' 14px 4px',
                borderTop: ti > 0 ? '1px solid var(--border-2)' : 'none',
                fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--ink-3)',
              }}>{type}s</div>
              {groups[type].map((r, i) => (
                <div key={i} {...hoverRow} onClick={() => nav(r.screen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <I name={r.icon} size={14} color="var(--ink-3)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>{r.sub}</div>
                  </div>
                  <I name="chevron" size={13} color="var(--ink-4)" />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Profile / agent-switcher Popover ----------
const WORKSPACE_AGENTS = [
  { name: 'Jordan Reyes',   brokerage: 'Royal LePage', role: 'buyer',  status: 'Online'  },
  { name: 'Sofia Castillo', brokerage: 'Royal LePage', role: 'seller', status: 'Away'    },
  { name: 'Demo workspace', brokerage: 'Sandbox',      role: 'soi',    status: 'Offline' },
];

function ProfilePopover({ onClose, onSettings }) {
  const [activeWS, setActiveWS] = React.useState(WORKSPACE_AGENTS[0].name);
  const statusDot = { Online: 'var(--success)', Away: 'oklch(0.72 0.155 70)', Offline: 'var(--ink-4)' };

  React.useEffect(() => {
    const h = e => {
      if (!e.target.closest('[data-profile-pop]') && !e.target.closest('[data-profile-btn]')) onClose();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', h), 80);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h); };
  }, [onClose]);

  return (
    <div data-profile-pop="1" style={{
      position: 'absolute', bottom: 'calc(100% + 8px)', left: 0,
      width: 224, background: 'var(--surface)',
      borderRadius: 12, border: '1px solid var(--border)',
      boxShadow: '0 -2px 8px -2px rgba(0,0,0,.06), 0 -16px 40px -4px rgba(0,0,0,.18)',
      zIndex: 400, overflow: 'hidden',
    }}>
      {/* Identity card */}
      <div style={{ padding: '13px 14px 11px', borderBottom: '1px solid var(--border-2)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar name="Jordan Reyes" role="buyer" size={40} />
            <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--surface)' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Jordan Reyes</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.5 }}>Royal LePage<br />Lic. ON-4812200</div>
          </div>
        </div>
      </div>

      {/* Workspace switcher */}
      <div style={{ padding: '8px 8px 6px', borderBottom: '1px solid var(--border-2)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-4)', padding: '2px 6px 5px' }}>Switch workspace</div>
        {WORKSPACE_AGENTS.map(a => {
          const on = a.name === activeWS;
          return (
            <div key={a.name} onClick={() => setActiveWS(a.name)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 7, cursor: 'pointer', background: on ? 'var(--brand-soft)' : '', transition: 'background 100ms' }}
              onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--bg-sunk)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = on ? 'var(--brand-soft)' : ''; }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Avatar name={a.name} role={a.role} size={24} />
                <div style={{ position: 'absolute', bottom: 0, right: -1, width: 7, height: 7, borderRadius: '50%', background: statusDot[a.status], border: '1.5px solid var(--surface)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: on ? 600 : 500, color: on ? 'var(--brand-ink)' : 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{a.brokerage}</div>
              </div>
              {on && <I name="check" size={13} color="var(--brand)" />}
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div style={{ padding: '6px 8px 8px' }}>
        <div onClick={() => { onSettings?.(); onClose(); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: 'var(--ink-2)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-sunk)'}
          onMouseLeave={e => e.currentTarget.style.background = ''}>
          <I name="sliders" size={14} color="var(--ink-3)" />
          Settings &amp; preferences
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: 'var(--destructive)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'oklch(0.97 0.01 25)'}
          onMouseLeave={e => e.currentTarget.style.background = ''}>
          <I name="arrowRight" size={14} color="var(--destructive)" />
          Sign out
        </div>
      </div>
    </div>
  );
}

// ---------- Sidebar ----------
const NAV_GROUPS = [
  {
    items: [
      { id: 'dash', label: 'Dashboard', icon: 'home' },
    ]
  },
  {
    label: 'Pipeline',
    items: [
      { id: 'leads',    label: 'Leads',    icon: 'users',     count: 28 },
      { id: 'clients',  label: 'Clients',  icon: 'briefcase', count: 11 },
      { id: 'contacts', label: 'Contacts', icon: 'contact'               },
    ]
  },
  {
    label: 'Listings',
    items: [
      { id: 'myListings', label: 'Listings',   icon: 'map',    count: 14 },
      { id: 'offers',     label: 'Offers',     icon: 'doc',    count: 5  },
      { id: 'mlsProps',   label: 'Properties', icon: 'search'             },
    ]
  },
  {
    label: 'Communicate',
    items: [
      { id: 'conversations', label: 'Conversations', icon: 'message', count: 3 },
    ]
  },
  {
    label: 'Manage',
    items: [
      { id: 'calendar',  label: 'Calendar',  icon: 'calendar'            },
      { id: 'tasks',     label: 'Tasks',     icon: 'check',   count: 7  },
      { id: 'notes',     label: 'Notes',     icon: 'note'                },
      { id: 'documents', label: 'Documents', icon: 'doc'                 },
    ]
  },
  {
    label: 'Insights',
    items: [
      { id: 'reports', label: 'Reports', icon: 'sliders' },
      { id: 'team',    label: 'Teams',   icon: 'contact' },
    ]
  },
];

function Sidebar({ screen, setScreen }) {
  const [profileOpen, setProfileOpen] = React.useState(false);

  const isActive = (id) => {
    if (screen === id) return true;
    if (id === 'leads'      && (screen === 'leadsBoard' || screen === 'leadDetail')) return true;
    if (id === 'clients'    && screen.startsWith('client')) return true;
    if (id === 'contacts'   && screen.startsWith('contact')) return true;
    if (id === 'myListings' && screen === 'propDetail') return true;
    if (id === 'offers'     && screen === 'offerDetail') return true;
    if (id === 'tasks'      && screen === 'taskDetail') return true;
    return false;
  };

  return (
    <aside className="side">
      <div className="brand">
        <div className="brand-mark">RC</div>
        <div>
          <div className="brand-name">Real CRM</div>
          <div className="brand-meta">Reyes Realty</div>
        </div>
      </div>

      {NAV_GROUPS.map((group, gi) => (
        <React.Fragment key={gi}>
          {group.label && (
            <div className="side-section" style={{ marginTop: gi > 0 ? 4 : 0 }}>{group.label}</div>
          )}
          {group.items.map(n => (
            <div key={n.id} className="nav"
              data-active={isActive(n.id)}
              onClick={() => setScreen(n.id)}>
              <I name={n.icon} size={18} />
              <span>{n.label}</span>
              {n.count !== undefined && <span className="nav-count">{n.count}</span>}
            </div>
          ))}
        </React.Fragment>
      ))}

      <div className="side-foot" style={{ position: 'relative' }}>
        {profileOpen && (
          <ProfilePopover
            onClose={() => setProfileOpen(false)}
            onSettings={() => setScreen('settings')}
          />
        )}
        <Avatar name={M.agent.name} role="buyer" size={32} />
        <div className="who" style={{ cursor: 'pointer', flex: 1 }} onClick={() => setProfileOpen(p => !p)}>
          <div className="who-name">{M.agent.name}</div>
          <div className="who-meta">Online · Royal LePage</div>
        </div>
        <button className="icon-btn" data-profile-btn="1" style={{ width: 28, height: 28 }} aria-label="profile options" onClick={() => setProfileOpen(p => !p)}>
          <I name="more" size={14} />
        </button>
      </div>
    </aside>
  );
}

// ---------- Topbar ----------
function Topbar({ screen }) {
  const [q, setQ] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const inputRef = React.useRef(null);
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQ('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  React.useEffect(() => {
    if (!searchOpen) return;
    const h = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setSearchOpen(false);
        setQ('');
      }
    };
    const t = setTimeout(() => document.addEventListener('mousedown', h), 80);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h); };
  }, [searchOpen]);

  const labels = {
    dash: 'Dashboard',
    leads: 'Leads', leadsBoard: 'Leads · Kanban', leadDetail: 'Lead detail',
    clients: 'Clients', clientDetail: 'Client detail',
    contacts: 'Contacts',
    myListings: 'Listings', propDetail: 'Listing detail',
    mlsProps: 'Properties (MLS)',
    offers: 'Offers', offerDetail: 'Offer detail',
    conversations: 'Conversations',
    calendar: 'Calendar', tasks: 'Tasks', notes: 'Notes', documents: 'Documents',
    reports: 'Reports', team: 'Team', settings: 'Settings',
  };

  return (
    <header className="topbar">
      <div className="topbar-crumbs">
        <span>RC CRM</span>
        <span className="sep">/</span>
        <span className="now">{labels[screen] || screen}</span>
      </div>
      <div style={{ flex: 1 }} />
      <div ref={wrapRef} style={{ position: 'relative' }}>
        <div className="cmd" onClick={() => { inputRef.current?.focus(); setSearchOpen(true); }}>
          <I name="search" size={14} />
          <input
            ref={inputRef}
            placeholder="Search clients, properties, offers…"
            value={q}
            onChange={e => { setQ(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
          />
          {!searchOpen && <span className="kbd">⌘K</span>}
        </div>
        {searchOpen && (
          <SearchDropdown q={q} onClose={() => { setSearchOpen(false); setQ(''); }} />
        )}
      </div>
      <button className="btn ghost sm"><I name="filter" size={14} />Saved views</button>
      <button className="icon-btn" aria-label="notifications" onClick={() => window.RC.toggleNotif?.()}>
        <I name="bell" size={16} /><span className="dot-badge" />
      </button>
      <button className="btn primary" onClick={() => window.RC.openModal?.('quickAdd')}><I name="plus" size={14} color="#fff" />New</button>
    </header>
  );
}

window.RC = window.RC || {};
Object.assign(window.RC, { Sidebar, Topbar, Money, Countdown, Avatar, Spark });
