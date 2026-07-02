// modals.jsx — Creation modals for Desktop RC CRM
const MD_I = window.Icon;

// ─── Base Modal ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width = 480 }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'oklch(0.10 0.01 260 / 0.38)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'var(--surface)', borderRadius: 14, width, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 60px -8px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 14px', borderBottom: '1px solid var(--border-2)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', flex: 1, color: 'var(--ink)' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 0, cursor: 'pointer', padding: '4px 5px', borderRadius: 6, color: 'var(--ink-3)', display: 'flex', lineHeight: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: '18px 20px 20px' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────
function MField({ label, children, hint, full }) {
  return (
    <div style={{ marginBottom: 14, gridColumn: full ? '1 / -1' : undefined }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.055em', marginBottom: 5 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

const inp = { width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'var(--font)', fontSize: 13.5, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', letterSpacing: '-0.003em' };
const sel = { ...inp, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center', paddingRight: 26 };
const two = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' };
const foot = { display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border-2)', paddingTop: 16, marginTop: 4 };

// ─── QUICK ADD ───────────────────────────────────────────────────────────────
function QuickAddModal({ onClose, onSelect }) {
  const types = [
    { id: 'lead',     icon: 'users',    label: 'New lead',    sub: 'Top of funnel' },
    { id: 'client',   icon: 'briefcase',label: 'New client',  sub: 'Under representation' },
    { id: 'property', icon: 'home',     label: 'New listing', sub: 'Add to portfolio' },
    { id: 'offer',    icon: 'coins',    label: 'New offer',   sub: 'Attach to property' },
    { id: 'task',     icon: 'check',    label: 'New task',    sub: 'Add to inbox' },
    { id: 'note',     icon: 'note',     label: 'New note',    sub: 'Quick capture' },
    { id: 'event',    icon: 'calendar', label: 'New event',   sub: 'Add to calendar' },
  ];
  return (
    <Modal title="Quick add" onClose={onClose} width={420}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {types.map(t => (
          <button key={t.id} onClick={() => onSelect(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font)', transition: 'background 80ms' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-soft)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
          >
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MD_I name={t.icon} size={14} color="var(--ink-2)" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{t.label}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{t.sub}</div>
            </div>
          </button>
        ))}
      </div>
      <div style={foot}><button className="btn sm" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

// ─── NEW LEAD ─────────────────────────────────────────────────────────────────
function NewLeadModal({ onClose }) {
  const [role, setRole] = React.useState('buyer');
  const [temp, setTemp] = React.useState('Warm');
  return (
    <Modal title="New lead" onClose={onClose} width={540}>
      <div style={two}>
        <MField label="Full name" full>
          <input style={inp} placeholder="First and last name" autoFocus />
        </MField>
        <MField label="Role">
          <div className="seg" style={{ width: '100%' }}>
            {['buyer','seller','investor'].map(r => (
              <button key={r} data-active={role === r} onClick={() => setRole(r)} style={{ flex: 1, justifyContent: 'center', textTransform: 'capitalize' }}>{r}</button>
            ))}
          </div>
        </MField>
        <MField label="Temperature">
          <div style={{ display: 'flex', gap: 6 }}>
            {['Hot','Warm','Cold'].map(t => (
              <button key={t} onClick={() => setTemp(t)} style={{ flex: 1, padding: '7px 0', borderRadius: 6, border: '1px solid ' + (temp === t ? 'var(--border)' : 'var(--border-2)'), background: temp === t ? (t === 'Hot' ? 'oklch(0.97 0.03 25)' : t === 'Warm' ? 'oklch(0.97 0.04 70)' : 'var(--bg-sunk)') : 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: temp === t ? 600 : 400, color: temp === t ? (t === 'Hot' ? 'oklch(0.48 0.18 25)' : t === 'Warm' ? 'oklch(0.50 0.16 70)' : 'var(--ink-2)') : 'var(--ink-3)' }}>{t}</button>
            ))}
          </div>
        </MField>
        <MField label="Phone">
          <input style={inp} placeholder="+1 (416) 555-0100" type="tel" />
        </MField>
        <MField label="Email">
          <input style={inp} placeholder="email@example.com" type="email" />
        </MField>
        <MField label={role === 'seller' ? 'Target area / address' : 'Budget range'}>
          <input style={inp} placeholder={role === 'seller' ? 'e.g. Leslieville' : 'e.g. $900k–$1.1M'} />
        </MField>
        <MField label="Source">
          <select style={sel}>{['Referral','Zillow / Realtor.ca','Open house','Social media','Cold outreach','Other'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Notes" hint="Optional — visible in agent notes field" full>
          <textarea style={{ ...inp, resize: 'none', height: 58, lineHeight: 1.5 }} placeholder="Initial notes…" />
        </MField>
      </div>
      <div style={foot}>
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm"><MD_I name="plus" size={13} color="#fff" />Add lead</button>
      </div>
    </Modal>
  );
}

// ─── NEW CLIENT ───────────────────────────────────────────────────────────────
function NewClientModal({ onClose }) {
  const [role, setRole] = React.useState('buyer');
  return (
    <Modal title="New client" onClose={onClose} width={540}>
      <div style={two}>
        <MField label="Full name" full>
          <input style={inp} placeholder="e.g. Marcus & Priya Chen" autoFocus />
        </MField>
        <MField label="Type">
          <div className="seg" style={{ width: '100%' }}>
            <button data-active={role === 'buyer'} onClick={() => setRole('buyer')} style={{ flex: 1, justifyContent: 'center' }}>Buyer</button>
            <button data-active={role === 'seller'} onClick={() => setRole('seller')} style={{ flex: 1, justifyContent: 'center' }}>Seller</button>
          </div>
        </MField>
        <MField label="Stage">
          <select style={sel}>
            {(role === 'buyer'
              ? ['Needs Analysis','Property Search','Offer Submitted','Under Contract','Closed']
              : ['Pre-Listing','Agreement Signed','Active on Market','Offer Review','Under Contract','Closed']
            ).map(s => <option key={s}>{s}</option>)}
          </select>
        </MField>
        <MField label="Phone">
          <input style={inp} placeholder="+1 (416) 555-0100" type="tel" />
        </MField>
        <MField label="Email">
          <input style={inp} placeholder="email@example.com" type="email" />
        </MField>
        {role === 'buyer' ? (
          <>
            <MField label="Budget range"><input style={inp} placeholder="e.g. $1.1–1.3M" /></MField>
            <MField label="Pre-approval"><input style={inp} placeholder="Lender · amount" /></MField>
          </>
        ) : (
          <>
            <MField label="Property address"><input style={inp} placeholder="Street address" /></MField>
            <MField label="Target list price"><input style={inp} placeholder="e.g. $1.4M" /></MField>
          </>
        )}
      </div>
      <div style={foot}>
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm"><MD_I name="plus" size={13} color="#fff" />Add client</button>
      </div>
    </Modal>
  );
}

// ─── NEW PROPERTY ─────────────────────────────────────────────────────────────
function NewPropertyModal({ onClose }) {
  return (
    <Modal title="New listing" onClose={onClose} width={540}>
      <div style={two}>
        <MField label="Street address" full>
          <input style={inp} placeholder="e.g. 128 Balsam Ave" autoFocus />
        </MField>
        <MField label="City / neighbourhood"><input style={inp} placeholder="e.g. The Beach, Toronto" /></MField>
        <MField label="List price"><input style={inp} placeholder="$" /></MField>
        <MField label="Bedrooms"><input style={inp} type="number" placeholder="3" min="0" /></MField>
        <MField label="Bathrooms"><input style={inp} type="number" placeholder="2" min="0" /></MField>
        <MField label="Sqft"><input style={inp} type="number" placeholder="1,800" /></MField>
        <MField label="Type">
          <select style={sel}>{['Detached','Semi-detached','Townhouse','Condo','Multi-family'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Stage">
          <select style={sel}>{['Pre-Listing','Listing Prep','Active on Market','Offer Review','Under Contract'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Seller client">
          <select style={sel}><option value="">— None —</option>{['Aya Fujimori','Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="MLS #" hint="Optional at this stage"><input style={inp} placeholder="E8912476" /></MField>
      </div>
      <div style={foot}>
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm"><MD_I name="plus" size={13} color="#fff" />Add listing</button>
      </div>
    </Modal>
  );
}

// ─── NEW OFFER ────────────────────────────────────────────────────────────────
function NewOfferModal({ onClose }) {
  const [side, setSide] = React.useState('buyer');
  return (
    <Modal title="New offer" onClose={onClose} width={540}>
      <div style={two}>
        <MField label="Side" full>
          <div className="seg" style={{ width: '100%' }}>
            <button data-active={side === 'buyer'} onClick={() => setSide('buyer')} style={{ flex: 1, justifyContent: 'center' }}>Buyer-side</button>
            <button data-active={side === 'seller'} onClick={() => setSide('seller')} style={{ flex: 1, justifyContent: 'center' }}>Seller-side</button>
          </div>
        </MField>
        <MField label="Property">
          <select style={sel}>{['128 Balsam Ave','88 Willow Park Rd','42 Sorauren Ave #3','77 Wellesley St E'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label={side === 'buyer' ? 'Buyer client' : 'Seller client'}>
          <select style={sel}>{['Marcus & Priya Chen','Sarah Okonkwo','Aya Fujimori','Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Offer price"><input style={inp} placeholder="$" /></MField>
        <MField label="Deposit"><input style={inp} placeholder="$" /></MField>
        <MField label="Closing date"><input style={inp} type="date" /></MField>
        <MField label="Irrevocable until"><input style={inp} type="datetime-local" /></MField>
        <MField label="Conditions" hint="Leave blank for a firm offer">
          <input style={inp} placeholder="Financing, Inspection…" />
        </MField>
        <MField label="Status">
          <select style={sel}>{['Submitted','Countered','Accepted'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
      </div>
      <div style={foot}>
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm"><MD_I name="coins" size={13} color="#fff" />Add offer</button>
      </div>
    </Modal>
  );
}

// ─── NEW TASK ─────────────────────────────────────────────────────────────────
function NewTaskModal({ onClose }) {
  const [due, setDue] = React.useState('today');
  return (
    <Modal title="New task" onClose={onClose} width={460}>
      <MField label="Task">
        <input style={inp} placeholder="What needs to be done?" autoFocus />
      </MField>
      <MField label="Due">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['today','Today'],['tomorrow','Tomorrow'],['this_week','This week'],['custom','Pick date']].map(([v,l]) => (
            <button key={v} onClick={() => setDue(v)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid ' + (due === v ? 'var(--brand)' : 'var(--border)'), background: due === v ? 'var(--brand-soft)' : 'transparent', color: due === v ? 'var(--brand-ink)' : 'var(--ink-2)', fontFamily: 'var(--font)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
      </MField>
      <div style={two}>
        <MField label="Client / Lead">
          <select style={sel}><option value="">— None —</option>{['Marcus & Priya Chen','Sarah Okonkwo','Aya Fujimori','Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Property">
          <select style={sel}><option value="">— None —</option>{['128 Balsam Ave','88 Willow Park Rd','42 Sorauren Ave #3'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Priority">
          <select style={sel}>{['Normal','High','Urgent'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Time">
          <input style={inp} type="time" />
        </MField>
      </div>
      <div style={foot}>
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm"><MD_I name="check" size={13} color="#fff" />Add task</button>
      </div>
    </Modal>
  );
}

// ─── NEW NOTE ─────────────────────────────────────────────────────────────────
function NewNoteModal({ onClose }) {
  return (
    <Modal title="New note" onClose={onClose} width={440}>
      <MField label="Note">
        <textarea style={{ ...inp, resize: 'none', height: 96, lineHeight: 1.55 }} placeholder="What happened? Key details…" autoFocus />
      </MField>
      <div style={two}>
        <MField label="Client / Lead">
          <select style={sel}><option value="">— None —</option>{['Marcus & Priya Chen','Sarah Okonkwo','Aya Fujimori','Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Tags">
          <input style={inp} placeholder="financing, offer, showing…" />
        </MField>
      </div>
      <div style={foot}>
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm"><MD_I name="note" size={13} color="#fff" />Save note</button>
      </div>
    </Modal>
  );
}

// ─── NEW EVENT ────────────────────────────────────────────────────────────────
function NewEventModal({ onClose }) {
  const [kind, setKind] = React.useState('showing');
  const kinds = [['showing','Showing'],['consult','Consult'],['inspect','Inspection'],['offer','Offer review'],['call','Call'],['other','Other']];
  return (
    <Modal title="New event" onClose={onClose} width={500}>
      <MField label="Type">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {kinds.map(([v,l]) => (
            <button key={v} onClick={() => setKind(v)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid ' + (kind === v ? 'var(--brand)' : 'var(--border)'), background: kind === v ? 'var(--brand-soft)' : 'transparent', color: kind === v ? 'var(--brand-ink)' : 'var(--ink-2)', fontFamily: 'var(--font)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
      </MField>
      <MField label="Title">
        <input style={inp} placeholder={kind === 'showing' ? 'e.g. Showing · 128 Balsam Ave' : 'Event title'} autoFocus />
      </MField>
      <div style={two}>
        <MField label="Date"><input style={inp} type="date" defaultValue="2026-04-17" /></MField>
        <MField label="Time"><input style={inp} type="time" defaultValue="10:30" /></MField>
        <MField label="Duration">
          <select style={sel}>{['30 min','45 min','1 hour','1.5 hours','2 hours','3 hours'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Client">
          <select style={sel}><option value="">— None —</option>{['Marcus & Priya Chen','Sarah Okonkwo','Aya Fujimori','Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        {(kind === 'showing' || kind === 'inspect' || kind === 'offer') && (
          <MField label="Property">
            <select style={sel}><option value="">— None —</option>{['128 Balsam Ave','88 Willow Park Rd','42 Sorauren Ave #3'].map(s => <option key={s}>{s}</option>)}</select>
          </MField>
        )}
      </div>
      <div style={foot}>
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm"><MD_I name="calendar" size={13} color="#fff" />Add event</button>
      </div>
    </Modal>
  );
}

// ─── EVENT DETAIL ────────────────────────────────────────────────────────────
function EventDetailModal({ event, onClose }) {
  const KC = {
    showing: { bg: 'var(--brand-soft)',        text: 'var(--brand-ink)',       label: 'Showing' },
    consult: { bg: 'oklch(0.96 0.04 70)',       text: 'oklch(0.50 0.16 70)',    label: 'Consult' },
    inspect: { bg: 'oklch(0.96 0.04 150)',      text: 'oklch(0.38 0.13 150)',   label: 'Inspection' },
    call:    { bg: 'oklch(0.96 0.03 260)',      text: 'oklch(0.40 0.01 260)',   label: 'Call' },
    offer:   { bg: 'oklch(0.97 0.03 25)',       text: 'oklch(0.48 0.18 25)',    label: 'Offer review' },
  };
  const c = KC[event.kind] || { bg: 'var(--bg-sunk)', text: 'var(--ink-2)', label: 'Event' };
  return (
    <Modal title="Event detail" onClose={onClose} width={440}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: c.bg, color: c.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</span>
        {event.date && <span className="meta tnum">{event.date}</span>}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 14 }}>{event.title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        {[['Time', event.t || '—'], ['Duration', Math.round((event.dur || 0) * 60) + ' min'], ['Client', event.client || event.who || '—'], ['Location', event.loc || '—']].map(([k, v]) => (
          <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
            <div className="meta">{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 2, color: 'var(--ink)' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={foot}>
        <button className="btn sm" onClick={onClose}>Close</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm"><MD_I name="note" size={13} />Add note</button>
        <button className="btn primary sm"><MD_I name="pen" size={13} color="#fff" />Edit event</button>
      </div>
    </Modal>
  );
}

// ─── TASK DETAIL ─────────────────────────────────────────────────────────────
function TaskDetailModal({ task, onClose }) {
  const [done, setDone] = React.useState(false);
  const [text, setText] = React.useState(task.text || '');
  return (
    <Modal title="Task detail" onClose={onClose} width={480}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16, padding: 14, background: 'var(--bg-sunk)', borderRadius: 8 }}>
        <input type="checkbox" checked={done} onChange={() => setDone(d => !d)} style={{ marginTop: 4, cursor: 'pointer' }} />
        <textarea value={text} onChange={e => setText(e.target.value)} rows={2}
          style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'var(--font)', fontSize: 14.5, fontWeight: 600, color: done ? 'var(--ink-4)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none', outline: 'none', resize: 'none', lineHeight: 1.4, padding: 0 }} />
      </div>
      <div style={two}>
        <MField label="Due">
          <div style={{ padding: '8px 10px', borderRadius: 7, background: 'var(--bg-sunk)', fontSize: 13.5, color: 'var(--ink-2)', fontFamily: 'var(--mono)' }}>{task.when || 'No due date'}</div>
        </MField>
        <MField label="Priority">
          <select style={sel}>{['Normal', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}</select>
        </MField>
        <MField label="Client / Lead">
          <select style={sel} defaultValue={task.contact || ''}>
            <option value="">— None —</option>
            {['Marcus & Priya Chen', 'Sarah Okonkwo', 'Aya Fujimori', 'Tran Household'].map(s => <option key={s}>{s}</option>)}
          </select>
        </MField>
        <MField label="Property">
          <select style={sel}>
            <option value="">— None —</option>
            {['128 Balsam Ave', '88 Willow Park Rd', '42 Sorauren Ave #3', '77 Wellesley St E'].map(s => <option key={s}>{s}</option>)}
          </select>
        </MField>
        <MField label="Notes" full>
          <textarea style={{ ...inp, resize: 'none', height: 56, lineHeight: 1.5 }} placeholder="Additional context…" />
        </MField>
      </div>
      <div style={foot}>
        <button className="btn sm" style={{ color: 'var(--destructive)', borderColor: 'transparent' }}>Delete</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm">Save changes</button>
      </div>
    </Modal>
  );
}

// ─── NOTE DETAIL ─────────────────────────────────────────────────────────────
function NoteDetailModal({ note, onClose }) {
  const [body, setBody] = React.useState(note.body || '');
  return (
    <Modal title="Note" onClose={onClose} width={480}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span className="badge brand">{note.tag}</span>
        <span className="meta tnum">{note.when}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)' }}>{note.who}</span>
      </div>
      <textarea value={body} onChange={e => setBody(e.target.value)}
        style={{ width: '100%', minHeight: 120, padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)', fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink)', outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }} />
      <div style={{ ...two, marginTop: 14 }}>
        <MField label="Linked to">
          <select style={sel} defaultValue={note.who}>
            <option value="">— None —</option>
            {['Marcus & Priya Chen', 'Sarah Okonkwo', 'Aya Fujimori', 'Tran Household', 'Camille Reese'].map(s => <option key={s}>{s}</option>)}
          </select>
        </MField>
        <MField label="Tags">
          <input style={inp} defaultValue={note.tag} placeholder="financing, offer…" />
        </MField>
      </div>
      <div style={foot}>
        <button className="btn sm" style={{ color: 'var(--destructive)', borderColor: 'transparent' }}>Delete</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm">Save note</button>
      </div>
    </Modal>
  );
}

// ─── CONVERT LEAD → CLIENT ────────────────────────────────────────────────────
function ConvertLeadModal({ lead, onClose }) {
  const name = (lead && lead.name) || 'Sarah Okonkwo';
  const [role, setRole] = React.useState('buyer');
  const [confirmed, setConfirmed] = React.useState(false);
  if (confirmed) return (
    <Modal title="Conversion complete" onClose={onClose} width={420}>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'oklch(0.96 0.04 150)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <MD_I name="check" size={22} color="oklch(0.60 0.15 150)" />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>{name} is now a client</div>
        <div className="meta">Moved from Leads to your {role === 'buyer' ? 'Buyer' : 'Seller'} pipeline at Needs Analysis. All notes and tasks carried over.</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 18 }}>
          <button className="btn sm" onClick={onClose}>Done</button>
          <button className="btn primary sm" onClick={onClose}>Open client record</button>
        </div>
      </div>
    </Modal>
  );
  return (
    <Modal title="Convert to client" onClose={onClose} width={480}>
      <div style={{ padding: '12px 14px', background: 'var(--bg-sunk)', borderRadius: 8, marginBottom: 16 }}>
        <div className="meta" style={{ marginBottom: 4 }}>Converting lead</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{name}</div>
        <div className="meta">Notes, tasks, and activity carry over to the new client record.</div>
      </div>
      <MField label="Client type">
        <div className="seg" style={{ width: '100%' }}>
          <button data-active={role === 'buyer'} onClick={() => setRole('buyer')} style={{ flex: 1, justifyContent: 'center' }}>Buyer</button>
          <button data-active={role === 'seller'} onClick={() => setRole('seller')} style={{ flex: 1, justifyContent: 'center' }}>Seller</button>
        </div>
      </MField>
      <div style={two}>
        <MField label="Starting stage">
          <select style={sel}>{(role === 'buyer' ? ['Needs Analysis', 'Property Search', 'Offer Submitted'] : ['Pre-Listing', 'Agreement Signed', 'Active on Market']).map(s => <option key={s}>{s}</option>)}</select>
        </MField>
        <MField label="Representation start">
          <input style={inp} type="date" defaultValue="2026-04-17" />
        </MField>
        {role === 'buyer' && <>
          <MField label="Budget"><input style={inp} placeholder="e.g. $900k–$1.1M" /></MField>
          <MField label="Pre-approval"><input style={inp} placeholder="Lender · amount" /></MField>
        </>}
        {role === 'seller' && <>
          <MField label="Property address"><input style={inp} placeholder="Street address" /></MField>
          <MField label="Target list price"><input style={inp} placeholder="e.g. $1.4M" /></MField>
        </>}
      </div>
      <div style={foot}>
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm" onClick={() => setConfirmed(true)}><MD_I name="convert" size={13} color="#fff" />Convert to client</button>
      </div>
    </Modal>
  );
}

// ─── NOTIFICATIONS POPOVER ───────────────────────────────────────────────────
function NotificationsPopover({ onClose }) {
  const [items, setItems] = React.useState([
    { id: 1, type: 'warn',    icon: 'clock', title: 'Offer expiring soon',   body: '128 Balsam Ave — irrevocable in 5h 40m',         time: 'Now',       read: false },
    { id: 2, type: 'danger',  icon: 'flame', title: 'Task overdue',          body: 'Confirm inspection booking · 2h overdue',         time: '2h ago',    read: false },
    { id: 3, type: 'info',    icon: 'bell',  title: 'New showing request',   body: 'Marcus Chen wants to see 18 Lower Jarvis St',    time: '3h ago',    read: false },
    { id: 4, type: 'success', icon: 'check', title: 'Offer accepted',        body: 'Tran Household · 77 Wellesley St E',              time: 'Yesterday', read: true  },
    { id: 5, type: '',        icon: 'user',  title: 'New lead assigned',     body: 'Camille Reese — open house at King West',         time: 'Yesterday', read: true  },
  ]);
  const unread = items.filter(n => !n.read).length;
  const toneCol = { warn: 'oklch(0.72 0.155 70)', danger: 'var(--destructive)', info: 'var(--brand)', success: 'var(--success)', '': 'var(--ink-3)' };

  React.useEffect(() => {
    const h = e => { if (!e.target.closest('[data-notif-pop]') && !e.target.closest('[aria-label="notifications"]')) onClose(); };
    const t = setTimeout(() => document.addEventListener('click', h), 80);
    return () => { clearTimeout(t); document.removeEventListener('click', h); };
  }, [onClose]);

  return (
    <div data-notif-pop="1" style={{ position: 'fixed', top: 62, right: 16, width: 364, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,.07), 0 24px 60px -8px rgba(0,0,0,.22)', zIndex: 300, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-2)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', flex: 1 }}>Notifications</div>
        {unread > 0 && <span className="badge danger" style={{ marginRight: 10 }}>{unread} new</span>}
        <button onClick={() => setItems(p => p.map(n => ({ ...n, read: true })))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--brand)', fontFamily: 'var(--font)', fontWeight: 500, padding: 0 }}>Mark all read</button>
      </div>
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {items.map((n, i) => (
          <div key={n.id} onClick={() => setItems(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
            style={{ display: 'flex', gap: 12, padding: '11px 16px', borderBottom: i < items.length - 1 ? '1px solid var(--border-2)' : 'none', background: n.read ? 'var(--surface)' : 'oklch(0.985 0.008 254)', cursor: 'pointer', alignItems: 'flex-start' }}
            onMouseEnter={ev => ev.currentTarget.style.background = 'var(--bg-sunk)'}
            onMouseLeave={ev => ev.currentTarget.style.background = n.read ? 'var(--surface)' : 'oklch(0.985 0.008 254)'}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: n.read ? 'var(--bg-deep)' : 'oklch(0.96 0.03 254)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <MD_I name={n.icon} size={14} color={n.read ? 'var(--ink-4)' : toneCol[n.type]} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: 'var(--ink)', lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 3, fontFamily: 'var(--mono)' }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0, marginTop: 6 }} />}
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-2)', textAlign: 'center' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: 'var(--brand)', fontFamily: 'var(--font)', fontWeight: 500, padding: 0 }}>View all activity</button>
      </div>
    </div>
  );
}

window.RC.Modal               = Modal;
window.RC.QuickAddModal       = QuickAddModal;
window.RC.NewLeadModal        = NewLeadModal;
window.RC.NewClientModal      = NewClientModal;
window.RC.NewPropertyModal    = NewPropertyModal;
window.RC.NewOfferModal       = NewOfferModal;
window.RC.NewTaskModal        = NewTaskModal;
window.RC.NewNoteModal        = NewNoteModal;
window.RC.NewEventModal       = NewEventModal;
window.RC.EventDetailModal    = EventDetailModal;
window.RC.TaskDetailModal     = TaskDetailModal;
window.RC.NoteDetailModal     = NoteDetailModal;
window.RC.ConvertLeadModal    = ConvertLeadModal;
window.RC.NotificationsPopover = NotificationsPopover;
