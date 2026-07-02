// mls.jsx — Properties (MLS) search page
const MLS_I = window.Icon;
const { Money: MLS_Money } = window.RC;

const MLS_DATA = [
  { id: 'mls1',  addr: '47 Maple Ave',         city: 'The Annex',         mls: 'C9-301-1122', price: 1875000, beds: 5, baths: 3, sqft: 2890, type: 'Detached',      dom: 2,  status: 'Active' },
  { id: 'mls2',  addr: '220 Roncesvalles Ave',  city: 'Roncesvalles',      mls: 'W9-210-8834', price: 1190000, beds: 3, baths: 2, sqft: 1640, type: 'Semi-detached', dom: 5,  status: 'Active' },
  { id: 'mls3',  addr: '14 Fenwick Ave',        city: 'Swansea',           mls: 'W9-220-5511', price: 1340000, beds: 4, baths: 2, sqft: 1950, type: 'Detached',      dom: 1,  status: 'Active' },
  { id: 'mls4',  addr: '88 Rushton Rd',         city: 'Wychwood',          mls: 'C9-188-2201', price: 1650000, beds: 4, baths: 3, sqft: 2300, type: 'Detached',      dom: 8,  status: 'Active' },
  { id: 'mls5',  addr: '331 Pape Ave',          city: 'Playter Estates',   mls: 'E9-045-7718', price: 1089000, beds: 3, baths: 2, sqft: 1520, type: 'Semi-detached', dom: 3,  status: 'Active' },
  { id: 'mls6',  addr: '19 Dovercourt Rd',      city: 'Trinity Bellwoods', mls: 'C9-092-3341', price: 1425000, beds: 4, baths: 2, sqft: 2010, type: 'Detached',      dom: 11, status: 'Active' },
  { id: 'mls7',  addr: '57 Springhurst Ave',    city: 'Parkdale',          mls: 'W9-067-9923', price:  979000, beds: 3, baths: 2, sqft: 1380, type: 'Semi-detached', dom: 14, status: 'Active' },
  { id: 'mls8',  addr: '102 Pears Ave',         city: 'Yorkville',         mls: 'C9-402-1198', price: 2890000, beds: 4, baths: 4, sqft: 3400, type: 'Detached',      dom: 4,  status: 'Active' },
  { id: 'mls9',  addr: '44 Fermanagh Ave',      city: 'Roncesvalles',      mls: 'W9-211-0882', price: 1260000, beds: 3, baths: 2, sqft: 1700, type: 'Detached',      dom: 7,  status: 'Active' },
  { id: 'mls10', addr: '212 Jones Ave',         city: 'Riverdale',         mls: 'E9-031-5510', price: 1115000, beds: 4, baths: 2, sqft: 1610, type: 'Semi-detached', dom: 9,  status: 'Active' },
  { id: 'mls11', addr: '8 Kensington Ave',      city: 'Kensington Market', mls: 'C9-044-6612', price: 1595000, beds: 4, baths: 3, sqft: 2150, type: 'Detached',      dom: 0,  status: 'New'    },
  { id: 'mls12', addr: '76 Concord Ave',        city: 'Palmerston',        mls: 'C9-078-3301', price: 1730000, beds: 5, baths: 3, sqft: 2580, type: 'Detached',      dom: 6,  status: 'Active' },
  { id: 'mls13', addr: '540 Manning Ave',       city: 'Seaton Village',    mls: 'C9-055-2290', price: 1480000, beds: 4, baths: 3, sqft: 2200, type: 'Detached',      dom: 12, status: 'Active' },
  { id: 'mls14', addr: '31 Lippincott St',      city: 'Little Portugal',   mls: 'C9-033-8821', price: 1205000, beds: 3, baths: 2, sqft: 1560, type: 'Semi-detached', dom: 3,  status: 'Active' },
  { id: 'mls15', addr: '185 Kenilworth Ave',    city: 'Upper Beaches',     mls: 'E9-072-1190', price: 1355000, beds: 4, baths: 2, sqft: 1880, type: 'Detached',      dom: 5,  status: 'Active' },
  { id: 'mls16', addr: '901 Logan Ave',         city: 'Riverdale',         mls: 'E9-039-0042', price:  895000, beds: 3, baths: 1, sqft: 1250, type: 'Semi-detached', dom: 18, status: 'Active' },
  { id: 'mls17', addr: '22 Glebe Rd W',         city: 'Davisville Village',mls: 'C9-310-7741', price: 2150000, beds: 5, baths: 4, sqft: 3100, type: 'Detached',      dom: 2,  status: 'New'    },
  { id: 'mls18', addr: '63 Booth Ave',          city: 'Leslieville',       mls: 'E9-060-4419', price: 1050000, beds: 3, baths: 2, sqft: 1490, type: 'Semi-detached', dom: 20, status: 'Active' },
  { id: 'mls19', addr: '148 Crescent Rd',       city: 'Rosedale',          mls: 'C9-450-9923', price: 4200000, beds: 6, baths: 5, sqft: 5200, type: 'Detached',      dom: 1,  status: 'New'    },
  { id: 'mls20', addr: '34 Yarmouth Rd',        city: 'Christie Pits',     mls: 'C9-071-3314', price: 1580000, beds: 4, baths: 3, sqft: 2250, type: 'Detached',      dom: 8,  status: 'Active' },
  { id: 'mls21', addr: '118 Westmoreland Ave',  city: 'Dufferin Grove',    mls: 'C9-048-5521', price: 1320000, beds: 3, baths: 2, sqft: 1720, type: 'Semi-detached', dom: 4,  status: 'Active' },
  { id: 'mls22', addr: '252 Ossington Ave',     city: 'Beaconsfield',      mls: 'C9-062-8870', price: 1545000, beds: 4, baths: 3, sqft: 2080, type: 'Detached',      dom: 6,  status: 'Active' },
  { id: 'mls23', addr: '77 Cowan Ave',          city: 'Parkdale',          mls: 'W9-055-3312', price:  850000, beds: 2, baths: 1, sqft: 1100, type: 'Semi-detached', dom: 22, status: 'Active' },
  { id: 'mls24', addr: '431 Broadview Ave',     city: 'Riverdale',         mls: 'E9-044-9901', price: 1680000, beds: 5, baths: 3, sqft: 2490, type: 'Detached',      dom: 0,  status: 'New'    },
];

