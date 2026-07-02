// screen-modals.jsx — Bottom sheet creation forms for Mobile RC CRM
const { useState: useSM, useEffect: useEffSM } = React;

// ─── Base BottomSheet ─────────────────────────────────────────────────────────
function BottomSheet({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'oklch(0.10 0.01 260 / 0.42)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: 'var(--bg)', borderRadius: '20px 20px 0 0', maxHeight: '88vh', overflow: 'auto', boxShadow: '0 -4px 32px rgba(0,0,0,0.14)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 2 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '6px 16px 12px' }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em', flex: 1, color: 'var(--ink)' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'var(--bg-deep)', border: 0, borderRadius: 999, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, color: 'var(--ink-3)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: '0 16px 44px' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Field + input helpers ────────────────────────────────────────────────────
function SField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.055em', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
const si = { width: '100%', padding: '11px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'var(--font)', fontSize: 15, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', WebkitAppearance: 'none' };
const ss = { ...si, cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 };

function SheetFooter({ onClose, saveLabel, icon }) {
  const I = window.Icon;
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 6, paddingTop: 14, borderTop: '1px solid var(--border-2)' }}>
      <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink-2)', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
      <button style={{ flex: 2, padding: '12px', borderRadius: 10, border: 0, background: 'var(--ink)', color: '#fff', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {icon && <I name={icon} size={16} color="#fff" />}
        {saveLabel}
      </button>
    </div>
  );
}

