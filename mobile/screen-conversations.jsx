// screen-conversations.jsx — Conversations inbox: list + channel threads

const useConvState = React.useState;
const useConvEffect = React.useEffect;

// ─── Channel definitions ───────────────────────────────────────────────
const CHAN = {
  1: { label: 'Phone', dot: '#40C057', soft: 'var(--success-soft)', ink: 'oklch(0.44 0.12 150)' },
  2: { label: 'Email', dot: '#339AF0', soft: 'var(--brand-soft)', ink: 'var(--brand-ink)' },
  3: { label: 'Messenger', dot: '#7950F2', soft: 'oklch(0.955 0.04 280)', ink: 'oklch(0.38 0.15 280)' },
  4: { label: 'Review', dot: '#FAB005', soft: 'var(--warning-soft)', ink: 'oklch(0.48 0.12 65)' },
  5: { label: 'Group SMS', dot: '#E64980', soft: 'oklch(0.96 0.04 345)', ink: 'oklch(0.42 0.14 345)' }
};

// ─── Channel icon (inline SVG) ─────────────────────────────────────────
function ChanIcon({ ch, size = 14, color = 'currentColor' }) {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (ch === 1) return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8 9.7a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z" />
    </svg>);

  if (ch === 2) return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>);

  if (ch === 3) return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M21 11.5a8.4 8.4 0 01-8.4 8.4c-1.3 0-2.6-.3-3.8-.8L2 21l1.9-6.8A8.4 8.4 0 0112 2.5a8.4 8.4 0 019 9z" />
    </svg>);

  if (ch === 4) return (
    <svg viewBox="0 0 24 24" style={{ ...s, strokeWidth: 1.5 }}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>);

  if (ch === 5) return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <path d="M8 11h8M8 14h5" />
    </svg>);

  return null;
}

function Stars({ n }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) =>
      <svg key={i} viewBox="0 0 24 24" style={{ width: 13, height: 13, fill: i <= n ? '#FAB005' : 'var(--border)', stroke: 'none' }}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      )}
    </div>);

}

