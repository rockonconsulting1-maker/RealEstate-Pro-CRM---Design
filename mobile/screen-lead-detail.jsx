// screen-lead-detail.jsx — Lead Detail for Buyer and Seller leads
const useStateLd = React.useState;

// ─── Shared sub-components ───────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="section-h" style={{ padding: '0 0 10px' }}>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function KVRow({ k, v, last }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: last ? 0 : '1px solid var(--border-2)' }}>
      <div style={{ width: 120, fontSize: 13, color: 'var(--ink-3)', flexShrink: 0 }}>{k}</div>
      <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{v}</div>
    </div>
  );
}

function ActivityItem({ t, kind, text, last }) {
  const dot = { note: 'var(--brand)', call: 'var(--success)', stage: 'var(--ink-3)', appt: 'var(--warning)' }[kind] || 'var(--ink-3)';
  return (
    <div style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: last ? 0 : '1px solid var(--border-2)', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0, paddingTop: 3 }}>
        <div style={{ width: 8, height: 8, borderRadius: 999, background: dot }} />
        {!last && <div style={{ width: 1, flex: 1, background: 'var(--border-2)', marginTop: 4, minHeight: 20 }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>{text}</div>
        <div className="meta tnum" style={{ marginTop: 2 }}>{t}</div>
      </div>
    </div>
  );
}

