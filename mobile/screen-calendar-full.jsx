// screen-calendar-full.jsx — Day, Week, Month calendar views + Event Detail
const { useState: useStateCal } = React;

const M_CAL = window.MOCK;

const kindColor = {
  showing: 'oklch(0.62 0.14 254)',
  consult: 'oklch(0.58 0.14 150)',
  inspect: 'oklch(0.55 0.17 310)',
  call:    'oklch(0.55 0.08 260)',
  offer:   'oklch(0.62 0.14 30)',
};

const kindBg = {
  showing: 'oklch(0.96 0.03 254)',
  consult: 'oklch(0.96 0.04 150)',
  inspect: 'oklch(0.96 0.035 310)',
  call:    'oklch(0.96 0.015 260)',
  offer:   'oklch(0.96 0.04 30)',
};

// ─── Header with view switcher ────────────────────────────────────────
function CalHeader({ view, setView, title, goto }) {
  return (
    <>
      <div className="topbar" style={{ paddingBottom: 6 }}>
        <div className="topbar-row">
          <h1 style={{ fontSize: 24, margin: 0 }}>{title}</h1>
          <div style={{ flex: 1 }} />
          <button className="icon-btn" style={{ marginRight: 6 }}><window.Icon name="plus" size={16} /></button>
          <button className="icon-btn"><window.Icon name="more" size={16} /></button>
        </div>
      </div>
      <div style={{ padding: '0 16px 12px' }}>
        <div className="seg" style={{ width: '100%', display: 'flex' }}>
          {['Agenda', 'Day', 'Week', 'Month'].map(v => (
            <button key={v} data-active={view === v} onClick={() => setView(v)} style={{ flex: 1, justifyContent: 'center' }}>{v}</button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── DAY VIEW ────────────────────────────────────────────────────────
function CalendarDay({ goto }) {
  const [view, setView] = useStateCal('Day');
  if (view !== 'Day') return <CalendarViewRouter view={view} setView={setView} goto={goto} />;

  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7am–7pm
  const events = [
    { start: 10.5, dur: 0.75, title: 'Showing · 128 Balsam', kind: 'showing', who: 'Chen Family' },
    { start: 12,   dur: 0.75, title: 'Buyer consult · Okonkwo', kind: 'consult', who: 'Sarah Okonkwo' },
    { start: 14,   dur: 1.5,  title: 'Inspection · 77 Wellesley', kind: 'inspect', who: 'Tran Household' },
    { start: 16.5, dur: 0.5,  title: 'Listing prep call', kind: 'call', who: 'Aya Fujimori' },
  ];
  const ROW_H = 56; // px per hour

  return (
    <>
      <CalHeader view={view} setView={setView} title="April 17" goto={goto} />

      {/* Day nav strip */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 10px', gap: 8 }}>
        <button className="icon-btn"><window.Icon name="chevron" size={14} style={{ transform: 'scaleX(-1)' }} /></button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Thursday, Apr 17</div>
        <button className="icon-btn"><window.Icon name="chevron" size={14} /></button>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', padding: '0 16px' }}>
        {/* Current time */}
        <div style={{ position: 'absolute', left: 52, right: 16, top: (9.68 - 7) * ROW_H + 'px', zIndex: 5, display: 'flex', alignItems: 'center', gap: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--destructive)', flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1.5, background: 'var(--destructive)' }} />
        </div>

        {hours.map(h => (
          <div key={h} style={{ display: 'flex', gap: 8, height: ROW_H, position: 'relative' }}>
            <div style={{ width: 36, paddingTop: 0, textAlign: 'right', fontSize: 11, color: 'var(--ink-4)', fontFamily: 'var(--mono)', flexShrink: 0 }}>{h > 12 ? h - 12 + ' PM' : h === 12 ? '12 PM' : h + ' AM'}</div>
            <div style={{ flex: 1, borderTop: '1px solid var(--border-2)' }} />
          </div>
        ))}

        {/* Event blocks */}
        {events.map((e, i) => (
          <div key={i} onClick={() => goto('calEventDetail')} style={{
            position: 'absolute',
            left: 64, right: 16,
            top: (e.start - 7) * ROW_H + 1,
            height: e.dur * ROW_H - 3,
            background: kindBg[e.kind],
            borderLeft: '3px solid ' + kindColor[e.kind],
            borderRadius: '0 6px 6px 0',
            padding: '5px 8px',
            cursor: 'pointer',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{e.title}</div>
            {e.dur > 0.5 && <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{e.who}</div>}
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </>
  );
}

// ─── WEEK VIEW ────────────────────────────────────────────────────────
function CalendarWeek({ goto }) {
  const [view, setView] = useStateCal('Week');
  if (view !== 'Week') return <CalendarViewRouter view={view} setView={setView} goto={goto} />;

  const days = [
    { label: 'M', date: '14', events: 1 },
    { label: 'T', date: '15', events: 2 },
    { label: 'W', date: '16', events: 1 },
    { label: 'T', date: '17', events: 4, today: true },
    { label: 'F', date: '18', events: 3 },
    { label: 'S', date: '19', events: 2 },
    { label: 'S', date: '20', events: 1 },
  ];

  const WEEK_EVENTS = [
    { day: 3, start: 10.5, dur: 0.75, kind: 'showing' },
    { day: 3, start: 12,   dur: 0.75, kind: 'consult' },
    { day: 3, start: 14,   dur: 1.5,  kind: 'inspect' },
    { day: 3, start: 16.5, dur: 0.5,  kind: 'call' },
    { day: 4, start: 9,    dur: 0.5,  kind: 'call' },
    { day: 4, start: 11,   dur: 1,    kind: 'showing' },
    { day: 4, start: 15,   dur: 1,    kind: 'offer' },
    { day: 5, start: 13,   dur: 2,    kind: 'showing' },
    { day: 6, start: 13,   dur: 2,    kind: 'showing' },
  ];

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const ROW_H = 44;
  const COL_W = `${100 / 7}%`;

  return (
    <>
      <CalHeader view={view} setView={setView} title="Apr 14–20" goto={goto} />

      {/* Day headers */}
      <div style={{ display: 'flex', padding: '0 0 0 32px', borderBottom: '1px solid var(--border-2)' }}>
        {days.map(d => (
          <div key={d.date} style={{ flex: 1, textAlign: 'center', padding: '4px 0 8px' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d.label}</div>
            <div style={{
              width: 28, height: 28, borderRadius: 999, margin: '2px auto 0',
              background: d.today ? 'var(--brand)' : 'transparent',
              color: d.today ? '#fff' : 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: d.today ? 700 : 400,
            }}>{d.date}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ position: 'relative', padding: '0 0 0 32px', overflowY: 'auto', maxHeight: 420 }}>
        {/* Hour rows */}
        {hours.map(h => (
          <div key={h} style={{ display: 'flex', height: ROW_H, position: 'relative' }}>
            <div style={{ position: 'absolute', left: -30, top: -7, fontSize: 10, color: 'var(--ink-4)', fontFamily: 'var(--mono)', width: 28, textAlign: 'right' }}>
              {h > 12 ? h - 12 + 'p' : h + 'a'}
            </div>
            <div style={{ flex: 1, borderTop: '1px solid var(--border-2)', display: 'flex' }}>
              {days.map(d => <div key={d.date} style={{ flex: 1, borderLeft: '1px solid var(--border-2)' }} />)}
            </div>
          </div>
        ))}

        {/* Current time */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: (9.68 - 8) * ROW_H, zIndex: 5, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--destructive)', flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1.5, background: 'var(--destructive)' }} />
        </div>

        {/* Event blocks */}
        {WEEK_EVENTS.map((e, i) => (
          <div key={i} onClick={() => goto('calEventDetail')} style={{
            position: 'absolute',
            left: `calc(${(100 / 7) * e.day}% + 2px)`,
            width: `calc(${100 / 7}% - 4px)`,
            top: (e.start - 8) * ROW_H + 1,
            height: e.dur * ROW_H - 3,
            background: kindBg[e.kind],
            borderLeft: '2.5px solid ' + kindColor[e.kind],
            borderRadius: '0 4px 4px 0',
            padding: '2px 4px',
            cursor: 'pointer', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
              {e.kind.charAt(0).toUpperCase() + e.kind.slice(1)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </>
  );
}

// ─── MONTH VIEW ──────────────────────────────────────────────────────
function CalendarMonth({ goto }) {
  const [view, setView] = useStateCal('Month');
  if (view !== 'Month') return <CalendarViewRouter view={view} setView={setView} goto={goto} />;

  const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  // April 2026 starts on Wednesday (offset 3)
  const offset = 3;
  const daysInMonth = 30;
  const cells = Array.from({ length: offset + daysInMonth }, (_, i) => i < offset ? null : i - offset + 1);
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const eventMap = {
    9: [{ kind: 'showing' }],
    10: [{ kind: 'inspect' }],
    14: [{ kind: 'call' }],
    15: [{ kind: 'consult' }, { kind: 'appt' }],
    16: [{ kind: 'showing' }],
    17: [{ kind: 'showing' }, { kind: 'consult' }, { kind: 'inspect' }, { kind: 'call' }],
    18: [{ kind: 'call' }, { kind: 'showing' }, { kind: 'offer' }],
    19: [{ kind: 'showing' }, { kind: 'showing' }],
    22: [{ kind: 'consult' }],
    24: [{ kind: 'showing' }],
    28: [{ kind: 'call' }],
  };

  return (
    <>
      <CalHeader view={view} setView={setView} title="April 2026" goto={goto} />

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 10px', gap: 8 }}>
        <button className="icon-btn"><window.Icon name="chevron" size={14} style={{ transform: 'scaleX(-1)' }} /></button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>April 2026</div>
        <button className="icon-btn"><window.Icon name="chevron" size={14} /></button>
      </div>

      <div style={{ padding: '0 12px' }}>
        {/* DOW headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
          {DOW.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid var(--border-2)', borderRadius: 10, overflow: 'hidden' }}>
          {cells.map((d, i) => {
            const isToday = d === 17;
            const evts = d ? (eventMap[d] || []) : [];
            return (
              <div key={i} style={{
                minHeight: 56, padding: '4px 3px 3px',
                borderRight: (i + 1) % 7 === 0 ? 0 : '1px solid var(--border-2)',
                borderBottom: i < cells.length - 7 ? '1px solid var(--border-2)' : 0,
                background: isToday ? 'var(--brand-soft)' : d ? 'var(--surface)' : 'var(--bg-sunk)',
                cursor: d ? 'pointer' : 'default',
              }} onClick={() => d && goto('calDay')}>
                {d && (
                  <>
                    <div style={{
                      width: 22, height: 22, borderRadius: 999, margin: '0 auto 2px',
                      background: isToday ? 'var(--brand)' : 'transparent',
                      color: isToday ? '#fff' : d <= 17 && d >= 14 ? 'var(--ink)' : 'var(--ink-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: isToday ? 700 : 400,
                    }}>{d}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                      {evts.slice(0, 3).map((e, j) => (
                        <div key={j} style={{ width: 5, height: 5, borderRadius: 999, background: kindColor[e.kind] || 'var(--ink-3)' }} />
                      ))}
                      {evts.length > 3 && <div style={{ fontSize: 8, color: 'var(--ink-3)' }}>+{evts.length - 3}</div>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected day mini agenda */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Today · Apr 17 · 4 events</div>
          {M_CAL.calendar[0].items.map((it, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 10, padding: '10px 12px', marginBottom: 6, alignItems: 'center', cursor: 'pointer' }} onClick={() => goto('calEventDetail')}>
              <div style={{ width: 3, alignSelf: 'stretch', background: kindColor[it.kind] || 'var(--ink-3)', borderRadius: 2 }} />
              <div style={{ width: 44, fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--mono)' }}>{it.t}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{it.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 80 }} />
    </>
  );
}

// ─── EVENT DETAIL ─────────────────────────────────────────────────────
function CalendarEventDetail({ goto }) {
  const [tab, setTab] = useStateCal('Details');
  const tabs = ['Details', 'Contact', 'Notes'];

  return (
    <>
      <div className="topbar" style={{ paddingBottom: 6 }}>
        <div className="topbar-row">
          <button className="icon-btn" onClick={() => goto('calDay')}><window.Icon name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} /></button>
          <div style={{ flex: 1 }} />
          <button className="icon-btn"><window.Icon name="pen" size={14} /></button>
          <button className="icon-btn" style={{ marginLeft: 6 }}><window.Icon name="more" size={16} /></button>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Event hero */}
        <div style={{ background: kindBg.showing, borderLeft: '4px solid ' + kindColor.showing, borderRadius: '0 12px 12px 0', padding: '16px 16px 16px 14px', marginBottom: 16 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
            <span className="badge brand">Showing</span>
            <span className="meta tnum">Today, Apr 17</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>128 Balsam Ave</div>
          <div style={{ color: 'var(--ink-3)', fontSize: 14, marginTop: 2 }}>The Beach · Toronto</div>
          <div className="flex items-center gap-3 mt-3">
            <div>
              <div className="meta" style={{ fontSize: 10 }}>START</div>
              <div className="tnum" style={{ fontSize: 16, fontWeight: 700 }}>10:30 AM</div>
            </div>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <window.Icon name="arrowRight" size={14} color="var(--ink-3)" />
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <div style={{ textAlign: 'right' }}>
              <div className="meta" style={{ fontSize: 10 }}>END</div>
              <div className="tnum" style={{ fontSize: 16, fontWeight: 700 }}>11:15 AM</div>
            </div>
          </div>
        </div>

        <div style={{ borderBottom: '1px solid var(--border-2)', marginBottom: 14 }}>
          <div className="chips" style={{ padding: '0 0 0', mask: 'none', WebkitMask: 'none' }}>
            {tabs.map(t => (
              <button key={t} className="chip" onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '8px 0', marginRight: 20, fontWeight: tab === t ? 600 : 500 }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === 'Details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card card-pad">
              <window.KVRow k="Address" v="128 Balsam Ave, The Beach" />
              <window.KVRow k="Type" v="Showing" />
              <window.KVRow k="Duration" v="45 minutes" />
              <window.KVRow k="MLS #" v="E8912476" />
              <window.KVRow k="List price" v="$1,295,000" last />
            </div>
            <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: 'oklch(0.62 0.14 254)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>MC</div>
              <div>
                <div style={{ fontWeight: 600 }}>Marcus & Priya Chen</div>
                <div className="row-sub">Buyer client · Chen Family</div>
              </div>
            </div>
            <div className="card card-pad">
              <div className="flex items-center gap-2">
                <window.Icon name="car" size={16} color="var(--ink-2)" />
                <span style={{ fontWeight: 500 }}>Drive from previous</span>
                <div style={{ flex: 1 }} />
                <span className="badge" style={{ fontFamily: 'var(--mono)' }}>≈ 18 min</span>
              </div>
              <div className="meta mt-2">Previous: Buyer consultation at 12:00 PM · 26 min drive · <span style={{ color: 'oklch(0.50 0.17 25)', fontWeight: 500 }}>Tight window</span></div>
            </div>
          </div>
        )}

        {tab === 'Contact' && (
          <div className="card card-pad">
            <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: 'oklch(0.62 0.14 254)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 15 }}>MC</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Marcus & Priya Chen</div>
                <div className="row-sub">Buyer client</div>
              </div>
            </div>
            {[['Phone', '+1 (416) 555-0211'], ['Email', 'chen.family@gmail.com'], ['Pre-approval', 'RBC · $1,350,000'], ['Budget', '$1.2–1.3M']].map(([k, v]) => (
              <window.KVRow key={k} k={k} v={v} />
            ))}
          </div>
        )}

        {tab === 'Notes' && (
          <div>
            <div className="card card-pad" style={{ marginBottom: 10 }}>
              <div className="meta" style={{ fontSize: 11, marginBottom: 6 }}>Pre-showing notes</div>
              <div style={{ fontSize: 14, lineHeight: 1.55 }}>Clients have toured 4 other homes in The Beach. 128 Balsam is the top contender. Confirm parking and basement before showing starts. Priya prefers natural light.</div>
            </div>
            <button style={{ width: '100%', padding: 12, border: '1px dashed var(--border)', background: 'transparent', borderRadius: 10, color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14 }}>
              + Add post-showing note
            </button>
          </div>
        )}
      </div>
      <div style={{ height: 120 }} />

      {/* Action bar */}
      <div className="actionbar">
        <button><window.Icon name="map" size={18} /><span>Navigate</span></button>
        <button><window.Icon name="phone" size={18} /><span>Call</span></button>
        <button className="primary"><window.Icon name="note" size={18} /><span>Add note</span></button>
        <button><window.Icon name="more" size={18} /><span>More</span></button>
      </div>
    </>
  );
}

// ─── Router helper (view switcher inside a view) ───────────────────────
function CalendarViewRouter({ view, setView, goto }) {
  if (view === 'Day')   return <CalendarDay   goto={goto} />;
  if (view === 'Week')  return <CalendarWeek  goto={goto} />;
  if (view === 'Month') return <CalendarMonth goto={goto} />;
  return <window.CalendarScreen goto={goto} />;
}

window.CalendarDay = CalendarDay;
window.CalendarWeek = CalendarWeek;
window.CalendarMonth = CalendarMonth;
window.CalendarEventDetail = CalendarEventDetail;
