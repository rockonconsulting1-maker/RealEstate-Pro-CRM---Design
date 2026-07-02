// screens4.jsx — ClientDetailBoth: combined Buyer + Seller client detail
// James & Kira Morton — selling 34 Strathmore Blvd, buying in east end.
// Desktop layout: buyer and seller panels sit SIDE BY SIDE (§11.5 spec).

const S4_I = window.Icon;
const { Avatar: S4Av, Money: S4Money, Countdown: S4CD } = window.RC;

// ── Shared local helpers ────────────────────────────────────────────────────
function S4TaskRow({ text, when, tone, role }) {
  const isSeller = role === 'Seller';
  return (
    <div className="lrow" style={{ gridTemplateColumns: 'auto auto 1fr auto' }}>
      <input type="checkbox" />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999, background: isSeller ? 'oklch(0.96 0.035 310)' : 'var(--brand-soft)', color: isSeller ? 'oklch(0.42 0.15 310)' : 'var(--brand-ink)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
        <span style={{ width: 5, height: 5, borderRadius: 999, background: isSeller ? 'oklch(0.58 0.17 310)' : 'oklch(0.62 0.14 254)', flexShrink: 0 }} />
        {role}
      </span>
      <div><div className="lname">{text}</div><div className="lsub">{when}</div></div>
      <span className={'badge ' + (tone === 'warn' ? 'warn' : tone === 'danger' ? 'danger' : '')}>{tone === 'warn' ? 'Today' : tone === 'danger' ? 'Overdue' : 'Upcoming'}</span>
    </div>
  );
}

