// screens2.jsx — Calendar sub-views (Day/Month/Agenda) + Settings screen
// Loads after modals.jsx so window.RC.Modal is available at definition time.
const S2_I = window.Icon;
const { Avatar: S2Av } = window.RC;

const KIND_COLORS = {
  showing: { bg: 'var(--brand-soft)',         bar: 'var(--brand)',            text: 'var(--brand-ink)',          label: 'Showing' },
  consult: { bg: 'oklch(0.96 0.04 70)',        bar: 'oklch(0.72 0.155 70)',    text: 'oklch(0.50 0.16 70)',       label: 'Consult' },
  inspect: { bg: 'oklch(0.96 0.04 150)',       bar: 'oklch(0.60 0.15 150)',    text: 'oklch(0.38 0.13 150)',      label: 'Inspection' },
  call:    { bg: 'oklch(0.96 0.03 260)',       bar: 'oklch(0.55 0.08 260)',    text: 'oklch(0.40 0.01 260)',      label: 'Call' },
  offer:   { bg: 'oklch(0.97 0.03 25)',        bar: 'oklch(0.60 0.21 25)',     text: 'oklch(0.48 0.18 25)',       label: 'Offer review' },
};

// ── Calendar Day View ────────────────────────────────────────────────────────
function CalendarDay({ events, HOURS, SLOT, onEventClick }) {
  const todayEvents = events.filter(e => e.day === 3).sort((a, b) => a.start - b.start);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 296px', gap: 16 }}>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-2)', background: 'oklch(0.985 0.01 250 / 0.5)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand)' }}>THU</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--brand)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>17</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>April 2026 · Today · {todayEvents.length} events</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', overflowY: 'auto', maxHeight: 540 }}>
          <div style={{ borderRight: '1px solid var(--border-2)' }}>
            {HOURS.map(h => (
              <div key={h} style={{ height: SLOT, paddingTop: 6, paddingRight: 10, textAlign: 'right', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--ink-4)' }}>
                {((h % 12) || 12) + (h < 12 ? 'a' : 'p')}
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', height: HOURS.length * SLOT }}>
            {HOURS.map((h, i) => (
              <div key={h} style={{ position: 'absolute', left: 0, right: 0, top: i * SLOT, borderTop: i === 0 ? 'none' : '1px solid var(--border-2)' }} />
            ))}
            <div style={{ position: 'absolute', left: 0, right: 0, top: (9.7 - 8) * SLOT, borderTop: '2px solid var(--destructive)', zIndex: 4 }}>
              <div style={{ position: 'absolute', left: -4, top: -5, width: 10, height: 10, borderRadius: 999, background: 'var(--destructive)' }} />
            </div>
            {todayEvents.map((e, ei) => {
              const c = KIND_COLORS[e.kind] || { bg: 'var(--bg-deep)', bar: 'var(--ink-4)', text: 'var(--ink-2)' };
              return (
                <div key={ei} onClick={() => onEventClick(e)}
                  style={{ position: 'absolute', top: (e.start - 8) * SLOT + 2, left: 8, right: 8, height: Math.max(e.dur * SLOT - 6, 22), background: c.bg, borderLeft: '3px solid ' + c.bar, borderRadius: 6, padding: '5px 10px', cursor: 'pointer', overflow: 'hidden' }}
                  onMouseEnter={ev => ev.currentTarget.style.filter = 'brightness(0.96)'}
                  onMouseLeave={ev => ev.currentTarget.style.filter = ''}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: c.text }}>{e.t}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 1 }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 1 }}>{e.client}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card">
          <div className="card-head"><h2>Today's schedule</h2><div style={{ flex: 1 }} /><span className="meta tnum">{todayEvents.length} events</span></div>
          {todayEvents.map((e, i) => {
            const c = KIND_COLORS[e.kind] || { bar: 'var(--brand)' };
            return (
              <div key={i} onClick={() => onEventClick(e)}
                style={{ display: 'flex', gap: 12, padding: '10px 16px', borderBottom: i < todayEvents.length - 1 ? '1px solid var(--border-2)' : 'none', cursor: 'pointer', alignItems: 'flex-start' }}
                onMouseEnter={ev => ev.currentTarget.style.background = 'var(--bg-sunk)'}
                onMouseLeave={ev => ev.currentTarget.style.background = ''}>
                <div style={{ width: 3, borderRadius: 2, background: c.bar, alignSelf: 'stretch', marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{e.title}</div>
                  <div style={{ fontSize: 11.5, fontFamily: 'var(--mono)', color: 'var(--ink-3)', marginTop: 2 }}>{e.t} · {Math.round(e.dur * 60)}m</div>
                  {e.client && e.client !== 'Internal' && e.client !== 'Open house' && <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1 }}>{e.client}</div>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="card card-pad" style={{ background: 'var(--bg-sunk)' }}>
          <div className="meta" style={{ marginBottom: 8 }}>Day utilization · 8 AM – 7 PM</div>
          <div style={{ height: 6, background: 'var(--bg-deep)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
            {todayEvents.map((e, i) => (
              <div key={i} style={{ position: 'absolute', left: ((e.start - 8) / 11) * 100 + '%', width: (e.dur / 11) * 100 + '%', height: '100%', background: (KIND_COLORS[e.kind] || {}).bar || 'var(--brand)', borderRadius: 2 }} />
            ))}
          </div>
          <div className="meta" style={{ marginTop: 6 }}>{Math.round(todayEvents.reduce((s, e) => s + e.dur, 0) * 60)}m booked</div>
        </div>
      </div>
    </div>
  );
}

// ── Calendar Month View ──────────────────────────────────────────────────────
function CalendarMonth({ events, onEventClick }) {
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // April 2026 starts Wednesday; grid from Mon Mar 30
  const startDate = new Date(2026, 2, 30);
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const date = d.getDate(), month = d.getMonth();
    return {
      date, month,
      isToday: month === 3 && date === 17,
      isCurrentMonth: month === 3,
      events: events.filter(e => month === 3 && date === 14 + e.day),
    };
  });
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-2)' }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((cell, i) => (
          <div key={i} style={{ minHeight: 88, padding: '6px 5px', borderRight: i % 7 !== 6 ? '1px solid var(--border-2)' : 'none', borderBottom: i < 28 ? '1px solid var(--border-2)' : 'none', background: cell.isToday ? 'oklch(0.985 0.01 250 / 0.4)' : cell.isCurrentMonth ? 'var(--surface)' : 'var(--bg-sunk)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: cell.isToday ? 'var(--brand)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: cell.isToday ? 700 : 400, color: cell.isToday ? '#fff' : cell.isCurrentMonth ? 'var(--ink)' : 'var(--ink-4)', fontVariantNumeric: 'tabular-nums' }}>
                {cell.date}
              </div>
            </div>
            {cell.events.slice(0, 3).map((e, ei) => (
              <div key={ei} onClick={() => onEventClick(e)}
                style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '1px 4px', borderRadius: 3, background: 'var(--brand-soft)', cursor: 'pointer', marginBottom: 2, overflow: 'hidden' }}
                onMouseEnter={ev => ev.currentTarget.style.background = 'oklch(0.935 0.04 254)'}
                onMouseLeave={ev => ev.currentTarget.style.background = 'var(--brand-soft)'}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: (KIND_COLORS[e.kind] || {}).bar || 'var(--brand)', flexShrink: 0 }} />
                <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
              </div>
            ))}
            {cell.events.length > 3 && <div style={{ fontSize: 10, color: 'var(--ink-3)', paddingLeft: 4 }}>+{cell.events.length - 3} more</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Calendar Agenda View ─────────────────────────────────────────────────────
function CalendarAgenda({ events, onEventClick }) {
  const DAYS = [
    { label: 'Thu Apr 17', isToday: true,  dayIdx: 3 },
    { label: 'Fri Apr 18', isToday: false, dayIdx: 4 },
    { label: 'Sat Apr 19', isToday: false, dayIdx: 5 },
    { label: 'Sun Apr 20', isToday: false, dayIdx: 6 },
    { label: 'Mon Apr 21', isToday: false, dayIdx: -1 },
    { label: 'Tue Apr 22', isToday: false, dayIdx: -1 },
    { label: 'Wed Apr 23', isToday: false, dayIdx: -1 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {DAYS.map(day => {
        const dayEvents = (day.dayIdx >= 0 ? events.filter(e => e.day === day.dayIdx) : []).sort((a, b) => a.start - b.start);
        return (
          <div key={day.label} className="card" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: dayEvents.length > 0 ? '1px solid var(--border-2)' : 'none', background: day.isToday ? 'oklch(0.985 0.01 250 / 0.4)' : 'transparent' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: day.isToday ? 'var(--brand)' : 'var(--ink)' }}>{day.label}{day.isToday ? ' · Today' : ''}</div>
              <div style={{ flex: 1 }} />
              {dayEvents.length === 0
                ? <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>No events</span>
                : <span className="meta tnum">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</span>}
            </div>
            {dayEvents.map((e, i) => {
              const c = KIND_COLORS[e.kind] || { bg: 'var(--bg-sunk)', text: 'var(--ink-2)', label: 'Event' };
              return (
                <div key={i} onClick={() => onEventClick(e)}
                  style={{ display: 'grid', gridTemplateColumns: '52px auto 1fr 20px', gap: 12, padding: '11px 16px', borderBottom: i < dayEvents.length - 1 ? '1px solid var(--border-2)' : 'none', alignItems: 'center', cursor: 'pointer' }}
                  onMouseEnter={ev => ev.currentTarget.style.background = 'var(--bg-sunk)'}
                  onMouseLeave={ev => ev.currentTarget.style.background = ''}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-3)' }}>{e.t}</div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: c.bg, color: c.text, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{c.label}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{e.client} · {Math.round(e.dur * 60)}m</div>
                  </div>
                  <S2_I name="chevron" size={14} color="var(--ink-4)" />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Settings ─────────────────────────────────────────────────────────────────
function Settings({ goto }) {
  const [section, setSection] = React.useState('profile');
  const SECTIONS = [
    { id: 'profile',       label: 'Profile & account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'display',       label: 'Display' },
    { id: 'integrations',  label: 'Integrations' },
  ];
  const sinp = { width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'var(--font)', fontSize: 13.5, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', letterSpacing: '-0.003em' };
  const slbl = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.055em', marginBottom: 5 };
  const SField = ({ label, children }) => <div style={{ marginBottom: 14 }}><label style={slbl}>{label}</label>{children}</div>;

  // Notification toggles state
  const [notifPrefs, setNotifPrefs] = React.useState({ taskDue: true, offerExpiry: true, clientActivity: true, leadAssigned: true, emailDigest: false, smsAlerts: false });
  const Toggle = ({ id, label, sub }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border-2)' }}>
      <div><div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{label}</div>{sub && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>}</div>
      <div onClick={() => setNotifPrefs(p => ({ ...p, [id]: !p[id] }))}
        style={{ width: 36, height: 20, borderRadius: 10, background: notifPrefs[id] ? 'var(--brand)' : 'var(--bg-deep)', cursor: 'pointer', position: 'relative', transition: 'background 150ms', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 3, left: notifPrefs[id] ? 19 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 150ms', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
      </div>
    </div>
  );

  const [theme, setTheme] = React.useState('light');
  const [density, setDensity] = React.useState('comfortable');
  const ssel = { ...sinp, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center', paddingRight: 26 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <div><div className="sub">Account</div><h1>Settings</h1></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Section nav */}
        <div className="card" style={{ padding: 8 }}>
          {SECTIONS.map(s => (
            <div key={s.id} className="nav" data-active={section === s.id} onClick={() => setSection(s.id)} style={{ borderRadius: 6, marginBottom: 2 }}>{s.label}</div>
          ))}
          <div style={{ margin: '12px 0 8px', borderTop: '1px solid var(--border-2)', paddingTop: 10 }}>
            <div className="nav" style={{ borderRadius: 6, color: 'var(--destructive)', gap: 8 }}>
              <S2_I name="arrowRight" size={14} color="var(--destructive)" />Sign out
            </div>
          </div>
        </div>

        {/* Profile */}
        {section === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'var(--ink)' }}>Agent profile</div>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  <S2Av name="Jordan Reyes" role="buyer" size={64} />
                  <button className="btn sm" style={{ marginTop: 10, width: '100%', fontSize: 11 }}>Change photo</button>
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                  {[['First name','Jordan'],['Last name','Reyes'],['Email','jordan@reyesrealty.ca'],['Phone','+1 (416) 555-0199'],['Brokerage','Royal LePage'],['License #','ON-4812200']].map(([lbl, val]) => (
                    <SField key={lbl} label={lbl}><input defaultValue={val} style={sinp} /></SField>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-2)' }}>
                <button className="btn primary sm">Save changes</button>
              </div>
            </div>
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--ink)' }}>Password & security</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                {['Current password','New password','Confirm new password'].map(lbl => (
                  <SField key={lbl} label={lbl}><input type="password" placeholder="••••••••" style={sinp} /></SField>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <button className="btn sm">Update password</button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {section === 'notifications' && (
          <div className="card card-pad">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: 'var(--ink)' }}>In-app notifications</div>
            <Toggle id="taskDue"        label="Task due reminders"    sub="Notify when a task is due within 1 hour" />
            <Toggle id="offerExpiry"    label="Offer expiry alerts"   sub="Alert when an irrevocable deadline is approaching" />
            <Toggle id="clientActivity" label="Client activity"       sub="New messages, document views, and replies" />
            <Toggle id="leadAssigned"   label="Lead assignments"      sub="When a lead is assigned to you by a team member" />
            <div style={{ fontSize: 13, fontWeight: 600, margin: '18px 0 2px', color: 'var(--ink)' }}>External</div>
            <Toggle id="emailDigest"    label="Daily email digest"    sub="Summary of the day's activity, sent at 7 AM" />
            <Toggle id="smsAlerts"      label="SMS alerts"            sub="Time-sensitive alerts for offer deadlines only" />
          </div>
        )}

        {/* Display */}
        {section === 'display' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--ink)' }}>Appearance</div>
              <SField label="Theme">
                <div className="seg">
                  {['Light','System','Dark'].map(v => <button key={v} data-active={theme === v.toLowerCase()} onClick={() => setTheme(v.toLowerCase())} style={{ flex: 1, justifyContent: 'center' }}>{v}</button>)}
                </div>
              </SField>
              <SField label="Density">
                <div className="seg">
                  {['Comfortable','Compact'].map(v => <button key={v} data-active={density === v.toLowerCase()} onClick={() => setDensity(v.toLowerCase())} style={{ flex: 1, justifyContent: 'center' }}>{v}</button>)}
                </div>
              </SField>
            </div>
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--ink)' }}>Default views</div>
              {[['Leads','List',['List','Board']],['Properties','List',['List','Board','Map']],['Calendar','Week',['Day','Week','Month','Agenda']]].map(([lbl, def, opts]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-2)' }}>
                  <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>{lbl}</div>
                  <select defaultValue={def} style={{ ...ssel, width: 'auto', padding: '6px 26px 6px 10px' }}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations */}
        {section === 'integrations' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            {[
              { name: 'Google Calendar',  connected: true,  icon: 'calendar', desc: 'Sync showings, consults, and inspections' },
              { name: 'DocuSign',         connected: false, icon: 'doc',      desc: 'Send and e-sign offer and listing documents' },
              { name: 'Realtor.ca / MLS', connected: true,  icon: 'home',     desc: 'Pull live listing data and client activity' },
              { name: 'Stripe',           connected: false, icon: 'coins',    desc: 'Track commission deposits and payments' },
            ].map((int, i, arr) => (
              <div key={int.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-2)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <S2_I name={int.icon} size={16} color="var(--ink-2)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{int.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{int.desc}</div>
                </div>
                <span className={'badge ' + (int.connected ? 'success' : '')}>{int.connected ? 'Connected' : 'Not connected'}</span>
                <button className="btn sm">{int.connected ? 'Manage' : 'Connect'}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

window.RC.CalendarDay    = CalendarDay;
window.RC.CalendarMonth  = CalendarMonth;
window.RC.CalendarAgenda = CalendarAgenda;
window.RC.Settings       = Settings;
