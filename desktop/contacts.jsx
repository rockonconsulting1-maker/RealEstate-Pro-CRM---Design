// contacts.jsx — Desktop Contacts / Directory
const CC_I = window.Icon;
const { Avatar: CCAv } = window.RC;

const CC_DATA = [
  { name: 'Marcus & Priya Chen', role: 'buyer',   phone: '+1 (416) 555-0142', email: 'marcus.chen@example.com',  source: 'Active client',   tags: ['buyer','pre-approved','active']  },
  { name: 'Aya Fujimori',        role: 'seller',  phone: '+1 (416) 555-0189', email: 'aya.fujimori@example.com', source: 'Active client',   tags: ['seller','listing','active']      },
  { name: 'Sarah Okonkwo',       role: 'lead',    phone: '+1 (416) 555-0101', email: 'sarah.o@example.com',      source: 'Zillow inquiry',  tags: ['lead','buyer']                   },
  { name: 'Tran Household',      role: 'buyer',   phone: '+1 (905) 555-0110', email: 'tran@example.com',         source: 'Referral',        tags: ['buyer','past']                   },
  { name: 'Navarro Family',      role: 'seller',  phone: '+1 (416) 555-0177', email: 'navarro@example.com',      source: 'Referral',        tags: ['seller','past']                  },
  { name: 'Baraka Waweru',       role: 'vendor',  phone: '+1 (647) 555-0198', email: 'baraka@inspects.ca',       source: 'Vendor · Inspector', tags: ['inspector','preferred']       },
  { name: 'Lena Hoffman',        role: 'vendor',  phone: '+1 (647) 555-0161', email: 'lena@staging.ca',          source: 'Vendor · Stager', tags: ['stager','preferred']             },
  { name: 'Kwame Boateng',       role: 'partner', phone: '+1 (416) 555-0155', email: 'kwame@mortgages.ca',       source: 'Mortgage broker', tags: ['mortgage','scotia']              },
  { name: 'Devon Park',          role: 'partner', phone: '+1 (416) 555-0133', email: 'devon@royallepage.ca',     source: 'Co-op agent',     tags: ['agent','royallepage']            },
];

const ROLE_TONE = { buyer: 'info', seller: '', lead: 'warn', vendor: '', partner: '' };

