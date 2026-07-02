// screen-documents.jsx — Documents · Coming Soon
function DocumentsPage({ goto }) {
  const { TopBar } = window;
  const I = window.Icon;

  const categories = [
    { icon: 'note',      label: 'Listing Agreements' },
    { icon: 'coins',     label: 'Offer Documents'    },
    { icon: 'check',     label: 'Inspection Reports' },
    { icon: 'briefcase', label: 'Client Files'       },
    { icon: 'doc',       label: 'MLS Sheets'         },
  ];

  return (
    <>
      <TopBar title="Documents" />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '52px 24px 32px', textAlign: 'center', gap: 20,
      }}>

        {/* Icon lockup */}
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          background: 'var(--bg-sunk)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I name="doc" size={36} color="var(--ink-3)" />
        </div>

        {/* Headline + body */}
        <div style={{ maxWidth: 272 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--ink)', marginBottom: 8 }}>
            Your document vault
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.65 }}>
            Store listing agreements, offers, inspection reports, and more — all linked to your clients and listings.
          </div>
        </div>

        {/* Coming Soon pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '7px 16px', borderRadius: 999,
          background: 'var(--bg-sunk)', border: '1px solid var(--border)',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--brand)', opacity: 0.75 }} />
          <span style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--ink-3)',
          }}>Coming Soon</span>
        </div>

        {/* Preview category list */}
        <div style={{ width: '100%', maxWidth: 340, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {categories.map(({ icon, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 10,
              background: 'var(--surface)', border: '1px solid var(--border-2)',
              opacity: 0.5,
            }}>
              <I name={icon} size={17} color="var(--ink-3)" />
              <span style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>{label}</span>
              <div style={{ flex: 1 }} />
              <I name="chevron" size={13} color="var(--border)" />
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

window.DocumentsPage = DocumentsPage;
