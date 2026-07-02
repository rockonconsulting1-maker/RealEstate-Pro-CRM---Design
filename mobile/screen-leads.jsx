// screen-leads.jsx — Leads list + kanban
const M2 = window.MOCK; const I2 = window.Icon;

function Leads({ view, onViewChange, goto }) {
  const { TopBar, Avatar, Money, btn } = window;
  const [filter, setFilter] = React.useState('All');
  const [openSwipeId, setOpenSwipeId] = React.useState(null);

  const chips = ['All', 'Hot', 'Warm', 'Cold', 'Buyer', 'Seller', 'Investor'];
  const counts = { All: 28, Hot: 6, Warm: 14, Cold: 8, Buyer: 19, Seller: 7, Investor: 4 };

  return (
    <>
      <TopBar title="Leads" />
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', alignItems: 'center' }}>
        <div className="seg">
          <button data-active={view === 'list'}  onClick={() => onViewChange('list')}>List</button>
          <button data-active={view === 'board'} onClick={() => onViewChange('board')}>Kanban</button>
        </div>
        <div style={{ flex: 1 }} />
        <button className="chip" style={{ padding: '6px 10px' }}>
          <I2 name="filter" size={13} /> Saved views
        </button>
      </div>

      <div className="chips" style={{ paddingBottom: 12 }}>
        {chips.map(c => (
          <button key={c} className="chip" data-active={filter === c} onClick={() => setFilter(c)}>
            {c} <span className="count">{counts[c]}</span>
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {M2.newLeads.concat([
            { id: 'l6', name: 'Camille Reese',   role: 'buyer',  stage: 'Contacted', color: '#74C0FC', budget: '$1.9–2.2M',  temp: 'Hot',  ago: '5h' },
            { id: 'l7', name: 'Mateo Vargas',    role: 'buyer',  stage: 'Nurturing', color: '#9775FA', budget: '$500–600k',  temp: 'Warm', ago: '1w' },
            { id: 'l8', name: 'Ines Alvarez',    role: 'seller', stage: 'Proposal',  color: '#E64980', budget: 'Leslieville', temp: 'Hot',  ago: '2d' },
          ]).map(l => (
            <div key={l.id} className="swipe-wrap card" style={{ padding: 0 }}>
              <div className="swipe-actions">
                <button className="done"><I2 name="check" size={16} />Done</button>
                <button className="del"><I2 name="more" size={16} />Delete</button>
              </div>
              <div
                className="swipe-inner card-pad"
                data-open={openSwipeId === l.id}
                onClick={() => setOpenSwipeId(openSwipeId === l.id ? null : l.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center gap-3">
                  <Avatar name={l.name} role={l.role} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2">
                      <div className="row-title truncate">{l.name}</div>
                      <span className={'role ' + (l.role === 'seller' ? 'seller' : 'buyer')}>
                        <span className="dot" style={{ backgroundColor: l.role === 'seller' ? 'oklch(0.58 0.17 310)' : 'oklch(0.62 0.14 254)' }} />
                        {l.role === 'seller' ? 'Seller lead' : 'Buyer lead'}
                      </span>
                    </div>
                    <div className="row-sub flex items-center gap-2 mt-1">
                      <span className="dot" style={{ backgroundColor: l.color }} />
                      <span>{l.stage}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {l.temp === 'Hot' && <span className="badge danger"><I2 name="flame" size={10} /> Hot</span>}
                    {l.temp === 'Warm' && <span className="badge warn">Warm</span>}
                    {l.temp === 'Cold' && <span className="badge">Cold</span>}
                    <div className="meta tnum mt-1">{l.ago} ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3" style={{ paddingTop: 10, borderTop: '1px solid var(--border-2)' }}>
                  <div style={{ flex: 1 }}>
                    <div className="meta" style={{ fontSize: 11 }}>Budget / Target</div>
                    <div className="tnum" style={{ fontSize: 14, fontWeight: 600 }}>{l.budget}</div>
                  </div>
                  <button style={btn.ghost} onClick={(e) => { e.stopPropagation(); goto && goto(l.role === 'seller' ? 'leadDetailSeller' : 'leadDetailBuyer'); }}>
                    <I2 name="phone" size={14} />
                  </button>
                  <button style={btn.ghost}>
                    <I2 name="message" size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', padding: '20px 0 30px', color: 'var(--ink-4)', fontSize: 12 }}>
            End of list · swipe any card for quick actions
          </div>
        </div>
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {M2.leadLanes.map(lane => (
            <div key={lane.name} className="lane">
              <div className="lane-head">
                <span className="dot" style={{ backgroundColor: lane.color }} />
                <span className="name">{lane.name}</span>
                <span className="count tnum">{lane.total}</span>
                <div className="spacer" />
                <span className="money tnum" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{lane.value}</span>
              </div>
              {lane.cards.length > 0 && (
                <div className="lane-body">
                  {lane.cards.map((c, i) => (
                    <div key={i} className="lane-card">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} role={c.role} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="row-title truncate" style={{ fontSize: 14 }}>{c.name}</div>
                          <div className="row-sub tnum">{c.tag} · {c.ago}</div>
                        </div>
                        <div className="money tnum" style={{ fontSize: 14 }}>{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {lane.cards.length === 0 && (
                <div style={{ padding: '16px 14px', color: 'var(--ink-4)', fontSize: 12, textAlign: 'center' }}>
                  {lane.total} leads · tap to expand
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

window.Leads = Leads;