// ─── Mock conversations ────────────────────────────────────────────────
const CONVS = [
{
  id: 'cv1', name: 'Sarah Okonkwo', initials: 'SO', avCls: 'av-buyer',
  type: 'Lead', channel: 2, time: '9:12 AM', unread: 2,
  preview: 'Thank you for the info, I\'ll confirm with Kwame tonight.',
  subject: 'Pre-approval update',
  thread: [
  { id: 'm1', dir: 'out', time: 'Apr 16 · 3:20 PM', body: 'Hi Sarah — great news on the Scotia pre-approval. I\'ve attached a summary sheet. Let me know once Kwame has reviewed it and we can book some showings.' },
  { id: 'm2', dir: 'in', time: 'Apr 16 · 5:45 PM', body: 'Hi Jordan! Thank you — he\'s looking at it tonight. Really excited about 128 Balsam from last week.' },
  { id: 'm3', dir: 'out', time: 'Apr 16 · 6:02 PM', body: '128 Balsam is a great fit. I\'ll check if there\'s a second showing window this weekend. Talk soon.' },
  { id: 'm4', dir: 'in', time: 'Today · 9:10 AM', body: 'Thank you for the info, I\'ll confirm with Kwame tonight.' }]

},
{
  id: 'cv2', name: 'Marcus & Priya Chen', initials: 'MC', avCls: 'av-buyer',
  type: 'Client', channel: 5, time: 'Yesterday', unread: 0,
  preview: 'You: Confirmed for 10:30 AM Sat. See you at 128 Balsam!',
  participants: ['Marcus Chen', 'Priya Chen'],
  thread: [
  { id: 'm1', dir: 'in', sender: 'Marcus', time: 'Yesterday · 4:15 PM', body: 'Hey Jordan — still on for the Saturday showing at 128 Balsam?' },
  { id: 'm2', dir: 'in', sender: 'Priya', time: 'Yesterday · 4:17 PM', body: 'We can also do Sunday afternoon if that works better.' },
  { id: 'm3', dir: 'out', time: 'Yesterday · 4:45 PM', body: 'Saturday works great! Confirmed for 10:30 AM. See you at 128 Balsam — I\'ll have the feature sheet ready.' },
  { id: 'm4', dir: 'in', sender: 'Marcus', time: 'Yesterday · 5:00 PM', body: 'Perfect. See you there.' }]

},
{
  id: 'cv3', name: 'Aya Fujimori', initials: 'AF', avCls: 'av-seller',
  type: 'Lead', channel: 1, time: 'Apr 15', unread: 0,
  preview: 'Call · 14 min · Listing presentation scheduled Apr 22',
  calls: [
  { id: 'k1', dir: 'out', status: 'connected', duration: '14 min', time: 'Apr 15 · 10:00 AM', note: 'Listing presentation scheduled for Apr 22.' },
  { id: 'k2', dir: 'in', status: 'missed', duration: null, time: 'Apr 14 · 2:35 PM', note: null },
  { id: 'k3', dir: 'out', status: 'voicemail', duration: '0:48', time: 'Apr 14 · 3:10 PM', note: 'Left voicemail re: intro call.' }]

},
{
  id: 'cv4', name: 'Derrick Bailey', initials: 'DB', avCls: 'av-buyer',
  type: 'Lead', channel: 3, time: 'Apr 15', unread: 1,
  preview: 'Are those Junction detacheds still available?',
  thread: [
  { id: 'm1', dir: 'out', time: 'Apr 15 · 11:00 AM', body: 'Hey Derrick! I\'ve put together a short list of Junction detacheds in your range — full breakdown coming by email today.' },
  { id: 'm2', dir: 'in', time: 'Apr 15 · 11:22 AM', body: 'Sounds good. The two on Annette St looked promising from the photos.' },
  { id: 'm3', dir: 'in', time: 'Apr 15 · 9:05 AM', body: 'Are those Junction detacheds still available?' }]

},
{
  id: 'cv5', name: 'Navarro Family', initials: 'NF', avCls: 'av-past',
  type: 'Contact', channel: 4, time: 'Apr 14', unread: 1,
  preview: '★★★★★ — Jordan made the whole experience feel effortless…',
  review: {
    platform: 'Google Maps',
    stars: 5,
    reviewer: 'Navarro Family',
    date: 'Apr 14, 2026',
    text: 'Jordan made the whole experience feel effortless — from listing to close in 12 days. His communication was constant, his pricing strategy was spot-on, and he negotiated well above asking. We couldn\'t be happier.'
  }
},
{
  id: 'cv6', name: 'Lena Hoffman', initials: 'LH', avCls: 'av-vendor',
  type: 'Contact', channel: 2, time: 'Apr 13', unread: 0,
  preview: 'You: Thanks Lena — photos look fantastic. Staging credit paid.',
  subject: 'Staging invoice · 77 Wellesley St E',
  thread: [
  { id: 'm1', dir: 'in', time: 'Apr 13 · 9:00 AM', body: 'Hi Jordan — invoice attached for the 77 Wellesley staging. Loved working on this one. The photos came out beautifully.' },
  { id: 'm2', dir: 'out', time: 'Apr 13 · 9:45 AM', body: 'Thanks Lena — photos look fantastic. Staging credit paid via e-transfer this morning. Let\'s do this again soon!' }]

}];


// ─── Contact type chip styles ──────────────────────────────────────────
const TYPE_COLORS = {
  Lead: { bg: 'oklch(0.96 0.03 254)', color: 'oklch(0.40 0.14 254)' },
  Client: { bg: 'var(--success-soft)', color: 'oklch(0.44 0.12 150)' },
  Contact: { bg: 'var(--bg-sunk)', color: 'var(--ink-3)' }
};

