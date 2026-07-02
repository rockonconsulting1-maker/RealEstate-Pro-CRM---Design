// screen-settings.jsx — Settings / Profile screen
function Toggle({ on: initialOn }) {
  const [on, setOn] = React.useState(initialOn);
  return (
    <div onClick={() => setOn(o => !o)} style={{ width: 44, height: 26, borderRadius: 999, background: on ? 'var(--brand)' : 'var(--border)', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 160ms' }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 160ms' }} />
    </div>
  );
}

function SettingsSection({ label }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '16px 4px 8px' }}>{label}</div>
  );
}

function Settings({ goto }) {
  const I = window.Icon;
  const [tab, setTab] = React.useState('Profile');
  const tabs = ['Profile', 'Preferences', 'Data'];

  return (
    <>
      <div className="topbar">
        <div className="topbar-row">
          <button className="icon-btn" onClick={() => goto('dash')}>
            <I name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <h1 style={{ fontSize: 20, margin: 0, flex: 1 }}>Settings</h1>
          <button className="icon-btn"><I name="more" size={16} /></button>
        </div>
      </div>

      {/* Agent card */}
      <div style={{ padding: '4px 16px 14px' }}>
        <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="ph" data-label="headshot" style={{ width: 64, height: 64, borderRadius: 999, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em' }}>Jordan Reyes</div>
            <div className="row-sub">RE/MAX Hallmark · Toronto</div>
            <div className="row-sub tnum" style={{ marginTop: 1 }}>RECO Lic. M21001234</div>
          </div>
          <button className="icon-btn"><I name="pen" size={14} /></button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border-2)', marginBottom: 0 }}>
        <div className="chips" style={{ padding: '0 12px', mask: 'none', WebkitMask: 'none' }}>
          {tabs.map(t => (
            <button key={t} className="chip" onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '10px 0', marginRight: 16, fontWeight: tab === t ? 600 : 500 }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px', paddingBottom: 120 }}>

        {tab === 'Profile' && (
          <>
            <SettingsSection label="Contact" />
            <div className="card" style={{ overflow: 'hidden' }}>
              {[
                ['Full name',   'Jordan Reyes'],
                ['Brokerage',   'RE/MAX Hallmark Realty'],
                ['Phone',       '+1 (416) 555-0188'],
                ['Email',       'jordan@remax-hallmark.ca'],
                ['RECO #',      'M21001234'],
                ['License exp.','Mar 31, 2027'],
              ].map(([k, v], i, arr) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-2)' : 0 }}>
                  <div style={{ width: 100, fontSize: 13, color: 'var(--ink-3)', flexShrink: 0 }}>{k}</div>
                  <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{v}</div>
                  <I name="chevron" size={13} color="var(--ink-4)" />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'Preferences' && (
          <>
            <SettingsSection label="Notifications" />
            <div className="card" style={{ overflow: 'hidden' }}>
              {[
                { label: 'New leads',           sub: 'Instant push + email',     on: true  },
                { label: 'Offer expiry alerts', sub: '60 min + 15 min before',   on: true  },
                { label: 'Task reminders',      sub: '30 min before due',        on: true  },
                { label: 'Showing confirmations',sub: 'When client confirms',    on: false },
                { label: 'Weekly summary',      sub: 'Every Monday 8 AM',       on: false },
              ].map((item, i, arr) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-2)' : 0 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{item.label}</div>
                    <div className="row-sub">{item.sub}</div>
                  </div>
                  <Toggle on={item.on} />
                </div>
              ))}
            </div>
            <SettingsSection label="Display" />
            <div className="card" style={{ overflow: 'hidden' }}>
              {[
                { label: 'Default calendar view', val: 'Agenda' },
                { label: 'Default leads view',    val: 'List' },
                { label: 'Currency format',        val: 'CAD · $' },
                { label: 'Date format',            val: 'MMM D, YYYY' },
              ].map(({ label, val }, i, arr) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-2)' : 0 }}>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{label}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{val}</div>
                  <I name="chevron" size={13} color="var(--ink-4)" />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'Data' && (
          <>
            <SettingsSection label="Sync" />
            <div className="card" style={{ overflow: 'hidden' }}>
              {[
                { label: 'Sync status',    sub: 'Synced · 2 min ago',     icon: 'check'  },
                { label: 'Export data',    sub: 'CSV · last 90 days',     icon: 'share'  },
                { label: 'Import contacts',sub: 'CSV or vCard',           icon: 'user'   },
                { label: 'Backup',         sub: 'Last backup: today 6 AM',icon: 'doc'    },
              ].map(({ label, sub, icon }, i, arr) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-2)' : 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-sunk)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <I name={icon} size={15} color="var(--ink-2)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{label}</div>
                    <div className="row-sub">{sub}</div>
                  </div>
                  <I name="chevron" size={13} color="var(--ink-4)" />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <button style={{ width: '100%', padding: '13px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--destructive)', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

window.Settings = Settings;
