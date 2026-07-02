// screen-cal-tasks.jsx — Calendar agenda + Tasks
function Calendar({ goto }) {
  const { TopBar } = window;
  const M = window.MOCK; const I = window.Icon;
  const [vm, setVm] = React.useState('Agenda');

  const kindIcon = {
    showing: 'home', consult: 'users', inspect: 'doc', call: 'phone', offer: 'coins',
  };
  const kindColor = {
    showing: 'oklch(0.62 0.14 254)',
    consult: 'oklch(0.58 0.14 150)',
    inspect: 'oklch(0.55 0.17 310)',
    call:    'oklch(0.55 0.08 260)',
    offer:   'oklch(0.62 0.14 30)',
  };

  return (
    <>
      <TopBar title="Calendar" noSearchField />
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="seg">
          {['Agenda', 'Day', 'Week', 'Month'].map(v => (
            <button key={v} data-active={vm === v} onClick={() => setVm(v)}>{v}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <span className="meta tnum">April 2026</span>
      </div>

      {vm === 'Agenda' && (
        <div style={{ padding: '0 16px' }}>
          {M.calendar.map((g, gi) => (
            <div key={g.day} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 4px 10px', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em' }}>{g.day}</div>
                <div className="meta tnum">{g.date}</div>
                <div style={{ flex: 1 }} />
                <span className="meta tnum">{g.items.length} events</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {g.items.map((it, i) => (
                  <React.Fragment key={i}>
                    <div className="card card-pad" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 64, textAlign: 'left', flex: 'none' }}>
                        <div className="tnum" style={{ fontWeight: 600, fontSize: 14 }}>{it.t}</div>
                        <div className="meta tnum" style={{ fontSize: 11 }}>{it.end}</div>
                      </div>
                      <div style={{ width: 2, alignSelf: 'stretch', background: kindColor[it.kind], borderRadius: 2 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="row-title">{it.title}</div>
                        <div className="row-sub flex items-center gap-2 mt-1">
                          <I name={kindIcon[it.kind]} size={12} />
                          <span>{it.who}</span>
                        </div>
                      </div>
                      <I name="chevron" size={16} color="var(--ink-4)" />
                    </div>

                    {i < g.items.length - 1 && it.drive && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', marginLeft: 20 }}>
                        <I name="car" size={13} color={g.items[i+1].tight ? 'oklch(0.5 0.17 25)' : 'var(--ink-3)'} />
                        <span className="meta tnum" style={{ color: g.items[i+1].tight ? 'oklch(0.5 0.17 25)' : 'var(--ink-3)', fontWeight: 500 }}>
                          ≈ {g.items[i+1].drive || it.drive} min drive {g.items[i+1].tight ? '· tight' : ''}
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          <div style={{ height: 40 }} />
        </div>
      )}

      {vm !== 'Agenda' && (
        <div style={{ padding: 16 }}>
          <div className="card card-pad" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--ink-3)' }}>
            <I name="calendar" size={28} color="var(--ink-4)" />
            <div className="mt-2" style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{vm} view</div>
            <div className="meta mt-1">Agent default on mobile is Agenda.</div>
          </div>
        </div>
      )}
    </>
  );
}

function Tasks({ goto }) {
  const { TopBar } = window;
  const M = window.MOCK; const I = window.Icon;
  const [filter, setFilter] = React.useState('Today + Overdue');
  const [done, setDone] = React.useState({});
  const [openId, setOpenId] = React.useState(null);

  const all = M.tasks;
  const shown = filter === 'Today + Overdue' ? all.filter(t => !t.when.startsWith('Tomorrow') && !t.when.startsWith('Fri')) :
                filter === 'Overdue' ? all.filter(t => t.tone === 'danger') :
                filter === 'Today' ? all.filter(t => t.when.startsWith('Today')) :
                filter === 'Upcoming' ? all.filter(t => t.when.startsWith('Tomorrow') || t.when.startsWith('Fri')) :
                all;

  const overdue = shown.filter(t => t.tone === 'danger');
  const today   = shown.filter(t => t.tone !== 'danger' && t.when.startsWith('Today'));
  const later   = shown.filter(t => !t.when.startsWith('Today') && t.tone !== 'danger');

  return (
    <>
      <TopBar title="Tasks" />
      <div className="chips" style={{ paddingBottom: 12 }}>
        {['Today + Overdue', 'Overdue', 'Today', 'Upcoming', 'All'].map(c => (
          <button key={c} className="chip" data-active={filter === c} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { name: 'Overdue', list: overdue, tone: 'danger' },
          { name: 'Today',   list: today,   tone: 'warn' },
          { name: 'Later',   list: later,   tone: 'ok' },
        ].map(section => section.list.length === 0 ? null : (
          <div key={section.name}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 4px 8px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: section.tone === 'danger' ? 'oklch(0.5 0.17 25)' : 'var(--ink-2)' }}>
                {section.name}
              </div>
              <span className="count tnum" style={{ color: 'var(--ink-3)', fontSize: 12 }}>{section.list.length}</span>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {section.list.map((t, i) => (
                <div key={t.id} className="swipe-wrap" style={{ background: done[t.id] ? 'oklch(0.97 0.03 150)' : 'var(--surface)', borderBottom: i < section.list.length - 1 ? '1px solid var(--border-2)' : 0 }}>
                  <div className="swipe-actions">
                    <button className="resch"><I name="clock" size={16} />Resched</button>
                    <button className="del"><I name="more" size={16} />Delete</button>
                  </div>
                  <div
                    className="swipe-inner"
                    data-open={openId === t.id}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', cursor: 'pointer' }}
                    onClick={() => window.openSheet?.('taskDetail')}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); setDone(d => ({ ...d, [t.id]: !d[t.id] })); }}
                      style={{ width: 22, height: 22, borderRadius: 999, border: '1.5px solid ' + (done[t.id] ? 'var(--success)' : 'var(--border)'), background: done[t.id] ? 'var(--success)' : 'transparent', cursor: 'pointer', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginTop: 1 }}
                    >
                      {done[t.id] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10"/></svg>}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row-title" style={{ fontSize: 14, textDecoration: done[t.id] ? 'line-through' : 'none', color: done[t.id] ? 'var(--ink-3)' : 'var(--ink)' }}>
                        {t.text}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={'countdown ' + t.tone}>{t.when}</span>
                        <span className="meta">· {t.contact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ height: 40 }} />
      </div>
    </>
  );
}

window.CalendarScreen = Calendar;
window.Tasks = Tasks;