function S4NoteCard({ when, tags, body }) {
  return (
    <div className="card card-pad">
      <div className="flex items-center gap-2">
        {tags.map(tag => <span key={tag} className={'badge ' + (tag === 'seller' ? '' : tag === 'buyer' ? 'brand' : 'brand')}>{tag}</span>)}
        <div style={{ flex: 1 }} />
        <span className="meta tnum">{when}</span>
      </div>
      <div style={{ color: 'var(--ink-2)', marginTop: 8, fontSize: 13, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

function S4TLine({ t, who, body, kind, role }) {
  const isSeller = role === 'Seller';
  return (
    <div className="tline-row">
      <div className="tline-t tnum">{t}</div>
      <div className="tline-rail">
        <div className={'pip ' + (kind === 'note' ? 'brand' : kind === 'call' ? 'success' : 'warn')} />
      </div>
      <div className="tline-text">
        <div className="who" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {who}
          {role && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 999, background: isSeller ? 'oklch(0.96 0.035 310)' : 'var(--brand-soft)', color: isSeller ? 'oklch(0.42 0.15 310)' : 'var(--brand-ink)' }}>
              {role}
            </span>
          )}
        </div>
        <div className="body">{body}</div>
      </div>
    </div>
  );
}

function S4DocRow({ name, type, date, size, role }) {
  const isSeller = role === 'Seller';
  return (
    <div className="lrow" style={{ gridTemplateColumns: 'auto auto 1fr auto' }}>
      <div style={{ width: 36, height: 36, borderRadius: 7, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <S4_I name="doc" size={16} color="var(--ink-3)" />
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 999, background: isSeller ? 'oklch(0.96 0.035 310)' : 'var(--brand-soft)', color: isSeller ? 'oklch(0.42 0.15 310)' : 'var(--brand-ink)', alignSelf: 'center', whiteSpace: 'nowrap' }}>{role}</span>
      <div><div className="lname">{name}</div><div className="lsub">{type} · {date} · {size}</div></div>
      <S4_I name="down" size={14} color="var(--ink-4)" />
    </div>
  );
}

// ── Pipeline stepper ────────────────────────────────────────────────────────
function S4Pipeline({ stages, curIdx, color }) {
  return (
    <div>
      <div className="steps">
        {stages.map((s, i) => (
          <div key={s} className={'step ' + (i < curIdx ? 'done' : i === curIdx ? 'cur' : '')}
            style={i === curIdx ? { '--step-color': color } : {}} />
        ))}
      </div>
      <div className="steps-labels">{stages.map(s => <span key={s}>{s}</span>)}</div>
    </div>
  );
}

// ── Buyer panel (card, used in Overview + Buyer tab) ─────────────────────────
function S4BuyerPanel({ goto }) {
  const buyerStages = ['Needs Analysis', 'Property Search', 'Offer Submitted', 'Under Contract', 'Closed'];
  return (
    <div className="card">
      <div className="card-head">
        <span className="role buyer" style={{ fontSize: 11 }}>
          <span className="dot" style={{ background: 'oklch(0.62 0.14 254)' }} />Buyer
        </span>
        <span className="meta" style={{ marginLeft: 6 }}>Property search</span>
        <div style={{ flex: 1 }} />
        <span className="badge brand">Active</span>
      </div>
      <div style={{ padding: '14px 18px' }}>
        <S4Pipeline stages={buyerStages} curIdx={1} color="var(--brand)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
          {[['Budget','$1.1–1.3M'],['Pre-approval','TD · $1.35M'],['Showings done','3']].map(([k,v]) => (
            <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
              <div className="meta">{k}</div>
              <div className="tnum" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Recently toured</div>
          {[
            { addr: '18 Hanson St',  sub: 'Leslieville · $1,099,000', st: 'Toured'   },
            { addr: '42 Endean Ave', sub: 'East Danforth · $1,189,000', st: 'Toured'  },
            { addr: '91 Pape Ave',   sub: 'Playter Estates · $1,235,000', st: 'Upcoming' },
          ].map((p, i) => (
            <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <S4_I name="home" size={13} color="var(--ink-3)" />
              </div>
              <div><div className="lname">{p.addr}</div><div className="lsub">{p.sub}</div></div>
              <span className={'badge ' + (p.st === 'Upcoming' ? 'info' : '')}>{p.st}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Seller panel (card, used in Overview + Seller tab) ───────────────────────
function S4SellerPanel({ goto }) {
  const sellerStages = ['Pre-listing', 'Active', 'Offers In', 'Under Contract', 'Closed'];
  return (
    <div className="card">
      <div className="card-head">
        <span className="role seller" style={{ fontSize: 11 }}>
          <span className="dot" style={{ background: 'oklch(0.58 0.17 310)' }} />Seller
        </span>
        <span className="meta" style={{ marginLeft: 6 }}>Active on market</span>
        <div style={{ flex: 1 }} />
        <span className="badge warn">6 DOM</span>
      </div>
      <div style={{ padding: '14px 18px' }}>
        <S4Pipeline stages={sellerStages} curIdx={1} color="oklch(0.72 0.155 70)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
          {[['List price','$1,095,000'],['Showings','6 booked'],['Offers in','1 received']].map(([k,v]) => (
            <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '10px 12px' }}>
              <div className="meta">{k}</div>
              <div className="tnum" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Listing</div>
          <div className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
            <div className="ph" data-label="34 Strathmore" style={{ width: 44, height: 44, borderRadius: 6 }} />
            <div>
              <div className="lname">34 Strathmore Blvd</div>
              <div className="lsub">Leslieville · 3 bd · 1 ba · MLS# E9021847</div>
            </div>
            <span className="badge warn">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
function ClientDetailBoth({ goto }) {
  const [tab, setTab] = React.useState('Overview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Page head ── */}
      <div className="page-head">
        <button className="btn ghost sm" onClick={() => goto('clients')}>
          <S4_I name="chevron" size={14} /> All clients
        </button>
        <div style={{ flex: 1 }} />
        <button className="btn sm"><S4_I name="share" size={14} />Share</button>
        <button className="btn sm"><S4_I name="pen" size={14} />Edit</button>
        <button className="btn primary sm"><S4_I name="phone" size={14} color="#fff" />Call client</button>
      </div>

      {/* ── Hero card ── */}
      <div className="card card-pad">
        <div className="flex items-center gap-3">
          {/* Split avatar */}
          <div style={{ width: 56, height: 56, borderRadius: 999, overflow: 'hidden', display: 'flex', flexShrink: 0, border: '2px solid var(--border)' }}>
            <div style={{ flex: 1, background: 'oklch(0.88 0.06 254)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'oklch(0.42 0.16 254)' }}>J</div>
            <div style={{ flex: 1, background: 'oklch(0.90 0.06 310)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'oklch(0.42 0.15 310)' }}>K</div>
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>James & Kira Morton</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="role buyer"><span className="dot" style={{ background: 'oklch(0.62 0.14 254)' }} />Buyer client</span>
              <span style={{ color: 'var(--ink-4)', fontSize: 11, fontWeight: 600 }}>+</span>
              <span className="role seller"><span className="dot" style={{ background: 'oklch(0.58 0.17 310)' }} />Seller client</span>
              <span className="meta">· Last contact <span className="tnum">3h ago</span></span>
              <span className="meta">· DOM <span className="tnum">6</span></span>
            </div>
          </div>
          {/* Coordination callout */}
          <div style={{ textAlign: 'right', background: 'oklch(0.975 0.015 70)', border: '1px solid oklch(0.88 0.06 70)', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'oklch(0.50 0.16 70)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coordination</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>Purchase conditional on sale</div>
            <div className="meta tnum">Close target: Jun 28, 2026</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs">
        {['Overview','Buyer','Seller','Properties','Offers','Tasks','Notes','Activity','Files'].map(t => (
          <button key={t} data-active={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* ── Overview: side-by-side panels (desktop spec) ── */}
      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <S4BuyerPanel goto={goto} />
          <S4SellerPanel goto={goto} />
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-head"><h2>Recent activity</h2><div style={{ flex: 1 }} /><span className="meta tnum">8 events</span></div>
            <div className="tline">
              {[
                { t: 'Today 14:00',  who: 'Listing agent', body: 'Offer received — 34 Strathmore, $1,060,000 with financing.',  kind: 'stage', role: 'Seller' },
                { t: 'Apr 17 10:30', who: 'James Morton',  body: 'Showing #6 at 34 Strathmore — very positive feedback.',      kind: 'call',  role: 'Seller' },
                { t: 'Apr 16 11:00', who: 'You',           body: 'Toured 42 Endean Ave with both clients — strong interest.',   kind: 'note',  role: 'Buyer'  },
                { t: 'Apr 13 09:00', who: 'You',           body: '34 Strathmore went live at $1,095,000.',                     kind: 'stage', role: 'Seller' },
                { t: 'Apr 11 14:00', who: 'You',           body: 'Toured 18 Hanson St — liked layout, small backyard noted.',  kind: 'note',  role: 'Buyer'  },
              ].map((it, i) => <S4TLine key={i} {...it} />)}
            </div>
          </div>
        </div>
      )}

      {/* ── Buyer tab ── */}
      {tab === 'Buyer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <S4BuyerPanel goto={goto} />
          <div className="card card-pad">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Search criteria</div>
            {[
              ['Areas',        'Leslieville · East Danforth · Playter Estates'],
              ['Type',         'Semi-detached or Detached · 3+ bed'],
              ['Budget',       '$1.1–1.3M'],
              ['Pre-approval', 'TD · $1,350,000 · valid Sep 2026'],
              ['Down payment', 'Proceeds from sale + $120k'],
              ['Must-haves',   'Parking, backyard, ≥1,400 sqft'],
              ['Condition',    'Conditional on sale of current home'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
                <div style={{ width: 110, fontSize: 12, color: 'var(--ink-3)', flexShrink: 0 }}>{k}</div>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Seller tab ── */}
      {tab === 'Seller' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <S4SellerPanel goto={goto} />
          <div className="card card-pad">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Listing details</div>
            {[
              ['Address',    '34 Strathmore Blvd, Toronto, ON M4J 1C8'],
              ['Type',       'Semi-detached · 3 bed · 1 bath'],
              ['Sqft',       '~1,350 sqft (est.)'],
              ['List price', '$1,095,000'],
              ['Listed',     'April 13, 2026'],
              ['MLS #',      'E9021847'],
              ['Target close','June 28, 2026'],
              ['Motivation', 'Upsizing — growing family'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-2)' }}>
                <div style={{ width: 110, fontSize: 12, color: 'var(--ink-3)', flexShrink: 0 }}>{k}</div>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Properties ── */}
      {tab === 'Properties' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <span className="role seller" style={{ fontSize: 11 }}><span className="dot" style={{ background: 'oklch(0.58 0.17 310)' }} />Selling</span>
              <h2 style={{ marginLeft: 8 }}>34 Strathmore Blvd</h2>
            </div>
            <div className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
              <div className="ph" data-label="34 Strathmore" style={{ width: 52, height: 52, borderRadius: 7 }} />
              <div>
                <div className="lname">34 Strathmore Blvd</div>
                <div className="lsub">Leslieville · 3 bd · 1 ba · MLS# E9021847</div>
                <div className="lsub tnum">$1,095,000 · 6 DOM · 6 showings</div>
              </div>
              <span className="badge warn">Active</span>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <span className="role buyer" style={{ fontSize: 11 }}><span className="dot" style={{ background: 'oklch(0.62 0.14 254)' }} />Touring</span>
              <h2 style={{ marginLeft: 8 }}>3 properties</h2>
            </div>
            <div>
              {[
                { addr: '18 Hanson St',   sub: 'Leslieville · 3 bd · $1,099,000',      st: 'Toured',   tone: '' },
                { addr: '42 Endean Ave',  sub: 'East Danforth · 3 bd · $1,189,000',    st: 'Toured',   tone: '' },
                { addr: '91 Pape Ave',    sub: 'Playter Estates · 3 bd · $1,235,000',  st: 'Upcoming', tone: 'info' },
              ].map((p, i) => (
                <div key={i} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <S4_I name="home" size={13} color="var(--ink-3)" />
                  </div>
                  <div><div className="lname">{p.addr}</div><div className="lsub">{p.sub}</div></div>
                  <span className={'badge ' + p.tone}>{p.st}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Offers ── */}
      {tab === 'Offers' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-head">
              <span className="role seller" style={{ fontSize: 11 }}><span className="dot" style={{ background: 'oklch(0.58 0.17 310)' }} />Seller</span>
              <h2 style={{ marginLeft: 8 }}>Incoming offers · 1</h2>
              <div style={{ flex: 1 }} />
              <span className="badge warn">Review needed</span>
            </div>
            <table className="tbl">
              <thead><tr><th>Buyer</th><th>Status</th><th className="num">Price</th><th>Conditions</th><th>Close</th></tr></thead>
              <tbody>
                <tr>
                  <td><div className="name">T. Nguyen</div></td>
                  <td><span className="badge info">Received</span></td>
                  <td className="num"><S4Money v={1060000} /></td>
                  <td style={{ fontSize: 12 }}>Financing</td>
                  <td className="tnum">Jun 20</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-head">
              <span className="role buyer" style={{ fontSize: 11 }}><span className="dot" style={{ background: 'oklch(0.62 0.14 254)' }} />Buyer</span>
              <h2 style={{ marginLeft: 8 }}>Submitted offers · 0</h2>
            </div>
            <div style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
              No offers submitted yet
              <div style={{ marginTop: 4, fontSize: 12 }}>Conditional on sale of 34 Strathmore</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tasks ── */}
      {tab === 'Tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn primary sm" onClick={() => window.RC.openModal?.('task')}>
              <S4_I name="plus" size={13} color="#fff" />New task
            </button>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge warn">2</span><h2 style={{ marginLeft: 6 }}>Today</h2></div>
            <div>
              <S4TaskRow text="Call James re: incoming offer — counter at $1,080k firm?" when="Today · 3:00 PM" tone="warn" role="Seller" />
              <S4TaskRow text="Book 91 Pape Ave showing for Friday"                     when="Today · 5:00 PM" tone="warn" role="Buyer"  />
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge">2</span><h2 style={{ marginLeft: 6 }}>Upcoming</h2></div>
            <div>
              <S4TaskRow text="Review staging feedback with Kira"          when="Thu Apr 18"  tone="ok" role="Seller" />
              <S4TaskRow text="Draft conditional purchase offer pending sale" when="Fri Apr 19" tone="ok" role="Buyer"  />
            </div>
          </div>
        </div>
      )}

      {/* ── Notes ── */}
      {tab === 'Notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn primary sm" onClick={() => window.RC.openModal?.('note')}>
              <S4_I name="plus" size={13} color="#fff" />New note
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <S4NoteCard when="Today 14:00"  tags={['offer','seller']}   body="Offer in at $1,060k with financing. James wants to counter at $1,080k firm. Close date must align with purchase — Jun 28 or later is non-negotiable." />
            <S4NoteCard when="Apr 16 11:00" tags={['showing','buyer']}  body="Both toured 42 Endean Ave. Strong interest but slightly over budget. Will reconsider once sale nets near ask. Kira really liked the backyard." />
            <S4NoteCard when="Apr 13"       tags={['listing','seller']} body="Listing live at $1,095,000. Staging photos came out great. Kira: no weekday morning showings. James: expects $1,080k minimum net after fees." />
          </div>
        </div>
      )}

      {/* ── Activity ── */}
      {tab === 'Activity' && (
        <div className="card">
          <div className="card-head"><h2>Combined activity</h2><div style={{ flex: 1 }} /><span className="meta tnum">9 events</span></div>
          <div className="tline">
            {[
              { t: 'Today 14:00',   who: 'Listing agent',  body: 'Offer received — 34 Strathmore, $1,060,000 with financing condition.',     kind: 'stage', role: 'Seller' },
              { t: 'Apr 17 10:30',  who: 'James Morton',   body: 'Showing #6 at 34 Strathmore — very positive feedback, interested buyers.', kind: 'call',  role: 'Seller' },
              { t: 'Apr 16 11:00',  who: 'You',            body: 'Toured 42 Endean Ave — strong interest, slightly over budget.',            kind: 'note',  role: 'Buyer'  },
              { t: 'Apr 15 14:00',  who: 'You',            body: 'Showing #5 completed at 34 Strathmore.',                                  kind: 'note',  role: 'Seller' },
              { t: 'Apr 13 09:00',  who: 'You',            body: '34 Strathmore went live on MLS at $1,095,000.',                           kind: 'stage', role: 'Seller' },
              { t: 'Apr 11 14:00',  who: 'You',            body: 'Toured 18 Hanson St — liked layout, noted small backyard.',               kind: 'note',  role: 'Buyer'  },
              { t: 'Apr 9',         who: 'You',            body: 'Both files activated: seller pre-listing complete, buyer search started.', kind: 'stage', role: null     },
            ].map((it, i) => <S4TLine key={i} {...it} />)}
          </div>
        </div>
      )}

      {/* ── Files ── */}
      {tab === 'Files' && (
        <div className="card">
          <div className="card-head"><h2>Documents</h2><div style={{ flex: 1 }} /><button className="btn sm"><S4_I name="plus" size={13} />Upload</button></div>
          <div>
            <S4DocRow name="Listing Agreement — Morton (Seller)"  type="PDF" date="Apr 9 2026"  size="312 KB" role="Seller" />
            <S4DocRow name="MLS Listing Sheet — 34 Strathmore"    type="PDF" date="Apr 13 2026" size="88 KB"  role="Seller" />
            <S4DocRow name="TD Pre-approval Letter"               type="PDF" date="Apr 10 2026" size="92 KB"  role="Buyer"  />
            <S4DocRow name="Buyer Representation Agreement"       type="PDF" date="Apr 9 2026"  size="148 KB" role="Buyer"  />
          </div>
        </div>
      )}

    </div>
  );
}

window.RC.ClientDetailBoth = ClientDetailBoth;
