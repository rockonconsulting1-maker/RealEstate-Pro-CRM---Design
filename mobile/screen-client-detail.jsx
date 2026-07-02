// screen-client-detail.jsx — Client Detail: Buyer client + Seller client
const { useState: useStateCD } = React;

function ClientDetailBuyer({ goto }) {
  const [tab, setTab] = useStateCD('Buyer');
  const MobileConvTab = window.MobileConvTab;
  const tabs = ['Buyer', 'Properties', 'Offers', 'Appointments', 'Tasks', 'Notes', 'Conversations', 'Activity'];

  const stageSteps = ['Needs Analysis', 'Property Search', 'Offer Submitted', 'Under Contract', 'Closed'];
  const stageIdx = 2; // Offer Submitted
  const stageColors = ['#ADB5BD', '#74C0FC', '#228BE6', '#FAB005', '#40C057'];

  return (
    <>
      <div className="topbar" style={{ paddingBottom: 6 }}>
        <div className="topbar-row">
          <button className="icon-btn" onClick={() => goto('clients')}><window.Icon name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} /></button>
          <div style={{ flex: 1 }} />
          <button className="icon-btn"><window.Icon name="pen" size={14} /></button>
          <button className="icon-btn" style={{ marginLeft: 6 }}><window.Icon name="more" size={16} /></button>
        </div>
      </div>

      <div style={{ padding: '4px 16px 0' }}>
        <div className="flex items-center gap-3">
          <div className="avatar av-buyer" style={{ width: 56, height: 56, fontSize: 15 }}>MC</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Marcus & Priya Chen</div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="role buyer"><span className="dot" style={{ background: 'oklch(0.62 0.14 254)' }} />Buyer client</span>
              <span className="meta">DOM <span className="tnum">31</span></span>
            </div>
          </div>
        </div>

        {/* Pipeline steps */}
        <div className="mt-4">
          <div className="flex items-center gap-0" style={{ marginBottom: 8 }}>
            {stageSteps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ width: 14, height: 14, borderRadius: 999, margin: '0 auto', background: i <= stageIdx ? stageColors[i] : 'var(--border)', border: i === stageIdx ? '2px solid var(--ink)' : '0', transition: 'all 0.2s' }} />
                </div>
                {i < stageSteps.length - 1 && <div style={{ height: 2, width: 18, background: i < stageIdx ? 'var(--brand)' : 'var(--border)' }} />}
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>Offer Submitted</span> · Stage 3 of 5
          </div>
        </div>

        {/* 4-metric grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 14 }}>
          {[
            { k: 'Budget', v: '$1.2–1.3M' },
            { k: 'Pre-approval', v: 'RBC · $1.35M' },
            { k: 'Active offer', v: '128 Balsam Ave' },
            { k: 'Offer expiry', v: <window.Countdown minutes={340} /> },
          ].map((m, i) => (
            <div key={i} className="card card-pad" style={{ padding: 12 }}>
              <div className="meta" style={{ fontSize: 11 }}>{m.k}</div>
              <div className="mt-1 tnum" style={{ fontSize: 15, fontWeight: 600 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border-2)', marginTop: 14, position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 }}>
        <div className="chips" style={{ padding: '0 12px', mask: 'none', WebkitMask: 'none' }}>
          {tabs.map(t => (
            <button key={t} className="chip" onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '10px 0', marginRight: 16, fontWeight: tab === t ? 600 : 500 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, paddingBottom: 120 }}>
        {tab === 'Buyer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card card-pad">
              <window.Section title="Search requirements">
                <window.KVRow k="Areas" v="The Beach · East York" />
                <window.KVRow k="Type" v="Detached · 4 beds" />
                <window.KVRow k="Must-haves" v="Parking, ≥2,200 sqft, large yard" />
                <window.KVRow k="Nice-to-have" v="Detached garage, main-fl office" last />
              </window.Section>
            </div>
            <div className="card card-pad">
              <window.Section title="Financing">
                <window.KVRow k="Pre-approval" v="RBC · $1,350,000" />
                <window.KVRow k="Down payment" v="$260,000 (20%)" />
                <window.KVRow k="Exp. date" v="Aug 15, 2026" last />
              </window.Section>
            </div>
            <div className="card card-pad">
              <window.Section title="Properties toured · 5">
                {['128 Balsam Ave — offer submitted', '44 Glen Manor Dr — declined', '18 Wineva Ave — outbid', '202 Woodbine Ave — declined', '5 Elmer Ave — declined'].map((p, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-2)' : 0, alignItems: 'center' }}>
                    <window.Icon name="home" size={14} color="var(--ink-3)" />
                    <span style={{ fontSize: 13, flex: 1 }}>{p}</span>
                  </div>
                ))}
              </window.Section>
            </div>
          </div>
        )}

        {tab === 'Offers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { addr: '128 Balsam Ave', price: 1245000, deposit: 65000, closing: 'Jun 6, 2026', exp: 340, status: 'Submitted', cond: 'Financing + Inspection' },
              { addr: '18 Wineva Ave', price: 1190000, deposit: 60000, closing: 'May 15, 2026', exp: -400, status: 'Expired', cond: 'Financing' },
            ].map((o, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, flex: 1 }}>{o.addr}</div>
                  {o.status === 'Expired' ? <span className="badge">Expired</span> : <span className="badge info">Submitted</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[['Price', '$' + o.price.toLocaleString()], ['Deposit', '$' + o.deposit.toLocaleString()], ['Closing', o.closing], ['Conditions', o.cond]].map(([k, v]) => (
                    <div key={k}>
                      <div className="meta" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }} className="tnum">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2"><window.Countdown minutes={o.exp} /></div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Activity' && (
          <div className="card card-pad">
            {[
              { t: 'Today, 10:30', kind: 'appt', text: 'Showing at 128 Balsam Ave confirmed.' },
              { t: 'Apr 16, 17:00', kind: 'note', text: 'Offer submitted at $1,245,000 with financing & inspection conditions.' },
              { t: 'Apr 14, 14:00', kind: 'appt', text: 'Showed 18 Wineva Ave — passed, too small.' },
              { t: 'Apr 10, 09:00', kind: 'stage', text: 'Moved to Offer Submitted stage.' },
            ].map((a, i, arr) => (
              <window.ActivityItem key={i} {...a} last={i === arr.length - 1} />
            ))}
          </div>
        )}

        {tab === 'Appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { t: 'Sat Apr 19 · 10:30 AM', title: 'Showing — 128 Balsam Ave', status: 'Upcoming',  tone: 'info'    },
              { t: 'Thu Apr 17 · 10:30 AM', title: 'Showing — 128 Balsam Ave', status: 'Completed', tone: 'success' },
              { t: 'Mon Apr 14 · 11:00 AM', title: 'Buyer consultation',        status: 'Completed', tone: 'success' },
            ].map((a, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="flex items-center gap-2 mb-1"><span className={'badge ' + a.tone}>{a.status}</span><span className="meta tnum">{a.t}</span></div>
                <div className="row-title">{a.title}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { text: 'Confirm inspection booking', when: 'Today, 2:00 PM', tone: 'warn' },
              { text: 'Send counter draft to listing agent', when: 'Today, 6:00 PM', tone: 'warn' },
              { text: 'File deposit wire transfer', when: 'Mon Apr 21', tone: 'ok' },
            ].map((t, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: 999, border: '1.5px solid var(--border)', marginTop: 1, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{t.text}</div>
                  <div className="mt-1"><span className={'countdown ' + t.tone}>{t.when}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { date: 'Today · 09:12', text: 'Counter expected by 5 PM. Marcus confirmed $1.25M cap. Priya open to waiving inspection if counter below $1.26M.', tags: ['offer'] },
              { date: 'Apr 17 · 10:30', text: 'Showing #14 at 128 Balsam. Both clients very engaged — asked about schools, transit, and the basement suite.', tags: ['showing'] },
              { date: 'Apr 14', text: 'Pre-approval confirmed from TD at $1.4M. Valid through Oct 2026. Parking is now a hard requirement.', tags: ['financing'] },
            ].map((n, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="meta tnum" style={{ marginBottom: 6 }}>{n.date}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55 }}>{n.text}</div>
                <div className="flex gap-2 mt-2">{n.tags.map(tag => <span key={tag} className="badge brand">#{tag}</span>)}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Conversations' && MobileConvTab && <MobileConvTab name="Marcus & Priya Chen" goto={goto} />}

        {tab === 'Properties' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card" style={{ display: 'flex', gap: 12, padding: 12 }}>
              <div className="ph" data-label="128 Balsam" style={{ width: 72, height: 72, borderRadius: 8, flex: 'none' }} />
              <div>
                <div className="row-title">128 Balsam Ave</div>
                <div className="row-sub">The Beach · 4 bd · 3 ba</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="money tnum" style={{ fontSize: 14 }}><span className="sym">$</span>1,295,000</span>
                  <span className="badge info" style={{ fontSize: 10 }}>Offer sent</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="actionbar">
        <button className="primary"><window.Icon name="phone" size={18} /><span>Call</span></button>
        <button><window.Icon name="message" size={18} /><span>Text</span></button>
        <button><window.Icon name="note" size={18} /><span>Note</span></button>
        <button><window.Icon name="calendar" size={18} /><span>Appt</span></button>
      </div>
    </>
  );
}

function ClientDetailSeller({ goto }) {
  const [tab, setTab] = useStateCD('Seller');
  const MobileConvTab = window.MobileConvTab;
  const tabs = ['Seller', 'Property', 'Offers', 'Appointments', 'Tasks', 'Notes', 'Conversations', 'Activity'];
  const stageSteps = ['Pre-Listing', 'Agreement Signed', 'Active on Market', 'Offer Review', 'Under Contract', 'Closed'];
  const stageIdx = 2;
  const stageColors = ['#ADB5BD', '#DA77F2', '#FAB005', '#F76707', '#F03E3E', '#40C057'];

  return (
    <>
      <div className="topbar" style={{ paddingBottom: 6 }}>
        <div className="topbar-row">
          <button className="icon-btn" onClick={() => goto('clients')}><window.Icon name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} /></button>
          <div style={{ flex: 1 }} />
          <button className="icon-btn"><window.Icon name="pen" size={14} /></button>
          <button className="icon-btn" style={{ marginLeft: 6 }}><window.Icon name="more" size={16} /></button>
        </div>
      </div>

      <div style={{ padding: '4px 16px 0' }}>
        <div className="flex items-center gap-3">
          <div className="avatar av-seller" style={{ width: 56, height: 56, fontSize: 18 }}>AF</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Aya Fujimori</div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="role seller"><span className="dot" style={{ background: 'oklch(0.58 0.17 310)' }} />Seller client</span>
              <span className="meta">DOM <span className="tnum">11</span></span>
            </div>
          </div>
        </div>

        {/* Pipeline dots */}
        <div className="mt-4">
          <div className="flex items-center gap-0" style={{ marginBottom: 8 }}>
            {stageSteps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 999, margin: '0 auto', background: i <= stageIdx ? stageColors[i] : 'var(--border)', border: i === stageIdx ? '2.5px solid var(--ink)' : '0' }} />
                </div>
                {i < stageSteps.length - 1 && <div style={{ height: 2, width: 12, background: i < stageIdx ? 'var(--brand)' : 'var(--border)' }} />}
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>Active on Market</span> · Stage 3 of 6
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 14 }}>
          {[
            { k: 'List price', v: '$1,495,000' },
            { k: 'Days on market', v: '11' },
            { k: 'Showings', v: '7 total' },
            { k: 'Incoming offers', v: '2 · 1 active' },
          ].map((m, i) => (
            <div key={i} className="card card-pad" style={{ padding: 12 }}>
              <div className="meta" style={{ fontSize: 11 }}>{m.k}</div>
              <div className="mt-1 tnum" style={{ fontSize: 15, fontWeight: 600 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border-2)', marginTop: 14, position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 }}>
        <div className="chips" style={{ padding: '0 12px', mask: 'none', WebkitMask: 'none' }}>
          {tabs.map(t => (
            <button key={t} className="chip" onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '10px 0', marginRight: 16, fontWeight: tab === t ? 600 : 500 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, paddingBottom: 120 }}>
        {tab === 'Seller' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card card-pad">
              <window.Section title="Listing details">
                <window.KVRow k="Address" v="88 Willow Park Rd" />
                <window.KVRow k="List price" v="$1,495,000" />
                <window.KVRow k="List date" v="April 9, 2026" />
                <window.KVRow k="MLS #" v="E8912021" last />
              </window.Section>
            </div>
            <div className="card card-pad">
              <window.Section title="Seller motivation">
                <window.KVRow k="Reason" v="Downsizing" />
                <window.KVRow k="Target close" v="June 30, 2026" />
                <window.KVRow k="Flexibility" v="Low — hard date set" last />
              </window.Section>
            </div>
          </div>
        )}
        {tab === 'Property' && (
          <div>
            <div className="ph" data-label="88 Willow Park Rd" style={{ height: 160, borderRadius: 10, marginBottom: 14 }} />
            <div className="card card-pad">
              <window.Section title="Property stats">
                <window.KVRow k="Beds / Baths" v="3 bed · 2 bath" />
                <window.KVRow k="Size" v="1,840 sqft" />
                <window.KVRow k="Lot" v="20 × 110 ft" />
                <window.KVRow k="Parking" v="1 garage + 1 drive" />
                <window.KVRow k="Taxes" v="$5,200 (2025)" last />
              </window.Section>
            </div>
          </div>
        )}
        {tab === 'Offers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { buyer: 'Bailey', price: 1410000, deposit: 70000, closing: 'Jun 1', exp: 22, cond: 'Financing', status: 'Countered' },
              { buyer: 'Chen',   price: 1455000, deposit: 75000, closing: 'Jun 15', exp: 340, cond: 'Firm', status: 'Submitted' },
            ].map((o, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, flex: 1 }}>Buyer: {o.buyer}</div>
                  {o.status === 'Countered' ? <span className="badge warn">Countered</span> : <span className="badge info">Submitted</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[['Price', '$' + o.price.toLocaleString()], ['Deposit', '$' + o.deposit.toLocaleString()], ['Closing', o.closing], ['Conditions', o.cond]].map(([k, v]) => (
                    <div key={k}>
                      <div className="meta" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }} className="tnum">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2"><window.Countdown minutes={o.exp} /></div>
              </div>
            ))}
          </div>
        )}
        {tab === 'Activity' && (
          <div className="card card-pad">
            {[
              { t: 'Today, 08:00', kind: 'note', text: '2nd offer received from Chen at $1,455,000 firm.' },
              { t: 'Apr 16, 17:00', kind: 'call', text: 'Reviewed Bailey counter with Aya. Preparing our counter at $1,460,000.' },
              { t: 'Apr 14, 12:30', kind: 'appt', text: 'Showing #7 completed.' },
              { t: 'Apr 9, 09:00', kind: 'stage', text: 'Listing went live on MLS.' },
            ].map((a, i, arr) => (
              <window.ActivityItem key={i} {...a} last={i === arr.length - 1} />
            ))}
          </div>
        )}
        {tab === 'Appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { t: 'Tue Apr 22 · 2:00 PM',  title: 'Listing presentation review', status: 'Upcoming',  tone: 'info'    },
              { t: 'Sat Apr 19 · 10:00 AM', title: 'Open house — 88 Willow Park', status: 'Upcoming',  tone: 'info'    },
              { t: 'Wed Apr 16 · 11:30 AM', title: 'Showing #7 — prospective buyer', status: 'Completed', tone: 'success' },
              { t: 'Sat Apr 12 · 1:00 PM',  title: 'Open house — 88 Willow Park', status: 'Completed', tone: 'success' },
            ].map((a, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <span className={'badge ' + a.tone}>{a.status}</span>
                  <span className="meta tnum">{a.t}</span>
                </div>
                <div className="row-title">{a.title}</div>
              </div>
            ))}
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Book appointment</button>
          </div>
        )}

        {tab === 'Tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { text: 'Upload final staging photos to MLS', when: 'Today, 5:00 PM', tone: 'warn' },
              { text: 'Review counter offer terms with Aya', when: 'Today, 4:00 PM', tone: 'warn' },
              { text: 'Prepare showing feedback summary', when: 'Thu Apr 18', tone: 'ok' },
              { text: 'Book professional photography re-shoot', when: 'Fri Apr 19', tone: 'ok' },
            ].map((t, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: 999, border: '1.5px solid var(--border)', marginTop: 1, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{t.text}</div>
                  <div className="mt-1"><span className={'countdown ' + t.tone}>{t.when}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { date: 'Today · 08:00', text: 'Second offer received from Chen at $1,455,000 firm. Presenting both offers to Aya this afternoon — she is leaning toward Chen due to no conditions.', tags: ['offer'] },
              { date: 'Apr 16 · 17:00', text: 'Reviewed Bailey counter with Aya. She is open to $1,460,000 counter if Bailey agrees to June 1 close. Hard cap on conditions.', tags: ['offer', 'strategy'] },
              { date: 'Apr 9', text: 'Listing went live at $1,495,000. Open house planned for Apr 12 and 19. Aya prefers minimal disruption to schedule.', tags: ['listing'] },
            ].map((n, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="meta tnum" style={{ marginBottom: 6 }}>{n.date}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55 }}>{n.text}</div>
                <div className="flex gap-2 mt-2">{n.tags.map(tag => <span key={tag} className="badge brand">#{tag}</span>)}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Conversations' && MobileConvTab && <MobileConvTab name="Aya Fujimori" goto={goto} />}

      </div>

      <div className="actionbar">
        <button className="primary"><window.Icon name="phone" size={18} /><span>Call</span></button>
        <button><window.Icon name="message" size={18} /><span>Text</span></button>
        <button><window.Icon name="note" size={18} /><span>Note</span></button>
        <button><window.Icon name="calendar" size={18} /><span>Appt</span></button>
      </div>
    </>
  );
}

window.ClientDetailBuyer = ClientDetailBuyer;
window.ClientDetailSeller = ClientDetailSeller;
