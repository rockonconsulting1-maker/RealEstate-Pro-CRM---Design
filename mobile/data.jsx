// data.jsx — mock data for RC CRM mobile prototype
const MOCK = {
  now: new Date('2026-04-17T09:41:00'),
  agent: { name: 'Jordan Reyes', initials: 'JR' },

  stats: [
    { label: 'Active Leads', value: '28',    trend: '+4',    tone: 'up' },
    { label: 'Active Deals', value: '11',    trend: '+1',    tone: 'up' },
    { label: 'Pipeline',     value: '$4.82M',trend: '+8.2%', tone: 'up' },
    { label: 'Closed MTD',   value: '$118k', trend: '+12%',  tone: 'up' },
  ],

  attention: [
    { id: 'a1', kind: 'overdue',  label: 'Overdue tasks',   count: 3, tone: 'danger' },
    { id: 'a2', kind: 'newleads', label: 'New leads',       count: 5, tone: 'info'   },
    { id: 'a3', kind: 'offers',   label: 'Pending offers',  count: 2, tone: 'warn'   },
  ],

  nextAppointment: {
    contactName: 'Marcus & Priya Chen',
    contactInitials: 'MC',
    address: '128 Balsam Ave',
    city: 'Beach · Toronto',
    when: 'Today, 10:30 AM',
    minutesUntil: 49,
    drive: 18,
    tight: false,
  },

  newLeads: [
    { id: 'l1', name: 'Sarah Okonkwo',  role: 'buyer',  stage: 'New Lead', color: '#ADB5BD', budget: '$900k–1.1M', temp: 'Warm',  ago: '2h' },
    { id: 'l2', name: 'Derrick Bailey', role: 'buyer',  stage: 'Contacted', color: '#74C0FC', budget: '$1.4–1.7M', temp: 'Hot',   ago: '4h' },
    { id: 'l3', name: 'Aya Fujimori',   role: 'seller', stage: 'Pre-Listing', color: '#ADB5BD', budget: 'Bloor West', temp: 'Warm',  ago: '1d' },
    { id: 'l4', name: 'Liam Patel',     role: 'buyer',  stage: 'Engaged',   color: '#339AF0', budget: '$600–750k',  temp: 'Cold',  ago: '2d' },
    { id: 'l5', name: 'Nora Hassan',    role: 'buyer',  stage: 'Appt Set',  color: '#FAB005', budget: '$1.1–1.3M',  temp: 'Hot',   ago: '3d' },
  ],

  pendingOffers: [
    { id: 'o1', address: '128 Balsam Ave',   price: 1245000, deposit: 65000, status: 'Submitted', expMin: 340,  client: 'Chen' },
    { id: 'o2', address: '42 Sorauren Ave #3', price: 879000,  deposit: 45000, status: 'Countered', expMin: 3,    client: 'Okonkwo' },
    { id: 'o3', address: '77 Wellesley St E',   price: 1580000, deposit: 80000, status: 'Accepted',  expMin: null, client: 'Tran' },
  ],

  activity: [
    { day: 'Today', items: [
      { t: '09:12', kind: 'note', who: 'Sarah Okonkwo', text: 'Pre-approval from Scotia confirmed — 1.05M' },
      { t: '08:47', kind: 'call', who: 'Marcus Chen', text: 'Called, 6 min. Confirmed 10:30 showing.' },
    ]},
    { day: 'Yesterday', items: [
      { t: '18:02', kind: 'stage', who: 'Derrick Bailey', text: 'Moved to Contacted' },
      { t: '15:20', kind: 'appt', who: 'Aya Fujimori', text: 'Listing presentation scheduled' },
      { t: '10:44', kind: 'note', who: '42 Sorauren #3', text: 'Staging photos uploaded' },
    ]},
  ],

  // Kanban lanes (buyer transaction on clients)
  leadLanes: [
    { name: 'New Lead',    color: '#ADB5BD', total: 5, value: '$4.8M',
      cards: [
        { name: 'Sarah Okonkwo',  role: 'buyer', tag: 'Pre-approved', ago: '2h', value: '$1.0M' },
        { name: 'Aya Fujimori',   role: 'seller', tag: 'Referral', ago: '1d', value: '—' },
      ]},
    { name: 'Contacted',   color: '#74C0FC', total: 8, value: '$9.1M',
      cards: [
        { name: 'Derrick Bailey', role: 'buyer', tag: 'Hot', ago: '4h', value: '$1.5M' },
        { name: 'Camille Reese',  role: 'buyer', tag: 'Investor', ago: '1d', value: '$2.1M' },
      ]},
    { name: 'Engaged',     color: '#339AF0', total: 6, value: '$7.2M',
      cards: [
        { name: 'Liam Patel',     role: 'buyer', tag: 'First-time', ago: '2d', value: '$680k' },
      ]},
    { name: 'Nurturing',   color: '#9775FA', total: 4, value: '$3.4M', cards: [] },
    { name: 'Appointment Set',   color: '#FAB005', total: 3, value: '$3.1M', cards: [] },
    { name: 'Agreement Signed',  color: '#40C057', total: 2, value: '$2.4M', cards: [] },
  ],

  // Clients — buyer transaction kanban
  clientLanes: [
    { name: 'Needs Analysis', color: '#ADB5BD', total: 3, value: '$3.1M',
      cards: [
        { name: 'Jules & Rory', role: 'buyer', tag: 'Pre-approved', dom: 6, value: '$1.25M' },
      ]},
    { name: 'Property Search', color: '#74C0FC', total: 4, value: '$5.6M',
      cards: [
        { name: 'Chen Family',     role: 'buyer', tag: 'Active', dom: 14, value: '$1.3M' },
        { name: 'Tobias Klein',    role: 'buyer', tag: 'Investor', dom: 22, value: '$2.0M' },
      ]},
    { name: 'Offer Submitted', color: '#228BE6', total: 2, value: '$2.6M',
      cards: [
        { name: 'Marcus & Priya Chen', role: 'buyer', tag: 'Submitted', dom: 31, value: '$1.245M' },
      ]},
    { name: 'Under Contract',  color: '#FAB005', total: 1, value: '$1.58M',
      cards: [
        { name: 'Tran Household', role: 'buyer', tag: 'Firm', dom: 45, value: '$1.58M' },
      ]},
    { name: 'Closed', color: '#40C057', total: 1, value: '$920k',
      cards: [
        { name: 'Navarro', role: 'buyer', tag: 'Closed Apr 9', dom: 61, value: '$920k' },
      ]},
  ],

  // Properties
  properties: [
    { id: 'p1', addr: '128 Balsam Ave', city: 'The Beach',    beds: 4, baths: 3, sqft: 2340, price: 1295000, stage: 'Active on Market', color: '#FAB005', dom: 6 },
    { id: 'p2', addr: '42 Sorauren Ave #3', city: 'Roncesvalles', beds: 2, baths: 2, sqft: 1040, price: 879000, stage: 'Offer Review', color: '#F76707', dom: 11 },
    { id: 'p3', addr: '77 Wellesley St E',    city: 'Cabbagetown', beds: 3, baths: 2, sqft: 1860, price: 1580000, stage: 'Under Contract', color: '#F03E3E', dom: 22 },
    { id: 'p4', addr: '901 Queen St W',       city: 'Trinity–Bell.', beds: 1, baths: 1, sqft: 620, price: 649000, stage: 'Listing Prep', color: '#CC5DE8', dom: 2 },
    { id: 'p5', addr: '18 Lower Jarvis',      city: 'Harbourfront',  beds: 2, baths: 2, sqft: 980, price: 999000, stage: 'Showings', color: '#FD7E14', dom: 9 },
  ],

  offers: [
    { id: 'of1', addr: '128 Balsam Ave', client: 'Chen',     price: 1245000, deposit: 65000,  status: 'Submitted', expMin: 340, side: 'buyer' },
    { id: 'of2', addr: '42 Sorauren Ave #3', client: 'Okonkwo', price: 879000,  deposit: 45000,  status: 'Countered', expMin: 3,  side: 'buyer' },
    { id: 'of3', addr: '77 Wellesley St E', client: 'Tran',    price: 1580000, deposit: 80000,  status: 'Accepted',  expMin: null, side: 'seller' },
    { id: 'of4', addr: '901 Queen St W',    client: 'Reese',   price: 1640000, deposit: 90000,  status: 'Expired',   expMin: -120, side: 'seller' },
    { id: 'of5', addr: '18 Lower Jarvis',   client: 'Bailey',  price: 980000,  deposit: 50000,  status: 'Submitted', expMin: 1200, side: 'buyer' },
  ],

  tasks: [
    { id: 't1', text: 'Send CMA draft to Aya Fujimori', when: 'Overdue · yesterday', tone: 'danger', contact: 'Aya Fujimori' },
    { id: 't2', text: 'Follow up on Scotia pre-approval', when: 'Today, 11:00 AM', tone: 'warn', contact: 'Sarah Okonkwo' },
    { id: 't3', text: 'Confirm inspection w/ Tran', when: 'Today, 2:00 PM', tone: 'warn', contact: 'Tran Household' },
    { id: 't4', text: 'Prep feedback email for 42 Sorauren', when: 'Today, 4:30 PM', tone: 'ok', contact: '42 Sorauren #3' },
    { id: 't5', text: 'Draft counter for Okonkwo', when: 'Today, 6:00 PM', tone: 'warn', contact: 'Okonkwo' },
    { id: 't6', text: 'Thank-you note to Navarro family', when: 'Tomorrow', tone: 'ok', contact: 'Navarro' },
    { id: 't7', text: 'Update 128 Balsam MLS photos', when: 'Fri Apr 18', tone: 'ok', contact: '128 Balsam' },
  ],

  calendar: [
    { day: 'Today',     date: 'Apr 17',
      items: [
        { t: '10:30 AM', end: '11:15 AM', title: 'Showing · 128 Balsam', who: 'Chen Family', kind: 'showing', drive: 18 },
        { t: '12:00 PM', end: '12:45 PM', title: 'Buyer consult · Okonkwo', who: 'Sarah Okonkwo', kind: 'consult', drive: 26, tight: true },
        { t: '2:00 PM',  end: '3:30 PM',  title: 'Inspection · 77 Wellesley', who: 'Tran Household', kind: 'inspect', drive: 12 },
        { t: '4:30 PM',  end: '5:00 PM',  title: 'Listing prep call',         who: 'Aya Fujimori',  kind: 'call' },
      ]},
    { day: 'Tomorrow',  date: 'Apr 18',
      items: [
        { t: '9:00 AM',  end: '9:30 AM',  title: 'Team huddle',               who: 'Team',          kind: 'call' },
        { t: '11:00 AM', end: '12:00 PM', title: 'Open house · 18 Lower Jarvis', who: 'Public',    kind: 'showing' },
        { t: '3:00 PM',  end: '4:00 PM',  title: 'Offer review · Sorauren',   who: 'Okonkwo',       kind: 'offer' },
      ]},
    { day: 'Sun',       date: 'Apr 19',
      items: [
        { t: '1:00 PM',  end: '3:00 PM',  title: 'Open house · 128 Balsam',   who: 'Public',        kind: 'showing' },
      ]},
  ],
};

