// conversations.jsx — Inbox / thread view
const CV_I = window.Icon;
const { Avatar: CVAv } = window.RC;

// ── Mock data ──────────────────────────────────────────────────────────
const THREADS = [
  {
    id: 'c1', name: 'Marcus & Priya Chen', role: 'buyer',
    channel: 'sms', preview: 'Sounds great — see you at 10:30!',
    time: '9:38 AM', unread: 0, pinned: true,
    tag: 'Offer submitted',
    messages: [
      { from: 'them', text: 'Hi Jordan — any news on the Balsam offer?', t: 'Yesterday 3:12 PM' },
      { from: 'me',   text: 'Still waiting on the listing agent. I\'ll call them by 5 PM and update you.', t: 'Yesterday 3:41 PM' },
      { from: 'them', text: 'Thanks. Fingers crossed 🤞', t: 'Yesterday 3:43 PM' },
      { from: 'me',   text: 'Good news — they\'re reviewing tonight. Can you do a quick call tomorrow morning before the showing?', t: 'Yesterday 5:02 PM' },
      { from: 'them', text: 'Yes! 9 AM works for us.', t: 'Today 8:54 AM' },
      { from: 'me',   text: 'Perfect. I\'ll send a calendar invite now.', t: 'Today 9:12 AM' },
      { from: 'them', text: 'Sounds great — see you at 10:30!', t: 'Today 9:38 AM' },
    ],
  },
  {
    id: 'c2', name: 'Sarah Okonkwo', role: 'buyer',
    channel: 'sms', preview: 'Yes the pre-approval came through — $1.05M from Scotia',
    time: '9:12 AM', unread: 2, pinned: false,
    tag: 'New lead',
    messages: [
      { from: 'me',   text: 'Hi Sarah! Any update from your bank on pre-approval?', t: 'Yesterday 2:00 PM' },
      { from: 'them', text: 'Still waiting — maybe tomorrow.', t: 'Yesterday 2:34 PM' },
      { from: 'them', text: 'Yes the pre-approval came through — $1.05M from Scotia', t: 'Today 9:12 AM' },
      { from: 'them', text: 'What are the next steps?', t: 'Today 9:13 AM' },
    ],
  },
  {
    id: 'c3', name: 'Aya Fujimori', role: 'seller',
    channel: 'email', preview: 'Re: Listing presentation — Thursday works perfectly.',
    time: 'Yesterday', unread: 1, pinned: false,
    tag: 'Pre-listing',
    messages: [
      { from: 'me',   text: 'Hi Aya, I\'d love to set up a listing presentation this week. Does Thursday afternoon work?', t: 'Apr 15, 4:30 PM' },
      { from: 'them', text: 'Re: Listing presentation — Thursday works perfectly.', t: 'Apr 16, 10:22 AM' },
    ],
  },
  {
    id: 'c4', name: 'Tran Household', role: 'buyer',
    channel: 'sms', preview: 'We\'re very excited about the closing!',
    time: 'Apr 15', unread: 0, pinned: false,
    tag: 'Under contract',
    messages: [
      { from: 'me',   text: 'Congrats — the firm date is confirmed for May 1. We\'re under contract!', t: 'Apr 15, 3:00 PM' },
      { from: 'them', text: 'We\'re very excited about the closing!', t: 'Apr 15, 3:18 PM' },
    ],
  },
  {
    id: 'c5', name: 'Liam Patel', role: 'buyer',
    channel: 'whatsapp', preview: 'Are there any open houses this weekend?',
    time: 'Apr 14', unread: 0, pinned: false,
    tag: 'Engaged',
    messages: [
      { from: 'them', text: 'Are there any open houses this weekend?', t: 'Apr 14, 12:04 PM' },
      { from: 'me',   text: '128 Balsam on Sunday 1–3 PM — I\'ll send you the details.', t: 'Apr 14, 12:30 PM' },
    ],
  },
  {
    id: 'c6', name: 'Nora Hassan', role: 'buyer',
    channel: 'email', preview: 'Re: Cabbagetown listings — those look great, can we see 77 Wellesley?',
    time: 'Apr 13', unread: 0, pinned: false,
    tag: 'Appt set',
    messages: [
      { from: 'me',   text: 'Nora — attached are 4 listings in Cabbagetown matching your criteria.', t: 'Apr 12, 5:00 PM' },
      { from: 'them', text: 'Re: Cabbagetown listings — those look great, can we see 77 Wellesley?', t: 'Apr 13, 9:44 AM' },
    ],
  },
  {
    id: 'c7', name: 'Derrick Bailey', role: 'buyer',
    channel: 'sms', preview: 'Got it. Talk soon.',
    time: 'Apr 12', unread: 0, pinned: false,
    tag: 'Contacted',
    messages: [
      { from: 'me',   text: 'Hey Derrick — just following up on 18 Lower Jarvis. Still interested?', t: 'Apr 12, 10:00 AM' },
      { from: 'them', text: 'Got it. Talk soon.', t: 'Apr 12, 11:30 AM' },
    ],
  },
];

