// screens3.jsx — Full tab content: ClientDetail + PropDetail (overrides screens.jsx stubs)
// Loads after screens2.jsx; overwrites window.RC.ClientDetail and window.RC.PropDetail.
const S3_I = window.Icon;
const { Avatar: S3Av, Money: S3Money, Countdown: S3CD } = window.RC;

// Shared helpers
function S3DocRow({ name, type, date, size }) {
  return (
    <div className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
      <div style={{ width: 36, height: 36, borderRadius: 7, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <S3_I name={type === 'ZIP' ? 'camera' : 'doc'} size={16} color="var(--ink-3)" />
      </div>
      <div><div className="lname">{name}</div><div className="lsub">{type} · {date} · {size}</div></div>
      <S3_I name="down" size={14} color="var(--ink-4)" />
    </div>
  );
}

function S3TaskRow({ text, when, tone }) {
  return (
    <div className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
      <input type="checkbox" />
      <div><div className="lname">{text}</div><div className="lsub">{when}</div></div>
      <span className={'badge ' + (tone === 'warn' ? 'warn' : tone === 'danger' ? 'danger' : '')}>
        {tone === 'warn' ? 'Today' : tone === 'danger' ? 'Overdue' : 'Upcoming'}
      </span>
    </div>
  );
}

function S3NoteCard({ when, tag, body }) {
  return (
    <div className="card card-pad">
      <div className="flex items-center gap-2">
        <span className="badge brand">{tag}</span>
        <div style={{ flex: 1 }} />
        <span className="meta tnum">{when}</span>
      </div>
      <div style={{ color: 'var(--ink-2)', marginTop: 8, fontSize: 13, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

function S3TimelineRow({ t, who, body, kind }) {
  return (
    <div className="tline-row">
      <div className="tline-t tnum">{t}</div>
      <div className="tline-rail"><div className={'pip ' + (kind === 'note' ? 'brand' : kind === 'call' ? 'success' : 'warn')} /></div>
      <div className="tline-text"><div className="who">{who}</div><div className="body">{body}</div></div>
    </div>
  );
}

// ── Full ClientDetail ────────────────────────────────────────────────────────
function ClientDetail({ goto }) {
  const [tab, setTab] = React.useState('Overview');
  const ConvTab = window.RC.ConversationsTab;
  const stages = ['Needs Analysis', 'Property Search', 'Offer Submitted', 'Under Contract', 'Closed'];
  const cur = 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <button className="btn ghost sm" onClick={() => goto('clients')}><S3_I name="chevron" size={14} /> All clients</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm"><S3_I name="share" size={14} />Share</button>
        <button className="btn sm"><S3_I name="pen" size={14} />Edit</button>
        <button className="btn primary sm"><S3_I name="phone" size={14} color="#fff" />Call client</button>
      </div>

      <div className="card card-pad">
        <div className="flex items-center gap-3">
          <S3Av name="Marcus & Priya Chen" role="buyer" size={56} />
          <div className="flex-1">
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Marcus & Priya Chen</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="role buyer"><span className="dot" style={{ background: 'oklch(0.62 0.14 254)' }} />Buyer client</span>
              <span className="meta">· Last contact <span className="tnum">2h ago</span></span>
              <span className="meta">· DOM <span className="tnum">31</span></span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="meta">Active offer</div>
            <div className="money tnum" style={{ fontSize: 22, marginTop: 2 }}><span className="sym">$</span>1,245,000</div>
          </div>
        </div>
        <div className="mt-4" style={{ marginTop: 20 }}>
          <div className="steps">{stages.map((s, i) => <div key={s} className={'step ' + (i < cur ? 'done' : i === cur ? 'cur' : '')} />)}</div>
          <div className="steps-labels">{stages.map(s => <span key={s}>{s}</span>)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 18 }}>
          {[['Budget','$1.2–1.4M'],['Pre-approval','TD · $1.4M'],['Active offers','1 · Submitted'],['Showings done','14']].map(([k,v]) => (
            <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
              <div className="meta">{k}</div>
              <div className="tnum" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {['Overview','Properties','Offers','Tasks','Notes','Conversations','Activity','Files'].map(t => (
          <button key={t} data-active={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head"><h2>Active offer · 128 Balsam Ave</h2><div style={{ flex: 1 }} /><span className="badge warn">Submitted · counter expected</span></div>
            <div style={{ padding: 18 }}>
              <div className="ph" data-label="hero · 128 Balsam Ave" style={{ height: 220, borderRadius: 8 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
                {[['List','$1,295,000'],['Offered','$1,245,000'],['Deposit','$65,000'],['Expires in','5h 40m']].map(([k,v]) => (
                  <div key={k}><div className="meta">{k}</div><div className="tnum" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h2>Open tasks</h2><div style={{ flex: 1 }} /><span className="meta tnum">3</span></div>
            <div>
              {[
                { text: 'Confirm inspection booking', when: 'Today · 2:00 PM', tone: 'warn' },
                { text: 'Send counter draft to listing', when: 'Today · 6:00 PM', tone: 'warn' },
                { text: 'Update Marcus on counter terms', when: 'Tomorrow', tone: 'ok' },
              ].map((t, i) => <S3TaskRow key={i} {...t} />)}
            </div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-head"><h2>Recent activity</h2></div>
            <div className="tline">
              {[
                { t: 'Today 09:12', who: 'Marcus Chen', body: 'Confirmed 10:30 showing at 128 Balsam', kind: 'call' },
                { t: 'Apr 16', who: 'You', body: 'Submitted offer · $1.245M, 65k deposit, 14-day close', kind: 'stage' },
                { t: 'Apr 15', who: 'You', body: 'Showing #14 — 128 Balsam Ave', kind: 'note' },
                { t: 'Apr 12', who: 'You', body: 'Showing #13 — 18 Lower Jarvis', kind: 'note' },
              ].map((it, i) => <S3TimelineRow key={i} {...it} />)}
            </div>
          </div>
        </div>
      )}

      {tab === 'Properties' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-head"><h2>Properties toured · 14</h2><div style={{ flex: 1 }} /><button className="btn sm" onClick={() => goto('propDetail')}><S3_I name="plus" size={13} />Add</button></div>
          <div>
            {[
              { addr: '128 Balsam Ave',    sub: 'The Beach · 4 bd · 3 ba · $1,295,000', badge: 'Offer sent', tone: 'info' },
              { addr: '44 Glen Manor Dr',  sub: 'The Beach · 3 bd · 2 ba · $1,085,000', badge: 'Declined', tone: '' },
              { addr: '18 Wineva Ave',     sub: 'Upper Beaches · 4 bd · $1,190,000',    badge: 'Outbid',   tone: 'warn' },
              { addr: '202 Woodbine Ave',  sub: 'East York · 3 bd · 2 ba · $1,050,000', badge: 'Declined', tone: '' },
              { addr: '5 Elmer Ave',       sub: 'The Beach · 3 bd · 1 ba · $979,000',   badge: 'Declined', tone: '' },
            ].map((p, i) => (
              <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto', cursor: 'pointer' }} onClick={() => goto('propDetail')}>
                <div className="ph" data-label="" style={{ width: 44, height: 44, borderRadius: 6 }} />
                <div><div className="lname">{p.addr}</div><div className="lsub">{p.sub}</div></div>
                <span className={'badge ' + p.tone}>{p.badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Offers' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-head"><h2>All offers · 2</h2><div style={{ flex: 1 }} /><button className="btn primary sm" onClick={() => window.RC.openModal?.('offer')}><S3_I name="plus" size={13} color="#fff" />New offer</button></div>
          <table className="tbl">
            <thead><tr><th>Property</th><th>Status</th><th className="num">Price</th><th className="num">Deposit</th><th>Expires</th><th></th></tr></thead>
            <tbody>
              {[
                { addr: '128 Balsam Ave', status: 'Submitted', tone: 'info', price: 1245000, deposit: 65000, exp: 340 },
                { addr: '18 Wineva Ave',  status: 'Expired',   tone: '',     price: 1190000, deposit: 60000, exp: -500 },
              ].map((o, i) => (
                <tr key={i} onClick={() => goto('offerDetail')} style={{ cursor: 'pointer' }}>
                  <td><div className="name">{o.addr}</div></td>
                  <td><span className={'badge ' + o.tone}>{o.status}</span></td>
                  <td className="num"><S3Money v={o.price} /></td>
                  <td className="num tnum">${o.deposit.toLocaleString()}</td>
                  <td><S3CD minutes={o.exp} /></td>
                  <td><S3_I name="chevron" size={14} color="var(--ink-4)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn primary sm" onClick={() => window.RC.openModal?.('task')}><S3_I name="plus" size={13} color="#fff" />New task</button>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge warn">2</span><h2 style={{ marginLeft: 6 }}>Today</h2></div>
            <div>
              <S3TaskRow text="Confirm inspection booking with Baraka" when="Today · 2:00 PM" tone="warn" />
              <S3TaskRow text="Send counter draft to listing agent" when="Today · 6:00 PM" tone="warn" />
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge">1</span><h2 style={{ marginLeft: 6 }}>Upcoming</h2></div>
            <div>
              <S3TaskRow text="File deposit wire transfer on acceptance" when="Mon Apr 21" tone="ok" />
            </div>
          </div>
        </div>
      )}

      {tab === 'Notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn primary sm" onClick={() => window.RC.openModal?.('note')}><S3_I name="plus" size={13} color="#fff" />New note</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <S3NoteCard when="Today 09:12" tag="Offer"     body="Counter expected by 5 PM. Marcus confirmed $1.25M cap. Priya open to waiving inspection if counter &lt; $1.26M." />
            <S3NoteCard when="Apr 17"     tag="Showing"   body="Showing #14 at 128 Balsam. Clients very engaged — asked about schools, transit, and the basement suite." />
            <S3NoteCard when="Apr 14"     tag="Financing" body="Pre-approval confirmed from TD at $1.4M, valid Oct 2026. Parking is now a hard requirement per Marcus." />
          </div>
        </div>
      )}

      {tab === 'Conversations' && ConvTab && <ConvTab name="Marcus & Priya Chen" goto={goto} />}

      {tab === 'Activity' && (
        <div className="card">
          <div className="card-head"><h2>Full activity history</h2><div style={{ flex: 1 }} /><span className="meta tnum">12 events</span></div>
          <div className="tline">
            {[
              { t: 'Today 09:12',   who: 'Marcus Chen',  body: 'Confirmed 10:30 showing at 128 Balsam. Excited about the listing.',                kind: 'call'  },
              { t: 'Apr 16 17:00',  who: 'You',          body: 'Offer submitted at $1,245,000 with financing and inspection conditions.',           kind: 'stage' },
              { t: 'Apr 16 16:15',  who: 'Marcus Chen',  body: 'Reviewed offer terms on call (12 min). Approved deposit and conditions.',           kind: 'call'  },
              { t: 'Apr 16 14:30',  who: 'You',          body: 'Offer drafted — $1,245,000, Jun 6 close, $65k deposit.',                           kind: 'note'  },
              { t: 'Apr 15',        who: 'You',          body: 'Showing #14 at 128 Balsam Ave. Clients very interested.',                           kind: 'note'  },
              { t: 'Apr 12',        who: 'You',          body: 'Showing #13 — 18 Lower Jarvis. Priya liked the kitchen.',                           kind: 'note'  },
              { t: 'Apr 10',        who: 'You',          body: 'Moved to Offer Submitted stage.',                                                   kind: 'stage' },
              { t: 'Apr 7',         who: 'Priya Chen',   body: 'Sent updated wish list — parking now mandatory.',                                   kind: 'note'  },
            ].map((it, i) => <S3TimelineRow key={i} {...it} />)}
          </div>
        </div>
      )}

      {tab === 'Files' && (
        <div className="card">
          <div className="card-head"><h2>Documents</h2><div style={{ flex: 1 }} /><button className="btn sm"><S3_I name="plus" size={13} />Upload</button></div>
          <div>
            <S3DocRow name="Buyer Representation Agreement" type="PDF" date="Apr 14 2026" size="142 KB" />
            <S3DocRow name="TD Pre-approval Letter"         type="PDF" date="Apr 12 2026" size="89 KB"  />
            <S3DocRow name="Offer · 128 Balsam Ave"         type="PDF" date="Apr 16 2026" size="204 KB" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Full PropDetail ───────────────────────────────────────────────────────────
function PropDetail({ goto }) {
  const [tab, setTab] = React.useState('Contacts');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <button className="btn ghost sm" onClick={() => goto('myListings')}>‹ My Listings</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm"><S3_I name="share" size={14} />Share</button>
        <button className="btn sm" onClick={() => window.RC.openModal?.('event')}><S3_I name="calendar" size={14} />Schedule showing</button>
        <button className="btn primary sm" onClick={() => window.RC.openModal?.('offer')}><S3_I name="coins" size={14} color="#fff" />Add offer</button>
      </div>

      {/* Hero always visible */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div>
          <div className="ph" data-label="hero · 128 Balsam Ave" style={{ height: 320, borderRadius: 10, border: '1px solid var(--border)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
            {[1,2,3,4].map(i => <div key={i} className="ph" data-label={'photo ' + i} style={{ height: 70, borderRadius: 6, border: '1px solid var(--border)' }} />)}
          </div>
        </div>
        <div className="card card-pad">
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>128 Balsam Ave</div>
          <div className="meta">The Beach · Toronto</div>
          <div className="flex items-center gap-2 mt-3">
            <span className="money tnum" style={{ fontSize: 24 }}><span className="sym">$</span>1,295,000</span>
            <span className="badge warn">Active · Offer review</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
            {[['Beds','4'],['Baths','3'],['Sqft','2,340'],['DOM','6']].map(([k,v]) => (
              <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
                <div className="meta">{k}</div><div className="tnum" style={{ fontSize: 16, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--border-2)', margin: '16px 0' }} />
          {[['Listed','Apr 11, 2026'],['MLS#','C8-211-0944'],['Lot','24 × 132 ft'],['Type','Detached · 2.5 storey'],['Taxes','$8,420 / yr (2025)']].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
              <div style={{ width: 90, fontSize: 12, color: 'var(--ink-3)' }}>{k}</div>
              <div style={{ flex: 1, fontSize: 13 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {['Contacts','Offers','Showings','Tasks','Notes','Activity','Files'].map(t => (
          <button key={t} data-active={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Contacts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="card">
            <div className="card-head"><h2>Seller side</h2></div>
            <div>
              {[
                { name: 'Aya Fujimori', role: 'Seller client', rc: 'seller' },
                { name: 'Jordan Reyes', role: 'Listing agent · Royal LePage', rc: 'soi' },
              ].map((c, i) => (
                <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                  <S3Av name={c.name} role={c.rc} size={32} />
                  <div><div className="lname">{c.name}</div><div className="lsub">{c.role}</div></div>
                  <S3_I name="phone" size={14} color="var(--ink-4)" />
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h2>Buyer side (active offer)</h2></div>
            <div>
              {[
                { name: 'Marcus & Priya Chen', role: 'Buyer client', rc: 'buyer' },
                { name: 'Jordan Reyes', role: "Buyer's agent · Royal LePage", rc: 'buyer' },
              ].map((c, i) => (
                <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                  <S3Av name={c.name} role={c.rc} size={32} />
                  <div><div className="lname">{c.name}</div><div className="lsub">{c.role}</div></div>
                  <S3_I name="phone" size={14} color="var(--ink-4)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Offers' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-head"><h2>All offers · 3</h2><div style={{ flex: 1 }} /><button className="btn primary sm" onClick={() => window.RC.openModal?.('offer')}><S3_I name="plus" size={13} color="#fff" />Add offer</button></div>
          <table className="tbl">
            <thead><tr><th>Buyer</th><th>Status</th><th className="num">Price</th><th className="num">Deposit</th><th>Conditions</th><th>Expires</th><th></th></tr></thead>
            <tbody>
              {[
                { buyer: 'Marcus & Priya Chen', status: 'Submitted', tone: 'info', price: 1245000, deposit: 65000, cond: 'Financing + Inspection', exp: 340  },
                { buyer: 'M. Navarro',          status: 'Countered', tone: 'warn', price: 1255000, deposit: 80000, cond: 'Firm',                   exp: 22   },
                { buyer: 'B. Bailey',           status: 'Expired',   tone: '',     price: 1210000, deposit: 60000, cond: 'Financing + Inspection',  exp: -200 },
              ].map((o, i) => (
                <tr key={i} onClick={() => goto('offerDetail')} style={{ cursor: 'pointer' }}>
                  <td><div className="name">{o.buyer}</div></td>
                  <td><span className={'badge ' + o.tone}>{o.status}</span></td>
                  <td className="num"><S3Money v={o.price} /></td>
                  <td className="num tnum">${o.deposit.toLocaleString()}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{o.cond}</td>
                  <td><S3CD minutes={o.exp} /></td>
                  <td><S3_I name="chevron" size={14} color="var(--ink-4)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Showings' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-head"><h2>Showings · 14 total</h2><div style={{ flex: 1 }} /><button className="btn sm" onClick={() => window.RC.openModal?.('event')}><S3_I name="plus" size={13} />Book</button></div>
          <table className="tbl">
            <thead><tr><th>Date</th><th>Time</th><th>Agent / group</th><th>Feedback</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { date: 'Sat Apr 19', time: '10:30 AM', agent: 'J. Reyes · Chen',  fb: 'Very strong interest — offer likely',  st: 'Upcoming',   tone: 'info'    },
                { date: 'Thu Apr 17', time: '10:30 AM', agent: 'J. Reyes · Chen',  fb: 'Offer submitted after visit',          st: 'Completed',  tone: 'success' },
                { date: 'Tue Apr 15', time: '2:30 PM',  agent: 'M. Navarro',       fb: 'Counter offer submitted',              st: 'Completed',  tone: 'success' },
                { date: 'Sun Apr 13', time: '1:00 PM',  agent: 'Open house',        fb: '22 groups through',                   st: 'Completed',  tone: ''        },
                { date: 'Fri Apr 11', time: '10:00 AM', agent: 'Photography',       fb: 'MLS photos captured',                 st: 'Completed',  tone: ''        },
              ].map((s, i) => (
                <tr key={i}>
                  <td><div className="name tnum">{s.date}</div></td>
                  <td className="tnum" style={{ fontSize: 12.5 }}>{s.time}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{s.agent}</td>
                  <td style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.fb}</td>
                  <td><span className={'badge ' + s.tone}>{s.st}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Tasks' && (
        <div className="card">
          <div className="card-head"><h2>Open tasks · 3</h2><div style={{ flex: 1 }} /><button className="btn sm" onClick={() => window.RC.openModal?.('task')}><S3_I name="plus" size={13} />New task</button></div>
          <div>
            <S3TaskRow text="Confirm inspection booking with Baraka" when="Today · 2:00 PM" tone="warn" />
            <S3TaskRow text="Upload final staging photos to MLS"     when="Today · 5:00 PM" tone="warn" />
            <S3TaskRow text="Review counter-offer terms with Aya"    when="Thu Apr 17"      tone="ok"   />
          </div>
        </div>
      )}

      {tab === 'Notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <S3NoteCard when="Today"    tag="Offer"   body="Buyers are motivated. Counter at $1.26M should close the deal — Aya confirmed she is open to it." />
          <S3NoteCard when="Apr 13"  tag="Showing" body="Open house went very well. 22 groups through. 3 strong prospects. Offer deadline set for Apr 17." />
          <S3NoteCard when="Apr 11"  tag="Listing" body="Listed at $1,295,000. Aya confirmed flexibility on closing date. Staging photos look great on MLS." />
        </div>
      )}

      {tab === 'Activity' && (
        <div className="card">
          <div className="card-head"><h2>Listing activity</h2><div style={{ flex: 1 }} /><span className="meta tnum">14 events</span></div>
          <div className="tline">
            {[
              { t: 'Today 09:00',   who: 'Buyer agent',  body: '3rd offer — M. Navarro at $1,255,000 firm.',                      kind: 'stage' },
              { t: 'Apr 17 10:30',  who: 'J. Reyes',     body: 'Showing #14 — Marcus & Priya Chen. Very strong interest.',         kind: 'call'  },
              { t: 'Apr 16 17:00',  who: 'Buyer agent',  body: 'Offer submitted — Chen at $1,245,000 financing + inspection.',     kind: 'stage' },
              { t: 'Apr 15 14:30',  who: 'Buyer agent',  body: 'Offer submitted — Bailey at $1,210,000 (expired).',               kind: 'stage' },
              { t: 'Apr 13 13:00',  who: 'J. Reyes',     body: 'Open house — 22 groups through, very strong weekend.',            kind: 'note'  },
              { t: 'Apr 11 09:00',  who: 'You',          body: 'Listing went live on MLS at $1,295,000.',                         kind: 'stage' },
            ].map((it, i) => <S3TimelineRow key={i} {...it} />)}
          </div>
        </div>
      )}

      {tab === 'Files' && (
        <div className="card">
          <div className="card-head"><h2>Documents & media</h2><div style={{ flex: 1 }} /><button className="btn sm"><S3_I name="plus" size={13} />Upload</button></div>
          <div>
            <S3DocRow name="Listing Agreement — Fujimori" type="PDF" date="Apr 9 2026"  size="318 KB" />
            <S3DocRow name="MLS Listing Sheet"             type="PDF" date="Apr 11 2026" size="94 KB"  />
            <S3DocRow name="Home Inspection Report"        type="PDF" date="Apr 17 2026" size="1.2 MB" />
            <S3DocRow name="Staging Photos (14 images)"    type="ZIP" date="Apr 10 2026" size="22 MB"  />
          </div>
        </div>
      )}
    </div>
  );
}

// ── ClientDetailSeller ────────────────────────────────────────────────────────
function ClientDetailSeller({ goto }) {
  const [tab, setTab] = React.useState('Overview');
  const ConvTab = window.RC.ConversationsTab;
  const stages = ['Pre-listing', 'Active', 'Offers In', 'Under Contract', 'Closed'];
  const cur = 2; // Offers In

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-head">
        <button className="btn ghost sm" onClick={() => goto('clients')}><S3_I name="chevron" size={14} /> All clients</button>
        <div style={{ flex: 1 }} />
        <button className="btn sm"><S3_I name="share" size={14} />Share</button>
        <button className="btn sm"><S3_I name="pen" size={14} />Edit</button>
        <button className="btn primary sm"><S3_I name="phone" size={14} color="#fff" />Call client</button>
      </div>

      <div className="card card-pad">
        <div className="flex items-center gap-3">
          <S3Av name="Aya Fujimori" role="seller" size={56} />
          <div className="flex-1">
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Aya Fujimori</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="role seller"><span className="dot" style={{ background: 'oklch(0.58 0.17 310)' }} />Seller client</span>
              <span className="meta">· Last contact <span className="tnum">1h ago</span></span>
              <span className="meta">· DOM <span className="tnum">6</span></span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="meta">Asking price</div>
            <div className="money tnum" style={{ fontSize: 22, marginTop: 2 }}><span className="sym">$</span>1,295,000</div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="steps">{stages.map((s, i) => <div key={s} className={'step ' + (i < cur ? 'done' : i === cur ? 'cur' : '')} />)}</div>
          <div className="steps-labels">{stages.map(s => <span key={s}>{s}</span>)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 18 }}>
          {[['Address','42 Maple Ave'],['Listed','Apr 11 · 6 DOM'],['Showings','14 total'],['Offers in','3 received']].map(([k,v]) => (
            <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
              <div className="meta">{k}</div>
              <div className="tnum" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {['Overview','Listing','Offers','Tasks','Notes','Conversations','Activity','Files'].map(t => (
          <button key={t} data-active={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head"><h2>Listing · 42 Maple Ave</h2><div style={{ flex: 1 }} /><span className="badge info">Active · 6 DOM</span></div>
            <div style={{ padding: 18 }}>
              <div className="ph" data-label="hero · 42 Maple Ave" style={{ height: 200, borderRadius: 8 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
                {[['List','$1,295,000'],['Bed/Bath','4 bd · 2 ba'],['Sqft','~1,800'],['Deadline','Apr 17 5PM']].map(([k,v]) => (
                  <div key={k}><div className="meta">{k}</div><div className="tnum" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h2>Open tasks</h2><div style={{ flex: 1 }} /><span className="meta tnum">3</span></div>
            <div>
              <S3TaskRow text="Confirm inspection booking with Baraka" when="Today · 2:00 PM" tone="warn" />
              <S3TaskRow text="Upload final staging photos to MLS"     when="Today · 5:00 PM" tone="warn" />
              <S3TaskRow text="Review counter-offer terms with Aya"    when="Thu Apr 17"      tone="ok"   />
            </div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-head"><h2>Recent activity</h2></div>
            <div className="tline">
              {[
                { t: 'Today 09:00', who: 'Buyer agent', body: '3rd offer — M. Navarro at $1,255,000 firm.',            kind: 'stage' },
                { t: 'Apr 17',      who: 'J. Reyes',    body: 'Showing #14 — Marcus & Priya Chen. Very strong.',       kind: 'call'  },
                { t: 'Apr 16',      who: 'Buyer agent', body: 'Offer submitted — Chen at $1,245,000.',                 kind: 'stage' },
                { t: 'Apr 13',      who: 'J. Reyes',    body: 'Open house — 22 groups through.',                      kind: 'note'  },
              ].map((it, i) => <S3TimelineRow key={i} {...it} />)}
            </div>
          </div>
        </div>
      )}

      {tab === 'Listing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="card card-pad">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Property details</div>
            {[['Address','42 Maple Ave, Toronto, ON M6R 2N4'],['Type','Detached · 4 bed · 2 bath'],['Sqft','~1,800 sqft (est.)'],['List price','$1,295,000'],['Listed','Apr 11, 2026'],['Deadline','Apr 17, 2026 at 5:00 PM'],['Agent','Jordan Reyes · Royal LePage']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
                <div style={{ width: 100, fontSize: 12, color: 'var(--ink-3)', flexShrink: 0 }}>{k}</div>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="card card-pad">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Showing schedule</div>
            {[
              { when: 'Apr 17 · 10:30 AM', who: 'Marcus & Priya Chen',   st: 'Confirmed', tone: 'info'    },
              { when: 'Apr 16 · 2:00 PM',  who: 'Bailey Family',         st: 'Completed', tone: 'success' },
              { when: 'Apr 15 · 11:00 AM', who: 'M. Navarro',            st: 'Completed', tone: 'success' },
              { when: 'Apr 13 · 1:00 PM',  who: 'Open house (22 groups)',st: 'Completed', tone: 'success' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)', alignItems: 'center' }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13 }}>{s.who}</div><div className="meta tnum">{s.when}</div></div>
                <span className={'badge ' + s.tone}>{s.st}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Offers' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-head"><h2>Received offers · 3</h2><div style={{ flex: 1 }} /><span className="badge warn">Deadline Apr 17</span></div>
          <table className="tbl">
            <thead><tr><th>Buyer</th><th>Status</th><th className="num">Price</th><th className="num">Deposit</th><th>Conditions</th><th>Close</th></tr></thead>
            <tbody>
              {[
                { buyer: 'M. & P. Chen', st: 'Under review', tone: 'info', price: 1245000, dep: 65000, cond: 'Financing · Insp.', close: 'May 6'  },
                { buyer: 'M. Navarro',   st: 'Under review', tone: 'info', price: 1255000, dep: 70000, cond: 'Firm',              close: 'May 10' },
                { buyer: 'Bailey Fam.',  st: 'Expired',      tone: '',     price: 1210000, dep: 55000, cond: 'Financing',         close: 'May 15' },
              ].map((o, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => goto('offerDetail')}>
                  <td><div className="name">{o.buyer}</div></td>
                  <td><span className={'badge ' + o.tone}>{o.st}</span></td>
                  <td className="num"><S3Money v={o.price} /></td>
                  <td className="num tnum">${o.dep.toLocaleString()}</td>
                  <td><span className="meta">{o.cond}</span></td>
                  <td className="tnum">{o.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn primary sm" onClick={() => window.RC.openModal?.('task')}><S3_I name="plus" size={13} color="#fff" />New task</button>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge warn">2</span><h2 style={{ marginLeft: 6 }}>Today</h2></div>
            <div>
              <S3TaskRow text="Confirm inspection booking with Baraka" when="Today · 2:00 PM" tone="warn" />
              <S3TaskRow text="Upload final staging photos to MLS"     when="Today · 5:00 PM" tone="warn" />
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge">1</span><h2 style={{ marginLeft: 6 }}>Upcoming</h2></div>
            <div><S3TaskRow text="Review counter-offer terms with Aya" when="Thu Apr 17" tone="ok" /></div>
          </div>
        </div>
      )}

      {tab === 'Notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <S3NoteCard when="Today"   tag="Offer"   body="Buyers are motivated. Counter at $1.26M should close — Aya confirmed open to it if close date is Jun 6 or earlier." />
          <S3NoteCard when="Apr 13" tag="Showing" body="Open house went very well — 22 groups through. 3 strong prospects. Offer deadline Apr 17 at 5 PM." />
          <S3NoteCard when="Apr 11" tag="Listing" body="Listed at $1,295,000. Aya confirmed flexibility on closing date. Staging photos look great on MLS." />
          <S3NoteCard when="Apr 9"  tag="Staging" body="Staging complete. Lena did excellent work. Photography booked for Apr 10 AM. All fixtures replaced." />
        </div>
      )}

      {tab === 'Conversations' && ConvTab && <ConvTab name="Aya Fujimori" goto={goto} />}

      {tab === 'Activity' && (
        <div className="card">
          <div className="card-head"><h2>Listing activity</h2><div style={{ flex: 1 }} /><span className="meta tnum">14 events</span></div>
          <div className="tline">
            {[
              { t: 'Today 09:00',  who: 'Buyer agent', body: '3rd offer — M. Navarro at $1,255,000 firm.',                   kind: 'stage' },
              { t: 'Apr 17 10:30', who: 'J. Reyes',    body: 'Showing #14 — Marcus & Priya Chen. Very strong interest.',     kind: 'call'  },
              { t: 'Apr 16 17:00', who: 'Buyer agent', body: 'Offer submitted — Chen at $1,245,000, financing + inspection.', kind: 'stage' },
              { t: 'Apr 15 14:30', who: 'Buyer agent', body: 'Offer submitted — Bailey at $1,210,000 (expired).',            kind: 'stage' },
              { t: 'Apr 13 13:00', who: 'J. Reyes',    body: 'Open house — 22 groups through.',                              kind: 'note'  },
              { t: 'Apr 11 09:00', who: 'You',         body: 'Listing went live on MLS at $1,295,000.',                      kind: 'stage' },
            ].map((it, i) => <S3TimelineRow key={i} {...it} />)}
          </div>
        </div>
      )}

      {tab === 'Files' && (
        <div className="card">
          <div className="card-head"><h2>Documents & media</h2><div style={{ flex: 1 }} /><button className="btn sm"><S3_I name="plus" size={13} />Upload</button></div>
          <div>
            <S3DocRow name="Listing Agreement — Fujimori" type="PDF" date="Apr 9 2026"  size="318 KB" />
            <S3DocRow name="MLS Listing Sheet"             type="PDF" date="Apr 11 2026" size="94 KB"  />
            <S3DocRow name="Home Inspection Report"        type="PDF" date="Apr 17 2026" size="1.2 MB" />
            <S3DocRow name="Staging Photos (14 images)"    type="ZIP" date="Apr 10 2026" size="22 MB"  />
          </div>
        </div>
      )}
    </div>
  );
}

window.RC.ClientDetail       = ClientDetail;
window.RC.ClientDetailSeller = ClientDetailSeller;
window.RC.PropDetail         = PropDetail;