function Contacts({ goto }) {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [sel, setSel]       = React.useState(null);
  const [contactTab, setContactTab] = React.useState('Overview');
  const ConvTab = window.RC.ConversationsTab;
  React.useEffect(() => { setContactTab('Overview'); }, [sel]);

  const FILTERS = [
    { id: 'all',     label: `All · ${CC_DATA.length}` },
    { id: 'buyer',   label: 'Buyers' },
    { id: 'seller',  label: 'Sellers' },
    { id: 'lead',    label: 'Leads' },
    { id: 'vendor',  label: 'Vendors' },
    { id: 'partner', label: 'Partners' },
  ];

  const visible = CC_DATA.filter(c => {
    const okRole = filter === 'all' || c.role === filter;
    const q      = search.toLowerCase();
    const okQ    = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.tags.some(t => t.includes(q));
    return okRole && okQ;
  });

  const cur = sel ? CC_DATA.find(c => c.name === sel) : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: cur ? '320px 1fr' : '1fr', gap: 16, alignItems: 'start' }}>

      {/* ── List panel ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        <div style={{ display: 'flex', gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, tag…"
            style={{ flex: 1, padding: '0 10px', height: 34, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font)', fontSize: 13, background: 'var(--bg-sunk)', color: 'var(--ink)', outline: 'none' }} />
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('client')}>
            <CC_I name="plus" size={13} color="#fff" />Add contact
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, fontFamily: 'var(--font)', border: '1px solid ' + (filter === f.id ? 'var(--brand)' : 'var(--border)'), background: filter === f.id ? 'var(--brand-soft)' : 'transparent', color: filter === f.id ? 'var(--brand-ink)' : 'var(--ink-3)', cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          {visible.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>No contacts found</div>
          )}
          {visible.map((c, i) => (
            <div key={i} className="lrow"
              style={{ gridTemplateColumns: 'auto 1fr auto', cursor: 'pointer', background: sel === c.name ? 'var(--brand-soft)' : undefined }}
              onClick={() => setSel(c.name === sel ? null : c.name)}>
              <CCAv name={c.name} role={c.role} size={32} />
              <div>
                <div className="lname">{c.name}</div>
                <div className="lsub">{c.source} · {c.phone}</div>
              </div>
              <span className={'badge ' + (ROLE_TONE[c.role] || '')} style={{ textTransform: 'capitalize' }}>{c.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Detail panel ────────────────────────────────────────── */}
      {cur && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <div className="tabs">
            {['Overview', 'Conversations'].map(t => (
              <button key={t} data-active={contactTab === t} onClick={() => setContactTab(t)}>{t}</button>
            ))}
          </div>

          {contactTab === 'Overview' && (<>
            <div className="card card-pad">
              <div className="flex items-center gap-3">
                <CCAv name={cur.name} role={cur.role} size={52} />
              <div className="flex-1">
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{cur.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={'role ' + (cur.role === 'seller' ? 'seller' : cur.role === 'buyer' ? 'buyer' : '')} style={{ textTransform: 'capitalize' }}>
                    <span className="dot" style={{ background: cur.role === 'seller' ? 'oklch(0.58 0.17 310)' : cur.role === 'buyer' ? 'oklch(0.62 0.14 254)' : 'var(--ink-3)' }} />
                    {cur.role}
                  </span>
                  <span className="meta">· {cur.source}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
              {[['Email', cur.email], ['Phone', cur.phone], ['Source', cur.source], ['Tags', cur.tags.join(', ')]].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '9px 11px' }}>
                  <div className="meta">{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, color: 'var(--ink)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2" style={{ marginTop: 12 }}>
              <button className="btn primary sm" style={{ flex: 1 }}><CC_I name="phone" size={13} color="#fff" />Call</button>
              <button className="btn sm" style={{ flex: 1 }}><CC_I name="message" size={13} />Text</button>
              <button className="btn sm" style={{ flex: 1 }} onClick={() => window.RC.openModal?.('note')}><CC_I name="note" size={13} />Note</button>
              <button className="btn sm" style={{ flex: 1 }}><CC_I name="calendar" size={13} />Book</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h2>Recent activity</h2><div style={{ flex: 1 }} /><span className="meta tnum">3 events</span></div>
            <div className="tline">
              {[
                { t: 'Today',  who: cur.name, body: 'Phone call — 8 min.',       kind: 'call'  },
                { t: 'Apr 15', who: 'You',    body: 'Note added — deal update.', kind: 'note'  },
                { t: 'Apr 12', who: 'You',    body: 'Meeting scheduled.',        kind: 'stage' },
              ].map((it, i) => (
                <div key={i} className="tline-row">
                  <div className="tline-t tnum">{it.t}</div>
                  <div className="tline-rail"><div className={'pip ' + (it.kind === 'call' ? 'success' : it.kind === 'note' ? 'brand' : 'warn')} /></div>
                  <div className="tline-text"><div className="who">{it.who}</div><div className="body">{it.body}</div></div>
                </div>
              ))}
            </div>
          </div>

          {(cur.role === 'buyer' || cur.role === 'lead') && (
              <button className="btn sm" style={{ alignSelf: 'flex-start' }} onClick={() => goto('clientDetail')}>
                <CC_I name="briefcase" size={13} />Open client record →
              </button>
            )}
            {cur.role === 'seller' && (
              <button className="btn sm" style={{ alignSelf: 'flex-start' }} onClick={() => goto('clientDetailSeller')}>
                <CC_I name="briefcase" size={13} />Open seller record →
              </button>
            )}
          </>)}

          {contactTab === 'Conversations' && ConvTab && <ConvTab name={cur.name} goto={goto} />}
        </div>
      )}
    </div>
  );
}

window.RC.Contacts = Contacts;