const CHANNEL_ICON = {
  sms:      { label: 'SMS',      color: 'var(--success)',     bg: 'var(--success-soft)'  },
  email:    { label: 'Email',    color: 'var(--brand)',       bg: 'var(--brand-soft)'    },
  whatsapp: { label: 'WhatsApp', color: 'oklch(0.55 0.17 150)', bg: 'oklch(0.96 0.04 150)' },
};

// ── Channel pill ────────────────────────────────────────────────────────
function ChannelPill({ ch }) {
  const c = CHANNEL_ICON[ch] || {};
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '1px 7px', borderRadius: 999,
      fontSize: 10.5, fontWeight: 600, letterSpacing: '0.02em',
      background: c.bg, color: c.color,
    }}>{c.label}</span>
  );
}

// ── Thread list item ────────────────────────────────────────────────────
function ThreadRow({ t, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'grid', gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'flex-start', gap: 12,
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-2)',
      cursor: 'pointer', userSelect: 'none',
      background: selected ? 'var(--brand-soft)' : 'transparent',
      boxShadow: selected ? 'inset 3px 0 0 var(--brand)' : 'none',
      transition: 'background 80ms',
    }}
    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--bg-sunk)'; }}
    onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
      <CVAv name={t.name} role={t.role} size={36} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13.5, fontWeight: t.unread > 0 ? 700 : 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{t.name}</span>
          {t.pinned && <CV_I name="map" size={11} color="var(--ink-4)" />}
        </div>
        <div style={{ fontSize: 12, color: t.unread > 0 ? 'var(--ink-2)' : 'var(--ink-3)', fontWeight: t.unread > 0 ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{t.preview}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChannelPill ch={t.channel} />
          <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{t.tag}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: 'var(--ink-4)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{t.time}</span>
        {t.unread > 0 && (
          <span style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--brand)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.unread}</span>
        )}
      </div>
    </div>
  );
}

// ── Message bubble ──────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isMe = msg.from === 'me';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap: 3 }}>
      <div style={{
        maxWidth: '72%', padding: '9px 13px',
        borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isMe ? 'var(--ink)' : 'var(--surface)',
        border: isMe ? 'none' : '1px solid var(--border)',
        color: isMe ? '#fff' : 'var(--ink)',
        fontSize: 13.5, lineHeight: 1.45,
        boxShadow: isMe ? 'none' : 'var(--shadow-1)',
      }}>{msg.text}</div>
      <span style={{ fontSize: 10.5, color: 'var(--ink-4)', padding: '0 2px' }}>{msg.t}</span>
    </div>
  );
}

