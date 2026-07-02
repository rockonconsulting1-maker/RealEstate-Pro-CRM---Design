// screen-mls.jsx — Properties (MLS) · MLS Director Database
function MLSProperties({ goto }) {
  const { TopBar } = window;
  const I = window.Icon;

  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('All');

  const MLS_LISTINGS = [
    { id: 'm1',  mls: 'E8901234', addr: '55 Monarch Park Ave',    city: 'Leslieville',        type: 'Detached',      beds: 3, baths: 2, sqft: 1680, price: 1089000, status: 'Active',      dom: 4  },
    { id: 'm2',  mls: 'W9012345', addr: '210 Roncesvalles Ave',   city: 'Roncesvalles',       type: 'Semi-Detached', beds: 4, baths: 3, sqft: 1920, price: 1395000, status: 'Active',      dom: 7  },
    { id: 'm3',  mls: 'C8765432', addr: '88 Carlton St #1402',    city: 'Cabbagetown',        type: 'Condo',         beds: 2, baths: 2, sqft: 890,  price: 749000,  status: 'Active',      dom: 12 },
    { id: 'm4',  mls: 'E9023456', addr: '14 Beech Ave',           city: 'The Beach',          type: 'Detached',      beds: 5, baths: 4, sqft: 3100, price: 2195000, status: 'Active',      dom: 2  },
    { id: 'm5',  mls: 'W8890123', addr: '33 Symington Ave',       city: 'Bloor West Village', type: 'Semi-Detached', beds: 3, baths: 2, sqft: 1540, price: 1149000, status: 'Active',      dom: 9  },
    { id: 'm6',  mls: 'C9034567', addr: '1 Bloor St E #4210',     city: 'Yorkville',          type: 'Condo',         beds: 1, baths: 1, sqft: 540,  price: 649000,  status: 'Active',      dom: 18 },
    { id: 'm7',  mls: 'E8789012', addr: '72 Glebemount Ave',      city: 'East York',          type: 'Detached',      beds: 3, baths: 2, sqft: 1420, price: 999000,  status: 'Conditional', dom: 21 },
    { id: 'm8',  mls: 'W9045678', addr: '445 Durie St',           city: 'Swansea',            type: 'Detached',      beds: 4, baths: 3, sqft: 2200, price: 1650000, status: 'Active',      dom: 5  },
    { id: 'm9',  mls: 'C8901234', addr: '155 Beecroft Rd #803',   city: 'North York',         type: 'Condo',         beds: 2, baths: 2, sqft: 920,  price: 699000,  status: 'Active',      dom: 14 },
    { id: 'm10', mls: 'E9056789', addr: '29 Dundas St E',         city: 'Leslieville',        type: 'Townhouse',     beds: 3, baths: 3, sqft: 1750, price: 1085000, status: 'Conditional', dom: 30 },
    { id: 'm11', mls: 'W9067890', addr: '92 Indian Rd',           city: 'High Park',          type: 'Detached',      beds: 4, baths: 3, sqft: 2050, price: 1875000, status: 'Active',      dom: 6  },
    { id: 'm12', mls: 'C9078901', addr: '330 Adelaide St W #902', city: 'Entertainment Dist', type: 'Condo',         beds: 1, baths: 1, sqft: 620,  price: 589000,  status: 'Active',      dom: 11 },
    { id: 'm13', mls: 'E9089012', addr: '44 Woodbine Ave',        city: 'The Beach',          type: 'Semi-Detached', beds: 3, baths: 2, sqft: 1600, price: 1295000, status: 'Active',      dom: 3  },
    { id: 'm14', mls: 'N9090123', addr: '8 Hillcrest Dr',         city: 'Thornhill',          type: 'Detached',      beds: 5, baths: 4, sqft: 3600, price: 2450000, status: 'Active',      dom: 8  },
    { id: 'm15', mls: 'W9101234', addr: '18 Vine Ave',            city: 'Junction Triangle',  type: 'Townhouse',     beds: 3, baths: 3, sqft: 1480, price: 998000,  status: 'Conditional', dom: 16 },
  ];

  const types = ['All', 'Detached', 'Semi-Detached', 'Condo', 'Townhouse'];

  const statusColor = { 'Active': '#40C057', 'Conditional': '#FAB005', 'Sold': '#ADB5BD' };

  const filtered = MLS_LISTINGS.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      l.addr.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.mls.toLowerCase().includes(q) ||
      l.type.toLowerCase().includes(q);
    const matchType = typeFilter === 'All' || l.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <>
      <TopBar title="Properties (MLS)" />

      {/* Search bar */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--bg-sunk)', borderRadius: 10, padding: '9px 12px',
        }}>
          <I name="search" size={15} color="var(--ink-3)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Address, city, MLS #…"
            style={{
              flex: 1, border: 0, background: 'transparent',
              fontFamily: 'var(--font)', fontSize: 14,
              color: 'var(--ink)', outline: 'none',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 20, lineHeight: 1, padding: 0 }}
            >×</button>
          )}
        </div>
      </div>

      {/* Type filter chips */}
      <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {types.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{
            padding: '5px 13px', borderRadius: 999, flexShrink: 0,
            border: '1.5px solid',
            borderColor: typeFilter === t ? 'var(--brand)' : 'var(--border)',
            background: typeFilter === t ? 'var(--brand)' : 'transparent',
            color: typeFilter === t ? '#fff' : 'var(--ink-2)',
            fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      {/* Count row */}
      <div style={{ padding: '0 20px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="meta tnum">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
        {(search || typeFilter !== 'All') && (
          <button
            onClick={() => { setSearch(''); setTypeFilter('All'); }}
            style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer', fontSize: 12, color: 'var(--brand)', fontFamily: 'var(--font)', fontWeight: 500 }}
          >Clear filters</button>
        )}
      </div>

      {/* Listings */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <I name="search" size={28} color="var(--ink-3)" />
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>No listings found</div>
            <div className="meta">Try a different search or filter</div>
          </div>
        ) : filtered.map(l => (
          <div key={l.id} className="card" style={{ display: 'flex', gap: 12, padding: 14, alignItems: 'flex-start' }}>
            <div className="ph" data-label="listing photo" style={{ width: 76, height: 76, borderRadius: 8, flex: 'none' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{l.addr}</div>
              <div className="row-sub">{l.city} · {l.type}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
                {l.beds} bd · {l.baths} ba · <span className="tnum">{l.sqft.toLocaleString()}</span> sqft
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span className="money tnum" style={{ fontSize: 15 }}>
                  <span className="sym">$</span>{l.price.toLocaleString()}
                </span>
                <div style={{ flex: 1 }} />
                <span className="badge">
                  <span className="dot" style={{ backgroundColor: statusColor[l.status] || '#ADB5BD' }} />
                  {l.status}
                </span>
                <span className="meta tnum" style={{ fontSize: 11 }}>DOM {l.dom}</span>
              </div>
              <div style={{ marginTop: 5, fontSize: 11, color: 'var(--ink-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                MLS# {l.mls}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 100 }} />
    </>
  );
}

window.MLSProperties = MLSProperties;