window.MOCK = MOCK;

// ----- Common icon set (inline SVG paths, lucide-like, 1.5 stroke) -----
function Icon({ name, size = 20, color = 'currentColor' }) {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home:      <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    users:     <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 19a6.5 6.5 0 0113 0"/><path d="M15 4.5a3.5 3.5 0 110 7"/><path d="M17 19a6.5 6.5 0 00-1.2-3.8"/></>,
    user:      <><circle cx="12" cy="8" r="3.8"/><path d="M4 20a8 8 0 0116 0"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M3 13h18"/></>,
    contact:   <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="11" r="2.5"/><path d="M8.5 17a3.5 3.5 0 017 0"/></>,
    calendar:  <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    check:     <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 12l3 3 5-6"/></>,
    map:       <><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v16M15 6v16"/></>,
    list:      <><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    board:     <><rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="10" rx="1.5"/></>,
    plus:      <><path d="M12 5v14M5 12h14"/></>,
    search:    <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    bell:      <><path d="M6 16V10a6 6 0 0112 0v6"/><path d="M4 17h16"/><path d="M10 20a2 2 0 004 0"/></>,
    phone:     <><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8 9.7a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></>,
    message:   <><path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    note:      <><path d="M5 4h10l4 4v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M14 4v4h4"/><path d="M8 13h7M8 17h5"/></>,
    pen:       <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4z"/></>,
    share:     <><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></>,
    chevron:   <><path d="M9 18l6-6-6-6"/></>,
    down:      <><path d="M6 9l6 6 6-6"/></>,
    more:      <><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></>,
    car:       <><path d="M3 13l2-5a2 2 0 012-2h10a2 2 0 012 2l2 5"/><path d="M3 13v5h18v-5"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></>,
    clock:     <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    flame:     <><path d="M12 3s5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4-1 2 1 4 3 3 0-2-1-4 0-9z"/></>,
    arrowUp:   <><path d="M6 14l6-6 6 6"/></>,
    arrowRight:<><path d="M5 12h14M13 5l7 7-7 7"/></>,
    filter:    <><path d="M3 5h18l-7 9v5l-4 2v-7L3 5z"/></>,
    sliders:   <><path d="M4 6h12M20 6h0"/><path d="M4 12h4M12 12h8"/><path d="M4 18h12M20 18h0"/><circle cx="18" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></>,
    camera:    <><path d="M3 8a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><circle cx="12" cy="13" r="4"/></>,
    doc:       <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></>,
    coins:     <><ellipse cx="8" cy="8" rx="6" ry="3"/><path d="M2 8v4c0 1.7 2.7 3 6 3"/><path d="M2 12v4c0 1.7 2.7 3 6 3"/><ellipse cx="16" cy="14" rx="6" ry="3"/><path d="M10 14v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4"/></>,
    convert:   <><path d="M17 3l4 4-4 4"/><path d="M3 7h18"/><path d="M7 21l-4-4 4-4"/><path d="M21 17H3"/></>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{paths[name] || null}</svg>;
}

window.Icon = Icon;
