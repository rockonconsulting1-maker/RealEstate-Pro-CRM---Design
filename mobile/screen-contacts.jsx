// screen-contacts.jsx — Mobile Contacts Directory + Contact Detail

const CONTACTS_DATA = [
  { name: 'Marcus & Priya Chen', initials: 'MC', role: 'buyer',   sub: 'Active buyer client',        phone: '+1 (416) 555-0142', email: 'marcus.chen@example.com',  source: 'Referral',        tags: ['buyer','pre-approved','active'] },
  { name: 'Aya Fujimori',        initials: 'AF', role: 'seller',  sub: 'Active seller client',       phone: '+1 (416) 555-0189', email: 'aya.fujimori@example.com', source: 'Active client',   tags: ['seller','listing','active']    },
  { name: 'Sarah Okonkwo',       initials: 'SO', role: 'lead',    sub: 'Lead · Zillow inquiry',      phone: '+1 (416) 555-0101', email: 'sarah.o@example.com',      source: 'Zillow inquiry',  tags: ['lead','buyer']                 },
  { name: 'Tran Household',      initials: 'TH', role: 'buyer',   sub: 'Past buyer client',          phone: '+1 (905) 555-0110', email: 'tran@example.com',         source: 'Referral',        tags: ['buyer','past']                 },
  { name: 'Navarro Family',      initials: 'NF', role: 'seller',  sub: 'Past seller client',         phone: '+1 (416) 555-0177', email: 'navarro@example.com',      source: 'Referral',        tags: ['seller','past']                },
  { name: 'Baraka Waweru',       initials: 'BW', role: 'vendor',  sub: 'Vendor · Inspector',         phone: '+1 (647) 555-0198', email: 'baraka@inspects.ca',       source: 'Preferred vendor',tags: ['inspector','preferred']        },
  { name: 'Lena Hoffman',        initials: 'LH', role: 'vendor',  sub: 'Vendor · Stager',            phone: '+1 (647) 555-0161', email: 'lena@staging.ca',          source: 'Preferred vendor',tags: ['stager','preferred']           },
  { name: 'Kwame Boateng',       initials: 'KB', role: 'partner', sub: 'Mortgage broker · Scotia',   phone: '+1 (416) 555-0155', email: 'kwame@mortgages.ca',       source: 'Partner',         tags: ['mortgage','scotia']            },
  { name: 'Devon Park',          initials: 'DP', role: 'partner', sub: 'Co-op agent · Royal LePage', phone: '+1 (416) 555-0133', email: 'devon@royallepage.ca',     source: 'Partner',         tags: ['agent','royallepage']          },
];

const ROLE_COLOR = {
  buyer:   'oklch(0.62 0.14 254)',
  seller:  'oklch(0.58 0.17 310)',
  lead:    'oklch(0.60 0.17 70)',
  vendor:  'var(--ink-3)',
  partner: 'var(--ink-3)',
};
const ROLE_BG = {
  buyer:   'oklch(0.93 0.04 254)',
  seller:  'oklch(0.93 0.04 310)',
  lead:    'oklch(0.95 0.06 70)',
  vendor:  'var(--bg-deep)',
  partner: 'var(--bg-deep)',
};

