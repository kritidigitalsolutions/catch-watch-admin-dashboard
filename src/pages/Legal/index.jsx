import { useState } from 'react';
import { FileText, Shield, HelpCircle, Info, Save, Send, MessageSquare, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { legalContent, supportTickets } from '../../constants/mockData';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/useThemeStore';

const legalTabs = [
  { key: 'privacy', label: 'Privacy Policy', icon: Shield },
  { key: 'terms', label: 'Terms & Conditions', icon: FileText },
  { key: 'refund', label: 'Refund Policy', icon: HelpCircle },
  { key: 'about', label: 'About App', icon: Info },
];

const ticketStatusTabs = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

export default function Legal() {
  const { isDark } = useThemeStore();
  const [activeSection, setActiveSection] = useState('legal');
  const [activeLegalTab, setActiveLegalTab] = useState('privacy');
  const [legalData, setLegalData] = useState(legalContent);
  const [tickets, setTickets] = useState(supportTickets);
  const [ticketFilter, setTicketFilter] = useState('All');
  const [activeTicket, setActiveTicket] = useState(null);
  const [reply, setReply] = useState('');

  const currentLegal = legalData[activeLegalTab];

  /* ── Colour tokens ───────────────────────── */
  const bg        = isDark ? '#1E293B' : '#ffffff';
  const pageBg    = isDark ? '#0F172A' : '#F8FAFC';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg   = isDark ? 'rgba(51,65,85,0.5)' : '#f8fafc';
  const hoverBg   = isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9';

  /* ── Handlers ────────────────────────────── */
  const handleSaveLegal  = () => toast.success(`${currentLegal.title} saved as draft`);
  const handlePublishLegal = () => toast.success(`${currentLegal.title} published live!`);

  const filteredTickets = ticketFilter === 'All'
    ? tickets
    : tickets.filter((t) => t.status === ticketFilter);

  const handleReply = () => {
    if (!reply.trim()) return;
    const newMsg = { sender: 'admin', text: reply, time: new Date().toISOString().replace('T', ' ').slice(0, 16) };
    setTickets((prev) => prev.map((t) => t.id === activeTicket.id ? { ...t, messages: [...t.messages, newMsg] } : t));
    setActiveTicket((prev) => ({ ...prev, messages: [...prev.messages, newMsg] }));
    setReply('');
    toast.success('Reply sent!');
  };

  const updateTicketStatus = (id, status) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    if (activeTicket?.id === id) setActiveTicket((prev) => ({ ...prev, status }));
    toast.success(`Ticket status updated to ${status}`);
  };

  /* ── Table columns ───────────────────────── */
  const ticketColumns = [
    {
      header: 'ID', accessor: 'id',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#f97316', fontWeight: 600 }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'User', accessor: 'userName',
      render: (row) => (
        <span style={{ fontWeight: 600, color: textMain, fontSize: '13px' }}>{row.userName}</span>
      ),
    },
    {
      header: 'Subject', accessor: 'subject',
      render: (row) => (
        <span style={{
          fontSize: '13px', color: textMuted,
          maxWidth: '200px', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block',
        }}>
          {row.subject}
        </span>
      ),
    },
    {
      header: 'Category', accessor: 'category',
      render: (row) => (
        <span style={{
          fontSize: '11px', fontWeight: 500,
          padding: '3px 10px', borderRadius: '999px',
          background: isDark ? 'rgba(51,65,85,0.7)' : '#f1f5f9',
          color: textMuted,
        }}>
          {row.category}
        </span>
      ),
    },
    {
      header: 'Date', accessor: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '12px', color: textMuted }}>{row.createdAt}</span>
      ),
    },
    {
      header: 'Priority', accessor: 'priority',
      render: (row) => {
        const map = {
          High:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          Medium: { color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
          Low:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
        };
        const s = map[row.priority] || map.Low;
        return (
          <span style={{
            fontSize: '11px', fontWeight: 600,
            padding: '3px 10px', borderRadius: '999px',
            background: s.bg, color: s.color,
          }}>
            {row.priority}
          </span>
        );
      },
    },
    {
      header: 'Status', accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  /* ── Card style helper ───────────────────── */
  const card = {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '20px',
    padding: '24px',
    boxSizing: 'border-box',
    boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
  };

  /* ── Input style ─────────────────────────── */
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: `1px solid ${border}`,
    background: inputBg,
    color: textMain,
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: '24px 24px 48px 24px',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── Page Header ─────────────────────── */}
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>
            Legal & Support
          </h1>
          <p style={{ fontSize: '14px', color: textMuted, marginTop: '6px' }}>
            Manage legal pages and support tickets
          </p>
        </div>

        {/* ── Section Toggle ───────────────────── */}
        <div style={{
          display: 'flex', gap: '4px',
          background: isDark ? '#334155' : '#f1f5f9',
          borderRadius: '14px',
          padding: '5px',
          width: 'fit-content',
        }}>
          {[
            { key: 'legal', label: 'Legal Pages', icon: FileText },
            { key: 'support', label: 'Support Tickets', icon: MessageSquare },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '9px 20px',
                borderRadius: '10px',
                border: 'none',
                background: activeSection === key
                  ? 'linear-gradient(135deg, #f97316, #ea580c)'
                  : 'transparent',
                color: activeSection === key ? '#fff' : textMuted,
                fontSize: '13px', fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeSection === key ? '0 4px 12px rgba(249,115,22,0.3)' : 'none',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── LEGAL PAGES SECTION ──────────────── */}
        {activeSection === 'legal' && (
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}
            className="legal-grid"
          >
            {/* Left: Tab list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {legalTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeLegalTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveLegalTab(tab.key)}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = hoverBg; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = bg; }}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      border: active ? '1px solid rgba(249,115,22,0.2)' : `1px solid ${border}`,
                      background: active ? 'linear-gradient(135deg, #f97316, #ea580c)' : bg,
                      color: active ? '#fff' : textMuted,
                      fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      textAlign: 'left',
                      boxShadow: active ? '0 6px 16px rgba(249,115,22,0.25)' : 'none',
                    }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: active ? 'rgba(255,255,255,0.18)' : isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9',
                    }}>
                      <Icon size={16} />
                    </div>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Right: Editor */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLegalTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={card}
              >
                {/* Editor header */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap',
                  gap: '12px', marginBottom: '20px',
                }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: textMain, margin: 0 }}>
                      {currentLegal.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>
                      Last updated: {currentLegal.lastUpdated}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleSaveLegal}
                      onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '9px 18px', borderRadius: '11px',
                        border: `1px solid ${border}`,
                        background: 'transparent', color: textMuted,
                        fontSize: '13px', fontWeight: 600,
                        cursor: 'pointer', transition: 'background 0.18s',
                      }}
                    >
                      <Save size={14} /> Save Draft
                    </button>
                    <button
                      onClick={handlePublishLegal}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '9px 18px', borderRadius: '11px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: '#fff',
                        fontSize: '13px', fontWeight: 600,
                        cursor: 'pointer', transition: 'opacity 0.2s',
                        boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
                      }}
                    >
                      <Send size={14} /> Publish Live
                    </button>
                  </div>
                </div>

                {/* Content editor area */}
                <div
                  style={{
                    minHeight: '420px',
                    padding: '20px',
                    borderRadius: '14px',
                    border: `1px solid ${border}`,
                    background: inputBg,
                    color: textMain,
                    fontSize: '14px',
                    lineHeight: '1.75',
                    overflowY: 'auto',
                    cursor: 'text',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#f97316';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{ __html: currentLegal.content }}
                    style={{ outline: 'none', minHeight: '380px' }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ── SUPPORT TICKETS SECTION ──────────── */}
        {activeSection === 'support' && (
          <div style={{
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: '20px',
            padding: '24px',
            boxSizing: 'border-box',
            boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            {/* Section heading */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: textMain, margin: 0 }}>
                Support Tickets
              </h3>
              <p style={{ fontSize: '13px', color: textMuted, marginTop: '4px' }}>
                Manage and respond to user support requests
              </p>
            </div>
            <DataTable
              columns={ticketColumns}
              data={filteredTickets}
              searchPlaceholder="Search tickets..."
              filters={ticketStatusTabs.map((s) => ({
                value: s,
                label: s,
                count: s === 'All' ? tickets.length : tickets.filter((t) => t.status === s).length,
              }))}
              activeFilter={ticketFilter}
              onFilterChange={setTicketFilter}
              onRowClick={(row) => setActiveTicket(row)}
              actions={(row) => (
                <select
                  value={row.status}
                  onChange={(e) => updateTicketStatus(row.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize: '12px', padding: '4px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${border}`,
                    background: isDark ? '#334155' : '#f1f5f9',
                    color: textMain, cursor: 'pointer',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              )}
            />
          </div>
        )}

        {/* ── Ticket Detail Modal ───────────────── */}
        <Modal isOpen={!!activeTicket} onClose={() => setActiveTicket(null)} title={`Ticket ${activeTicket?.id}`} size="lg">
          {activeTicket && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Ticket meta */}
              <div style={{
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                paddingBottom: '16px', borderBottom: `1px solid ${border}`,
              }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: textMain, margin: 0 }}>
                    {activeTicket.subject}
                  </h4>
                  <p style={{ fontSize: '12px', color: textMuted, marginTop: '5px' }}>
                    {activeTicket.userName} · {activeTicket.category} · {activeTicket.createdAt}
                  </p>
                </div>
                <StatusBadge status={activeTicket.status} />
              </div>

              {/* Message thread */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
                maxHeight: '320px', overflowY: 'auto',
                padding: '4px 4px 4px 0',
              }}>
                {activeTicket.messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: msg.sender === 'admin' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.sender === 'admin'
                        ? 'linear-gradient(135deg, #f97316, #ea580c)'
                        : isDark ? '#334155' : '#f1f5f9',
                      color: msg.sender === 'admin' ? '#fff' : textMain,
                    }}>
                      <p style={{ fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{msg.text}</p>
                      <p style={{
                        fontSize: '10px', marginTop: '6px',
                        color: msg.sender === 'admin' ? 'rgba(255,255,255,0.65)' : textMuted,
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        <Clock size={9} /> {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Reply input */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                  placeholder="Type your reply..."
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = border; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  onClick={handleReply}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '10px 20px', borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#fff', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', flexShrink: 0,
                    transition: 'opacity 0.2s',
                    boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
                  }}
                >
                  <Send size={14} /> Reply
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Responsive override */}
        <style>{`
          @media (max-width: 768px) {
            .legal-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

      </div>
    </motion.div>
  );
}