// ── ConversationsTab — embedded mini-thread for detail views ─────────────
function ConversationsTab({ name, goto }) {
  const thread = THREADS.find(t => t.name === name);
  const [draft, setDraft] = React.useState('');
  const [msgs, setMsgs] = React.useState(thread ? [...thread.messages] : []);
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    if (bottomRef.current) {
      const el = bottomRef.current.parentElement;
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(prev => [...prev, { from: 'me', text: draft.trim(), t: 'Just now' }]);
    setDraft('');
    setTimeout(() => {
      if (bottomRef.current) {
        const el = bottomRef.current.parentElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 30);
  };

  if (!thread) {
    return (
      <div style={{ marginTop: 16 }}>
        <div className="card card-pad" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>No conversations yet</div>
          <div className="meta" style={{ marginBottom: 20 }}>Start a conversation with {name || 'this contact'}</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="btn primary sm"><CV_I name="message" size={13} color="#fff" />Send SMS</button>
            <button className="btn sm"><CV_I name="message" size={13} />Send Email</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-sunk)', flexShrink: 0 }}>
          <ChannelPill ch={thread.channel} />
          <span className="meta">{thread.tag}</span>
          {thread.unread > 0 && (
            <span style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--brand)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{thread.unread}</span>
          )}
          <div style={{ flex: 1 }} />
          <button className="btn ghost sm" onClick={() => goto?.('conversations')}>Open inbox →</button>
        </div>
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 320, overflowY: 'auto' }}>
          {msgs.map((m, i) => <Bubble key={i} msg={m} />)}
          <div ref={bottomRef} />
        </div>
        <div style={{ borderTop: '1px solid var(--border-2)', padding: '10px 14px', background: 'var(--bg-sunk)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={`Message via ${CHANNEL_ICON[thread.channel]?.label || thread.channel}…`}
              rows={2}
              style={{ flex: 1, resize: 'none', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', fontSize: 13, lineHeight: 1.5, background: 'var(--bg)', outline: 'none', fontFamily: 'var(--font)', color: 'var(--ink)' }}
            />
            <button
              className="btn primary"
              onClick={send}
              style={{ height: 38, padding: '0 14px', alignSelf: 'flex-end', opacity: draft.trim() ? 1 : 0.45, transition: 'opacity 120ms' }}
            >
              <CV_I name="arrowRight" size={14} color="#fff" />Send
            </button>
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
            <button className="btn ghost sm"><CV_I name="note" size={12} />Template</button>
            <button className="btn ghost sm"><CV_I name="share" size={12} />Listing link</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────
function Conversations({ goto }) {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [activeId, setActiveId] = React.useState('c1');
  const [draft, setDraft] = React.useState('');
  const [threads, setThreads] = React.useState(THREADS);
  const bottomRef = React.useRef(null);
  const textareaRef = React.useRef(null);

  const filtered = threads.filter(t => {
    if (filter !== 'all' && t.channel !== filter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.preview.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const active = threads.find(t => t.id === activeId) || threads[0];

  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.parentElement.scrollTop = bottomRef.current.parentElement.scrollHeight;
    }
  }, [activeId]);

  // Mark as read on select
  const selectThread = (id) => {
    setActiveId(id);
    setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t));
  };

  const send = () => {
    if (!draft.trim()) return;
    const msg = { from: 'me', text: draft.trim(), t: 'Just now' };
    setThreads(prev => prev.map(t => t.id === activeId
      ? { ...t, messages: [...t.messages, msg], preview: draft.trim(), time: 'Just now' }
      : t
    ));
    setDraft('');
    setTimeout(() => {
      if (bottomRef.current) bottomRef.current.parentElement.scrollTop = bottomRef.current.parentElement.scrollHeight;
    }, 30);
  };

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      {/* Page header */}
      <div className="page-head" style={{ marginBottom: 16 }}>
        <div>
          <div className="sub">Inbox</div>
          <h1>Conversations</h1>
        </div>
        <div className="actions">
          {totalUnread > 0 && <span className="badge brand">{totalUnread} unread</span>}
          <button className="btn sm"><CV_I name="pen" size={13} />Compose</button>
          <button className="btn primary sm" onClick={() => window.RC.openModal?.('quickAdd')}><CV_I name="plus" size={14} color="#fff" />New</button>
        </div>
      </div>

      {/* Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, flex: 1, minHeight: 0 }}>

        {/* ── Left: thread list ── */}
        <div className="split-pane" style={{ minHeight: 0, overflow: 'hidden' }}>
          {/* Search + filters */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="cmd" style={{ maxWidth: 'none' }}>
              <CV_I name="search" size={13} color="var(--ink-3)" />
              <input
                placeholder="Search conversations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="chips">
              {[['all','All'],['sms','SMS'],['email','Email'],['whatsapp','WhatsApp']].map(([v,l]) => (
                <div key={v} className="chip" data-active={filter === v} onClick={() => setFilter(v)} style={{ fontSize: 12, padding: '3px 10px' }}>{l}</div>
              ))}
            </div>
          </div>

          {/* Thread rows */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>No conversations found</div>
            )}
            {filtered.map(t => (
              <ThreadRow key={t.id} t={t} selected={t.id === activeId} onClick={() => selectThread(t.id)} />
            ))}
          </div>
        </div>

        {/* ── Right: thread detail ── */}
        <div className="split-pane" style={{ minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {active && (
            <>
              {/* Thread header */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <CVAv name={active.name} role={active.role} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{active.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <ChannelPill ch={active.channel} />
                    <span>{active.tag}</span>
                  </div>
                </div>
                <button className="btn sm ghost" onClick={() => goto('clientDetail')}><CV_I name="briefcase" size={13} />View client</button>
                <button className="icon-btn" aria-label="call"><CV_I name="phone" size={15} /></button>
                <button className="icon-btn" aria-label="more"><CV_I name="more" size={15} /></button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {active.messages.map((m, i) => <Bubble key={i} msg={m} />)}
                <div ref={bottomRef} />
              </div>

              {/* Composer */}
              <div style={{ borderTop: '1px solid var(--border-2)', padding: '12px 16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder={`Message via ${CHANNEL_ICON[active.channel]?.label || active.channel}…`}
                    rows={2}
                    style={{
                      flex: 1, resize: 'none', border: '1px solid var(--border)',
                      borderRadius: 10, padding: '9px 12px',
                      fontSize: 13.5, lineHeight: 1.5,
                      background: 'var(--bg-sunk)', outline: 'none',
                      fontFamily: 'var(--font)', color: 'var(--ink)',
                    }}
                  />
                  <button
                    className="btn primary"
                    onClick={send}
                    style={{ height: 40, padding: '0 16px', alignSelf: 'flex-end', opacity: draft.trim() ? 1 : 0.45, transition: 'opacity 120ms' }}
                  >
                    <CV_I name="arrowRight" size={15} color="#fff" />Send
                  </button>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button className="btn ghost sm"><CV_I name="note" size={13} />Template</button>
                  <button className="btn ghost sm"><CV_I name="camera" size={13} />Attach</button>
                  <button className="btn ghost sm"><CV_I name="share" size={13} />Listing link</button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

window.RC = window.RC || {};
Object.assign(window.RC, { Conversations, ConversationsTab });
