// app.jsx — Root App component. Loaded last so all window.* components are defined.
const useStateApp = React.useState;
const useEffectApp = React.useEffect;

const SAVED_APP = (() => {
  try { return JSON.parse(localStorage.getItem('rccrm-state') || '{}'); }
  catch { return {}; }
})();

const TWEAKS = /*EDITMODE-BEGIN*/{
  "roleVariant": "vendor"
}/*EDITMODE-END*/;

const SCREEN_GROUPS = [
  { group: 'Dashboard', screens: [
    { id: 'dash', label: 'Dashboard' },
  ]},
  { group: 'Leads', screens: [
    { id: 'leads',            label: 'List' },
    { id: 'leadsBoard',       label: 'Kanban' },
    { id: 'leadDetailBuyer',  label: 'Detail · Buyer' },
    { id: 'leadDetailSeller', label: 'Detail · Seller' },
  ]},
  { group: 'Clients', screens: [
    { id: 'clients',            label: 'Kanban' },
    { id: 'clientDetailBuyer',  label: 'Detail · Buyer' },
    { id: 'clientDetailSeller', label: 'Detail · Seller' },
    { id: 'clientDetail',       label: 'Detail · Vendor' },
    { id: 'clientDetailBoth',   label: 'Detail · Both' },
  ]},
  { group: 'My Listings', screens: [
    { id: 'props',        label: 'List' },
    { id: 'propsStages',  label: 'Stages' },
    { id: 'propDetail',   label: 'Property detail' },
  ]},
  { group: 'Properties (MLS)', screens: [
    { id: 'mlsProps', label: 'MLS Search' },
  ]},
  { group: 'Documents', screens: [
    { id: 'documents', label: 'Documents' },
  ]},
  { group: 'Offers', screens: [
    { id: 'offers',         label: 'By status' },
    { id: 'offersByProp',   label: 'By property' },
    { id: 'offersByClient', label: 'By client' },
    { id: 'offerDetail',    label: 'Offer detail' },
  ]},
  { group: 'Calendar', screens: [
    { id: 'calendar',        label: 'Agenda' },
    { id: 'calDay',          label: 'Day' },
    { id: 'calWeek',         label: 'Week' },
    { id: 'calMonth',        label: 'Month' },
    { id: 'calEventDetail',  label: 'Event detail' },
  ]},
  { group: 'Tasks', screens: [
    { id: 'tasks',           label: 'Today + Overdue' },
    { id: 'tasksByProperty', label: 'By property' },
    { id: 'tasksByClient',   label: 'By client' },
  ]},
  { group: 'Notes', screens: [
    { id: 'notesByClient',  label: 'By client' },
    { id: 'notesByContact', label: 'By contact' },
    { id: 'notesByTag',     label: 'By tag' },
  ]},
  { group: 'Contacts', screens: [
    { id: 'contacts',      label: 'Directory' },
    { id: 'contactDetail', label: 'Contact detail' },
  ]},
  { group: 'Conversations', screens: [
    { id: 'conversations', label: 'Inbox' },
  ]},
  { group: 'Settings', screens: [
    { id: 'settings', label: 'Profile & settings' },
  ]},
];