// ─── Chat bubbles (Messenger, Group SMS, Email) ──────────────────────
function ChatBubbles({ thread, isGroup, avCls, initials }) {
  // Group messages by day for date dividers
  const groups = [];
  thread.forEach(msg => {
    const day = msg.time.includes('·') ? msg.time.split(' · ')[0] : msg.time.split(' ')[0];
    if (!groups.length || groups[groups.length - 1].day !== day) groups.push({ day, msgs: [] });
    groups[groups.length - 1].msgs.push(msg);
  });

  return (
    <div style={{ background: 'var(--bg-sunk)', paddingBottom: 8 }}>
      {groups.map((group, gi) => (
        <div key={gi}>
          {/* Date divider */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-3)', background: 'oklch(0.93 0.005 85)', padding: '3px 11px', borderRadius: 999, fontFamily: 'var(--mono)' }}>{group.day}</span>
          </div>

          {group.msgs.map((msg, mi) => {
            const isOut = msg.dir === 'out';
            const prev  = group.msgs[mi - 1];
            const next  = group.msgs[mi + 1];
            const isFirst = !prev || prev.dir !== msg.dir;
            const isLast  = !next || next.dir !== msg.dir;
            const outBR = isFirst ? '16px 16px 4px 16px' : '16px 4px 4px 16px';
            const inBR  = isLast  ? '16px 16px 16px 4px' : '16px 16px 16px 16px';

            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: isOut ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 6, padding: `${isFirst ? 5 : 2}px 12px ${isLast ? 4 : 1}px` }}>
                {/* Avatar slot — incoming, last in group */}
                {!isOut && (
                  <div style={{ width: 26, height: 26, flexShrink: 0 }}>
                    {isLast && avCls && (
                      <div className={`avatar ${avCls}`} style={{ width: 26, height: 26, fontSize: 10 }}>{initials}</div>
                    )}
                  </div>
                )}

                {/* Bubble */}
                <div style={{ maxWidth: '72%', padding: '8px 11px 5px', borderRadius: isOut ? outBR : inBR, background: isOut ? 'oklch(0.928 0.022 78)' : 'var(--surface)', color: 'var(--ink)', boxShadow: '0 1px 2px rgba(25,30,45,0.07)' }}>
                  {isGroup && !isOut && isFirst && msg.sender && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', marginBottom: 3 }}>{msg.sender}</div>
                  )}
                  <div style={{ fontSize: 14, lineHeight: 1.45 }}>{msg.body}</div>

                  {/* Time + read receipt inside bubble */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 3 }}>
                    <span style={{ fontSize: 10, color: isOut ? 'oklch(0.52 0.01 85)' : 'var(--ink-4)', fontFamily: 'var(--mono)' }}>
                      {msg.time.includes('·') ? msg.time.split('· ')[1] : msg.time}
                    </span>
                    {isOut && (
                      <svg viewBox="0 0 20 12" style={{ width: 17, height: 10, fill: 'none', stroke: 'oklch(0.54 0.165 254)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                        <path d="M1 6l4 4 6-8M8 6l4 4 6-8"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Email thread ──────────────────────────────────────────────────────
function EmailThread({ conv }) {
  const [expanded, setExpanded] = useConvState(conv.thread.length - 1);
  return (
    <div style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ padding: '10px 0 6px', fontSize: 10, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {conv.subject} · <span style={{ fontWeight: 500 }}>{conv.thread.length} messages</span>
      </div>
      {conv.thread.map((msg, i) => {
        const isExpanded = expanded === i;
        const isOut = msg.dir === 'out';
        return (
          <div key={msg.id} className="card" style={{ overflow: 'hidden' }}>
            <div onClick={() => setExpanded(isExpanded ? null : i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', cursor: 'pointer' }}>
              <div className={`avatar ${isOut ? 'av-agent' : conv.avCls}`} style={{ width: 28, height: 28, fontSize: 11 }}>
                {isOut ? 'JR' : conv.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                  {isOut ? 'Jordan Reyes' : conv.name}
                </div>
                {!isExpanded &&
                <div style={{ fontSize: 12, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.body.slice(0, 58)}…
                  </div>
                }
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--mono)', flexShrink: 0 }}>
                {msg.time.includes('·') ? msg.time.split('· ')[1] : msg.time}
              </div>
            </div>
            {isExpanded &&
            <div style={{ padding: '0 14px 14px', fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>
                {msg.body}
              </div>
            }
          </div>);

      })}
    </div>);

}

// ─── Phone call log ────────────────────────────────────────────────────
function PhoneLog({ conv }) {
  const statusMeta = {
    connected: { label: (dir) => dir === 'out' ? 'Outgoing call' : 'Incoming call', color: 'var(--success)' },
    missed: { label: () => 'Missed call', color: 'var(--destructive)' },
    voicemail: { label: () => 'Voicemail', color: 'var(--warning)' }
  };
  return (
    <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {conv.calls.map((call) => {
        const meta = statusMeta[call.status];
        return (
          <div key={call.id} className="card" style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'flex-start' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 999, flexShrink: 0, marginTop: 1,
              background: meta.color + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ChanIcon ch={1} size={16} color={meta.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: call.status === 'missed' ? 'var(--destructive)' : 'var(--ink)' }}>
                  {meta.label(call.dir)}
                </span>
                {call.duration &&
                <span className="meta tnum" style={{ background: 'var(--bg-sunk)', padding: '1px 7px', borderRadius: 999 }}>
                    {call.duration}
                  </span>
                }
              </div>
              {call.note &&
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.4 }}>{call.note}</div>
              }
              <div className="meta tnum" style={{ marginTop: 4 }}>{call.time}</div>
            </div>
            {call.status === 'missed' &&
            <span className="badge danger" style={{ alignSelf: 'center', flexShrink: 0 }}>Missed</span>
            }
          </div>);

      })}

      {/* Call-back action row */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
        <button style={{ flex: 1, padding: '11px', border: '1px solid oklch(0.87 0.06 150)', borderRadius: 10, background: 'var(--success-soft)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'oklch(0.44 0.12 150)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <ChanIcon ch={1} size={14} color="oklch(0.44 0.12 150)" />Call back
        </button>
        <button style={{ flex: 1, padding: '11px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: 'var(--ink-2)', cursor: 'pointer' }}>
          Log call
        </button>
      </div>
    </div>);

}

// ─── Review card ───────────────────────────────────────────────────────
function ReviewCard({ conv }) {
  const r = conv.review;
  const [draft, setDraft] = useConvState('');
  const [sent, setSent] = useConvState(false);
  return (
    <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="card card-pad">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div className={`avatar ${conv.avCls}`} style={{ width: 40, height: 40, fontSize: 14 }}>{conv.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{r.reviewer}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Stars n={r.stars} />
              <span className="meta tnum">{r.date}</span>
            </div>
          </div>
          <span className="badge" style={{ flexShrink: 0, fontSize: 10 }}>{r.platform}</span>
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-2)', fontStyle: 'italic' }}>
          "{r.text}"
        </p>
      </div>

      {sent ?
      <div className="card card-pad" style={{ background: 'var(--success-soft)', border: '1px solid oklch(0.87 0.06 150)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'oklch(0.44 0.12 150)', marginBottom: 7 }}>
            Response published
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ink)' }}>{draft}</p>
        </div> :

      <div className="card card-pad" style={{ background: 'var(--brand-soft)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand-ink)', marginBottom: 8 }}>
            Respond publicly
          </div>
          <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Thank the reviewer by name, mention a detail, keep it professional…"
          style={{ width: '100%', minHeight: 90, border: '1px solid oklch(0.87 0.04 254)', borderRadius: 8, padding: '9px 11px', fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.5, resize: 'none', background: 'var(--surface)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }} />
        
          <button
          onClick={() => {if (draft.trim()) setSent(true);}}
          style={{ marginTop: 8, padding: 11, background: draft.trim() ? 'var(--brand)' : 'var(--border)', color: draft.trim() ? '#fff' : 'var(--ink-3)', border: 'none', borderRadius: 8, fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', transition: 'background 0.15s' }}>
          
            Publish response
          </button>
        </div>
      }
    </div>);

}

// ─── Compose bar ───────────────────────────────────────────────────────
function ComposeBar({ ch }) {
  const [msg, setMsg] = useConvState('');
  if (ch === 4) return null;

  if (ch === 1) {
    return (
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-2)', padding: '10px 16px 12px', display: 'flex', gap: 8 }}>
        <button style={{ flex: 1, padding: 11, border: '1px solid oklch(0.87 0.06 150)', borderRadius: 10, background: 'var(--success-soft)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'oklch(0.44 0.12 150)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <ChanIcon ch={1} size={14} color="oklch(0.44 0.12 150)" />Call
        </button>
        <button style={{ flex: 1, padding: 11, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: 'var(--ink-2)', cursor: 'pointer' }}>
          Log call
        </button>
      </div>
    );
  }

  const placeholder = ch === 2 ? 'Reply…' : 'Message…';
  return (
    <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-2)', padding: '8px 12px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {/* + attachment */}
        <button style={{ width: 34, height: 34, borderRadius: 999, border: '1.5px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'var(--ink-3)' }}>
          <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' }}><path d="M12 5v14M5 12h14"/></svg>
        </button>
        {/* Emoji */}
        <button style={{ width: 30, height: 30, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}>
          <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: 'none', stroke: 'var(--ink-3)', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <circle cx="12" cy="12" r="9"/>
            <path d="M8.5 14.5s1 1.5 3.5 1.5 3.5-1.5 3.5-1.5"/>
            <circle cx="9" cy="10" r="0.8" fill="var(--ink-3)" stroke="none"/>
            <circle cx="15" cy="10" r="0.8" fill="var(--ink-3)" stroke="none"/>
          </svg>
        </button>
        {/* Input */}
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, height: 36, padding: '0 14px', border: '1px solid var(--border)', borderRadius: 20, fontFamily: 'var(--font)', fontSize: 14, background: 'var(--bg-sunk)', color: 'var(--ink)', outline: 'none', minWidth: 0 }}
        />
        {/* Send */}
        <button
          onClick={() => setMsg('')}
          style={{ height: 36, padding: '0 13px', borderRadius: 20, background: 'var(--ink)', color: '#fff', border: 'none', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}
        >
          Send
          <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, fill: 'none', stroke: '#fff', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Conversation detail ───────────────────────────────────────────────
function ConversationDetail({ conv, onBack }) {
  const ch = CHAN[conv.channel];
  const tc = TYPE_COLORS[conv.type] || TYPE_COLORS.Contact;

  useConvEffect(() => {
    window.setConvCompose?.(conv.channel);
    return () => window.setConvCompose?.(null);
  }, [conv.channel]);

  return (
    <>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10, borderBottom: '1px solid var(--border-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 52 }}>
          <button className="icon-btn" onClick={onBack} aria-label="back">
            <window.Icon name="chevron" size={16} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <div className={`avatar ${conv.avCls}`} style={{ width: 32, height: 32, fontSize: 12 }}>{conv.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {conv.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '1px 6px', borderRadius: 999, background: tc.bg, color: tc.color }}>
                {conv.type}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--ink-4)', flexShrink: 0 }} />
              <ChanIcon ch={conv.channel} size={11} color={ch.dot} />
              <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 }}>{ch.label}</span>
              {conv.participants &&
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>· {conv.participants.length} people</span>
              }
            </div>
          </div>
          <button className="icon-btn">
            <window.Icon name="more" size={16} />
          </button>
        </div>
      </div>

      {/* Thread body */}
      {conv.channel === 1 && <PhoneLog conv={conv} />}
      {conv.channel === 2 && (
        <>
          {conv.subject && (
            <div style={{ padding: '8px 16px 2px', fontSize: 10, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.07em', background: 'var(--bg-sunk)' }}>
              {conv.subject} · {conv.thread.length} messages
            </div>
          )}
          <ChatBubbles thread={conv.thread} isGroup={false} avCls={conv.avCls} initials={conv.initials} />
        </>
      )}
      {conv.channel === 3 && <ChatBubbles thread={conv.thread} isGroup={false} avCls={conv.avCls} initials={conv.initials} />}
      {conv.channel === 4 && <ReviewCard conv={conv} />}
      {conv.channel === 5 && <ChatBubbles thread={conv.thread} isGroup={true} avCls={conv.avCls} initials={conv.initials} />}

    </>);

}

// ─── Conversation row ──────────────────────────────────────────────────
function ConvRow({ conv, onClick }) {
  const ch = CHAN[conv.channel];
  const tc = TYPE_COLORS[conv.type] || TYPE_COLORS.Contact;
  const hasUnread = conv.unread > 0;

  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-2)', background: 'var(--surface)', cursor: 'pointer', alignItems: 'center' }}>
      
      {/* Avatar + channel badge */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div className={`avatar ${conv.avCls}`} style={{ width: 42, height: 42, fontSize: 14 }}>{conv.initials}</div>
        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 999, background: ch.dot, border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChanIcon ch={conv.channel} size={9} color="#fff" />
        </div>
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 15, fontWeight: hasUnread ? 700 : 500, color: 'var(--ink)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {conv.name}
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--mono)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
            {conv.time}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{ fontSize: 13, color: hasUnread ? 'var(--ink-2)' : 'var(--ink-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: hasUnread ? 500 : 400 }}>
            {conv.preview}
          </span>
          {hasUnread &&
          <span style={{ flexShrink: 0, minWidth: 20, height: 20, borderRadius: 999, background: 'var(--brand)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
              {conv.unread}
            </span>
          }
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '1px 6px', borderRadius: 999, background: tc.bg, color: tc.color }}>
          {conv.type}
        </span>
      </div>
    </div>);

}

// ─── Conversations list (main screen) ─────────────────────────────────
function ConversationsList({ goto }) {
  const [filter, setFilter] = useConvState('all');
  const [open, setOpen] = useConvState(null);

  const FILTERS = [
  { id: 'all', label: 'All', count: CONVS.length },
  { id: '1', label: 'Phone', count: CONVS.filter((c) => c.channel === 1).length },
  { id: '2', label: 'Email', count: CONVS.filter((c) => c.channel === 2).length },
  { id: '3', label: 'Messenger', count: CONVS.filter((c) => c.channel === 3).length },
  { id: '4', label: 'Review', count: CONVS.filter((c) => c.channel === 4).length },
  { id: '5', label: 'Group SMS', count: CONVS.filter((c) => c.channel === 5).length }];


  const visible = filter === 'all' ? CONVS : CONVS.filter((c) => String(c.channel) === filter);
  const totalUnread = CONVS.reduce((s, c) => s + (c.unread || 0), 0);

  if (open) {
    const conv = CONVS.find((c) => c.id === open);
    return <ConversationDetail conv={conv} onBack={() => setOpen(null)} />;
  }

  return (
    <>
      {/* Topbar */}
      <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 52 }}>
          <h1 style={{ flex: 1, margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
            Conversations
            {totalUnread > 0 &&
            <span style={{ fontSize: 12, fontWeight: 700, minWidth: 20, height: 20, borderRadius: 999, background: 'var(--destructive)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                {totalUnread}
              </span>
            }
          </h1>
          <button className="icon-btn" aria-label="compose">
            <window.Icon name="pen" size={14} />
          </button>
          <button className="icon-btn" aria-label="filter">
            <window.Icon name="filter" size={14} />
          </button>
        </div>

        {/* Channel filter chips */}
        <div className="chips" style={{ paddingBottom: 10 }}>
          {FILTERS.map((f) =>
          <button key={f.id} className="chip" data-active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.id !== 'all' &&
            <span style={{ width: 7, height: 7, borderRadius: 999, background: filter === f.id ? 'rgba(255,255,255,0.7)' : CHAN[Number(f.id)]?.dot, flexShrink: 0 }} />
            }
              {f.label}
              {f.count > 0 && <span className="count">{f.count}</span>}
            </button>
          )}
        </div>

        <div style={{ height: 1, background: 'var(--border-2)' }} />
      </div>

      {/* Conversation list */}
      <div style={{ background: 'var(--surface)' }}>
        {visible.length === 0 ?
        <div style={{ padding: '52px 24px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
            No conversations in this channel yet.
          </div> :

        visible.map((conv) =>
        <ConvRow key={conv.id} conv={conv} onClick={() => setOpen(conv.id)} />
        )
        }
      </div>
    </>);

}

// ─── MobileConvTab — embedded in Lead/Client detail ───────────────────────
function MobileConvTab({ name, goto }) {
  const conv = CONVS.find(c => c.name === name);

  if (!conv) {
    return (
      <div style={{ borderRadius: 12, border: '1px dashed var(--border)', padding: '40px 20px', textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>No conversations yet</div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 18 }}>Start a conversation with {name}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button style={{ padding: '10px 18px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Send SMS</button>
          <button style={{ padding: '10px 18px', background: 'var(--surface)', color: 'var(--ink-2)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Email</button>
        </div>
      </div>
    );
  }

  const ch = CHAN[conv.channel];

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-2)', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border-2)' }}>
        <div style={{ width: 8, height: 8, borderRadius: 999, background: ch.dot }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ch.label}</span>
        {conv.unread > 0 && (
          <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: 'var(--brand)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{conv.unread}</span>
        )}
        <div style={{ flex: 1 }} />
        <button onClick={() => goto('conversations')} style={{ background: 'none', border: 'none', color: 'var(--brand)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font)', cursor: 'pointer', padding: 0 }}>Inbox →</button>
      </div>
      {conv.thread && <ChatBubbles thread={conv.thread} isGroup={conv.channel === 5} avCls={conv.avCls} initials={conv.initials} />}
      {conv.calls && <PhoneLog conv={conv} />}
      <ComposeBar ch={conv.channel} />
    </div>
  );
}

window.ConversationsList  = ConversationsList;
window.ConversationDetail = ConversationDetail;
window.ConvComposeBar     = ComposeBar;
window.MobileConvTab      = MobileConvTab;