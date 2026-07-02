// screen-client-detail-both.jsx — Client Detail: Both (Buyer + Seller combined)
// James & Kira Morton — selling 34 Strathmore Blvd while buying in east end.

function ClientDetailBoth({ goto }) {
  const [tab, setTab] = React.useState('Overview');
  const tabs = ['Overview', 'Buyer', 'Seller', 'Properties', 'Offers', 'Appointments', 'Tasks', 'Notes', 'Activity'];

  const buyerStages  = ['Needs Analysis', 'Property Search', 'Offer Submitted', 'Under Contract', 'Closed'];
  const buyerIdx     = 1;
  const sellerStages = ['Pre-Listing', 'Active on Market', 'Offers In', 'Under Contract', 'Closed'];
  const sellerIdx    = 1;

  function PipelineDots({ stages, idx, colors }) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {stages.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ width: 11, height: 11, borderRadius: 999, margin: '0 auto', background: i <= idx ? colors[i] : 'var(--border)', border: i === idx ? '2px solid var(--ink)' : '0', boxSizing: 'border-box' }} />
              </div>
              {i < stages.length - 1 && <div style={{ height: 2, width: 10, background: i < idx ? 'var(--brand)' : 'var(--border)', flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', marginTop: 6 }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{stages[idx]}</span>
          <span> · {idx + 1} of {stages.length}</span>
        </div>
      </div>
    );
  }

  function RoleChip({ role }) {
    const isSeller = role === 'Seller';
    return (
      <span className={'role ' + (isSeller ? 'seller' : 'buyer')} style={{ fontSize: 10, padding: '2px 6px' }}>
        <span className="dot" style={{ background: isSeller ? 'oklch(0.58 0.17 310)' : 'oklch(0.62 0.14 254)' }} />
        {role}
      </span>
    );
  }

  function BuyerPanel({ compact }) {
    return (
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <RoleChip role="Buyer" />
          <span className="meta" style={{ flex: 1 }}>Property search</span>
          <span className="badge brand" style={{ fontSize: 10 }}>Active</span>
        </div>
        <div style={{ padding: '10px 14px 12px' }}>
          <PipelineDots stages={buyerStages} idx={buyerIdx} colors={['#ADB5BD','#74C0FC','#228BE6','#FAB005','#40C057']} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            {[['Budget','$1.1–1.3M'],['Pre-approval','TD · $1.35M']].map(([k,v]) => (
              <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '8px 10px' }}>
                <div className="meta" style={{ fontSize: 10 }}>{k}</div>
                <div className="tnum" style={{ fontSize: 13, fontWeight: 600, marginTop: 1 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function SellerPanel() {
    return (
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <RoleChip role="Seller" />
          <span className="meta" style={{ flex: 1 }}>Active on market</span>
          <span className="badge warn" style={{ fontSize: 10 }}>6 DOM</span>
        </div>
        <div style={{ padding: '10px 14px 12px' }}>
          <PipelineDots stages={sellerStages} idx={sellerIdx} colors={['#ADB5BD','#FAB005','#F76707','#F03E3E','#40C057']} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            {[['List price','$1,095,000'],['Showings','6 booked']].map(([k,v]) => (
              <div key={k} style={{ background: 'var(--bg-sunk)', borderRadius: 8, padding: '8px 10px' }}>
                <div className="meta" style={{ fontSize: 10 }}>{k}</div>
                <div className="tnum" style={{ fontSize: 13, fontWeight: 600, marginTop: 1 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Topbar ── */}
      <div className="topbar" style={{ paddingBottom: 6 }}>
        <div className="topbar-row">
          <button className="icon-btn" onClick={() => goto('clients')}>
            <window.Icon name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <div style={{ flex: 1 }} />
          <button className="icon-btn"><window.Icon name="pen" size={14} /></button>
          <button className="icon-btn" style={{ marginLeft: 6 }}><window.Icon name="more" size={16} /></button>
        </div>
      </div>

      {/* ── Hero header ── */}
      <div style={{ padding: '4px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Split avatar — buyer blue / seller pink */}
          <div style={{ width: 56, height: 56, borderRadius: 999, overflow: 'hidden', display: 'flex', flexShrink: 0, border: '2px solid var(--border)' }}>
            <div style={{ flex: 1, background: 'oklch(0.88 0.06 254)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'oklch(0.42 0.16 254)' }}>J</div>
            <div style={{ flex: 1, background: 'oklch(0.90 0.06 310)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'oklch(0.42 0.15 310)' }}>K</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>James & Kira Morton</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
              <RoleChip role="Buyer" />
              <span style={{ color: 'var(--ink-4)', fontSize: 11, fontWeight: 600 }}>+</span>
              <RoleChip role="Seller" />
              <span className="meta" style={{ marginLeft: 2 }}>· DOM <span className="tnum">6</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ borderBottom: '1px solid var(--border-2)', marginTop: 14, position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 }}>
        <div className="chips" style={{ padding: '0 12px', mask: 'none', WebkitMask: 'none' }}>
          {tabs.map(t => (
            <button key={t} className="chip" onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '10px 0', marginRight: 16, fontWeight: tab === t ? 600 : 500, flexShrink: 0 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, paddingBottom: 120 }}>

        {/* ── Overview: panels stack vertically (mobile spec) ── */}
        {tab === 'Overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <BuyerPanel />
            <SellerPanel />
            {/* Coordination note */}
            <div className="card card-pad" style={{ padding: 12, background: 'oklch(0.975 0.015 70)', border: '1px solid oklch(0.88 0.06 70)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'oklch(0.50 0.16 70)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Coordination note</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>Purchase is conditional on sale of 34 Strathmore Blvd. Target close for sale: <span className="tnum" style={{ fontWeight: 600 }}>Jun 28</span>. Buffer: <span className="tnum" style={{ fontWeight: 600 }}>3 weeks</span> for purchase search.</div>
            </div>
          </div>
        )}

        {/* ── Buyer tab ── */}
        {tab === 'Buyer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <BuyerPanel />
            <div className="card card-pad">
              <window.Section title="Search requirements">
                <window.KVRow k="Areas" v="Leslieville · East Danforth" />
                <window.KVRow k="Type" v="Semi or Detached · 3+ bed" />
                <window.KVRow k="Budget" v="$1.1–1.3M" />
                <window.KVRow k="Must-haves" v="Parking, backyard, ≥1,400 sqft" last />
              </window.Section>
            </div>
            <div className="card card-pad">
              <window.Section title="Financing">
                <window.KVRow k="Pre-approval" v="TD · $1,350,000" />
                <window.KVRow k="Down payment" v="Proceeds from sale + $120k" />
                <window.KVRow k="Condition" v="Conditional on sale of current home" last />
              </window.Section>
            </div>
          </div>
        )}

        {/* ── Seller tab ── */}
        {tab === 'Seller' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SellerPanel />
            <div className="card card-pad">
              <window.Section title="Listing details">
                <window.KVRow k="Address" v="34 Strathmore Blvd" />
                <window.KVRow k="List price" v="$1,095,000" />
                <window.KVRow k="Listed" v="April 13, 2026" />
                <window.KVRow k="MLS #" v="E9021847" last />
              </window.Section>
            </div>
            <div className="card card-pad">
              <window.Section title="Seller motivation">
                <window.KVRow k="Reason" v="Upsizing — growing family" />
                <window.KVRow k="Target close" v="Jun 28, 2026" />
                <window.KVRow k="Flexibility" v="Low — hard date for purchase sync" last />
              </window.Section>
            </div>
          </div>
        )}

        {/* ── Properties ── */}
        {tab === 'Properties' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'oklch(0.42 0.15 310)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Selling</div>
            <div className="card" style={{ display: 'flex', gap: 12, padding: 12 }}>
              <div className="ph" data-label="34 Strathmore" style={{ width: 72, height: 72, borderRadius: 8, flexShrink: 0 }} />
              <div>
                <div className="row-title">34 Strathmore Blvd</div>
                <div className="row-sub">Leslieville · 3 bd · 1 ba</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <span className="money tnum" style={{ fontSize: 14 }}><span className="sym">$</span>1,095,000</span>
                  <span className="badge warn" style={{ fontSize: 10 }}>Active · 6 DOM</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'oklch(0.40 0.14 254)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>Touring</div>
            {[
              { addr: '18 Hanson St', sub: 'Leslieville · 3 bd · $1,099,000', badge: 'Toured', tone: '' },
              { addr: '42 Endean Ave', sub: 'East Danforth · 3 bd · $1,189,000', badge: 'Toured', tone: '' },
              { addr: '91 Pape Ave', sub: 'Playter Estates · 3 bd · $1,235,000', badge: 'Upcoming', tone: 'info' },
            ].map((p, i) => (
              <div key={i} className="card card-pad" style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <window.Icon name="home" size={14} color="var(--ink-3)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.addr}</div>
                  <div className="row-sub">{p.sub}</div>
                </div>
                <span className={'badge ' + p.tone} style={{ fontSize: 10 }}>{p.badge}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Offers ── */}
        {tab === 'Offers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'oklch(0.42 0.15 310)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Incoming — selling</div>
            <div className="card card-pad" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ fontWeight: 600, flex: 1 }}>34 Strathmore Blvd</div>
                <span className="badge info">1 received</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[['Price','$1,060,000'],['Deposit','$50,000'],['Closing','Jun 20, 2026'],['Conditions','Financing']].map(([k,v]) => (
                  <div key={k}>
                    <div className="meta" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                    <div className="tnum" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, color: 'oklch(0.40 0.14 254)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>Submitted — buying</div>
            <div className="card card-pad" style={{ padding: 14, background: 'var(--bg-sunk)', textAlign: 'center' }}>
              <div style={{ color: 'var(--ink-4)', fontSize: 13 }}>No offers submitted yet</div>
              <div style={{ color: 'var(--ink-4)', fontSize: 12, marginTop: 4 }}>Conditional on sale of Strathmore</div>
            </div>
          </div>
        )}

        {/* ── Appointments ── */}
        {tab === 'Appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { t: 'Sat Apr 19 · 11:00 AM', title: 'Open house — 34 Strathmore', status: 'Upcoming',  tone: 'info',    role: 'Seller' },
              { t: 'Fri Apr 18 · 3:00 PM',  title: 'Showing — 91 Pape Ave',        status: 'Upcoming',  tone: 'info',    role: 'Buyer'  },
              { t: 'Thu Apr 17 · 2:30 PM',  title: 'Showing #6 — 34 Strathmore',   status: 'Completed', tone: 'success', role: 'Seller' },
              { t: 'Mon Apr 14 · 2:00 PM',  title: 'Showing — 42 Endean Ave',       status: 'Completed', tone: 'success', role: 'Buyer'  },
              { t: 'Sat Apr 12 · 1:00 PM',  title: 'Open house — 34 Strathmore',   status: 'Completed', tone: 'success', role: 'Seller' },
            ].map((a, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span className={'badge ' + a.tone}>{a.status}</span>
                  <RoleChip role={a.role} />
                  <span className="meta tnum" style={{ marginLeft: 'auto', fontSize: 11 }}>{a.t}</span>
                </div>
                <div className="row-title">{a.title}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tasks ── */}
        {tab === 'Tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { text: 'Call James re: incoming offer — counter at $1,080k?',    when: 'Today, 3:00 PM', tone: 'warn',   role: 'Seller' },
              { text: 'Book 91 Pape Ave showing for Friday',                     when: 'Today, 5:00 PM', tone: 'warn',   role: 'Buyer'  },
              { text: 'Review staging feedback with Kira',                        when: 'Thu Apr 18',     tone: 'ok',     role: 'Seller' },
              { text: 'Draft conditional purchase offer — pending sale',          when: 'Fri Apr 19',     tone: 'ok',     role: 'Buyer'  },
            ].map((t, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: 999, border: '1.5px solid var(--border)', marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <RoleChip role={t.role} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{t.text}</div>
                  <div style={{ marginTop: 4 }}><span className={'countdown ' + t.tone}>{t.when}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Notes ── */}
        {tab === 'Notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { date: 'Today · 14:00', text: 'Incoming offer at $1,060,000 with financing. James wants to counter at $1,080k firm. Key: close date must align with purchase — Jun 28 or later.', tags: ['offer','seller'] },
              { date: 'Apr 16 · 11:00', text: 'Both toured 42 Endean Ave. Strong interest but slightly over budget at $1,189k. Will reconsider if sale nets near ask.', tags: ['showing','buyer'] },
              { date: 'Apr 13', text: 'Listing live at $1,095,000. Staging photos look great. Kira: no weekday morning showings. James: expects $1,080k minimum net.', tags: ['listing','seller'] },
            ].map((n, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="meta tnum" style={{ marginBottom: 6 }}>{n.date}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink)' }}>{n.text}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {n.tags.map(tag => <span key={tag} className="badge brand">#{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Activity ── */}
        {tab === 'Activity' && (
          <div className="card card-pad">
            {[
              { t: 'Today, 14:00', kind: 'note',  text: 'Offer received on 34 Strathmore — $1,060,000 with financing condition.',    role: 'Seller' },
              { t: 'Apr 16, 11:00',kind: 'appt',  text: 'Both toured 42 Endean Ave — strong interest.',                              role: 'Buyer'  },
              { t: 'Apr 17, 10:30',kind: 'appt',  text: 'Showing #6 at 34 Strathmore — good feedback.',                             role: 'Seller' },
              { t: 'Apr 13, 09:00',kind: 'stage', text: '34 Strathmore went live on MLS at $1,095,000.',                             role: 'Seller' },
              { t: 'Apr 11, 14:00',kind: 'appt',  text: 'Toured 18 Hanson St — liked layout, noted small backyard.',                role: 'Buyer'  },
              { t: 'Apr 9',        kind: 'stage', text: 'Files activated: Seller active on market, Buyer in property search.',        role: 'Both'   },
            ].map((a, i, arr) => {
              const isSeller = a.role === 'Seller';
              const isBoth   = a.role === 'Both';
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 20px 1fr', gap: '0 10px', paddingBottom: i < arr.length - 1 ? 16 : 0, marginBottom: i < arr.length - 1 ? 0 : 0 }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--ink-4)', paddingTop: 1, textAlign: 'right' }}>{a.t}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 999, background: a.kind === 'stage' ? 'var(--brand)' : a.kind === 'call' ? 'var(--success)' : 'oklch(0.72 0.155 70)', border: '1.5px solid var(--surface)', flexShrink: 0, marginTop: 2 }} />
                    {i < arr.length - 1 && <div style={{ flex: 1, width: 1, background: 'var(--border-2)', marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                      {!isBoth && <RoleChip role={a.role} />}
                      {isBoth && <span className="badge" style={{ fontSize: 9 }}>Both</span>}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45 }}>{a.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>{/* /scroll */}

      {/* ── Action bar ── */}
      <div className="actionbar">
        <button className="primary"><window.Icon name="phone" size={18} /><span>Call</span></button>
        <button><window.Icon name="message" size={18} /><span>Text</span></button>
        <button onClick={() => window.openSheet?.('quickNote')}><window.Icon name="note" size={18} /><span>Note</span></button>
        <button><window.Icon name="calendar" size={18} /><span>Appt</span></button>
      </div>
    </>
  );
}

window.ClientDetailBoth = ClientDetailBoth;