function App() {
  const [screen, setScreen] = useStateApp(SAVED_APP.screen || 'dash');
  const [roleVariant, setRoleVariant] = useStateApp(SAVED_APP.roleVariant || TWEAKS.roleVariant);
  const [editMode, setEditMode] = useStateApp(false);
  const [tweaksOpen, setTweaksOpen] = useStateApp(false);
  const [sheet, setSheet] = useStateApp(null);
  const [searchActive, setSearchActive] = useStateApp(false);
  const [convCh, setConvCh] = useStateApp(null);

  useEffectApp(() => {
    localStorage.setItem('rccrm-state', JSON.stringify({ screen, roleVariant }));
  }, [screen, roleVariant]);

  useEffectApp(() => { window.openSheet = setSheet; window.gotoScreen = setScreen; window.openSearch = () => setSearchActive(true); window.setConvCompose = setConvCh; }, []);

  useEffectApp(() => {
    const onMsg = (e) => {
      const t = e.data && e.data.type;
      if (t === '__activate_edit_mode')   { setEditMode(true);  setTweaksOpen(true); }
      if (t === '__deactivate_edit_mode') { setEditMode(false); setTweaksOpen(false); }
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const updateRole = (r) => {
    setRoleVariant(r);
    setScreen('clientDetail');
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { roleVariant: r } }, '*');
  };

  const activeTab =
    screen === 'dash' ? 'dash' :
    screen.startsWith('lead') ? 'leads' :
    screen.startsWith('client') ? 'clients' :
    screen.startsWith('conv') ? 'contacts' :
    screen.startsWith('contact') ? 'contacts' :
    screen.startsWith('cal') ? 'calendar' :
    (screen.startsWith('task') || screen.startsWith('note') || screen.startsWith('prop') || screen.startsWith('offer') || screen === 'mlsProps' || screen === 'documents') ? 'tasks' : 'dash';

  const onTab = (id) => {
    if (id === 'dash')           setScreen('dash');
    else if (id === 'leads')     setScreen('leads');
    else if (id === 'clients')   setScreen('clients');
    else if (id === 'contacts')  setScreen('contacts');
    else if (id === 'calendar')  setScreen('calendar');
    else if (id === 'tasks')     setScreen('tasks');
  };

  const goto = (id) => setScreen(id);

  const DETAIL_SCREENS = ['clientDetail','clientDetailBuyer','clientDetailSeller','clientDetailBoth','propDetail','offerDetail','leadDetailBuyer','leadDetailSeller','calEventDetail','contactDetail'];
  const isDetail = DETAIL_SCREENS.includes(screen);
  const showFab = !isDetail && !searchActive && !screen.startsWith('cal') && screen !== 'notesByClient' && screen !== 'notesByContact' && screen !== 'notesByTag' && screen !== 'settings' && screen !== 'documents' && screen !== 'mlsProps';

  let content;
  if (screen === 'dash')                  content = <window.Dashboard goto={goto} />;
  else if (screen === 'leads')            content = <window.Leads view="list"  onViewChange={(v) => setScreen(v === 'board' ? 'leadsBoard' : 'leads')} goto={goto} />;
  else if (screen === 'leadsBoard')       content = <window.Leads view="board" onViewChange={(v) => setScreen(v === 'board' ? 'leadsBoard' : 'leads')} goto={goto} />;
  else if (screen === 'leadDetailBuyer')  content = <window.LeadDetailBuyer goto={goto} />;
  else if (screen === 'leadDetailSeller') content = <window.LeadDetailSeller goto={goto} />;
  else if (screen === 'clients')          content = <window.Clients view="kanban" onViewChange={() => {}} goto={goto} />;
  else if (screen === 'clientDetail')     content = <window.Clients view="detail" roleVariant="vendor" goto={goto} />;
  else if (screen === 'clientDetailBuyer')  content = <window.ClientDetailBuyer goto={goto} />;
  else if (screen === 'clientDetailSeller') content = <window.ClientDetailSeller goto={goto} />;
  else if (screen === 'clientDetailBoth')   content = <window.ClientDetailBoth goto={goto} />;
  else if (screen === 'props')            content = <window.Properties view="list"   onViewChange={(v) => setScreen(v === 'stages' ? 'propsStages' : 'props')} goto={goto} />;
  else if (screen === 'propsStages')      content = <window.Properties view="stages" onViewChange={(v) => setScreen(v === 'stages' ? 'propsStages' : 'props')} goto={goto} />;
  else if (screen === 'propDetail')       content = <window.PropDetail goto={goto} />;
  else if (screen === 'mlsProps')         content = <window.MLSProperties goto={goto} />;
  else if (screen === 'documents')        content = <window.DocumentsPage goto={goto} />;
  else if (screen === 'offers')           content = <window.Offers goto={goto} />;
  else if (screen === 'offersByProp')     content = <window.OffersByProperty goto={goto} />;
  else if (screen === 'offerDetail')      content = <window.OfferDetail goto={goto} />;
  else if (screen === 'offersByClient')   content = <window.OffersByClient goto={goto} />;
  else if (screen === 'settings')         content = <window.Settings goto={goto} />;
  else if (screen === 'calendar')         content = <window.CalendarScreen goto={goto} />;
  else if (screen === 'calDay')           content = <window.CalendarDay goto={goto} />;
  else if (screen === 'calWeek')          content = <window.CalendarWeek goto={goto} />;
  else if (screen === 'calMonth')         content = <window.CalendarMonth goto={goto} />;
  else if (screen === 'calEventDetail')   content = <window.CalendarEventDetail goto={goto} />;
  else if (screen === 'tasks')            content = <window.Tasks goto={goto} />;
  else if (screen === 'tasksByProperty')  content = <window.TasksGrouped groupBy="property" goto={goto} />;
  else if (screen === 'tasksByClient')    content = <window.TasksGrouped groupBy="client" goto={goto} />;
  else if (screen === 'notesByClient')    content = <window.Notes groupBy="client" goto={goto} />;
  else if (screen === 'notesByContact')   content = <window.Notes groupBy="contact" goto={goto} />;
  else if (screen === 'notesByTag')       content = <window.Notes groupBy="tag" goto={goto} />;
  else if (screen === 'contacts')         content = <window.ContactsDirectory goto={goto} />;
  else if (screen === 'contactDetail')    content = <window.ContactDetail goto={goto} />;
  else if (screen === 'conversations')    content = <window.ConversationsList goto={goto} />;

  const showActionBar = ['clientDetail','clientDetailBuyer','clientDetailSeller','clientDetailBoth','propDetail'].includes(screen);

  return (
    <div className="stage">
      <div className="intro">
        <h1>RC CRM — Mobile Prototype</h1>
        <div>Calm, human CRM for independent real-estate agents. iPhone 15 bezel · light mode · single accent. Tap any screen button to navigate.</div>
        {SCREEN_GROUPS.map(g => (
          <div key={g.group} style={{ marginTop: 10, width: '100%' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'oklch(0.55 0.01 260)', marginBottom: 5, textAlign: 'left', paddingLeft: 2 }}>{g.group}</div>
            <div className="screens" style={{ justifyContent: 'flex-start' }}>
              {g.screens.map(s => (
                <button key={s.id} data-active={screen === s.id} onClick={() => setScreen(s.id)}>{s.label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="frame-container">
        <window.IOSDevice width={393} height={852} dark={false}>
          <div className="app">
            <div className="app-status-spacer" />
            <div className="app-scroll" key={searchActive ? '__search' : screen}>
              {searchActive
                ? <window.SearchScreen onClose={() => setSearchActive(false)} />
                : content}
            </div>

            {showFab && (
              <button className="fab" aria-label="new" onClick={() => setSheet('picker')}>
                <window.Icon name="plus" size={22} color="#fff" />
              </button>
            )}

            {convCh !== null && window.ConvComposeBar && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 68, zIndex: 35 }}>
                <window.ConvComposeBar ch={convCh} />
              </div>
            )}

            {showActionBar && ['clientDetail','clientDetailBuyer','clientDetailSeller','clientDetailBoth'].includes(screen) && (
              <div className="actionbar">
                <button className="primary"><window.Icon name="phone" size={18} /><span>Call</span></button>
                <button><window.Icon name="message" size={18} /><span>Text</span></button>
                <button onClick={() => setSheet('quickNote')}><window.Icon name="note" size={18} /><span>Note</span></button>
                <button><window.Icon name="calendar" size={18} /><span>Appt</span></button>
              </div>
            )}
            {showActionBar && screen === 'propDetail' && (
              <div className="actionbar">
                <button><window.Icon name="share" size={18} /><span>Share</span></button>
                <button><window.Icon name="calendar" size={18} /><span>Showing</span></button>
                <button className="primary"><window.Icon name="coins" size={18} /><span>Add offer</span></button>
                <button onClick={() => setSheet('quickNote')}><window.Icon name="note" size={18} /><span>Note</span></button>
              </div>
            )}

            {sheet === 'picker'   && <window.FabPicker        onClose={() => setSheet(null)} onSelect={(t) => setSheet(t)} />}
            {sheet === 'lead'     && <window.NewLeadSheet     onClose={() => setSheet(null)} />}
            {sheet === 'task'     && <window.NewTaskSheet     onClose={() => setSheet(null)} />}
            {sheet === 'note'     && <window.NewNoteSheet     onClose={() => setSheet(null)} />}
            {sheet === 'event'    && <window.NewEventSheet    onClose={() => setSheet(null)} />}
            {sheet === 'client'   && <window.NewClientSheet   onClose={() => setSheet(null)} />}
            {sheet === 'property' && <window.NewPropertySheet onClose={() => setSheet(null)} />}
            {sheet === 'offer'          && <window.NewOfferSheet     onClose={() => setSheet(null)} />}
            {sheet === 'convertLead'    && <window.ConvertLeadSheet   onClose={() => setSheet(null)} />}
            {sheet === 'notifications'  && <window.NotificationsSheet onClose={() => setSheet(null)} />}
            {sheet === 'noteDetail'     && <window.NoteDetailSheet    onClose={() => setSheet(null)} />}
            {sheet === 'taskDetail'     && <window.TaskDetailSheet    onClose={() => setSheet(null)} />}
            {sheet === 'quickNote'      && <window.QuickNoteSheet     onClose={() => setSheet(null)} />}
            {sheet === 'taskDetail'     && <window.TaskDetailSheet    onClose={() => setSheet(null)} />}

            {!isDetail && !searchActive && <window.TabBar active={activeTab} onTab={onTab} />}
          </div>
        </window.IOSDevice>
      </div>

      {!editMode && (
        <button className="tweaks-trigger" onClick={() => setTweaksOpen(!tweaksOpen)}>
          Tweaks
        </button>
      )}

      <div className="tweaks" data-open={tweaksOpen}>
        <h3>Tweaks</h3>
        <div className="field">
          <label>Role variant · client detail</label>
          <div className="opts">
            {[['buyer_lead','Buyer lead'],['seller_client','Seller client'],['vendor','Vendor']].map(([v, l]) => (
              <button key={v} data-active={roleVariant === v} onClick={() => updateRole(v)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Jump to</label>
          <div className="opts" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <button onClick={() => setScreen('dash')}>Dashboard</button>
            <button onClick={() => setScreen('calWeek')}>Week cal</button>
            <button onClick={() => setScreen('mlsProps')}>MLS</button>
            <button onClick={() => setScreen('notesByTag')}>Notes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