const PRICE_CAPS = [
  { label: 'Any price',   value: 0        },
  { label: 'Under $1M',   value: 1000000  },
  { label: 'Under $1.5M', value: 1500000  },
  { label: 'Under $2M',   value: 2000000  },
  { label: 'Under $3M',   value: 3000000  },
];
const PROP_TYPES = ['Any', 'Detached', 'Semi-detached', 'Condo', 'Townhouse'];
const BED_OPTS   = [0, 2, 3, 4, 5];
const BATH_OPTS  = [0, 1, 2, 3];

function MLSProperties({ goto }) {
  const [query,    setQuery]    = React.useState('');
  const [minBeds,  setMinBeds]  = React.useState(0);
  const [minBaths, setMinBaths] = React.useState(0);
  const [propType, setPropType] = React.useState('Any');
  const [maxPrice, setMaxPrice] = React.useState(0);
  const [sortBy,   setSortBy]   = React.useState('dom');
  const inputRef = React.useRef(null);

  const hasFilters = query || minBeds > 0 || minBaths > 0 || propType !== 'Any' || maxPrice > 0;

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    return MLS_DATA
      .filter(p => {
        if (q && !p.addr.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.mls.toLowerCase().includes(q)) return false;
        if (minBeds  > 0        && p.beds  < minBeds)    return false;
        if (minBaths > 0        && p.baths < minBaths)   return false;
        if (propType !== 'Any'  && p.type  !== propType) return false;
        if (maxPrice > 0        && p.price > maxPrice)   return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc')  return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return a.dom - b.dom;
      });
  }, [query, minBeds, minBaths, propType, maxPrice, sortBy]);

  const clearFilters = () => {
    setQuery(''); setMinBeds(0); setMinBaths(0); setPropType('Any'); setMaxPrice(0);
  };

  const selStyle = {
    fontSize: 13, padding: '5px 10px',
    border: '1px solid var(--border)', borderRadius: 6,
    background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Page head ── */}
      <div className="page-head">
        <div>
          <div className="sub">MLS database · Toronto Region</div>
          <h1>Properties</h1>
        </div>
        <div className="actions">
          {hasFilters && (
            <span className="meta tnum" style={{ color: 'var(--brand)', fontWeight: 600 }}>
              {filtered.length} of {MLS_DATA.length} results
            </span>
          )}
          {!hasFilters && (
            <span className="meta tnum">{MLS_DATA.length} listings</span>
          )}
        </div>
      </div>

      {/* ── Search + filters card ── */}
      <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
            <MLS_I name="search" size={15} color="var(--ink-4)" />
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by address, neighbourhood, or MLS#…"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 36px 10px 36px',
              border: '1.5px solid var(--border)', borderRadius: 8,
              background: 'var(--bg-sunk)', color: 'var(--ink)', fontSize: 14,
              outline: 'none', transition: 'border-color 120ms',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.background = 'var(--surface)'; }}
            onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg-sunk)'; }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
            >×</button>
          )}
        </div>

        {/* Filter row */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Beds */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>Beds</span>
            <div className="seg">
              {BED_OPTS.map(b => (
                <button key={b} data-active={minBeds === b} onClick={() => setMinBeds(b)}>
                  {b === 0 ? 'Any' : b + '+'}
                </button>
              ))}
            </div>
          </div>

          {/* Baths */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>Baths</span>
            <div className="seg">
              {BATH_OPTS.map(b => (
                <button key={b} data-active={minBaths === b} onClick={() => setMinBaths(b)}>
                  {b === 0 ? 'Any' : b + '+'}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Type</span>
            <select value={propType} onChange={e => setPropType(e.target.value)} style={selStyle}>
              {PROP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Max price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>Max price</span>
            <select value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={selStyle}>
              {PRICE_CAPS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          {/* Sort — pushed right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Sort</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selStyle}>
              <option value="dom">Newest first</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>
          </div>

          {hasFilters && (
            <button className="btn ghost sm" onClick={clearFilters} style={{ color: 'var(--ink-3)', fontSize: 12 }}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      {filtered.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: 'center', padding: '52px 20px' }}>
          <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.4 }}>⌕</div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-2)', marginBottom: 4 }}>No listings match your search</div>
          <div className="meta">Try adjusting your filters or search a different area</div>
          <button className="btn sm" style={{ marginTop: 14 }} onClick={clearFilters}>Clear all filters</button>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 72 }}>Photo</th>
                <th>Address</th>
                <th>MLS #</th>
                <th>Type</th>
                <th className="num">Price</th>
                <th className="num">Beds</th>
                <th className="num">Baths</th>
                <th className="num">Sqft</th>
                <th className="num">DOM</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => goto('propDetail')}>
                  <td><div className="ph" data-label="photo" style={{ width: 58, height: 40, borderRadius: 6 }} /></td>
                  <td>
                    <div className="name">{p.addr}</div>
                    <div className="sub">{p.city}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--ink-3)' }}>{p.mls}</span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{p.type}</td>
                  <td className="num"><MLS_Money v={p.price} /></td>
                  <td className="num tnum">{p.beds}</td>
                  <td className="num tnum">{p.baths}</td>
                  <td className="num tnum">{p.sqft.toLocaleString()}</td>
                  <td className="num tnum">{p.dom === 0 ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>New</span> : p.dom}</td>
                  <td>
                    <span className={'badge ' + (p.status === 'New' ? 'success' : 'info')}>{p.status}</span>
                  </td>
                  <td><MLS_I name="chevron" size={14} color="var(--ink-4)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

window.RC.MLSProperties = MLSProperties;