// ─── FAB PICKER ───────────────────────────────────────────────────────────────
function FabPicker({ onClose, onSelect }) {
  const I = window.Icon;
  const types = [
    { id: 'lead',     icon: 'users',    label: 'Lead' },
    { id: 'task',     icon: 'check',    label: 'Task' },
    { id: 'note',     icon: 'note',     label: 'Note' },
    { id: 'event',    icon: 'calendar', label: 'Event' },
    { id: 'client',   icon: 'briefcase',label: 'Client' },
    { id: 'property', icon: 'home',     label: 'Listing' },
    { id: 'offer',    icon: 'coins',    label: 'Offer' },
  ];
  return (
    <BottomSheet title="Create new…" onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, paddingBottom: 8 }}>
        {types.map(t => (
          <button key={t.id} onClick={() => onSelect(t.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '14px 8px 12px', background: 'var(--bg-sunk)', border: '1px solid var(--border-2)', borderRadius: 12, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <I name={t.icon} size={18} color="var(--ink-2)" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-2)' }}>{t.label}</span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}

// ─── NEW LEAD ─────────────────────────────────────────────────────────────────
function NewLeadSheet({ onClose }) {
  const [role, setRole] = useSM('buyer');
  const [temp, setTemp] = useSM('Warm');
  return (
    <BottomSheet title="New lead" onClose={onClose}>
      <SField label="Full name">
        <input style={si} placeholder="First and last name" autoFocus />
      </SField>
      <SField label="Role">
        <div className="seg" style={{ width: '100%' }}>
          {['buyer','seller','investor'].map(r => (
            <button key={r} data-active={role === r} onClick={() => setRole(r)} style={{ flex: 1, justifyContent: 'center', textTransform: 'capitalize' }}>{r}</button>
          ))}
        </div>
      </SField>
      <SField label="Phone">
        <input style={si} placeholder="+1 (416) 555-0100" type="tel" />
      </SField>
      <SField label={role === 'seller' ? 'Target area' : 'Budget range'}>
        <input style={si} placeholder={role === 'seller' ? 'e.g. Leslieville' : 'e.g. $900k–$1.1M'} />
      </SField>
      <SField label="Source">
        <select style={ss}>{['Referral','Zillow / Realtor.ca','Open house','Social media','Other'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <SField label="Temperature">
        <div style={{ display: 'flex', gap: 8 }}>
          {['Hot','Warm','Cold'].map(t => (
            <button key={t} onClick={() => setTemp(t)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1.5px solid ' + (temp === t ? 'var(--border)' : 'var(--border-2)'), background: temp === t ? (t === 'Hot' ? 'oklch(0.97 0.03 25)' : t === 'Warm' ? 'oklch(0.97 0.04 70)' : 'var(--bg-sunk)') : 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: temp === t ? 600 : 400, color: temp === t ? (t === 'Hot' ? 'oklch(0.48 0.18 25)' : t === 'Warm' ? 'oklch(0.50 0.16 70)' : 'var(--ink-2)') : 'var(--ink-3)' }}>{t}</button>
          ))}
        </div>
      </SField>
      <SheetFooter onClose={onClose} saveLabel="Add lead" icon="users" />
    </BottomSheet>
  );
}

// ─── NEW TASK ─────────────────────────────────────────────────────────────────
function NewTaskSheet({ onClose }) {
  const [due, setDue] = useSM('today');
  return (
    <BottomSheet title="New task" onClose={onClose}>
      <SField label="Task">
        <input style={si} placeholder="What needs to be done?" autoFocus />
      </SField>
      <SField label="Due">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['today','Today'],['tomorrow','Tomorrow'],['this_week','This week'],['custom','Pick date']].map(([v,l]) => (
            <button key={v} onClick={() => setDue(v)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid ' + (due === v ? 'var(--brand)' : 'var(--border)'), background: due === v ? 'var(--brand-soft)' : 'transparent', color: due === v ? 'var(--brand-ink)' : 'var(--ink-2)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
      </SField>
      <SField label="Client / Lead">
        <select style={ss}><option value="">— None —</option>{['Marcus & Priya Chen','Sarah Okonkwo','Aya Fujimori','Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <SField label="Property">
        <select style={ss}><option value="">— None —</option>{['128 Balsam Ave','88 Willow Park Rd','42 Sorauren Ave #3'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <SheetFooter onClose={onClose} saveLabel="Add task" icon="check" />
    </BottomSheet>
  );
}

// ─── NEW NOTE ─────────────────────────────────────────────────────────────────
function NewNoteSheet({ onClose }) {
  return (
    <BottomSheet title="New note" onClose={onClose}>
      <SField label="Note">
        <textarea style={{ ...si, resize: 'none', height: 100, lineHeight: 1.55 }} placeholder="What happened? Key details…" autoFocus />
      </SField>
      <SField label="Client / Lead">
        <select style={ss}><option value="">— None —</option>{['Marcus & Priya Chen','Sarah Okonkwo','Aya Fujimori','Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <SField label="Tags">
        <input style={si} placeholder="financing, offer, showing…" />
      </SField>
      <SheetFooter onClose={onClose} saveLabel="Save note" icon="note" />
    </BottomSheet>
  );
}

// ─── NEW EVENT ────────────────────────────────────────────────────────────────
function NewEventSheet({ onClose }) {
  const [kind, setKind] = useSM('showing');
  return (
    <BottomSheet title="New event" onClose={onClose}>
      <SField label="Type">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['showing','Showing'],['consult','Consult'],['inspect','Inspection'],['offer','Offer review'],['call','Call']].map(([v,l]) => (
            <button key={v} onClick={() => setKind(v)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid ' + (kind === v ? 'var(--brand)' : 'var(--border)'), background: kind === v ? 'var(--brand-soft)' : 'transparent', color: kind === v ? 'var(--brand-ink)' : 'var(--ink-2)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
      </SField>
      <SField label="Title">
        <input style={si} placeholder={kind === 'showing' ? 'Showing · 128 Balsam Ave' : 'Event title'} autoFocus />
      </SField>
      <SField label="Date">
        <input style={si} type="date" defaultValue="2026-04-17" />
      </SField>
      <SField label="Time">
        <input style={si} type="time" defaultValue="10:30" />
      </SField>
      <SField label="Client">
        <select style={ss}><option value="">— None —</option>{['Marcus & Priya Chen','Sarah Okonkwo','Aya Fujimori','Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      {(kind === 'showing' || kind === 'inspect') && (
        <SField label="Property">
          <select style={ss}><option value="">— None —</option>{['128 Balsam Ave','88 Willow Park Rd','42 Sorauren Ave #3'].map(s => <option key={s}>{s}</option>)}</select>
        </SField>
      )}
      <SheetFooter onClose={onClose} saveLabel="Add event" icon="calendar" />
    </BottomSheet>
  );
}

// ─── NEW CLIENT ───────────────────────────────────────────────────────────────
function NewClientSheet({ onClose }) {
  const [role, setRole] = useSM('buyer');
  return (
    <BottomSheet title="New client" onClose={onClose}>
      <SField label="Full name">
        <input style={si} placeholder="e.g. Marcus & Priya Chen" autoFocus />
      </SField>
      <SField label="Type">
        <div className="seg" style={{ width: '100%' }}>
          <button data-active={role === 'buyer'} onClick={() => setRole('buyer')} style={{ flex: 1, justifyContent: 'center' }}>Buyer</button>
          <button data-active={role === 'seller'} onClick={() => setRole('seller')} style={{ flex: 1, justifyContent: 'center' }}>Seller</button>
        </div>
      </SField>
      <SField label="Stage">
        <select style={ss}>
          {(role === 'buyer'
            ? ['Needs Analysis', 'Property Search', 'Offer Submitted', 'Under Contract', 'Closed']
            : ['Pre-Listing', 'Agreement Signed', 'Active on Market', 'Offer Review', 'Under Contract', 'Closed']
          ).map(s => <option key={s}>{s}</option>)}
        </select>
      </SField>
      <SField label="Phone">
        <input style={si} placeholder="+1 (416) 555-0100" type="tel" />
      </SField>
      <SField label="Email">
        <input style={si} placeholder="email@example.com" type="email" />
      </SField>
      {role === 'buyer' ? (
        <>
          <SField label="Budget range">
            <input style={si} placeholder="e.g. $1.1–1.3M" />
          </SField>
          <SField label="Pre-approval">
            <input style={si} placeholder="Lender · amount" />
          </SField>
        </>
      ) : (
        <>
          <SField label="Property address">
            <input style={si} placeholder="Street address" />
          </SField>
          <SField label="Target list price">
            <input style={si} placeholder="e.g. $1.4M" />
          </SField>
        </>
      )}
      <SheetFooter onClose={onClose} saveLabel="Add client" icon="briefcase" />
    </BottomSheet>
  );
}

// ─── NEW PROPERTY ─────────────────────────────────────────────────────────────
function NewPropertySheet({ onClose }) {
  return (
    <BottomSheet title="New listing" onClose={onClose}>
      <SField label="Street address">
        <input style={si} placeholder="e.g. 128 Balsam Ave" autoFocus />
      </SField>
      <SField label="City / neighbourhood">
        <input style={si} placeholder="e.g. The Beach, Toronto" />
      </SField>
      <SField label="List price">
        <input style={si} placeholder="$" />
      </SField>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.055em', marginBottom: 6 }}>Beds</label>
          <input style={si} type="number" placeholder="3" min="0" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.055em', marginBottom: 6 }}>Baths</label>
          <input style={si} type="number" placeholder="2" min="0" />
        </div>
      </div>
      <SField label="Type">
        <select style={ss}>{['Detached', 'Semi-detached', 'Townhouse', 'Condo', 'Multi-family'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <SField label="Stage">
        <select style={ss}>{['Pre-Listing', 'Listing Prep', 'Active on Market', 'Offer Review', 'Under Contract'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <SField label="Seller client">
        <select style={ss}>
          <option value="">— None —</option>
          {['Aya Fujimori', 'Tran Household'].map(s => <option key={s}>{s}</option>)}
        </select>
      </SField>
      <SheetFooter onClose={onClose} saveLabel="Add listing" icon="home" />
    </BottomSheet>
  );
}

// ─── NEW OFFER ────────────────────────────────────────────────────────────────
function NewOfferSheet({ onClose }) {
  const [side, setSide] = useSM('buyer');
  return (
    <BottomSheet title="New offer" onClose={onClose}>
      <SField label="Side">
        <div className="seg" style={{ width: '100%' }}>
          <button data-active={side === 'buyer'} onClick={() => setSide('buyer')} style={{ flex: 1, justifyContent: 'center' }}>Buyer-side</button>
          <button data-active={side === 'seller'} onClick={() => setSide('seller')} style={{ flex: 1, justifyContent: 'center' }}>Seller-side</button>
        </div>
      </SField>
      <SField label="Property">
        <select style={ss}>{['128 Balsam Ave', '88 Willow Park Rd', '42 Sorauren Ave #3', '77 Wellesley St E'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <SField label={side === 'buyer' ? 'Buyer client' : 'Seller client'}>
        <select style={ss}>{['Marcus & Priya Chen', 'Sarah Okonkwo', 'Aya Fujimori', 'Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.055em', marginBottom: 6 }}>Offer price</label>
          <input style={si} placeholder="$" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.055em', marginBottom: 6 }}>Deposit</label>
          <input style={si} placeholder="$" />
        </div>
      </div>
      <SField label="Closing date">
        <input style={si} type="date" />
      </SField>
      <SField label="Irrevocable until">
        <input style={si} type="datetime-local" />
      </SField>
      <SField label="Conditions" >
        <input style={si} placeholder="Financing, Inspection… (blank = firm)" />
      </SField>
      <SheetFooter onClose={onClose} saveLabel="Add offer" icon="coins" />
    </BottomSheet>
  );
}

// ─── CONVERT LEAD → CLIENT ───────────────────────────────────────────────────
function ConvertLeadSheet({ onClose }) {
  const [role, setRole] = useSM('buyer');
  return (
    <BottomSheet title="Convert to client" onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--brand-soft)', borderRadius: 10, marginBottom: 16 }}>
        <div className="avatar av-buyer" style={{ width: 40, height: 40, fontSize: 14 }}>SO</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Sarah Okonkwo</div>
          <div className="row-sub">Buyer lead · Contacted</div>
        </div>
      </div>
      <SField label="Client type">
        <div className="seg" style={{ width: '100%' }}>
          <button data-active={role === 'buyer'} onClick={() => setRole('buyer')} style={{ flex: 1, justifyContent: 'center' }}>Buyer client</button>
          <button data-active={role === 'seller'} onClick={() => setRole('seller')} style={{ flex: 1, justifyContent: 'center' }}>Seller client</button>
        </div>
      </SField>
      <SField label="Starting stage">
        <select style={ss}>
          {(role === 'buyer'
            ? ['Needs Analysis', 'Property Search', 'Offer Submitted', 'Under Contract']
            : ['Pre-Listing', 'Agreement Signed', 'Active on Market']
          ).map(s => <option key={s}>{s}</option>)}
        </select>
      </SField>
      <SField label="Notes">
        <textarea style={{ ...si, resize: 'none', height: 72, lineHeight: 1.55 }} placeholder="Anything to carry over from the lead record…" />
      </SField>
      <div style={{ padding: '10px 14px', background: 'oklch(0.97 0.025 70 / 0.6)', borderRadius: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>All notes, tasks, and activity from the lead record will be copied to the new client profile.</div>
      </div>
      <SheetFooter onClose={onClose} saveLabel="Convert to client" icon="convert" />
    </BottomSheet>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotificationsSheet({ onClose }) {
  const I = window.Icon;
  const notifs = [
    { id: 'n1', icon: 'flame',    tone: 'danger',  title: 'New lead · Camille Reese',    sub: 'Zillow inquiry · $1.9–2.2M buyer · 5 min ago',       unread: true  },
    { id: 'n2', icon: 'clock',    tone: 'warn',    title: 'Offer expiring in 22 min',    sub: '128 Balsam Ave · Bailey · Countered',                 unread: true  },
    { id: 'n3', icon: 'check',    tone: 'success', title: 'Task completed',              sub: 'Sarah Okonkwo — Pre-approval confirmed · Just now',   unread: true  },
    { id: 'n4', icon: 'calendar', tone: 'info',    title: 'Showing confirmed',           sub: '128 Balsam Ave · Chen Family · 10:30 AM today',       unread: false },
    { id: 'n5', icon: 'note',     tone: '',        title: 'Note added · Aya Fujimori',   sub: 'Staging photos approved · Yesterday',                 unread: false },
  ];
  const [read, setRead] = useSM({});
  const toneColor = { danger: 'oklch(0.60 0.21 25)', warn: 'oklch(0.72 0.155 70)', success: 'oklch(0.60 0.15 150)', info: 'oklch(0.65 0.13 230)' };
  const unreadCount = notifs.filter(n => n.unread && !read[n.id]).length;

  return (
    <BottomSheet title="Notifications" onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        {unreadCount > 0 && <span className="badge danger tnum">{unreadCount} new</span>}
        <div style={{ flex: 1 }} />
        {unreadCount > 0 && (
          <button onClick={() => setRead(Object.fromEntries(notifs.map(n => [n.id, true])))} style={{ fontSize: 13, color: 'var(--brand)', background: 'none', border: 0, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, padding: 0 }}>
            Mark all read
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {notifs.map(n => {
          const isRead = read[n.id] || !n.unread;
          const color = isRead ? 'var(--ink-3)' : (toneColor[n.tone] || 'var(--ink-3)');
          return (
            <div key={n.id} onClick={() => setRead(r => ({ ...r, [n.id]: true }))} style={{ display: 'flex', gap: 12, padding: '11px 12px', borderRadius: 10, background: isRead ? 'transparent' : 'var(--brand-soft)', cursor: 'pointer', alignItems: 'flex-start' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: isRead ? 'var(--bg-sunk)' : 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-2)' }}>
                <I name={n.icon} size={16} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: isRead ? 400 : 600, color: 'var(--ink)', lineHeight: 1.3 }}>{n.title}</div>
                <div className="row-sub" style={{ marginTop: 2 }}>{n.sub}</div>
              </div>
              {!isRead && <div style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--brand)', flexShrink: 0, marginTop: 5 }} />}
            </div>
          );
        })}
      </div>
      {unreadCount === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0 4px', color: 'var(--ink-4)', fontSize: 13 }}>All caught up</div>
      )}
    </BottomSheet>
  );
}

// ─── QUICK NOTE ───────────────────────────────────────────────────────────────
function QuickNoteSheet({ onClose }) {
  return (
    <BottomSheet title="Quick note" onClose={onClose}>
      <SField label="Note">
        <textarea style={{ ...si, resize: 'none', height: 100, lineHeight: 1.55 }} placeholder="What happened? Key details…" autoFocus />
      </SField>
      <SField label="Client / Lead">
        <select style={ss}>
          <option value="">— None —</option>
          {['Marcus & Priya Chen', 'Sarah Okonkwo', 'Aya Fujimori', 'Tran Household'].map(s => <option key={s}>{s}</option>)}
        </select>
      </SField>
      <SField label="Tags">
        <input style={si} placeholder="financing, offer, showing…" />
      </SField>
      <SheetFooter onClose={onClose} saveLabel="Save note" icon="note" />
    </BottomSheet>
  );
}

// ─── TASK DETAIL / EDIT ───────────────────────────────────────────────────────
function TaskDetailSheet({ onClose }) {
  const [due, setDue] = useSM('today');
  const [priority, setPriority] = useSM('High');
  const [done, setDone] = useSM(false);
  return (
    <BottomSheet title="Task detail" onClose={onClose}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
        <button onClick={() => setDone(d => !d)} style={{ width: 24, height: 24, borderRadius: 999, border: '1.5px solid ' + (done ? 'var(--success)' : 'var(--border)'), background: done ? 'var(--success)' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginTop: 4 }}>
          {done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>}
        </button>
        <textarea style={{ ...si, resize: 'none', height: 58, lineHeight: 1.55, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--ink-3)' : 'var(--ink)', flex: 1 }} defaultValue="Confirm inspection booking with Tran household" />
      </div>
      <SField label="Due">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['today','Today'],['tomorrow','Tomorrow'],['this_week','This week']].map(([v,l]) => (
            <button key={v} onClick={() => setDue(v)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid ' + (due === v ? 'var(--brand)' : 'var(--border)'), background: due === v ? 'var(--brand-soft)' : 'transparent', color: due === v ? 'var(--brand-ink)' : 'var(--ink-2)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
      </SField>
      <SField label="Priority">
        <div style={{ display: 'flex', gap: 8 }}>
          {['Normal','High','Urgent'].map(p => (
            <button key={p} onClick={() => setPriority(p)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1.5px solid ' + (priority === p ? 'var(--border)' : 'var(--border-2)'), background: priority === p ? (p === 'Urgent' ? 'oklch(0.97 0.03 25)' : p === 'High' ? 'oklch(0.97 0.04 70)' : 'var(--bg-sunk)') : 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: priority === p ? 600 : 400, color: priority === p ? (p === 'Urgent' ? 'oklch(0.48 0.18 25)' : p === 'High' ? 'oklch(0.50 0.16 70)' : 'var(--ink-2)') : 'var(--ink-3)' }}>{p}</button>
          ))}
        </div>
      </SField>
      <SField label="Client / Lead">
        <select style={ss}><option value="">— None —</option>{['Marcus & Priya Chen','Sarah Okonkwo','Aya Fujimori','Tran Household'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <SField label="Property">
        <select style={ss}><option value="">— None —</option>{['128 Balsam Ave','88 Willow Park Rd','42 Sorauren Ave #3','77 Wellesley St E'].map(s => <option key={s}>{s}</option>)}</select>
      </SField>
      <div style={{ display: 'flex', gap: 10, marginTop: 6, paddingTop: 14, borderTop: '1px solid var(--border-2)' }}>
        <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--destructive)', background: 'transparent', color: 'var(--destructive)', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Delete</button>
        <button style={{ flex: 2, padding: '12px', borderRadius: 10, border: 0, background: 'var(--ink)', color: '#fff', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <window.Icon name="check" size={16} color="#fff" />Save changes
        </button>
      </div>
    </BottomSheet>
  );
}

// ─── NOTE DETAIL / EDIT ───────────────────────────────────────────────────────
function NoteDetailSheet({ onClose }) {
  const note = window._selectedNote || {
    date: 'Today',
    body: 'Pre-approval from Scotia confirmed — $1.05M. Expires July 31, 2026. Partner name is Kwame.',
    tags: ['financing'],
    client: 'Marcus & Priya Chen',
  };
  const [editing, setEditing] = useSM(false);
  const [body, setBody]       = useSM(note.body);

  return (
    <BottomSheet title="Note" onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span className="meta tnum">{note.date}</span>
        {(note.tags || []).map(t => (
          <span key={t} style={{ padding: '3px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: 'var(--brand-soft)', color: 'var(--brand-ink)' }}>#{t}</span>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setEditing(e => !e)}
          style={{ fontSize: 13, color: 'var(--brand)', background: 'none', border: 0, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, padding: 0 }}>
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <textarea value={body} onChange={e => setBody(e.target.value)}
          style={{ ...si, resize: 'none', height: 120, lineHeight: 1.6, fontSize: 15 }} autoFocus />
      ) : (
        <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink)', padding: '2px 0 12px' }}>{body}</div>
      )}

      {note.client && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', background: 'var(--bg-sunk)', borderRadius: 10, marginBottom: 6 }}>
          <I name="briefcase" size={14} color="var(--ink-3)" />
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{note.client}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 8, paddingTop: 14, borderTop: '1px solid var(--border-2)' }}>
        <button onClick={onClose}
          style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--destructive)', background: 'transparent', color: 'var(--destructive)', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
          Delete
        </button>
        <button onClick={onClose}
          style={{ flex: 2, padding: '12px', borderRadius: 10, border: 0, background: 'var(--ink)', color: '#fff', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <window.Icon name="note" size={16} color="#fff" />Save note
        </button>
      </div>
    </BottomSheet>
  );
}

window.BottomSheet        = BottomSheet;
window.FabPicker          = FabPicker;
window.NewLeadSheet       = NewLeadSheet;
window.NewTaskSheet       = NewTaskSheet;
window.NoteDetailSheet    = NoteDetailSheet;
window.NewNoteSheet       = NewNoteSheet;
window.NewEventSheet      = NewEventSheet;
window.NewClientSheet     = NewClientSheet;
window.NewPropertySheet   = NewPropertySheet;
window.NewOfferSheet      = NewOfferSheet;
window.ConvertLeadSheet   = ConvertLeadSheet;
window.NotificationsSheet = NotificationsSheet;
window.QuickNoteSheet     = QuickNoteSheet;
window.TaskDetailSheet    = TaskDetailSheet;
