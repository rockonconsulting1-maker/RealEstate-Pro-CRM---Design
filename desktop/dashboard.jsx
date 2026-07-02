// dashboard.jsx — Desktop dashboard
const D_M = window.MOCK; const D_I = window.Icon;
const { Money: DMoney, Countdown: DCD, Avatar: DAv, Spark } = window.RC;

function Dashboard({ goto }) {
  const a = D_M.nextAppointment;
  const sparks = [
    [4,5,3,6,5,7,8,7,9,10,11,9,12],
    [2,3,3,4,5,4,6,7,7,8,9,9,11],
    [3.2,3.4,3.5,3.7,3.6,3.9,4.1,4.0,4.3,4.5,4.6,4.7,4.82],
    [60,72,80,75,90,95,100,108,112,118,118,118,118],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="page-head">
        <div>
          <div className="sub">Friday, April 17 · 9:41 AM</div>
          <h1>Good morning, Jordan</h1>
        </div>
        <div className="actions">
          <button className="btn ghost sm"><span className="now-pulse" />Live · synced 2m ago</button>
          <button className="btn sm"><D_I name="share" size={14} />Export</button>
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('quickAdd')}><D_I name="plus" size={14} color="#fff" />Quick add</button>
        </div>
      </div>

      {/* Top row — Hero + KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* Next appointment hero */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
            <div style={{ padding: '22px 24px' }}>
              <div className="flex items-center gap-2">
                <span className="badge info">Next up</span>
                <span className="meta">in {a.minutesUntil} min</span>
              </div>
              <div className="tnum" style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1, marginTop: 10 }}>
                10:30 AM
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 6, letterSpacing: '-0.015em' }}>
                Showing · {a.address}
              </div>
              <div className="meta" style={{ marginTop: 2 }}>{a.city}</div>

              <div className="flex items-center gap-3 mt-3" style={{ paddingTop: 14, borderTop: '1px solid var(--border-2)', marginTop: 18 }}>
                <DAv name={a.contactName} role="buyer" size={36} />
                <div className="flex-1">
                  <div style={{ fontWeight: 600 }}>{a.contactName}</div>
                  <div className="meta">Buyer client · 4th showing</div>
                </div>
                <span className="badge"><D_I name="car" size={11} />≈ {a.drive} min drive</span>
              </div>

              <div className="flex gap-2 mt-3" style={{ marginTop: 16 }}>
                <button className="btn primary"><D_I name="arrowRight" size={14} color="#fff" />Navigate</button>
                <button className="btn"><D_I name="phone" size={14} />Call client</button>
                <button className="btn"><D_I name="note" size={14} />Brief</button>
              </div>
            </div>
            <div style={{ position: 'relative', borderLeft: '1px solid var(--border-2)' }}>
              <div className="ph" data-label="map · 128 Balsam Ave" style={{ position: 'absolute', inset: 0 }} />
              <div className="map-pin selected" style={{ left: '52%', top: '52%' }}>
                <div className="pin-body">10:30 · Chen</div>
              </div>
              <div className="map-pin" style={{ left: '30%', top: '70%' }}>
                <div className="pin-body">12:00 · Okonkwo</div>
              </div>
              <div className="map-pin" style={{ left: '70%', top: '32%' }}>
                <div className="pin-body">2:00 · Tran</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI grid 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {D_M.stats.map((s, i) => (
            <div key={s.label} className="stat">
              <div className="lbl">{s.label}</div>
              <div className="flex items-center gap-2" style={{ alignItems: 'baseline' }}>
                <div className="val tnum">{s.value}</div>
                <div className="delta"><D_I name="arrowUp" size={12} />{s.trend}</div>
              </div>
              <Spark data={sparks[i]} color={i === 2 ? 'oklch(0.55 0.16 254)' : 'var(--success)'} />
            </div>
          ))}
        </div>
      </div>

      {/* Second row — Attention / Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 18 }}>
        {/* Attention */}
        <div className="card">
          <div className="card-head">
            <h2>Needs your attention</h2>
            <div style={{ flex: 1 }} />
            <span className="meta">3 items</span>
          </div>
          <div>
            {D_M.attention.map((it, i) => (
              <div key={it.id} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                <span className={'badge ' + (it.tone === 'danger' ? 'danger' : it.tone === 'warn' ? 'warn' : 'info')}
                  style={{ fontSize: 13, fontWeight: 700, minWidth: 28, justifyContent: 'center' }}>
                  <span className="tnum">{it.count}</span>
                </span>
                <div>
                  <div className="lname">{it.label}</div>
                  <div className="lsub">{it.kind === 'overdue' ? 'Review and reschedule' : it.kind === 'newleads' ? 'Respond in under 5 min' : 'Expiring within 24h'}</div>
                </div>
                <D_I name="chevron" size={16} color="var(--ink-4)" />
              </div>
            ))}
            <div className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto', borderBottom: 0 }}>
              <span className="badge solid" style={{ fontSize: 13, fontWeight: 700, minWidth: 28, justifyContent: 'center' }}>1</span>
              <div>
                <div className="lname">Closing reminder · Tran</div>
                <div className="lsub">Funds release Apr 21 · 4 days</div>
              </div>
              <D_I name="chevron" size={16} color="var(--ink-4)" />
            </div>
          </div>
        </div>

        {/* Pipeline funnel */}
        <div className="card card-pad">
          <div className="flex items-center" style={{ marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>Pipeline this quarter</h2>
            <div style={{ flex: 1 }} />
            <span className="meta tnum">$13.8M</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { k: 'New leads',         v: 28, w: 100, c: '#ADB5BD' },
              { k: 'Contacted',         v: 19, w: 75,  c: '#74C0FC' },
              { k: 'Engaged',           v: 14, w: 56,  c: '#339AF0' },
              { k: 'Appointment set',   v: 9,  w: 38,  c: '#FAB005' },
              { k: 'Agreement signed',  v: 5,  w: 22,  c: '#40C057' },
              { k: 'Closed MTD',        v: 2,  w: 10,  c: '#15803d' },
            ].map(s => (
              <div key={s.k} className="flex items-center gap-3">
                <div style={{ width: 130, fontSize: 12, color: 'var(--ink-2)', fontWeight: 500 }}>{s.k}</div>
                <div style={{ flex: 1, height: 8, borderRadius: 999, background: 'var(--bg-sunk)', overflow: 'hidden' }}>
                  <div style={{ width: s.w + '%', height: '100%', background: s.c, opacity: 0.85 }} />
                </div>
                <div className="tnum" style={{ width: 24, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending offers */}
        <div className="card">
          <div className="card-head">
            <h2>Pending offers</h2>
            <div style={{ flex: 1 }} />
            <a className="meta" style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={() => goto('offers')}>See all →</a>
          </div>
          <div>
            {D_M.pendingOffers.map(o => (
              <div key={o.id} className="lrow" style={{ gridTemplateColumns: '1fr auto auto' }}>
                <div>
                  <div className="lname truncate">{o.address}</div>
                  <div className="lsub">{o.client} · {o.status}</div>
                </div>
                <DMoney v={o.price} />
                <DCD minutes={o.expMin} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third row — New leads + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <div className="card">
          <div className="card-head">
            <h2>New leads · last 48h</h2>
            <div style={{ flex: 1 }} />
            <div className="chips">
              {['All', 'Hot', 'Warm', 'Cold'].map((c, i) => (
                <button key={c} className="chip" data-active={i === 0}>{c}</button>
              ))}
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Stage</th>
                <th>Budget / Target</th>
                <th>Temp</th>
                <th className="num">Age</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {D_M.newLeads.map(l => (
                <tr key={l.id} onClick={() => goto('leadDetail')} style={{ cursor: 'pointer' }}>
                  <td>
                    <div className="flex items-center gap-2">
                      <DAv name={l.name} role={l.role} size={28} />
                      <div>
                        <div className="name">{l.name}</div>
                        <div className="sub">
                          <span className={'role ' + (l.role === 'seller' ? 'seller' : 'buyer')}>
                            <span className="dot" style={{ background: l.role === 'seller' ? 'oklch(0.58 0.17 310)' : 'oklch(0.62 0.14 254)' }} />
                            {l.role === 'seller' ? 'Seller' : 'Buyer'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-2">
                      <span className="dot" style={{ background: l.color }} />{l.stage}
                    </span>
                  </td>
                  <td className="tnum">{l.budget}</td>
                  <td>
                    {l.temp === 'Hot'  && <span className="badge danger"><D_I name="flame" size={10} />Hot</span>}
                    {l.temp === 'Warm' && <span className="badge warn">Warm</span>}
                    {l.temp === 'Cold' && <span className="badge">Cold</span>}
                  </td>
                  <td className="num tnum">{l.ago} ago</td>
                  <td><D_I name="chevron" size={14} color="var(--ink-4)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Recent activity</h2>
            <div style={{ flex: 1 }} />
            <div className="chips">
              {['All', 'Notes', 'Calls', 'Stage'].map((c, i) => (
                <button key={c} className="chip" data-active={i === 0}>{c}</button>
              ))}
            </div>
          </div>
          <div className="tline">
            {D_M.activity.map(group => (
              <React.Fragment key={group.day}>
                <div className="tline-day">{group.day}</div>
                {group.items.map((it, i) => (
                  <div key={i} className="tline-row">
                    <div className="tline-t tnum">{it.t}</div>
                    <div className="tline-rail"><div className={'pip ' + (it.kind === 'note' ? 'brand' : it.kind === 'call' ? 'success' : it.kind === 'stage' ? 'warn' : '')} /></div>
                    <div className="tline-text">
                      <div className="who">{it.who}</div>
                      <div className="body">{it.text}</div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
            <div style={{ padding: '12px 18px 18px', textAlign: 'center' }}>
              <button className="btn ghost sm">Load older →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.RC.Dashboard = Dashboard;
