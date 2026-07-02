// app.jsx — Desktop root
const SAVED = (() => { try { return JSON.parse(localStorage.getItem('rccrm-desk') || '{}'); } catch { return {}; } })();

function App() {
  const [screen, setScreen] = React.useState(SAVED.screen || 'dash');
  const [leadsView, setLeadsView] = React.useState('list');
  const [selectedLead, setSelectedLead] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const [notifOpen, setNotifOpen] = React.useState(false);
  React.useEffect(() => { localStorage.setItem('rccrm-desk', JSON.stringify({ screen })); }, [screen]);
  React.useEffect(() => {
    window.RC.openModal = (type) => { setNotifOpen(false); setModal(type); };
    window.RC.toggleNotif = () => setNotifOpen(prev => !prev);
    window.RC.gotoSettings = () => { setNotifOpen(false); setModal(null); setScreen('settings'); };
    window.RC.goto = setScreen;
    window.RC.selectLead = setSelectedLead;
  }, []);
  const goto = setScreen;
  const R = window.RC;
  const closeModal = () => setModal(null);

  let content;
  if (screen === 'dash')              content = <R.Dashboard goto={goto} />;
  else if (screen === 'leads')        content = <R.Leads view={leadsView} setView={setLeadsView} goto={goto} />;
  else if (screen === 'leadDetail')   content = <R.LeadDetailPage lead={selectedLead} goto={goto} />;
  else if (screen === 'clients')              content = <R.Clients goto={goto} />;
  else if (screen === 'clientDetail')         content = <R.ClientDetail goto={goto} />;
  else if (screen === 'clientDetailSeller')   content = <R.ClientDetailSeller goto={goto} />;
  else if (screen === 'clientDetailBoth')     content = <R.ClientDetailBoth goto={goto} />;
  else if (screen === 'contacts')             content = <R.Contacts goto={goto} />;
  else if (screen === 'myListings')   content = <R.MyListings goto={goto} />;
  else if (screen === 'mlsProps')     content = <R.MLSProperties goto={goto} />;
  else if (screen === 'propDetail')   content = <R.PropDetail goto={goto} />;
  else if (screen === 'offers')       content = <R.Offers goto={goto} />;
  else if (screen === 'offerDetail')  content = <R.OfferDetail goto={goto} />;
  else if (screen === 'calendar')     content = <R.Calendar goto={goto} />;
  else if (screen === 'tasks')        content = <R.Tasks goto={goto} />;
  else if (screen === 'notes')        content = <R.Notes goto={goto} />;
  else if (screen === 'conversations') content = <R.Conversations goto={goto} />;
  else if (screen === 'settings')     content = R.Settings ? <R.Settings goto={goto} /> : null;
  else content = <div className="card card-pad" style={{ textAlign: 'center', color: 'var(--ink-3)' }}>{screen} · coming soon</div>;

  return (
    <>
      <div className="app">
        <R.Sidebar screen={screen} setScreen={setScreen} />
        <div className="main">
          <R.Topbar screen={screen} />
          <div className="page">{content}</div>
        </div>
      </div>
      {modal === 'quickAdd'    && <R.QuickAddModal     onClose={closeModal} onSelect={(t) => setModal(t)} />}
      {modal === 'lead'        && <R.NewLeadModal      onClose={closeModal} />}
      {modal === 'client'      && <R.NewClientModal    onClose={closeModal} />}
      {modal === 'property'    && <R.NewPropertyModal  onClose={closeModal} />}
      {modal === 'offer'       && <R.NewOfferModal     onClose={closeModal} />}
      {modal === 'task'        && <R.NewTaskModal      onClose={closeModal} />}
      {modal === 'note'        && <R.NewNoteModal      onClose={closeModal} />}
      {modal === 'event'       && <R.NewEventModal     onClose={closeModal} />}
      {modal === 'convertLead' && R.ConvertLeadModal   && <R.ConvertLeadModal  onClose={closeModal} />}
      {notifOpen && R.NotificationsPopover && <R.NotificationsPopover onClose={() => setNotifOpen(false)} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