// ── Directory list ───────────────────────────────────────────────────────────
function ContactsDirectory({ goto }) {
  const I = window.Icon;
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const FILTERS = [
    { id: 'all',     label: 'All'      },
    { id: 'buyer',   label: 'Buyers'   },
    { id: 'seller',  label: 'Sellers'  },
    { id: 'lead',    label: 'Leads'    },
    { id: 'vendor',  label: 'Vendors'  },
    { id: 'partner', label: 'Partners' },
  ];

  const visible = CONTACTS_DATA.filter(c => {
    const okRole = filter === 'all' || c.role === filter;
    const q = search.toLowerCase();
    const okQ = !q || c.name.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q) || c.tags.some(t => t.includes(q));
    return okRole && okQ;
  });

  // Alphabetical grouping
  const groups = [];
  visible.forEach(c => {
    const letter = c.name[0].toUpperCase();
    const g = groups.find(x => x.letter === letter);
    if (g) g.items.push(c);
    else groups.push({ letter, items: [c] });
  });

  const openDetail = (c) => { window._selectedContact = c; goto('contactDetail'); };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 52, borderBottom: '1px solid var(--border-2)', background: 'var(--surface)' }}>
        <h1 style={{ flex: 1, margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>Contacts</h1>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', background: 'var(--bg-sunk)', borderRadius: 999, padding: '3px 8px' }}>{CONTACTS_DATA.length}</span>
        <button className="icon-btn" aria-label="add"><I name="plus" size={18} /></button>
      </div>

      <div style={{ padding: '12px 16px 8px' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-sunk)', borderRadius: 10, padding: '9px 12px', marginBottom: 10 }}>
          <I name="search" size={15} color="var(--ink-3)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Name, role, tag…"
            style={{ flex: 1, border: 0, background: 'transparent', fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
          )}
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flexShrink: 0, padding: '5px 13px', borderRadius: 999, fontSize: 13,
              fontWeight: 500, fontFamily: 'var(--font)', border: '1.5px solid', cursor: 'pointer',
              borderColor: filter === f.id ? 'var(--brand)' : 'var(--border)',
              background:   filter === f.id ? 'var(--brand)' : 'transparent',
              color:        filter === f.id ? '#fff' : 'var(--ink-3)',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '0 16px 100px' }}>
        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-3)', fontSize: 14 }}>No contacts match</div>
        )}
        {groups.map(g => (
          <div key={g.letter}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: '0.08em', padding: '10px 0 4px' }}>{g.letter}</div>
            {g.items.map((c, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border-2)', cursor: 'pointer' }}
                onClick={() => openDetail(c)}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 999, flexShrink: 0,
                  background: ROLE_BG[c.role] || 'var(--bg-deep)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: ROLE_COLOR[c.role],
                }}>{c.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                  <div className="row-sub">{c.sub}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button className="icon-btn" onClick={e => e.stopPropagation()}><I name="phone" size={15} /></button>
                  <button className="icon-btn" onClick={e => e.stopPropagation()}><I name="message" size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Contact detail ───────────────────────────────────────────────────────────
function ContactDetail({ goto }) {
  const I = window.Icon;
  const c = window._selectedContact;
  const [tab, setTab] = React.useState('Overview');

  if (!c) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div className="meta">No contact selected.</div>
        <button onClick={() => goto('contacts')} style={{ marginTop: 12, padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'transparent', fontFamily: 'var(--font)', cursor: 'pointer' }}>← Back to Contacts</button>
      </div>
    );
  }

  const roleLabel = c.role.charAt(0).toUpperCase() + c.role.slice(1);

  return (
    <>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 52, borderBottom: '1px solid var(--border-2)', background: 'var(--surface)' }}>
        <button className="icon-btn" onClick={() => goto('contacts')}>
          <I name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <div style={{ flex: 1, fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', textAlign: 'center' }}>Contact</div>
        <button className="icon-btn"><I name="more" size={16} /></button>
      </div>

      {/* Avatar + name hero */}
      <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 999, flexShrink: 0,
          background: ROLE_BG[c.role] || 'var(--bg-deep)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 700, color: ROLE_COLOR[c.role],
        }}>{c.initials}</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em' }}>{c.name}</div>
          <div className="row-sub" style={{ marginTop: 3 }}>{c.sub}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="badge" style={{ textTransform: 'capitalize' }}>{roleLabel}</span>
            <span className="badge">{c.source}</span>
          </div>
        </div>
      </div>

      {/* Quick action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '12px 16px', borderBottom: '1px solid var(--border-2)' }}>
        {[
          { icon: 'phone',    label: 'Call'  },
          { icon: 'message',  label: 'Text'  },
          { icon: 'note',     label: 'Note'  },
          { icon: 'calendar', label: 'Book'  },
        ].map(({ icon, label }) => (
          <button key={label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            padding: '10px 4px', border: '1px solid var(--border)', borderRadius: 10,
            background: 'var(--surface)', cursor: 'pointer', fontFamily: 'var(--font)',
          }}>
            <I name={icon} size={18} color="var(--brand)" />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-2)' }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border-2)' }}>
        <div style={{ display: 'flex', padding: '0 16px' }}>
          {['Overview', 'Activity', 'Notes'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              border: 0, background: 'transparent', padding: '10px 0', marginRight: 20,
              fontFamily: 'var(--font)', fontSize: 14, cursor: 'pointer',
              fontWeight: tab === t ? 600 : 500,
              color: tab === t ? 'var(--brand)' : 'var(--ink-3)',
              borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {tab === 'Overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Contact info card */}
            <div className="card card-pad">
              <div className="section-h" style={{ padding: 0, marginBottom: 10 }}><h2>Contact info</h2></div>
              {[
                ['Phone',  c.phone],
                ['Email',  c.email],
                ['Source', c.source],
                ['Tags',   c.tags.join(', ')],
              ].map(([k, v], idx, arr) => (
                <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: idx < arr.length - 1 ? '1px solid var(--border-2)' : 0 }}>
                  <div style={{ width: 68, fontSize: 13, color: 'var(--ink-3)', flexShrink: 0 }}>{k}</div>
                  <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)', fontWeight: 500, wordBreak: 'break-word' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Open record links */}
            {(c.role === 'buyer' || c.role === 'lead') && (
              <button
                onClick={() => goto('clientDetailBuyer')}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-2)', fontWeight: 500, textAlign: 'left' }}
              >
                <I name="briefcase" size={16} color="var(--brand)" />
                Open buyer record
                <div style={{ flex: 1 }} />
                <I name="chevron" size={14} color="var(--ink-3)" />
              </button>
            )}
            {c.role === 'seller' && (
              <button
                onClick={() => goto('clientDetailSeller')}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-2)', fontWeight: 500, textAlign: 'left' }}
              >
                <I name="briefcase" size={16} color="var(--brand)" />
                Open seller record
                <div style={{ flex: 1 }} />
                <I name="chevron" size={14} color="var(--ink-3)" />
              </button>
            )}
          </div>
        )}

        {tab === 'Activity' && (
          <div className="card card-pad">
            {[
              { t: 'Today',  kind: 'call',  text: 'Phone call — 8 min. Confirmed 10:30 showing.' },
              { t: 'Apr 15', kind: 'note',  text: 'Note added — deal update.' },
              { t: 'Apr 12', kind: 'stage', text: 'Meeting scheduled.' },
              { t: 'Apr 10', kind: 'appt',  text: 'Showing confirmed at 128 Balsam Ave.' },
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

        {tab === 'Notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { date: 'Today',  text: 'Strong interest in Beach properties. Pre-approved to $1.3M. Wants detached, min 3 bed.' },
              { date: 'Apr 13', text: 'Showed 3 properties — 128 Balsam was the favourite. Following up this week.' },
              { date: 'Apr 10', text: 'Initial buyer consult complete. Looking to close by June.' },
            ].map((n, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="meta tnum" style={{ marginBottom: 6 }}>{n.date}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55 }}>{n.text}</div>
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Add note</button>
          </div>
        )}
      </div>

      <div style={{ height: 100 }} />
    </>
  );
}

window.ContactsDirectory = ContactsDirectory;
window.ContactDetail = ContactDetail;