// ─── BUYER LEAD DETAIL ───────────────────────────────────────────────
function LeadDetailBuyer({ goto }) {
  const [tab, setTab] = useStateLd('Buyer Info');
  const MobileConvTab = window.MobileConvTab;
  const tabs = ['Buyer Info', 'Properties', 'Appointments', 'Tasks', 'Notes', 'Conversations', 'Activity'];

  const lead = {
    name: 'Sarah Okonkwo', initials: 'SO', role: 'buyer',
    stage: 'Contacted', stageColor: '#74C0FC', stageNum: 2, stagePct: 18,
    lastContact: '3 days ago', temp: 'Warm',
    phone: '+1 (416) 555-0192', email: 'sarah.o@gmail.com',
    source: 'Referral — Navarro family',
  };

  return (
    <>
      {/* Back nav */}
      <div className="topbar" style={{ paddingBottom: 6 }}>
        <div className="topbar-row">
          <button className="icon-btn" onClick={() => goto('leads')} aria-label="back">
            <window.Icon name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <div style={{ flex: 1 }} />
          <button className="icon-btn"><window.Icon name="pen" size={14} /></button>
          <button className="icon-btn" style={{ marginLeft: 6 }}><window.Icon name="more" size={16} /></button>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '4px 16px 0' }}>
        <div className="flex items-center gap-3">
          <div className="avatar av-buyer" style={{ width: 56, height: 56, fontSize: 18 }}>{lead.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{lead.name}</div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="role buyer">
                <span className="dot" style={{ background: 'oklch(0.62 0.14 254)' }} />Buyer lead
              </span>
              <span className="badge warn"><window.Icon name="flame" size={10} />Warm</span>
              <span className="meta">Last contact <span className="tnum">{lead.lastContact}</span></span>
            </div>
          </div>
        </div>

        {/* Quick contact */}
        <div className="flex gap-2 mt-3">
          <button style={{ ...window.btn.primary, flex: 1 }}><window.Icon name="phone" size={14} />Call</button>
          <button style={{ ...window.btn.ghost, flex: 1 }}><window.Icon name="message" size={14} />Text</button>
          <button style={{ ...window.btn.ghost, flex: 1 }}><window.Icon name="note" size={14} />Note</button>
        </div>

        {/* Stage progress */}
        <div className="mt-4">
          <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
            <span className="dot" style={{ backgroundColor: lead.stageColor }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>{lead.stage}</span>
            <div style={{ flex: 1 }} />
            <span className="meta">Stage {lead.stageNum} of 8</span>
          </div>
          <div className="progress"><span style={{ width: lead.stagePct + '%', background: lead.stageColor }} /></div>
        </div>

        {/* Convert CTA */}
        <button onClick={() => window.openSheet?.('convertLead')} style={{ width: '100%', marginTop: 12, padding: '11px', background: 'var(--brand-soft)', color: 'var(--brand-ink)', border: '1px solid oklch(0.87 0.04 254)', borderRadius: 10, fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <window.Icon name="convert" size={15} />Convert to Client
        </button>
      </div>

      {/* Scrollable tabs */}
      <div style={{ borderBottom: '1px solid var(--border-2)', marginTop: 16, position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 }}>
        <div className="chips" style={{ padding: '0 12px', mask: 'none', WebkitMask: 'none' }}>
          {tabs.map(t => (
            <button key={t} className="chip" onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '10px 0', marginRight: 16, fontWeight: tab === t ? 600 : 500 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, paddingBottom: 120 }}>

        {tab === 'Buyer Info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card card-pad">
              <Section title="Budget & financing">
                <KVRow k="Budget range" v="$900,000 – $1,100,000" />
                <KVRow k="Pre-approval" v="Scotiabank · $1,050,000" />
                <KVRow k="Pre-approval exp." v="July 31, 2026" />
                <KVRow k="Down payment" v="~20% (approx. $200k)" last />
              </Section>
            </div>
            <div className="card card-pad">
              <Section title="Search requirements">
                <KVRow k="Areas" v="Roncesvalles · Bloor West · Junction" />
                <KVRow k="Type" v="Detached or semi · 3+ beds" />
                <KVRow k="Must-haves" v="Parking, ≥1,200 sqft, finished basement" />
                <KVRow k="Nice-to-have" v="Fenced yard, ensuite, home office" />
                <KVRow k="Showings" v="Weekends + weekday eve only" last />
              </Section>
            </div>
            <div className="card card-pad">
              <Section title="Timeline & source">
                <KVRow k="Timeline" v="60–90 days" />
                <KVRow k="Urgency" v="Lease ends July 1, 2026" />
                <KVRow k="Source" v={lead.source} />
                <KVRow k="Phone" v={lead.phone} />
                <KVRow k="Email" v={lead.email} last />
              </Section>
            </div>
            <div className="card card-pad" style={{ background: 'var(--brand-soft)' }}>
              <div className="meta" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand-ink)', marginBottom: 6 }}>Agent notes</div>
              <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.55 }}>Partner (Kwame) works rotating shifts — always confirm showing windows 24h in advance. Prefers text over calls. Motivated; lease deadline is the hard driver.</div>
            </div>
          </div>
        )}

        {tab === 'Properties' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['128 Balsam Ave — $1.295M · Shown Apr 17', '44 Elm Grove Ave — $1.05M · Shown Apr 9', '19 Runnymede Rd — $979k · Declined'].map((p, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 12, padding: 12 }}>
                <div className="ph" data-label="photo" style={{ width: 68, height: 68, borderRadius: 8, flex: 'none' }} />
                <div style={{ flex: 1 }}>
                  <div className="row-title" style={{ fontSize: 14 }}>{p.split(' — ')[0]}</div>
                  <div className="row-sub">{p.split(' — ')[1]}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Activity' && (
          <div className="card card-pad">
            {[
              { t: 'Today, 09:12', kind: 'note', text: 'Pre-approval from Scotia confirmed — $1.05M. Expires July 31.' },
              { t: 'Today, 08:47', kind: 'call', text: 'Called (6 min). Confirmed showing for 10:30 AM Saturday.' },
              { t: 'Apr 15, 14:20', kind: 'stage', text: 'Moved from New Lead → Contacted' },
              { t: 'Apr 14, 11:00', kind: 'appt', text: 'Buyer consultation completed. Search parameters captured.' },
              { t: 'Apr 13, 09:30', kind: 'note', text: 'Lead came in via Navarro referral. High motivation noted.' },
            ].map((a, i, arr) => (
              <ActivityItem key={i} {...a} last={i === arr.length - 1} />
            ))}
          </div>
        )}

        {tab === 'Appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { t: 'Sat Apr 19 · 10:30 AM', title: 'Showing — 128 Balsam Ave', status: 'Upcoming', tone: 'info' },
              { t: 'Mon Apr 14 · 11:00 AM', title: 'Buyer consultation', status: 'Completed', tone: 'success' },
            ].map((a, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={'badge ' + a.tone}>{a.status}</span>
                  <span className="meta tnum">{a.t}</span>
                </div>
                <div className="row-title">{a.title}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { text: 'Follow up on Scotia pre-approval', when: 'Today, 11:00 AM', tone: 'warn' },
              { text: 'Confirm Saturday showing at 128 Balsam', when: 'Today, 3:00 PM', tone: 'warn' },
              { text: 'Send neighbourhood comparison sheet', when: 'Tomorrow', tone: 'ok' },
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
              { date: 'Apr 17 · 09:12', text: 'Pre-approval from Scotia confirmed — $1.05M. Expires July 31, 2026. Partners name is Kwame.', tags: ['financing'] },
              { date: 'Apr 14 · 11:00', text: 'Buyer consult complete. Key priorities: parking, finished basement, near Bloor West Village. Lease ends July 1 — hard deadline.', tags: ['search', 'timeline'] },
            ].map((n, i) => (
              <div key={i} className="card card-pad" style={{ padding: 14 }}>
                <div className="meta tnum" style={{ marginBottom: 6 }}>{n.date}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55 }}>{n.text}</div>
                <div className="flex gap-2 mt-2">
                  {n.tags.map(tag => <span key={tag} className="badge brand">#{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Conversations' && MobileConvTab && <MobileConvTab name="Sarah Okonkwo" goto={goto} />}

      </div>
    </>
  );
}

// ─── SELLER LEAD DETAIL ──────────────────────────────────────────────
function LeadDetailSeller({ goto }) {
  const [tab, setTab] = useStateLd('Seller Info');
  const MobileConvTab = window.MobileConvTab;
  const tabs = ['Seller Info', 'Properties', 'Appointments', 'Tasks', 'Notes', 'Conversations', 'Activity'];

  return (
    <>
      <div className="topbar" style={{ paddingBottom: 6 }}>
        <div className="topbar-row">
          <button className="icon-btn" onClick={() => goto('leads')} aria-label="back">
            <window.Icon name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} />
          </button>
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
              <span className="role seller"><span className="dot" style={{ background: 'oklch(0.58 0.17 310)' }} />Seller lead</span>
              <span className="badge warn"><window.Icon name="flame" size={10} />Warm</span>
              <span className="meta">Last contact <span className="tnum">1d ago</span></span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button style={{ ...window.btn.primary, flex: 1 }}><window.Icon name="phone" size={14} />Call</button>
          <button style={{ ...window.btn.ghost, flex: 1 }}><window.Icon name="message" size={14} />Text</button>
          <button style={{ ...window.btn.ghost, flex: 1 }}><window.Icon name="note" size={14} />Note</button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
            <span className="dot" style={{ backgroundColor: '#ADB5BD' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>Pre-Listing</span>
            <div style={{ flex: 1 }} />
            <span className="meta">Stage 1 of 8</span>
          </div>
          <div className="progress"><span style={{ width: '8%', background: '#ADB5BD' }} /></div>
        </div>

        <button onClick={() => window.openSheet?.('convertLead')} style={{ width: '100%', marginTop: 12, padding: '11px', background: 'var(--brand-soft)', color: 'var(--brand-ink)', border: '1px solid oklch(0.87 0.04 254)', borderRadius: 10, fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <window.Icon name="convert" size={15} />Convert to Client
        </button>
      </div>

      <div style={{ borderBottom: '1px solid var(--border-2)', marginTop: 16, position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 }}>
        <div className="chips" style={{ padding: '0 12px', mask: 'none', WebkitMask: 'none' }}>
          {tabs.map(t => (
            <button key={t} className="chip" onClick={() => setTab(t)} style={{ border: 0, background: 'transparent', color: tab === t ? 'var(--brand)' : 'var(--ink-3)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent', borderRadius: 0, padding: '10px 0', marginRight: 16, fontWeight: tab === t ? 600 : 500 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, paddingBottom: 120 }}>
        {tab === 'Seller Info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card card-pad">
              <Section title="Property to sell">
                <KVRow k="Address" v="88 Willow Park Rd, Leslieville" />
                <KVRow k="Type" v="Semi-detached · 3 bed · 2 bath" />
                <KVRow k="Est. value" v="$1.4M – $1.55M" />
                <KVRow k="Ownership" v="15 years · mortgage-free" last />
              </Section>
            </div>
            <div className="card card-pad">
              <Section title="Selling motivation">
                <KVRow k="Reason" v="Downsizing — kids moved out" />
                <KVRow k="Timeline" v="List by June 2026" />
                <KVRow k="Buying after?" v="Yes — wants to buy in Hamilton" />
                <KVRow k="Temperature" v="Warm · Exploring options" last />
              </Section>
            </div>
            <div className="card card-pad">
              <Section title="Contact & source">
                <KVRow k="Phone" v="+1 (416) 555-0207" />
                <KVRow k="Email" v="aya.fujimori@email.ca" />
                <KVRow k="Source" v="Referral — past client" />
                <KVRow k="Lead age" v="1 day" last />
              </Section>
            </div>
            <div className="card card-pad" style={{ background: 'oklch(0.97 0.015 310 / 0.4)' }}>
              <div className="meta" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'oklch(0.42 0.15 310)', marginBottom: 6 }}>Agent notes</div>
              <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.55 }}>Met at the Navarro close — warm referral. Very organized. May also want help buying in Hamilton (co-op opp). Listing presentation is next step.</div>
            </div>
          </div>
        )}

        {tab === 'Activity' && (
          <div className="card card-pad">
            {[
              { t: 'Apr 16 · 15:20', kind: 'appt', text: 'Listing presentation scheduled for Apr 22.' },
              { t: 'Apr 15 · 10:00', kind: 'call', text: 'Intro call (14 min). Motivated seller, wants to list before summer.' },
              { t: 'Apr 15 · 09:30', kind: 'note', text: 'Lead received via Navarro referral. Emailed intro within 5 min.' },
            ].map((a, i, arr) => (
              <ActivityItem key={i} {...a} last={i === arr.length - 1} />
            ))}
          </div>
        )}

        {tab === 'Properties' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card" style={{ display: 'flex', gap: 12, padding: 12 }}>
              <div className="ph" data-label="88 Willow Park" style={{ width: 68, height: 68, borderRadius: 8, flex: 'none' }} />
              <div style={{ flex: 1 }}>
                <div className="row-title">88 Willow Park Rd</div>
                <div className="row-sub">Leslieville · 3 bd · 2 ba · <span className="tnum">1,840 sqft</span></div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="money tnum" style={{ fontSize: 14 }}><span className="sym">$</span>1,495,000</span>
                  <span className="badge" style={{ fontSize: 10 }}>Listing prep</span>
                </div>
              </div>
            </div>
            <button style={{ padding: 11, border: '1px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--ink-3)', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>+ Add property</button>
          </div>
        )}

        {tab === 'Appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { t: 'Tue Apr 22 · 2:00 PM',  title: 'Listing presentation', status: 'Upcoming',  tone: 'info'    },
              { t: 'Wed Apr 15 · 10:00 AM', title: 'Initial consultation', status: 'Completed', tone: 'success' },
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
              { text: 'Prepare CMA for Aya Fujimori', when: 'Today, 4:00 PM', tone: 'warn' },
              { text: 'Book listing presentation at 88 Willow Park', when: 'Tomorrow', tone: 'ok' },
              { text: 'Research comparable sales in Leslieville', when: 'Fri Apr 19', tone: 'ok' },
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
              { date: 'Apr 15 · 10:00', text: 'Intro call. Motivated seller — wants to list before summer. CMA requested. May want help buying in Hamilton (co-op opportunity).', tags: ['motivation', 'co-op'] },
              { date: 'Apr 13 · 09:30', text: 'Referred by the Navarro family. Emailed intro deck within 5 minutes. Warm referral, high trust from the start.', tags: ['referral'] },
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
    </>
  );
}

window.LeadDetailBuyer = LeadDetailBuyer;
window.LeadDetailSeller = LeadDetailSeller;
window.Section = Section;
window.KVRow = KVRow;
window.ActivityItem = ActivityItem;
