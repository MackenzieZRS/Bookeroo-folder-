import { useState, useEffect, useRef, createContext, useContext } from "react";

// Global nav context so modals can navigate
const NavContext = createContext(null);
const useNav = () => useContext(NavContext);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&family=Geist+Mono:wght@400;500;600&family=Geist:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #F5F0E8; }

  :root {
    --cream: #F5F0E8;
    --cream-dark: #EDE8DF;
    --cream-darker: #E2DDD4;
    --ink: #1A1714;
    --ink-2: #3D3833;
    --ink-3: #6B6560;
    --ink-4: #9E9892;
    --ink-5: #C8C3BC;
    --sage: #4A7C6F;
    --sage-light: #6A9E90;
    --sage-bg: #EBF3F0;
    --amber: #C4772A;
    --amber-bg: #FBF0E4;
    --rose: #B85C5C;
    --rose-bg: #FAF0F0;
    --sky: #3B6FA0;
    --sky-bg: #EEF3F9;
    --border: rgba(26,23,20,0.08);
    --border-strong: rgba(26,23,20,0.14);
    --shadow-sm: 0 1px 3px rgba(26,23,20,0.06), 0 1px 2px rgba(26,23,20,0.04);
    --shadow-md: 0 4px 12px rgba(26,23,20,0.08), 0 2px 4px rgba(26,23,20,0.05);
    --shadow-lg: 0 12px 32px rgba(26,23,20,0.10), 0 4px 8px rgba(26,23,20,0.06);
    --radius: 14px;
    --radius-sm: 8px;
    --radius-lg: 20px;
    --font-display: 'Fraunces', Georgia, serif;
    --font-body: 'Geist', system-ui, sans-serif;
    --font-mono: 'Geist Mono', monospace;
  }

  html { font-family: var(--font-body); font-size: 14px; color: var(--ink); background: var(--cream); }
  
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--ink-5); border-radius: 10px; }

  .app { display: flex; height: 100vh; background: var(--cream); overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 232px; flex-shrink: 0;
    background: var(--ink);
    display: flex; flex-direction: column;
    transition: width 0.3s cubic-bezier(.4,0,.2,1);
    position: relative; z-index: 20;
  }
  .sidebar.collapsed { width: 64px; }

  .sidebar-logo {
    padding: 20px 18px; border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; gap: 12; height: 64px;
  }
  .logo-mark {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, #6A9E90, #4A7C6F);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 16px; font-weight: 700;
    color: white; font-style: italic; letter-spacing: -0.04em;
  }
  .logo-text { overflow: hidden; transition: opacity 0.2s, width 0.3s; }
  .sidebar.collapsed .logo-text { opacity: 0; width: 0; pointer-events: none; }
  .logo-name { color: #F5F0E8; font-family: var(--font-display); font-size: 15px; font-weight: 600; letter-spacing: -0.02em; line-height: 1; }

  .sidebar-nav { flex: 1; overflow-y: auto; padding: 10px 8px; }
  .nav-section-label {
    padding: 10px 10px 4px;
    color: rgba(245,240,232,0.25); font-size: 9.5px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    white-space: nowrap; overflow: hidden;
    transition: opacity 0.2s;
  }
  .sidebar.collapsed .nav-section-label { opacity: 0; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: 9px; cursor: pointer;
    border: 1px solid transparent; transition: all 0.15s;
    position: relative; white-space: nowrap; overflow: hidden;
    background: none; width: 100%; text-align: left;
    margin-bottom: 1px;
  }
  .sidebar.collapsed .nav-item { justify-content: center; padding: 10px; }
  .nav-item:hover { background: rgba(245,240,232,0.06); }
  .nav-item.active { background: rgba(106,158,144,0.18); border-color: rgba(106,158,144,0.3); }
  .nav-item-icon { flex-shrink: 0; opacity: 0.55; color: #F5F0E8; transition: opacity 0.15s; }
  .nav-item.active .nav-item-icon, .nav-item:hover .nav-item-icon { opacity: 1; }
  .nav-item.active .nav-item-icon { color: #6A9E90; }
  .nav-item-label { color: rgba(245,240,232,0.6); font-size: 13px; font-weight: 400; transition: color 0.15s; flex: 1; }
  .nav-item.active .nav-item-label { color: #F5F0E8; font-weight: 500; }
  .nav-item:hover .nav-item-label { color: rgba(245,240,232,0.9); }
  .sidebar.collapsed .nav-item-label { display: none; }
  .nav-badge { background: #B85C5C; color: white; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 6px; font-family: var(--font-mono); }
  .sidebar.collapsed .nav-badge { display: none; }
  .nav-dot { position: absolute; top: 7px; right: 7px; width: 6px; height: 6px; background: #B85C5C; border-radius: 50%; border: 1.5px solid var(--ink); display: none; }
  .sidebar.collapsed .nav-dot { display: block; }

  .sidebar-footer {
    padding: 12px 8px; border-top: 1px solid rgba(255,255,255,0.07);
  }
  .user-card {
    display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 9px; cursor: pointer;
    overflow: hidden;
  }
  .user-card:hover { background: rgba(245,240,232,0.05); }
  .user-avatar { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #C4772A, #E09548); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; color: white; flex-shrink: 0; font-family: var(--font-display); }
  .user-info { overflow: hidden; }
  .user-name { color: rgba(245,240,232,0.85); font-size: 12.5px; font-weight: 500; white-space: nowrap; }
  .user-role { color: rgba(245,240,232,0.3); font-size: 10px; }
  .sidebar.collapsed .user-info { display: none; }

  .sidebar-toggle {
    position: absolute; top: 20px; right: -11px; width: 22px; height: 22px;
    background: var(--cream); border: 1.5px solid var(--border-strong); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 30; color: var(--ink-3); font-size: 10px;
    transition: all 0.2s; box-shadow: var(--shadow-sm);
  }
  .sidebar-toggle:hover { background: var(--cream-dark); transform: scale(1.1); }

  /* MAIN */
  .main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; transition: all 0.3s cubic-bezier(.4,0,.2,1); }

  .topbar {
    height: 64px; background: var(--cream); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; flex-shrink: 0; gap: 16px;
  }
  .topbar-left { display: flex; align-items: center; gap: 8px; }
  .breadcrumb-sep { color: var(--ink-5); }
  .breadcrumb-current { font-family: var(--font-display); font-size: 15px; font-weight: 500; color: var(--ink); }

  .search-bar {
    display: flex; align-items: center; gap: 8px;
    background: var(--cream-dark); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 7px 12px; width: 260px; cursor: text;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .search-bar:focus-within { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(106,158,144,0.12); }
  .search-bar input { background: none; border: none; outline: none; font-size: 13px; color: var(--ink); font-family: var(--font-body); flex: 1; }
  .search-bar input::placeholder { color: var(--ink-4); }
  .search-kbd { background: var(--cream-darker); border: 1px solid var(--border-strong); border-radius: 4px; padding: 1px 5px; font-size: 10px; color: var(--ink-4); font-family: var(--font-mono); }

  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--cream-dark);
    border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--ink-3); transition: all 0.15s; position: relative;
  }
  .icon-btn:hover { background: var(--cream-darker); border-color: var(--border-strong); }
  .notif-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: #B85C5C; border-radius: 50%; border: 1.5px solid var(--cream-dark); }

  .btn-primary {
    display: flex; align-items: center; gap: 6px;
    background: var(--ink); color: var(--cream);
    border: none; border-radius: 10px; padding: 9px 16px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: var(--font-body); transition: all 0.15s;
    white-space: nowrap; box-shadow: var(--shadow-sm);
  }
  .btn-primary:hover { background: var(--ink-2); box-shadow: var(--shadow-md); transform: translateY(-1px); }
  .btn-secondary {
    display: flex; align-items: center; gap: 6px;
    background: var(--cream-dark); color: var(--ink-2);
    border: 1.5px solid var(--border); border-radius: 10px; padding: 8px 14px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: var(--font-body); transition: all 0.15s;
  }
  .btn-secondary:hover { background: var(--cream-darker); border-color: var(--border-strong); }
  .btn-sage {
    display: flex; align-items: center; gap: 6px;
    background: var(--sage); color: white;
    border: none; border-radius: 10px; padding: 9px 16px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: var(--font-body); transition: all 0.15s;
    box-shadow: var(--shadow-sm);
  }
  .btn-sage:hover { background: var(--sage-light); box-shadow: var(--shadow-md); transform: translateY(-1px); }

  .page-content { flex: 1; overflow-y: auto; padding: 28px 32px; }

  /* CARDS */
  .card {
    background: white; border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow-sm);
  }
  .card-header {
    padding: 18px 22px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .card-title { font-family: var(--font-display); font-size: 15px; font-weight: 500; color: var(--ink); }
  .card-body { padding: 22px; }

  /* STAT CARDS */
  .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: white; border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px 22px; position: relative; overflow: hidden;
    box-shadow: var(--shadow-sm); transition: all 0.2s ease; cursor: pointer;
  }
  .stat-card:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .stat-card-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }
  .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 10px; }
  .stat-value { font-family: var(--font-mono); font-size: 28px; font-weight: 600; color: var(--ink); letter-spacing: -0.04em; line-height: 1; }
  .stat-change { display: flex; align-items: center; gap: 4px; margin-top: 8px; font-size: 11.5px; font-weight: 500; }
  .stat-change.up { color: var(--sage); }
  .stat-change.down { color: var(--rose); }
  .stat-sub { color: var(--ink-4); font-size: 11px; margin-left: 2px; }

  /* SPARKLINE */
  .sparkline-wrap { position: absolute; bottom: 12px; right: 16px; opacity: 0.4; }

  /* STATUS BADGES */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.03em;
    font-family: var(--font-mono);
  }
  .badge-confirmed { background: var(--sage-bg); color: var(--sage); }
  .badge-pending { background: var(--amber-bg); color: var(--amber); }
  .badge-cancelled { background: var(--rose-bg); color: var(--rose); }
  .badge-expired { background: var(--cream-darker); color: var(--ink-4); }
  .badge-active { background: var(--sage-bg); color: var(--sage); }
  .badge-inactive { background: var(--cream-darker); color: var(--ink-4); }
  .badge-maintenance { background: var(--amber-bg); color: var(--amber); }
  .badge-offline { background: var(--cream-darker); color: var(--ink-3); }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* TABLE */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { border-bottom: 1px solid var(--border); }
  th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-4); white-space: nowrap; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; cursor: pointer; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--cream); }
  td { padding: 13px 16px; font-size: 13px; color: var(--ink-2); vertical-align: middle; }

  /* BOOKING TABLE */
  .booking-id { font-family: var(--font-mono); font-size: 12px; color: var(--ink-4); }
  .customer-cell { display: flex; align-items: center; gap: 10px; }
  .avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; font-family: var(--font-display); }
  .customer-name { font-weight: 500; color: var(--ink); font-size: 13px; }
  .activity-name { color: var(--ink-2); font-size: 13px; max-width: 180px; }
  .amount-cell { font-family: var(--font-mono); font-weight: 600; color: var(--ink); font-size: 13.5px; }
  .date-cell .date { font-weight: 500; color: var(--ink); }
  .date-cell .time { font-size: 11px; color: var(--ink-4); font-family: var(--font-mono); margin-top: 1px; }
  .actions-cell { display: flex; gap: 4px; }
  .tbl-btn { width: 28px; height: 28px; border-radius: 6px; background: var(--cream-dark); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ink-3); transition: all 0.1s; }
  .tbl-btn:hover { background: var(--cream-darker); color: var(--ink); }

  /* FILTER TABS */
  .filter-tabs { display: flex; gap: 2px; background: var(--cream-dark); border-radius: 10px; padding: 3px; width: fit-content; border: 1px solid var(--border); }
  .filter-tab { padding: 5px 14px; border-radius: 7px; font-size: 12.5px; font-weight: 500; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; color: var(--ink-4); background: none; font-family: var(--font-body); }
  .filter-tab.active { background: white; color: var(--ink); border-color: var(--border); box-shadow: var(--shadow-sm); }

  /* ACTIVITY CARDS */
  .activity-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .activity-card {
    background: white; border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden; transition: all 0.2s; cursor: pointer;
    box-shadow: var(--shadow-sm);
  }
  .activity-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .activity-stripe { height: 4px; }
  .activity-body { padding: 18px 20px; }
  .activity-name { font-family: var(--font-display); font-size: 15px; font-weight: 500; color: var(--ink); margin-bottom: 6px; }
  .activity-meta { display: flex; gap: 16px; margin: 14px 0; }
  .activity-metric { }
  .activity-metric-val { font-family: var(--font-mono); font-size: 17px; font-weight: 600; color: var(--ink); }
  .activity-metric-lbl { font-size: 10.5px; color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 1px; }
  .activity-actions { display: flex; gap: 8px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }

  /* PROMO CARDS */
  .promo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .promo-card {
    background: white; border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; box-shadow: var(--shadow-sm); transition: all 0.2s;
  }
  .promo-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .promo-code-pill {
    display: inline-block; background: var(--ink); color: var(--cream);
    font-family: var(--font-mono); font-size: 13px; font-weight: 500;
    padding: 5px 12px; border-radius: 6px; letter-spacing: 0.05em; margin-bottom: 12px;
  }
  .promo-discount { font-family: var(--font-display); font-size: 32px; font-weight: 600; color: var(--sage); letter-spacing: -0.03em; line-height: 1; }
  .promo-title { color: var(--ink-2); font-size: 13px; margin-top: 4px; }
  .promo-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
  .promo-expiry { font-size: 11px; color: var(--ink-4); font-family: var(--font-mono); }
  .promo-uses { font-size: 11px; color: var(--ink-4); }

  /* ANALYTICS */
  .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 140px; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
  .bar { width: 100%; border-radius: 5px 5px 2px 2px; transition: opacity 0.2s; cursor: pointer; min-height: 4px; }
  .bar:hover { opacity: 0.75; }
  .bar-label { font-size: 10px; color: var(--ink-4); font-family: var(--font-mono); }

  /* CALENDAR */
  .calendar-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 1px; background: var(--border); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); }
  .cal-header { background: var(--cream-dark); padding: 8px 4px; text-align: center; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-4); }
  .cal-day { background: white; padding: 8px; min-height: 80px; cursor: pointer; transition: background 0.1s; }
  .cal-day:hover { background: var(--cream); }
  .cal-day.other-month { background: var(--cream); }
  .cal-day-num { font-size: 12px; font-weight: 500; color: var(--ink-3); font-family: var(--font-mono); }
  .cal-day.today .cal-day-num { background: var(--ink); color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .cal-booking-dot { font-size: 10px; background: var(--sage-bg); color: var(--sage); border-radius: 4px; padding: 1px 5px; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }

  /* EMPTY STATE */
  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 12px; }
  .empty-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--cream-dark); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--ink-4); }
  .empty-title { font-family: var(--font-display); font-size: 17px; color: var(--ink-2); }
  .empty-sub { font-size: 13px; color: var(--ink-4); text-align: center; }

  /* MINI CHART */
  .progress-bar-wrap { margin-bottom: 14px; }
  .progress-bar-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .progress-bar-label { font-size: 12.5px; color: var(--ink-2); }
  .progress-bar-val { font-family: var(--font-mono); font-size: 12px; color: var(--ink); font-weight: 600; }
  .progress-bar-track { height: 6px; background: var(--cream-darker); border-radius: 3px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 3px; transition: width 1s cubic-bezier(.4,0,.2,1); }

  /* UPCOMING SLOTS */
  .slot-item { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .slot-item:last-child { border-bottom: none; }
  .slot-time-badge { background: var(--cream-dark); border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; text-align: center; flex-shrink: 0; }
  .slot-time-day { font-size: 9px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--ink-4); font-weight: 600; }
  .slot-time-num { font-family: var(--font-mono); font-size: 16px; font-weight: 600; color: var(--ink); line-height: 1.1; }
  .slot-info { flex: 1; }
  .slot-name { font-weight: 500; color: var(--ink); font-size: 13px; }
  .slot-time { font-size: 11.5px; color: var(--ink-4); font-family: var(--font-mono); margin-top: 2px; }
  .slot-capacity { text-align: right; flex-shrink: 0; }
  .slot-cap-num { font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--ink); }
  .slot-cap-pct { font-size: 10.5px; color: var(--ink-4); margin-top: 1px; }
  .slot-bar { height: 3px; border-radius: 2px; margin-top: 6px; background: var(--cream-darker); overflow: hidden; }
  .slot-bar-fill { height: 100%; border-radius: 2px; }

  /* PAGE HEADER */
  .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
  .page-title { font-family: var(--font-display); font-size: 26px; font-weight: 500; color: var(--ink); letter-spacing: -0.02em; }
  .page-sub { font-size: 13px; color: var(--ink-4); margin-top: 3px; }

  /* RESOURCES */
  .resource-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow-sm); display: flex; align-items: flex-start; gap: 16px; }
  .resource-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--sky-bg); border: 1px solid rgba(59,111,160,0.15); display: flex; align-items: center; justify-content: center; color: var(--sky); flex-shrink: 0; }
  .resource-name { font-weight: 600; color: var(--ink); font-size: 14px; }
  .resource-type { font-size: 11.5px; color: var(--ink-4); margin-top: 2px; }
  .resource-stats { display: flex; gap: 16px; margin-top: 10px; }
  .res-stat-val { font-family: var(--font-mono); font-size: 15px; font-weight: 600; color: var(--ink); }
  .res-stat-lbl { font-size: 10px; color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.05em; }

  /* WAIVERS */
  .waiver-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .waiver-row:last-child { border-bottom: none; }
  .waiver-avatar { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; font-family: var(--font-display); }
  .waiver-name { font-weight: 500; color: var(--ink); font-size: 13px; }
  .waiver-activity { font-size: 11.5px; color: var(--ink-4); margin-top: 1px; }
  .waiver-date { font-size: 11.5px; color: var(--ink-4); font-family: var(--font-mono); margin-left: auto; }

  /* OVERLAYS */
  .modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(26,23,20,0.5); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
    animation: fadeIn 0.2s ease;
  }
  .modal-content {
    background: white; border-radius: var(--radius-lg);
    width: 600px; max-width: 90vw;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    animation: slideUp 0.3s cubic-bezier(.4,0,.2,1);
  }
  .modal-header {
    padding: 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .modal-title { font-family: var(--font-display); font-size: 20px; font-weight: 500; color: var(--ink); }
  .modal-close {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--cream-dark); border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--ink-3); transition: all 0.15s;
  }
  .modal-close:hover { background: var(--cream-darker); color: var(--ink); }
  .modal-body { padding: 32px 24px; }
  
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .page-content > * { animation: fadeIn 0.25s ease; }

  /* SIDEBAR DROPDOWN */
  .nav-group { margin-bottom: 1px; }
  .nav-group-trigger {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: 9px; cursor: pointer;
    border: 1px solid transparent; transition: all 0.15s;
    white-space: nowrap; overflow: hidden;
    background: none; width: 100%; text-align: left;
    margin-bottom: 1px;
  }
  .sidebar.collapsed .nav-group-trigger { justify-content: center; padding: 10px; }
  .nav-group-trigger:hover { background: rgba(245,240,232,0.06); }
  .nav-group-trigger.open { background: rgba(245,240,232,0.04); }
  .nav-group-trigger.active-group { background: rgba(106,158,144,0.12); border-color: rgba(106,158,144,0.2); }
  .nav-group-chevron { margin-left: auto; color: rgba(245,240,232,0.3); transition: transform 0.2s; flex-shrink: 0; }
  .nav-group-chevron.open { transform: rotate(180deg); }
  .sidebar.collapsed .nav-group-chevron { display: none; }
  .nav-group-children {
    overflow: hidden; transition: max-height 0.25s cubic-bezier(.4,0,.2,1), opacity 0.2s;
    max-height: 0; opacity: 0;
  }
  .nav-group-children.open { max-height: 300px; opacity: 1; }
  .sidebar.collapsed .nav-group-children { display: none; }
  .nav-child {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 10px 6px 36px; border-radius: 8px; cursor: pointer;
    border: 1px solid transparent; transition: all 0.15s;
    background: none; width: 100%; text-align: left; margin-bottom: 1px;
  }
  .nav-child:hover { background: rgba(245,240,232,0.06); }
  .nav-child.active { background: rgba(106,158,144,0.18); border-color: rgba(106,158,144,0.3); }
  .nav-child-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(245,240,232,0.25); flex-shrink: 0; transition: background 0.15s; }
  .nav-child.active .nav-child-dot { background: #6A9E90; }
  .nav-child-label { color: rgba(245,240,232,0.5); font-size: 12.5px; transition: color 0.15s; }
  .nav-child:hover .nav-child-label { color: rgba(245,240,232,0.85); }
  .nav-child.active .nav-child-label { color: #F5F0E8; font-weight: 500; }

  /* FINANCIALS */
  .fin-hero { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
  .fin-hero-card {
    background: white; border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px 22px; position: relative; overflow: hidden;
    box-shadow: var(--shadow-sm); transition: all 0.2s;
  }
  .fin-hero-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .fin-hero-eyebrow { font-size: 10.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 8px; }
  .fin-hero-val { font-family: var(--font-mono); font-size: 26px; font-weight: 600; color: var(--ink); letter-spacing: -0.04em; line-height: 1; }
  .fin-hero-sub { font-size: 11.5px; color: var(--ink-4); margin-top: 6px; }
  .fin-hero-tag { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 6px; margin-top: 6px; }
  .fin-hero-tag.up { background: var(--sage-bg); color: var(--sage); }
  .fin-hero-tag.down { background: var(--rose-bg); color: var(--rose); }
  .fin-hero-tag.warn { background: var(--amber-bg); color: var(--amber); }
  .fin-hero-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }

  .fin-section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .fin-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid var(--border); }
  .fin-row:last-child { border-bottom: none; }
  .fin-row-label { font-size: 13px; color: var(--ink-2); }
  .fin-row-sub { font-size: 11px; color: var(--ink-4); margin-top: 1px; }
  .fin-row-val { font-family: var(--font-mono); font-weight: 600; font-size: 13.5px; color: var(--ink); }
  .fin-row-val.red { color: var(--rose); }
  .fin-row-val.green { color: var(--sage); }
  .fin-row-val.amber { color: var(--amber); }

  .outstanding-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .outstanding-item:last-child { border-bottom: none; }
  .payout-card { background: #1A1714; border-radius: var(--radius); padding: 22px; color: white; position: relative; overflow: hidden; }
  .payout-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(245,240,232,0.45); margin-bottom: 6px; }
  .payout-amount { font-family: var(--font-mono); font-size: 34px; font-weight: 600; color: white; letter-spacing: -0.04em; line-height: 1; }
  .payout-date { font-size: 12px; color: rgba(245,240,232,0.5); margin-top: 6px; }
  .payout-details { display: flex; gap: 20px; margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(245,240,232,0.1); position: relative; z-index: 1; }
  .payout-detail-val { font-family: var(--font-mono); font-size: 14px; font-weight: 600; color: rgba(245,240,232,0.9); }
  .payout-detail-lbl { font-size: 10px; color: rgba(245,240,232,0.35); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

  /* STATEMENTS */
  .stmt-state { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; font-family: var(--font-mono); }
  .stmt-state.paid { background: var(--sage-bg); color: var(--sage); }
  .stmt-state.unpaid { background: var(--rose-bg); color: var(--rose); }
  .stmt-ref { font-family: var(--font-mono); font-size: 12px; color: var(--ink-3); }

  /* TAX REPORT */
  .tax-mode-pill { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10.5px; font-family: var(--font-mono); background: var(--cream-dark); color: var(--ink-3); border: 1px solid var(--border); }

  /* TODAY'S MANIFEST */
  .manifest-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 22px; border-bottom: 1px solid var(--border);
    transition: background 0.1s; cursor: pointer;
  }
  .manifest-row:last-child { border-bottom: none; }
  .manifest-row:hover { background: var(--cream); }
  .manifest-name { font-weight: 500; font-size: 13px; color: var(--ink); flex: 1; min-width: 0; }
  .manifest-activity { font-size: 11px; color: var(--ink-4); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
  .manifest-icons { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
  .manifest-icon-dot {
    width: 22px; height: 22px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; font-family: var(--font-mono);
  }
  .manifest-icon-dot.ok { background: var(--sage-bg); color: var(--sage); }
  .manifest-icon-dot.warn { background: var(--amber-bg); color: var(--amber); }
  .manifest-icon-dot.bad { background: var(--rose-bg); color: var(--rose); }
  .manifest-tickets { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); flex-shrink: 0; background: var(--cream-dark); border: 1px solid var(--border); border-radius: 5px; padding: 2px 7px; }
  .manifest-summary-strip { display: flex; border-bottom: 1px solid var(--border); }
  .manifest-summary-item { flex: 1; padding: 11px 0; text-align: center; border-right: 1px solid var(--border); }
  .manifest-summary-item:last-child { border-right: none; }
  .manifest-summary-val { font-family: var(--font-mono); font-size: 17px; font-weight: 600; color: var(--ink); }
  .manifest-summary-lbl { font-size: 9.5px; color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 1px; }
  .manifest-session-header { display: flex; align-items: center; gap: 10px; padding: 8px 22px 4px; }
  .manifest-session-line { flex: 1; height: 1px; background: var(--border); }
  .manifest-session-label { font-size: 10px; font-weight: 700; color: var(--ink-4); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
  .manifest-time-chip { font-size: 10px; font-family: var(--font-mono); background: var(--cream-dark); border: 1px solid var(--border); color: var(--ink-3); padding: 2px 7px; border-radius: 5px; flex-shrink: 0; }

`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const DATA = {
  stats: [
    { label: "Revenue", value: "$18,420", raw: 18420, change: "+14.2%", up: true, sub: "vs last week", color: "#4A7C6F", spark: [3200, 2800, 4100, 3600, 5200, 4800, 5900, 6200, 7100, 6800, 7500, 8200] },
    { label: "Bookings", value: "47", raw: 47, change: "+8.5%", up: true, sub: "vs last week", color: "#3B6FA0", spark: [9, 12, 8, 15, 11, 17, 13, 18, 16, 20, 19, 22] },
    { label: "Avg. Value", value: "$391.9", raw: 392, change: "+11.3%", up: true, sub: "vs last week", color: "#C4772A", spark: [290, 310, 285, 340, 320, 365, 345, 390, 370, 410, 395, 415] },
    { label: "Capacity Used", value: "78%", raw: 78, change: "+4.3%", up: true, sub: "vs last week", color: "#7B5EA7", spark: [65, 68, 62, 71, 67, 70, 69, 74, 72, 75, 76, 78] },
  ],
  manifest: [
    // 09:00 session
    { id: 1031, name: "Zakaria Mohamad", initials: "ZM", hue: 140, activity: "Buggy + Jet Ski + Aqua Karts", session: "09:00–13:00", tickets: 2, waiver: "ok", balance: "warn", confirmed: "ok" },
    { id: 1030, name: "Jose Fuentes", initials: "JF", hue: 60, activity: "Buggy + Jet Ski + Aqua Karts", session: "09:00–13:00", tickets: 1, waiver: "ok", balance: "ok", confirmed: "ok" },
    { id: 1029, name: "Andy Pena", initials: "AP", hue: 200, activity: "Buggy + Jet Ski + Aqua Karts", session: "09:00–13:00", tickets: 1, waiver: "warn", balance: "ok", confirmed: "ok" },
    // 14:00 session
    { id: 1037, name: "Jaeda Ray", initials: "JR", hue: 25, activity: "Jet Ski + Aqua Kart", session: "14:00–18:00", tickets: 1, waiver: "warn", balance: "warn", confirmed: "warn" },
    { id: 1035, name: "Ce'Asia Williams", initials: "CW", hue: 190, activity: "Jet Ski + Aqua Kart", session: "14:00–18:00", tickets: 1, waiver: "ok", balance: "warn", confirmed: "warn" },
    { id: 1034, name: "Tremishea Brady", initials: "TB", hue: 320, activity: "Jet Ski + Aqua Kart", session: "14:00–18:00", tickets: 1, waiver: "ok", balance: "ok", confirmed: "ok" },
    { id: 1001, name: "Jackson Moore", initials: "JM", hue: 160, activity: "Jet Ski + Aqua Kart", session: "14:00–18:00", tickets: 4, waiver: "ok", balance: "ok", confirmed: "ok" },
  ],
  bookings: [
    { id: 1037, name: "Jaeda Ray", initials: "JR", activity: "Jet Ski + Aqua Kart", date: "Mar 13", time: "14:00–18:00", status: "pending", amount: 122.55, tickets: 1, hue: 25 },
    { id: 1035, name: "Ce'Asia Williams", initials: "CW", activity: "Jet Ski + Aqua Kart", date: "Mar 13", time: "14:00–18:00", status: "pending", amount: 122.55, tickets: 1, hue: 190 },
    { id: 1034, name: "Tremishea Brady", initials: "TB", activity: "Jet Ski + Aqua Kart", date: "Mar 13", time: "14:00–18:00", status: "confirmed", amount: 129.00, tickets: 1, hue: 320 },
    { id: 1031, name: "Zakaria Mohamad", initials: "ZM", activity: "Buggy + Jet Ski + Aqua Karts", date: "Mar 23", time: "09:00–13:00", status: "pending", amount: 338.00, tickets: 2, hue: 140 },
    { id: 1030, name: "Jose Fuentes", initials: "JF", activity: "Buggy + Jet Ski + Aqua Karts", date: "Jun 26", time: "09:00–13:00", status: "confirmed", amount: 160.55, tickets: 1, hue: 60 },
    { id: 1029, name: "Andy Pena", initials: "AP", activity: "Buggy + Jet Ski + Aqua Karts", date: "Jun 26", time: "09:00–13:00", status: "confirmed", amount: 160.55, tickets: 1, hue: 200 },
    { id: 1015, name: "Danial Gourlie", initials: "DG", activity: "Buggy & Jet Ski", date: "Mar 3", time: "14:00–18:00", status: "confirmed", amount: 129.00, tickets: 1, hue: 270 },
    { id: 1001, name: "Jackson Moore", initials: "JM", activity: "Buggy + Jet Ski + Aqua Karts", date: "Mar 9", time: "14:00–18:00", status: "confirmed", amount: 608.40, tickets: 4, hue: 160 },
    { id: 993, name: "Jonathan Rivera", initials: "JR", activity: "Aqua Splash Pack", date: "Feb 25", time: "09:00–13:00", status: "confirmed", amount: 198.00, tickets: 2, hue: 45 },
    { id: 992, name: "Sarah Chen", initials: "SC", activity: "Buggy & Jet Ski", date: "Feb 26", time: "14:00–18:00", status: "cancelled", amount: 387.00, tickets: 3, hue: 300 },
  ],
  activities: [
    { id: 1, name: "Aqua Splash Pack", status: "active", bookings: 12, revenue: 2376, schedules: 1, stripe: "#4A7C6F" },
    { id: 2, name: "Aqua Kart + Buggy", status: "active", bookings: 8, revenue: 1560, schedules: 1, stripe: "#3B6FA0" },
    { id: 3, name: "Buggy & Jet Ski", status: "active", bookings: 15, revenue: 1935, schedules: 1, stripe: "#C4772A" },
    { id: 4, name: "Jet Ski + Aqua Kart", status: "active", bookings: 22, revenue: 2838, schedules: 1, stripe: "#7B5EA7" },
    { id: 5, name: "Buggy + Jet Ski + Aqua Karts", status: "active", bookings: 19, revenue: 6090, schedules: 1, stripe: "#B85C5C" },
    { id: 6, name: "Single Seater Tour", status: "inactive", bookings: 0, revenue: 0, schedules: 0, stripe: "#9E9892" },
  ],
  promotions: [
    { id: 8, code: "JETSKI2025", title: "Summer Season", discount: "10% OFF", uses: 14, expires: "Sep 30, 2026", type: "percent" },
    { id: 7, code: "ADVENTURE10", title: "Adventure Discount", discount: "5% OFF", uses: 7, expires: "Dec 31, 2030", type: "percent" },
    { id: 6, code: "JETSKI15", title: "Loyalty Reward", discount: "15% OFF", uses: 22, expires: "Aug 31, 2026", type: "percent" },
    { id: 5, code: "JET10", title: "Popup Exclusive", discount: "10% OFF", uses: 31, expires: "Nov 30, 2027", type: "percent" },
    { id: 2, code: "JETSKI20", title: "VIP Discount", discount: "20% OFF", uses: 5, expires: "Dec 31, 2030", type: "percent" },
    { id: 1, code: "JETSKI2024", title: "Early Bird", discount: "14% OFF", uses: 3, expires: "Mar 12, 2024", type: "percent" },
  ],
  weeklyRevenue: [
    { day: "Mon", revenue: 1240, bookings: 4 }, { day: "Tue", revenue: 2180, bookings: 7 },
    { day: "Wed", revenue: 980, bookings: 3 }, { day: "Thu", revenue: 3420, bookings: 11 },
    { day: "Fri", revenue: 4100, bookings: 13 }, { day: "Sat", revenue: 3800, bookings: 12 },
    { day: "Sun", revenue: 2700, bookings: 9 },
  ],
  upcoming: [
    { activity: "Jet Ski + Aqua Kart", day: "Mar", date: "13", time: "14:00–18:00", booked: 5, cap: 6 },
    { activity: "Buggy + Jet Ski + Aqua Karts", day: "Mar", date: "23", time: "09:00–13:00", booked: 2, cap: 4 },
    { activity: "Buggy & Jet Ski", day: "Mar", date: "15", time: "14:00–18:00", booked: 1, cap: 4 },
    { activity: "Aqua Splash Pack", day: "Mar", date: "17", time: "09:00–13:00", booked: 3, cap: 8 },
    { activity: "Jet Ski + Aqua Kart", day: "Mar", date: "20", time: "09:00–13:00", booked: 0, cap: 6 },
  ],
  waivers: [
    { name: "Tremishea Brady", activity: "Jet Ski + Aqua Kart", signed: "Mar 7, 2026", initials: "TB", hue: 320 },
    { name: "Jose Fuentes", activity: "Buggy + Jet Ski + Aqua Karts", signed: "Mar 6, 2026", initials: "JF", hue: 60 },
    { name: "Jackson Moore", activity: "Buggy + Jet Ski + Aqua Karts", signed: "Feb 27, 2026", initials: "JM", hue: 160 },
    { name: "Jonathan Rivera", activity: "Aqua Splash Pack", signed: "Feb 25, 2026", initials: "JR", hue: 45 },
  ],
  resources: [
    { id: 1, name: "Double Seater Jetski", type: "Watercraft", cap: 2, min: 1, avail: 4, status: "active" },
    { id: 2, name: "Single Seater Jetski", type: "Watercraft", cap: 1, min: 1, avail: 6, status: "active" },
    { id: 3, name: "Banana Boat",          type: "Watercraft", cap: 6, min: 1, avail: 2, status: "active" },
    { id: 4, name: "Speed Boat",           type: "Watercraft", cap: 8, min: 1, avail: 0, status: "maintenance" },
    { id: 5, name: "Rescue Jetski",        type: "Watercraft", cap: 2, min: 1, avail: 1, status: "active" },
    { id: 6, name: "Safety Boat",          type: "Watercraft", cap: 6, min: 1, avail: 0, status: "offline" },
  ],
  staff: [
    { id: 1,  name: "Marcus Alvarez",   role: "Instructor",           hue: 200, activities: ["Guided Jetski Tour","Sunset Jetski Tour"],                         avail: [{ days: "Mon–Fri", hours: "9–5" }, { days: "Sat", hours: "10–6" }, { days: "Sun", hours: "Off" }] },
    { id: 2,  name: "Olivia Chen",      role: "Senior Guide",         hue: 160, activities: ["Guided Jetski Tour","Sunset Jetski Tour","Open Water Rental"],     avail: [{ days: "Mon–Thu", hours: "8–4" }, { days: "Fri", hours: "10–6" }, { days: "Sat", hours: "12–8" }, { days: "Sun", hours: "Off" }] },
    { id: 3,  name: "Daniel Brooks",    role: "Rental Operator",      hue: 35,  activities: ["Open Water Rental","Guided Jetski Tour"],                          avail: [{ days: "Mon–Fri", hours: "9–5" }, { days: "Sat–Sun", hours: "Off" }] },
    { id: 4,  name: "Hannah Rivera",    role: "Dock Manager",         hue: 300, activities: ["Open Water Rental"],                                               avail: [{ days: "Mon–Wed", hours: "8–4" }, { days: "Thu–Sun", hours: "Off" }] },
    { id: 5,  name: "Jason Patel",      role: "Tour Guide",           hue: 50,  activities: ["Guided Jetski Tour","Sunset Jetski Tour"],                         avail: [{ days: "Wed–Sun", hours: "10–6" }, { days: "Mon–Tue", hours: "Off" }] },
    { id: 6,  name: "Sophie Carter",    role: "Instructor",           hue: 270, activities: ["Guided Jetski Tour"],                                              avail: [{ days: "Mon", hours: "Off" }, { days: "Tue–Fri", hours: "9–5" }, { days: "Sat", hours: "10–6" }, { days: "Sun", hours: "Off" }] },
    { id: 7,  name: "Ethan Park",       role: "Equipment Specialist", hue: 185, activities: ["Open Water Rental"],                                               avail: [{ days: "Mon–Fri", hours: "7–3" }, { days: "Sat–Sun", hours: "Off" }] },
    { id: 8,  name: "Maya Thompson",    role: "Guide",                hue: 340, activities: ["Sunset Jetski Tour"],                                              avail: [{ days: "Thu–Sun", hours: "12–8" }, { days: "Mon–Wed", hours: "Off" }] },
    { id: 9,  name: "Ryan Cole",        role: "Instructor",           hue: 120, activities: ["Guided Jetski Tour","Open Water Rental"],                          avail: [{ days: "Mon–Fri", hours: "9–5" }] },
    { id: 10, name: "Isabella Torres",  role: "Tour Guide",           hue: 20,  activities: ["Guided Jetski Tour","Sunset Jetski Tour"],                         avail: [{ days: "Mon–Thu", hours: "10–6" }, { days: "Fri–Sat", hours: "12–8" }, { days: "Sun", hours: "Off" }] },
  ],
  statements: [
    { id: 35, ref: "R2026033975", period: "Feb 1 – Feb 28, 2026", amount: "USD 3,421.00", state: "paid", updated: "2026-03-03" },
    { id: 34, ref: "R2026023873", period: "Jan 1 – Jan 31, 2026", amount: "USD 2,890.00", state: "paid", updated: "2026-02-03" },
    { id: 33, ref: "R2026013767", period: "Dec 1 – Dec 31, 2025", amount: "USD 4,120.00", state: "paid", updated: "2026-01-06" },
    { id: 32, ref: "R2025123647", period: "Nov 1 – Nov 30, 2025", amount: "USD 3,670.00", state: "paid", updated: "2025-12-02" },
    { id: 31, ref: "R2025113536", period: "Oct 1 – Oct 31, 2025", amount: "USD 5,210.00", state: "paid", updated: "2025-11-04" },
    { id: 30, ref: "R2025103428", period: "Sep 1 – Sep 30, 2025", amount: "USD 6,840.00", state: "paid", updated: "2025-10-06" },
    { id: 29, ref: "R2025093303", period: "Jul 8 – Aug 31, 2025", amount: "USD 8,950.00", state: "paid", updated: "2025-10-06" },
    { id: 28, ref: "R2025083183", period: "Jul 1 – Jul 7, 2025", amount: "USD 1,340.00", state: "paid", updated: "2025-08-05" },
  ],
  taxRows: [
    { id: 1002, status: "confirmed", created: "2026-02-27", actDate: "2026-03-04", item: "Buggy & Jet ski / Participant", price: 129.00, discount: 0, taxRate: 0, taxAmt: 0, mode: "included", payRatio: 100, paid: 129.00 },
    { id: 1001, status: "confirmed", created: "2026-02-27", actDate: "2026-03-09", item: "Buggy + Jet Ski + Aqua Karts / Participant", price: 676.00, discount: 67.60, taxRate: 0, taxAmt: 0, mode: "included", payRatio: 100, paid: 608.40 },
    { id: 1000, status: "cancelled", created: "2026-02-27", actDate: "2026-03-09", item: "Aqua Splash Pack / Participant", price: 396.00, discount: 0, taxRate: 0, taxAmt: 0, mode: "included", payRatio: 0, paid: 0 },
    { id: 993, status: "confirmed", created: "2026-02-25", actDate: "2026-02-25", item: "Aqua Splash Pack / Participant", price: 198.00, discount: 0, taxRate: 0, taxAmt: 0, mode: "included", payRatio: 100, paid: 198.00 },
    { id: 992, status: "confirmed", created: "2026-02-25", actDate: "2026-02-26", item: "Buggy & Jet ski / Participant", price: 387.00, discount: 19.35, taxRate: 0, taxAmt: 0, mode: "included", payRatio: 100, paid: 367.65 },
    { id: 989, status: "confirmed", created: "2026-02-25", actDate: "2026-02-25", item: "Buggy + Jet Ski + Aqua Karts / Participant", price: 338.00, discount: 0, taxRate: 0, taxAmt: 0, mode: "included", payRatio: 100, paid: 338.00 },
  ],
  outstanding: [
    { id: 1037, name: "Jaeda Ray", initials: "JR", hue: 25, activity: "Jet Ski + Aqua Kart", due: 58.05, total: 122.55, date: "Mar 13" },
    { id: 1035, name: "Ce'Asia Williams", initials: "CW", hue: 190, activity: "Jet Ski + Aqua Kart", due: 58.05, total: 122.55, date: "Mar 13" },
    { id: 1031, name: "Zakaria Mohamad", initials: "ZM", hue: 140, activity: "Buggy + Jet Ski + Aqua Karts", due: 169.00, total: 338.00, date: "Mar 23" },
  ],
};

// ─── SVG ICONS ──────────────────────────────────────────────────────────────
const I = ({ n, s = 16 }) => {
  const p = {
    grid: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
    cal: "M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
    book: "M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    box: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM12 2l7 4-7 4-7-4 7-4zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
    tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
    bar: "M18 20V10M12 20V4M6 20v-6",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    plus: "M12 5v14M5 12h14",
    search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    person: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12a3 3 0 100-6 3 3 0 000 6z",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    more: "",
    arr: "M5 12h14M12 5l7 7-7 7",
    up: "M7 17l10-10M7 7h10v10",
    down: "M7 7l10 10M17 7H7v10",
    copy: "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",
    check: "M20 6L9 17l-5-5",
    file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6",
    money: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    ticket: "M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z",
  };
  if (n === "more") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={p[n]} />
    </svg>
  );
};

const Sparkline = ({ data, color, h = 36, w = 80 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.1" stroke="none" />
    </svg>
  );
};

// ─── BADGE ───────────────────────────────────────────────────────────────────
const Badge = ({ status }) => (
  <span className={`badge badge-${status}`}>
    <span className="badge-dot" />
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

// ─── PAGES ───────────────────────────────────────────────────────────────────

// Realistic time-series data per metric
const METRIC_SERIES = {
  Revenue: {
    "Last 7 days":  [3820,4250,3640,5100,4780,6200,5940],
    "Last 14 days": [2900,3200,2800,4100,3600,3900,4200,3820,4250,3640,5100,4780,6200,5940],
    "Last 30 days": [2200,2400,1900,2700,2500,2300,3100,2800,3400,3200,2900,3600,3900,4100,3700,4300,3800,4600,4200,5100,4700,5300,4900,5600,5200,6000,5500,6200,5800,6400],
    "This month":   [3100,3400,2900,3800,3600,4200,4000,4500,4300,4900,4700,5200,5000,5500,5300,5800,5600,6100,5900,6400,6200,6700,6500,7000,6800,7300,7100,7600,7400,7900],
  },
  Bookings: {
    "Last 7 days":  [9,11,8,14,12,18,16],
    "Last 14 days": [6,8,7,10,9,11,8,9,11,8,14,12,18,16],
    "Last 30 days": [5,6,5,7,6,7,8,7,9,8,7,9,10,10,9,11,10,12,11,13,12,14,13,15,14,16,15,17,16,18],
    "This month":   [7,8,7,9,8,10,9,11,10,12,11,13,12,14,13,15,14,16,15,17,16,18,17,19,18,20,19,21,20,22],
  },
  "Avg. Value": {
    "Last 7 days":  [340,355,330,380,365,410,395],
    "Last 14 days": [290,310,285,320,305,330,315,340,355,330,380,365,410,395],
    "Last 30 days": [280,295,270,305,290,300,315,310,325,320,310,330,345,340,355,350,360,370,365,380,375,390,385,400,395,408,402,415,409,420],
    "This month":   [310,320,305,335,325,345,340,355,350,365,360,375,370,385,380,395,390,405,400,415,410,420,418,428,422,432,428,438,435,445],
  },
  "Capacity Used": {
    "Last 7 days":  [70,72,68,74,71,76,78],
    "Last 14 days": [64,66,62,68,65,70,67,70,72,68,74,71,76,78],
    "Last 30 days": [58,60,56,62,59,63,61,65,63,67,65,68,66,70,68,71,69,72,70,73,71,74,72,75,73,76,74,77,76,78],
    "This month":   [62,64,61,66,64,68,66,70,68,71,69,72,70,73,71,74,72,75,73,76,74,77,75,78,76,79,77,80,78,81],
  },
};

const DATE_RANGES = ["Last 7 days", "Last 14 days", "Last 30 days", "This month"];

// SVG line chart component
const LineChart = ({ data, color, height = 160, rangeLabel = "Last 30 days" }) => {
  const [hovered, setHovered] = useState(null);
  const w = 520, h = height + 20, pad = { top: 12, right: 12, bottom: 36, left: 44 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const max = Math.max(...data) * 1.1;
  const min = Math.min(...data) * 0.9;
  const dataRange = max - min || 1;
  const xs = data.map((_, i) => pad.left + (i / (data.length - 1)) * innerW);
  const ys = data.map(v => pad.top + innerH - ((v - min) / dataRange) * innerH);
  const linePath = data.map((_, i) => `${i === 0 ? "M" : "L"}${xs[i]},${ys[i]}`).join(" ");
  const areaPath = `${linePath} L${xs[xs.length - 1]},${h - pad.bottom} L${xs[0]},${h - pad.bottom} Z`;

  // Y-axis labels
  const yTicks = [0, 0.5, 1].map(t => ({
    y: pad.top + innerH - t * innerH,
    val: min + t * dataRange,
  }));

  // X-axis labels — show ~5 evenly spaced ticks with smart date labels
  const getXLabels = () => {
    const n = data.length;
    const today = new Date(2026, 2, 8); // March 8, 2026
    const tickCount = Math.min(6, n);
    const indices = Array.from({ length: tickCount }, (_, i) => Math.round(i * (n - 1) / (tickCount - 1)));
    return indices.map(i => {
      const daysBack = n - 1 - i;
      const d = new Date(today);
      d.setDate(d.getDate() - daysBack);
      // Format based on range
      if (rangeLabel.includes("7 days") || rangeLabel.includes("14 days")) {
        return { i, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
      } else if (rangeLabel.includes("month") || rangeLabel.includes("30")) {
        return { i, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
      } else {
        return { i, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
      }
    });
  };
  const xLabels = getXLabels();

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", display: "block" }}
      onMouseLeave={() => setHovered(null)}>
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={pad.left} x2={w - pad.right} y1={t.y} y2={t.y} stroke="rgba(26,23,20,0.06)" strokeWidth="1" />
          <text x={pad.left - 8} y={t.y + 4} textAnchor="end" fontSize="10" fill="var(--ink-4)" fontFamily="monospace">
            {t.val >= 1000 ? `$${(t.val/1000).toFixed(1)}k` : t.val >= 100 ? t.val.toFixed(0) : t.val.toFixed(1)}
          </text>
        </g>
      ))}
      {/* X-axis baseline */}
      <line x1={pad.left} x2={w - pad.right} y1={h - pad.bottom} y2={h - pad.bottom} stroke="rgba(26,23,20,0.08)" strokeWidth="1" />
      {/* X-axis labels */}
      {xLabels.map(({ i, label }) => (
        <text key={i} x={xs[i]} y={h - pad.bottom + 14} textAnchor="middle" fontSize="9.5" fill="var(--ink-4)" fontFamily="monospace">{label}</text>
      ))}
      {/* Area fill */}
      <path d={areaPath} fill={`url(#grad-${color.replace("#","")})`} />
      {/* Line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Hover areas + dots */}
      {data.map((v, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} style={{ cursor: "crosshair" }}>
          <rect x={xs[i] - innerW / data.length / 2} y={pad.top} width={innerW / data.length} height={innerH} fill="transparent" />
          {hovered === i && (
            <>
              <line x1={xs[i]} x2={xs[i]} y1={pad.top} y2={h - pad.bottom} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <circle cx={xs[i]} cy={ys[i]} r="5" fill="white" stroke={color} strokeWidth="2.5" />
              <rect x={Math.min(xs[i] - 30, w - pad.right - 60)} y={ys[i] - 32} width={60} height={22} rx="5" fill="var(--ink)" />
              <text x={Math.min(xs[i], w - pad.right - 30)} y={ys[i] - 17} textAnchor="middle" fontSize="11" fill="white" fontFamily="monospace" fontWeight="600">
                {v >= 1000 ? `$${(v/1000).toFixed(1)}k` : v < 1 ? `${v.toFixed(1)}%` : v.toString()}
              </text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
};

// Custom mini calendar for date range picker — with hover-preview highlighting
const MiniCalendar = ({ month, year, startDate, endDate, onSelect, hoverDate, onHover }) => {
  const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = i - firstDay + 1;
    return d >= 1 && d <= daysInMonth ? new Date(year, month, d) : null;
  });
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
  const isStart = (d) => isSameDay(d, startDate);
  const isEnd = (d) => isSameDay(d, endDate);

  // Determine effective end for range display (endDate if set, else hoverDate if picking)
  const effectiveEnd = endDate || (startDate && !endDate && hoverDate ? hoverDate : null);

  const inRange = (d) => {
    if (!d || !startDate || !effectiveEnd) return false;
    const lo = startDate < effectiveEnd ? startDate : effectiveEnd;
    const hi = startDate < effectiveEnd ? effectiveEnd : startDate;
    return d > lo && d < hi;
  };
  const isEffectiveEnd = (d) => isSameDay(d, effectiveEnd) && !isSameDay(d, startDate);
  const isPreview = (d) => !endDate && inRange(d); // soft highlight when just hovering

  return (
    <div style={{ width: 210 }}>
      <div style={{ textAlign: "center", fontWeight: 600, fontSize: 12.5, color: "var(--ink)", marginBottom: 10, fontFamily: "var(--font-body)" }}>
        {MONTHS[month]} {year}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1 }}>
        {days.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 9.5, color: "var(--ink-4)", fontWeight: 600, padding: "3px 0", marginBottom: 2 }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const selected = isStart(d) || isEnd(d);
          const between = inRange(d);
          const preview = isPreview(d);
          const effEnd = isEffectiveEnd(d);

          let bg = "transparent";
          let textColor = d ? "var(--ink-2)" : "transparent";
          let fw = 400;
          let borderRadius = 6;

          if (selected || effEnd) {
            bg = "var(--ink)";
            textColor = "white";
            fw = 700;
          } else if (between && endDate) {
            bg = "var(--cream-darker)";
          } else if (preview) {
            bg = "var(--cream-dark)";
          }

          return (
            <div key={i}
              onClick={() => d && onSelect(d)}
              onMouseEnter={() => d && onHover && onHover(d)}
              onMouseLeave={() => onHover && onHover(null)}
              style={{
                textAlign: "center", fontSize: 11.5, padding: "5px 2px",
                borderRadius, cursor: d ? "pointer" : "default",
                background: bg, color: textColor, fontWeight: fw,
                transition: "background 0.08s",
              }}
            >
              {d ? d.getDate() : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Navigation targets for each metric label
const METRIC_NAV = {
  "Revenue": "fin-overview",
  "Bookings": "bookings",
  "Avg. Value": "fin-overview",
  "Capacity Used": "bookings",
  "Collected": "fin-overview",
  "Outstanding": "fin-overview",
  "Projected Revenue": "fin-overview",
  "Avg. Booking Value": "fin-overview",
};

const StatModal = ({ metrics, initialIndex, onClose }) => {
  const setPage = useNav();
  const [idx, setIdx] = useState(initialIndex);
  const [range, setRange] = useState("Last 30 days");
  const [appliedRange, setAppliedRange] = useState("Last 30 days");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calStart, setCalStart] = useState(null);
  const [calEnd, setCalEnd] = useState(null);
  const [calHover, setCalHover] = useState(null);
  const [pendingStart, setPendingStart] = useState(null);
  const [pendingEnd, setPendingEnd] = useState(null);
  const [calMonth, setCalMonth] = useState(2);
  const [calYear, setCalYear] = useState(2026);

  const metric = metrics[idx];
  const color = metric.color || "#4A7C6F";
  const seriesKey = metric.label === "Avg. Value" ? "Avg. Value" : metric.label;
  const series = METRIC_SERIES[seriesKey]?.[appliedRange] || metric.spark || [];

  const navTarget = METRIC_NAV[metric.label];

  // Calendar select: pick start then end (pending, not applied yet)
  const handleCalSelect = (d) => {
    if (!pendingStart || (pendingStart && pendingEnd)) {
      setPendingStart(d); setPendingEnd(null); setCalHover(null);
    } else {
      if (d < pendingStart) { setPendingStart(d); setPendingEnd(null); setCalHover(null); }
      else { setPendingEnd(d); setCalHover(null); }
    }
  };

  const handleApply = () => {
    if (pendingStart && pendingEnd) {
      const label = `${pendingStart.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${pendingEnd.toLocaleDateString("en-US",{month:"short",day:"numeric"})}`;
      setRange(label);
      setAppliedRange(label);
    } else if (range !== appliedRange) {
      setAppliedRange(range);
    }
    setShowCalendar(false);
  };

  const handleQuickPreset = (p) => {
    setRange(p);
    setPendingStart(null); setPendingEnd(null); setCalHover(null);
  };

  const canApply = pendingStart && pendingEnd;
  const selectionLabel = pendingStart && pendingEnd
    ? `${pendingStart.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${pendingEnd.toLocaleDateString("en-US",{month:"short",day:"numeric"})}`
    : pendingStart ? `From ${pendingStart.toLocaleDateString("en-US",{month:"short",day:"numeric"})}…` : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: 660, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header" style={{ padding: "18px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setIdx((idx - 1 + metrics.length) % metrics.length)}
              style={{ width: 30, height: 30, borderRadius: 8, background: "var(--cream-dark)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-3)", fontSize: 16, lineHeight: 1, transition: "all 0.15s", flexShrink: 0 }}>‹</button>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-4)" }}>
                {idx + 1} / {metrics.length}
              </div>
              <div className="modal-title" style={{ fontSize: 17, lineHeight: 1.2 }}>{metric.label}</div>
            </div>
            <button onClick={() => setIdx((idx + 1) % metrics.length)}
              style={{ width: 30, height: 30, borderRadius: 8, background: "var(--cream-dark)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-3)", fontSize: 16, lineHeight: 1, transition: "all 0.15s", flexShrink: 0 }}>›</button>
          </div>
          {/* X close button — top right, prominent */}
          <button className="modal-close" onClick={onClose} style={{ width: 34, height: 34, borderRadius: 8, background: "var(--cream-dark)", border: "1.5px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-2)", transition: "all 0.15s", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ padding: "20px 24px 24px" }}>
          {/* Metric hero */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.04em" }}>{metric.value}</div>
            <div className={`stat-change ${metric.up ? "up" : "down"}`} style={{ fontSize: 13 }}>
              <I n={metric.up ? "up" : "down"} s={13} /> {metric.change}
              <span className="stat-sub" style={{ fontSize: 12 }}> {metric.sub}</span>
            </div>
          </div>

          {/* Date range selector row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, position: "relative", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 2, background: "var(--cream-dark)", border: "1px solid var(--border)", borderRadius: 9, padding: 3 }}>
              {DATE_RANGES.map(r => (
                <button key={r} onClick={() => { setRange(r); setAppliedRange(r); setShowCalendar(false); setPendingStart(null); setPendingEnd(null); }}
                  style={{ background: appliedRange === r ? "white" : "none", border: appliedRange === r ? "1px solid var(--border)" : "1px solid transparent", borderRadius: 6, padding: "4px 10px", fontSize: 11.5, color: appliedRange === r ? "var(--ink)" : "var(--ink-4)", cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: appliedRange === r ? "var(--shadow-sm)" : "none", whiteSpace: "nowrap", transition: "all 0.15s" }}>
                  {r}
                </button>
              ))}
            </div>

            {/* Custom range button */}
            <button onClick={() => setShowCalendar(!showCalendar)}
              style={{ display: "flex", alignItems: "center", gap: 5, background: showCalendar ? "var(--ink)" : "var(--cream-dark)", color: showCalendar ? "white" : "var(--ink-3)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 10px", fontSize: 11.5, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s", whiteSpace: "nowrap" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>
              Custom
            </button>

            {/* Calendar popover */}
            {showCalendar && (
              <div onClick={e => e.stopPropagation()}
                style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "white", border: "1.5px solid var(--border-strong)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", padding: 16, zIndex: 300, display: "flex", gap: 0, animation: "slideUp 0.2s cubic-bezier(.4,0,.2,1)", minWidth: 380 }}>
                {/* Quick presets */}
                <div style={{ borderRight: "1px solid var(--border)", paddingRight: 14, marginRight: 14, display: "flex", flexDirection: "column", gap: 2, minWidth: 120 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 8 }}>Quick select</div>
                  {["Today", "Yesterday", "Last 7 days", "Last 14 days", "Last 30 days", "This month", "Last month"].map(p => (
                    <button key={p} onClick={() => handleQuickPreset(p)}
                      style={{ background: range === p ? "var(--cream-dark)" : "none", border: "none", textAlign: "left", padding: "6px 8px", borderRadius: 6, fontSize: 12, color: range === p ? "var(--ink)" : "var(--ink-3)", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: range === p ? 500 : 400, transition: "all 0.1s" }}
                      onMouseEnter={e => { if (range !== p) e.currentTarget.style.background = "var(--cream)"; }}
                      onMouseLeave={e => { if (range !== p) e.currentTarget.style.background = "none"; }}>{p}</button>
                  ))}
                </div>

                {/* Calendar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 18, padding: "0 6px", lineHeight: 1 }}>‹</button>
                    <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 18, padding: "0 6px", lineHeight: 1 }}>›</button>
                  </div>
                  <MiniCalendar month={calMonth} year={calYear} startDate={pendingStart} endDate={pendingEnd} hoverDate={calHover} onHover={setCalHover} onSelect={handleCalSelect} />

                  {/* Selection status + Apply */}
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ fontSize: 11.5, color: selectionLabel ? "var(--ink-2)" : "var(--ink-4)", fontFamily: "var(--font-body)", fontWeight: selectionLabel ? 500 : 400 }}>
                      {selectionLabel || "Click to set start date"}
                    </div>
                    <button onClick={handleApply} disabled={!canApply && range === appliedRange}
                      style={{ background: (canApply || range !== appliedRange) ? "var(--ink)" : "var(--cream-darker)", color: (canApply || range !== appliedRange) ? "white" : "var(--ink-4)", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: (canApply || range !== appliedRange) ? "pointer" : "default", fontFamily: "var(--font-body)", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Line chart */}
          <div style={{ background: "var(--cream)", borderRadius: "var(--radius-sm)", padding: "14px 8px 6px", border: "1px solid var(--border)" }}>
            <LineChart data={series} color={color} height={160} rangeLabel={appliedRange} />
          </div>

          {/* Footer stats row — Peak, Low, Avg + More Info button */}
          <div style={{ display: "flex", alignItems: "stretch", gap: 0, marginTop: 14, background: "var(--cream-dark)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", overflow: "hidden" }}>
            {[
              { label: "Peak", val: series.length ? Math.max(...series) : "—" },
              { label: "Low", val: series.length ? Math.min(...series) : "—" },
              { label: "Avg", val: series.length ? parseFloat((series.reduce((a,b) => a+b,0)/series.length).toFixed(1)) : "—" },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, padding: "12px 16px", borderRight: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
                  {typeof s.val === "number" && s.val >= 1000 ? `$${(s.val/1000).toFixed(1)}k` : s.val}
                </div>
                <div style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
            {/* More Info navigation button */}
            {navTarget && (
              <div style={{ display: "flex", alignItems: "center", padding: "12px 18px", flexShrink: 0 }}>
                <button onClick={() => { onClose(); setPage(navTarget); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--ink)", color: "var(--cream)", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap", transition: "all 0.15s", boxShadow: "var(--shadow-sm)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--ink-2)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  More info <I n="arr" s={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── STRIPE WIDGET ────────────────────────────────────────────────────────────
function StripeWidget() {
  return (
    <div className="payout-card">
      <div className="payout-label">Next Stripe Payout</div>
      <div className="payout-amount">$2,847.30</div>
      <div className="payout-date">Estimated arrival · Mar 12, 2026</div>
      <div className="payout-details">
        {[{ l: "In Transit", v: "$1,290.00" }, { l: "Pending", v: "$1,557.30" }, { l: "Account", v: "BPDODOSX" }].map(d => (
          <div key={d.l}>
            <div className="payout-detail-val">{d.v}</div>
            <div className="payout-detail-lbl">{d.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const [activeMetricIdx, setActiveMetricIdx] = useState(null);
  const actRevMax = Math.max(...DATA.activities.map(a => a.revenue));
  const actColors = ["#4A7C6F", "#3B6FA0", "#C4772A", "#7B5EA7", "#B85C5C", "#9E9892"];

  return (
    <div>
      {activeMetricIdx !== null && <StatModal metrics={DATA.stats} initialIndex={activeMetricIdx} onClose={() => setActiveMetricIdx(null)} />}
      <div className="page-header">
        <div>
          <div className="page-title">Good morning, Pierre</div>
          <div className="page-sub">Jet Ski Punta Cana · Sunday, March 8, 2026</div>
        </div>
        <button className="btn-sage"><I n="plus" s={14} /> New Booking</button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {DATA.stats.map((s, i) => (
          <div key={s.label} className="stat-card" onClick={() => setActiveMetricIdx(i)}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.up ? "up" : "down"}`}>
              <I n={s.up ? "up" : "down"} s={11} /> {s.change} <span className="stat-sub">{s.sub}</span>
            </div>
            <div className="sparkline-wrap"><Sparkline data={s.spark} color={s.color} /></div>
            <div className="stat-card-accent" style={{ background: `linear-gradient(90deg, ${s.color}60, ${s.color}20)` }} />
          </div>
        ))}
      </div>

      {/* Stripe Payout Widget — full width below stat grid */}
      <div style={{ marginBottom: 20 }}>
        <StripeWidget />
      </div>

      {/* Middle row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 20 }}>

        {/* TODAY'S MANIFEST */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Manifest</div>
              <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>Sunday, March 8 · 2 sessions · 7 guests</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-secondary" style={{ fontSize: 11.5, padding: "6px 12px" }}>
                <I n="file" s={13} /> Print
              </button>
              <button className="btn-secondary" style={{ fontSize: 11.5, padding: "6px 12px" }}>
                <I n="copy" s={13} /> Export
              </button>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, padding: "10px 22px", borderBottom: "1px solid var(--border)", background: "var(--cream)" }}>
            {[["W", "Waiver"], ["$", "Balance"], ["✓", "Confirmed"]].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div className="manifest-icon-dot ok" style={{ fontSize: 9 }}>{icon}</div>
                <span style={{ fontSize: 11, color: "var(--ink-4)" }}>{label}</span>
              </div>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
              {[["ok", "All clear"], ["warn", "Needs attention"], ["bad", "Urgent"]].map(([cls, label]) => (
                <div key={cls} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: cls === "ok" ? "var(--sage)" : cls === "warn" ? "var(--amber)" : "var(--rose)" }} />
                  <span style={{ fontSize: 10.5, color: "var(--ink-4)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary strip */}
          <div className="manifest-summary-strip">
            {[
              { val: "7", lbl: "Guests" },
              { val: "9", lbl: "Tickets" },
              { val: "2", lbl: "Waivers ⚠" },
              { val: "3", lbl: "Bal. Due" },
            ].map(s => (
              <div key={s.lbl} className="manifest-summary-item">
                <div className="manifest-summary-val">{s.val}</div>
                <div className="manifest-summary-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Session 1 */}
          <div className="manifest-session-header">
            <span className="manifest-session-label">09:00 – 13:00</span>
            <div className="manifest-session-line" />
            <span style={{ fontSize: 11, color: "var(--ink-4)", flexShrink: 0 }}>Buggy + Jet Ski + Aqua Karts · 3 guests</span>
          </div>
          {DATA.manifest.filter(m => m.session === "09:00–13:00").map(m => (
            <div key={m.id} className="manifest-row">
              <div className="avatar" style={{ background: `hsl(${m.hue},45%,88%)`, color: `hsl(${m.hue},50%,35%)`, width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>{m.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="manifest-name">{m.name}</div>
                <div className="manifest-activity">{m.activity}</div>
              </div>
              <span className="manifest-tickets">{m.tickets}x</span>
              <div className="manifest-icons">
                <div className={`manifest-icon-dot ${m.waiver}`} title="Waiver">W</div>
                <div className={`manifest-icon-dot ${m.balance}`} title="Balance">$</div>
                <div className={`manifest-icon-dot ${m.confirmed}`} title="Confirmed">✓</div>
              </div>
            </div>
          ))}

          {/* Session 2 */}
          <div className="manifest-session-header">
            <span className="manifest-session-label">14:00 – 18:00</span>
            <div className="manifest-session-line" />
            <span style={{ fontSize: 11, color: "var(--ink-4)", flexShrink: 0 }}>Jet Ski + Aqua Kart · 4 guests</span>
          </div>
          {DATA.manifest.filter(m => m.session === "14:00–18:00").map(m => (
            <div key={m.id} className="manifest-row">
              <div className="avatar" style={{ background: `hsl(${m.hue},45%,88%)`, color: `hsl(${m.hue},50%,35%)`, width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>{m.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="manifest-name">{m.name}</div>
                <div className="manifest-activity">{m.activity}</div>
              </div>
              <span className="manifest-tickets">{m.tickets}x</span>
              <div className="manifest-icons">
                <div className={`manifest-icon-dot ${m.waiver}`} title="Waiver">W</div>
                <div className={`manifest-icon-dot ${m.balance}`} title="Balance">$</div>
                <div className={`manifest-icon-dot ${m.confirmed}`} title="Confirmed">✓</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Upcoming Sessions</div>
            <button style={{ background: "none", border: "none", color: "var(--sage)", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-body)" }}>View all <I n="arr" s={12} /></button>
          </div>
          <div className="card-body" style={{ padding: "0 22px" }}>
            {DATA.upcoming.slice(0, 5).map((s, i) => {
              const pct = s.booked / s.cap;
              const color = pct > 0.8 ? "#B85C5C" : pct > 0.4 ? "#C4772A" : "#4A7C6F";
              return (
                <div key={i} className="slot-item">
                  <div className="slot-time-badge">
                    <div className="slot-time-day">{s.day}</div>
                    <div className="slot-time-num">{s.date}</div>
                  </div>
                  <div className="slot-info">
                    <div className="slot-name">{s.activity}</div>
                    <div className="slot-time">{s.time}</div>
                    <div className="slot-bar"><div className="slot-bar-fill" style={{ width: `${pct * 100}%`, background: color }} /></div>
                  </div>
                  <div className="slot-capacity">
                    <div className="slot-cap-num" style={{ color }}>{s.booked}/{s.cap}</div>
                    <div className="slot-cap-pct">{Math.round(pct * 100)}% full</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
        {/* Recent bookings */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Bookings</div>
            <button style={{ background: "none", border: "none", color: "var(--sage)", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 4 }}>All bookings <I n="arr" s={12} /></button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Customer</th><th>Activity</th><th>Date</th><th>Status</th><th>Amount</th></tr></thead>
              <tbody>
                {DATA.bookings.slice(0, 6).map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="avatar" style={{ background: `hsl(${b.hue},45%,88%)`, color: `hsl(${b.hue},50%,35%)` }}>{b.initials}</div>
                        <div><div className="customer-name">{b.name}</div><div className="booking-id">#{b.id}</div></div>
                      </div>
                    </td>
                    <td><div className="activity-name">{b.activity}</div></td>
                    <td><div className="date-cell"><div className="date">{b.date}</div><div className="time">{b.time}</div></div></td>
                    <td><Badge status={b.status} /></td>
                    <td><div className="amount-cell">${b.amount.toFixed(2)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity performance */}
        <div className="card">
          <div className="card-header"><div className="card-title">Revenue by Activity</div></div>
          <div className="card-body">
            {DATA.activities.filter(a => a.revenue > 0).map((a, i) => (
              <div key={a.id} className="progress-bar-wrap">
                <div className="progress-bar-header">
                  <span className="progress-bar-label">{a.name}</span>
                  <span className="progress-bar-val">${a.revenue.toLocaleString()}</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${(a.revenue / actRevMax) * 100}%`, background: actColors[i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bookings() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const tabs = ["all", "confirmed", "pending", "cancelled"];
  const filtered = DATA.bookings.filter(b =>
    (filter === "all" || b.status === filter) &&
    (b.name.toLowerCase().includes(search.toLowerCase()) || b.activity.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bookings</div>
          <div className="page-sub">{DATA.bookings.length} total bookings</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-secondary"><I n="file" s={14} /> Export</button>
          <button className="btn-primary"><I n="plus" s={14} /> Add Booking</button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div className="filter-tabs">
          {tabs.map(t => (
            <button key={t} className={`filter-tab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === "pending" && <span style={{ marginLeft: 4, background: "#C4772A", color: "white", borderRadius: 8, fontSize: 9, padding: "1px 5px", fontFamily: "var(--font-mono)" }}>2</span>}
            </button>
          ))}
        </div>
        <div className="search-bar" style={{ width: 220 }}>
          <I n="search" s={14} /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Customer</th><th>Activity</th><th>Date & Time</th><th>Tickets</th><th>Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td><span className="booking-id">#{b.id}</span></td>
                  <td>
                    <div className="customer-cell">
                      <div className="avatar" style={{ background: `hsl(${b.hue},45%,88%)`, color: `hsl(${b.hue},50%,35%)` }}>{b.initials}</div>
                      <span className="customer-name">{b.name}</span>
                    </div>
                  </td>
                  <td><div className="activity-name">{b.activity}</div></td>
                  <td><div className="date-cell"><div className="date">{b.date}</div><div className="time">{b.time}</div></div></td>
                  <td><span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{b.tickets}</span></td>
                  <td><div className="amount-cell">${b.amount.toFixed(2)}</div></td>
                  <td><Badge status={b.status} /></td>
                  <td>
                    <div className="actions-cell">
                      <div className="tbl-btn"><I n="eye" s={13} /></div>
                      <div className="tbl-btn"><I n="edit" s={13} /></div>
                      <div className="tbl-btn"><I n="more" s={13} /></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><I n="book" s={22} /></div>
              <div className="empty-title">No bookings found</div>
              <div className="empty-sub">Try adjusting your search or filters.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Activities() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Activities</div>
          <div className="page-sub">5 active · 1 inactive</div>
        </div>
        <button className="btn-primary"><I n="plus" s={14} /> New Activity</button>
      </div>

      <div className="activity-grid">
        {DATA.activities.map(a => (
          <div key={a.id} className="activity-card">
            <div className="activity-stripe" style={{ background: a.stripe }} />
            <div className="activity-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="activity-name">{a.name}</div>
                  <Badge status={a.status} />
                </div>
                <div className="tbl-btn"><I n="more" s={14} /></div>
              </div>
              <div className="activity-meta">
                {[{ l: "Bookings", v: a.bookings }, { l: "Revenue", v: a.revenue > 0 ? `$${a.revenue.toLocaleString()}` : "$0" }, { l: "Schedules", v: a.schedules }].map(m => (
                  <div key={m.l} className="activity-metric">
                    <div className="activity-metric-val">{m.v}</div>
                    <div className="activity-metric-lbl">{m.l}</div>
                  </div>
                ))}
              </div>
              <div className="activity-actions">
                <button className="btn-secondary" style={{ flex: 1, justifyContent: "center", padding: "7px 0" }}><I n="cal" s={13} /> Schedules</button>
                <button style={{ flex: 1, justifyContent: "center", display: "flex", alignItems: "center", gap: 6, background: `${a.stripe}15`, border: `1px solid ${a.stripe}40`, color: a.stripe, borderRadius: 9, padding: "7px 0", fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)" }}><I n="edit" s={13} /> Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarPage() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startOffset = 0;
  const totalDays = 31;
  const cells = Array.from({ length: 35 }, (_, i) => {
    const day = i - startOffset + 1;
    return { day, valid: day >= 1 && day <= totalDays };
  });
  const bookingDays = { 3: 2, 6: 3, 7: 5, 9: 4, 13: 6, 15: 1, 17: 3, 20: 2, 23: 2, 26: 2 };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Calendar</div>
          <div className="page-sub">March 2026</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary">← Prev</button>
          <button className="btn-secondary">Today</button>
          <button className="btn-secondary">Next →</button>
        </div>
      </div>

      <div className="calendar-grid">
        {days.map(d => <div key={d} className="cal-header">{d}</div>)}
        {cells.map((c, i) => (
          <div key={i} className={`cal-day ${!c.valid ? "other-month" : ""} ${c.day === 8 ? "today" : ""}`}>
            {c.valid && (
              <>
                <div className="cal-day-num">{c.day}</div>
                {bookingDays[c.day] && (
                  <div className="cal-booking-dot">{bookingDays[c.day]} booking{bookingDays[c.day] > 1 ? "s" : ""}</div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Promotions() {
  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Promotions</div><div className="page-sub">{DATA.promotions.length} active codes</div></div>
        <button className="btn-primary"><I n="plus" s={14} /> New Promo</button>
      </div>

      <div className="promo-grid">
        {DATA.promotions.map(p => (
          <div key={p.id} className="promo-card">
            <div className="promo-code-pill">{p.code}</div>
            <div className="promo-discount">{p.discount}</div>
            <div className="promo-title">{p.title}</div>
            <div className="promo-footer">
              <div>
                <div className="promo-expiry">Expires {p.expires}</div>
                <div className="promo-uses" style={{ marginTop: 2 }}>{p.uses} uses</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <div className="tbl-btn"><I n="copy" s={13} /></div>
                <div className="tbl-btn"><I n="edit" s={13} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Resources() {
  const rules = [
    {
      id: 1,
      title: "Guided Jetski Tour Assignment",
      logic: "When activity = Guided Jetski Tour",
      items: ["1 × Double Seater Jetski", "1 × Staff Instructor"],
    },
    {
      id: 2,
      title: "Open Water Rental Requirement",
      logic: "When activity = Open Water Rental",
      items: ["1 × Single Seater Jetski"],
    },
    {
      id: 3,
      title: "Sunset Tour Boat Requirement",
      logic: "When activity = Sunset Jetski Tour",
      items: ["1 × Speed Boat", "1 × Double Seater Jetski"],
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Resources</div><div className="page-sub">Equipment & asset management</div></div>
        <button className="btn-primary"><I n="plus" s={14} /> New Resource</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {DATA.resources.map(r => (
          <div key={r.id} className="resource-card">
            <div className="resource-icon"><I n="ticket" s={22} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="resource-name">{r.name}</div>
                  <div className="resource-type">Type: {r.type}</div>
                </div>
                <Badge status={r.status} />
              </div>
              <div className="resource-stats">
                {[{ l: "Capacity", v: r.cap }, { l: "Min", v: r.min }, { l: "Availability", v: r.avail }].map(m => (
                  <div key={m.l}><div className="res-stat-val">{m.v}</div><div className="res-stat-lbl">{m.l}</div></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div className="card-title">Resource Management</div>
          <button className="btn-secondary" style={{ fontSize: 12 }}><I n="plus" s={12} /> Add Rule</button>
        </div>
        <div style={{ padding: "8px 22px 22px" }}>
          {rules.map(rule => (
            <div key={rule.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 0", borderBottom: rule.id < rules.length ? "1px solid var(--border)" : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink)", marginBottom: 4 }}>{rule.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 8 }}>{rule.logic}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {rule.items.map((item, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--cream-dark)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 9px", fontSize: 11.5, color: "var(--ink-2)", fontFamily: "var(--font-mono)" }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 16, marginTop: 2 }}>
                <div className="tbl-btn"><I n="edit" s={13} /></div>
                <div className="tbl-btn" style={{ color: "var(--rose)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STAFF ───────────────────────────────────────────────────────────────────

// ─── ACTIVITY CONFIG ─────────────────────────────────────────────────────────
const ACTIVITY_COLORS = {
  "Guided Jetski Tour":  { border: "#3B6FA0", bg: "#EEF3F9", text: "#3B6FA0" },
  "Sunset Jetski Tour":  { border: "#C4772A", bg: "#FBF0E4", text: "#C4772A" },
  "Open Water Rental":   { border: "#4A7C6F", bg: "#EBF3F0", text: "#4A7C6F" },
};
const STAFF_REQUIREMENTS = {
  "Guided Jetski Tour": ["Instructor"],
  "Sunset Jetski Tour": ["Guide"],
  "Open Water Rental":  ["Rental Operator"],
};

// ─── STAFF ASSIGN DROPDOWN ───────────────────────────────────────────────────
const StaffDropdown = ({ sessionId, assigned, onAssign, unavailableIds }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const dropRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (btnRef.current?.contains(e.target) || dropRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <button ref={btnRef} onClick={() => setOpen(o => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", padding: "2px 0", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", color: "var(--sky)" }}>
        <I n="plus" s={10} /> Assign
      </button>
      {open && (
        <div ref={dropRef} style={{ position: "absolute", top: pos.top, left: pos.left, width: 210, background: "white", border: "1.5px solid var(--border-strong)", borderRadius: 10, boxShadow: "0 8px 24px rgba(26,23,20,0.12)", zIndex: 1000, overflow: "hidden", animation: "slideUp 0.12s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px 5px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-4)" }}>Assign staff</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-4)", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {DATA.staff.map(s => {
              const isAssigned = assigned.includes(s.id);
              const isUnavail = unavailableIds.includes(s.id);
              return (
                <div key={s.id}
                  onClick={() => onAssign(sessionId, s.id)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", cursor: "pointer", background: "transparent", opacity: isUnavail ? 0.45 : 1, transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: `hsl(${s.hue},38%,88%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: `hsl(${s.hue},38%,34%)`, flexShrink: 0 }}>
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 400, color: "var(--ink-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-4)" }}>{s.role}{isUnavail ? " · Unavailable" : ""}</div>
                  </div>
                  {isAssigned && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

// ─── SESSION CARD ─────────────────────────────────────────────────────────────
const SessionCard = ({ session, onAssign, onUnassign, unavailableIds }) => {
  const col = ACTIVITY_COLORS[session.activity] || ACTIVITY_COLORS["Guided Jetski Tour"];
  const requiredRoles = STAFF_REQUIREMENTS[session.activity] || [];
  const assignedStaff = DATA.staff.filter(s => session.assigned.includes(s.id));
  const assignedRoles = assignedStaff.map(s => s.role);
  const missingRoles = requiredRoles.filter(r => !assignedRoles.includes(r));
  const isCovered = missingRoles.length === 0;

  return (
    <div style={{ background: "white", border: `1px solid var(--border)`, borderLeft: `3px solid ${col.border}`, borderRadius: 8, boxShadow: "var(--shadow-sm)", marginBottom: 7 }}>
      <div style={{ padding: "8px 10px" }}>

        {/* Staffing readiness badge */}
        <div style={{ marginBottom: 5 }}>
          {isCovered
            ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "var(--sage-bg)", color: "var(--sage)", border: "1px solid rgba(74,124,111,0.2)", borderRadius: 4, padding: "1px 6px", fontSize: 9.5, fontWeight: 700 }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Covered
              </span>
            : <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "var(--amber-bg)", color: "var(--amber)", border: "1px solid rgba(196,119,42,0.2)", borderRadius: 4, padding: "1px 6px", fontSize: 9.5, fontWeight: 700 }}>
                ⚠ Needs Staff
              </span>
          }
        </div>

        {/* Activity name + time */}
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>{session.activity}</div>
        <div style={{ fontSize: 10.5, color: "var(--ink-4)", fontFamily: "var(--font-mono)", marginTop: 1, marginBottom: 6 }}>{session.time}</div>

        {/* Missing roles summary */}
        {!isCovered && (
          <div style={{ fontSize: 10.5, fontWeight: 500, color: "var(--amber)", marginBottom: 6 }}>
            ⚠ {missingRoles.length} role{missingRoles.length > 1 ? "s" : ""} missing
          </div>
        )}

        {/* Assigned staff rows: Name · Role · × */}
        {assignedStaff.map(s => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: `hsl(${s.hue},38%,88%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: `hsl(${s.hue},38%,34%)`, flexShrink: 0 }}>
              {s.name.split(" ").map(n => n[0]).join("")}
            </div>
            <span style={{ fontSize: 11, color: "var(--ink-2)", fontWeight: 500, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
            <span style={{ fontSize: 10, color: "var(--ink-4)", flexShrink: 0 }}>{s.role}</span>
            <button onClick={() => onUnassign(session.id, s.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-5)", fontSize: 13, lineHeight: 1, padding: "0 1px", flexShrink: 0 }}
              title="Remove">×</button>
          </div>
        ))}

        {/* Assign link */}
        <StaffDropdown sessionId={session.id} assigned={session.assigned} onAssign={onAssign} unavailableIds={unavailableIds} />
      </div>
    </div>
  );
};

// ─── WEEK JUMP CALENDAR POPOVER ───────────────────────────────────────────────
const WeekJumpPopover = ({ onJumpToWeek, onClose }) => {
  const ANCHOR = new Date(2026, 2, 9);
  const [calMonth, setCalMonth] = useState(2);
  const [calYear, setCalYear] = useState(2026);
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleSelect = (date) => {
    // Calculate week offset from ANCHOR
    const anchorMon = new Date(ANCHOR);
    const clickedMon = new Date(date);
    // Snap to Monday of selected week
    const dow = clickedMon.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    clickedMon.setDate(clickedMon.getDate() + diff);
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const offset = Math.round((clickedMon - anchorMon) / msPerWeek);
    onJumpToWeek(offset);
    onClose();
  };

  return (
    <div ref={ref} style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: "white", border: "1.5px solid var(--border-strong)", borderRadius: 12, boxShadow: "0 8px 28px rgba(26,23,20,0.12)", zIndex: 500, padding: 14, animation: "slideUp 0.15s cubic-bezier(.4,0,.2,1)", minWidth: 240 }}>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); }}
          className="tbl-btn" style={{ width: 26, height: 26 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{ fontWeight: 600, fontSize: 13, fontFamily: "var(--font-body)", color: "var(--ink)" }}>{MONTHS[calMonth]} {calYear}</span>
        <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); }}
          className="tbl-btn" style={{ width: 26, height: 26 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <MiniCalendar month={calMonth} year={calYear} startDate={null} endDate={null} hoverDate={null} onHover={() => {}} onSelect={handleSelect} />
      <div style={{ marginTop: 8, fontSize: 10.5, color: "var(--ink-4)", textAlign: "center" }}>Click any date to jump to that week</div>
    </div>
  );
};

// ─── STAFF PAGE ───────────────────────────────────────────────────────────────
function Staff() {
  const ANCHOR = new Date(2026, 2, 9);
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState("week");
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  // Staff availability state: id → true (available) | false (unavailable)
  const [availability, setAvailability] = useState(() =>
    Object.fromEntries(DATA.staff.map(s => [s.id, true]))
  );
  const unavailableIds = DATA.staff.filter(s => !availability[s.id]).map(s => s.id);

  const toggleAvail = (id) => setAvailability(prev => ({ ...prev, [id]: !prev[id] }));

  // Sessions
  const seedSessions = () => {
    const base = [];
    const weeks = Array.from({ length: 25 }, (_, i) => i);
    weeks.forEach(wk => {
      base.push({ id: `${wk}-0a`, dayOffset: 0, wk, activity: "Guided Jetski Tour",  time: "09:00 – 10:30", assigned: [1] });
      base.push({ id: `${wk}-0b`, dayOffset: 0, wk, activity: "Open Water Rental",   time: "11:00 – 12:30", assigned: [] });
      base.push({ id: `${wk}-1a`, dayOffset: 1, wk, activity: "Guided Jetski Tour",  time: "09:00 – 10:30", assigned: [6, 9] });
      base.push({ id: `${wk}-1b`, dayOffset: 1, wk, activity: "Sunset Jetski Tour",  time: "18:00 – 19:30", assigned: [] });
      base.push({ id: `${wk}-2a`, dayOffset: 2, wk, activity: "Open Water Rental",   time: "10:00 – 11:30", assigned: [3] });
      base.push({ id: `${wk}-2b`, dayOffset: 2, wk, activity: "Guided Jetski Tour",  time: "14:00 – 15:30", assigned: [] });
      base.push({ id: `${wk}-3a`, dayOffset: 3, wk, activity: "Sunset Jetski Tour",  time: "17:30 – 19:00", assigned: [8] });
      base.push({ id: `${wk}-3b`, dayOffset: 3, wk, activity: "Guided Jetski Tour",  time: "09:00 – 10:30", assigned: [1, 9] });
      base.push({ id: `${wk}-4a`, dayOffset: 4, wk, activity: "Open Water Rental",   time: "11:00 – 12:30", assigned: [7] });
      base.push({ id: `${wk}-4b`, dayOffset: 4, wk, activity: "Guided Jetski Tour",  time: "14:00 – 15:30", assigned: [] });
      base.push({ id: `${wk}-5a`, dayOffset: 5, wk, activity: "Guided Jetski Tour",  time: "09:00 – 10:30", assigned: [1, 6] });
      base.push({ id: `${wk}-5b`, dayOffset: 5, wk, activity: "Sunset Jetski Tour",  time: "18:00 – 19:30", assigned: [2, 8] });
      base.push({ id: `${wk}-6a`, dayOffset: 6, wk, activity: "Open Water Rental",   time: "10:00 – 11:30", assigned: [] });
      base.push({ id: `${wk}-6b`, dayOffset: 6, wk, activity: "Sunset Jetski Tour",  time: "17:00 – 18:30", assigned: [5, 10] });
    });
    return base;
  };

  const [sessions, setSessions] = useState(seedSessions);

  const handleAssign = (sessionId, staffId) => {
    setSessions(prev => prev.map(s =>
      s.id === sessionId
        ? { ...s, assigned: s.assigned.includes(staffId) ? s.assigned.filter(id => id !== staffId) : [...s.assigned, staffId] }
        : s
    ));
  };
  const handleUnassign = (sessionId, staffId) => {
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, assigned: s.assigned.filter(id => id !== staffId) } : s
    ));
  };

  // Date helpers
  const DAYS_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const getWeekStart = (offset) => { const d = new Date(ANCHOR); d.setDate(d.getDate() + offset * 7); return d; };
  const weekStart = getWeekStart(weekOffset);
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; });
  const isToday = (d) => d.toDateString() === new Date(2026,2,9).toDateString();
  const formatShort = (d) => `${d.getDate()} ${MONTHS_FULL[d.getMonth()].slice(0,3)}`;
  const formatFull = (d) => `${MONTHS_FULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  const getSessionsFor = (wk, di) => sessions.filter(s => s.wk === wk && s.dayOffset === di);

  // Overview stats
  const totalStaff = DATA.staff.length;
  const weekSessions = Array.from({length:7},(_,i) => getSessionsFor(weekOffset, i)).flat();

  // Derive covered/needing using same logic as SessionCard badges
  const getSessionCoverage = (session) => {
    const requiredRoles = STAFF_REQUIREMENTS[session.activity] || [];
    const assignedStaff = DATA.staff.filter(s => session.assigned.includes(s.id));
    const assignedRoles = assignedStaff.map(s => s.role);
    const missingRoles = requiredRoles.filter(r => !assignedRoles.includes(r));
    return missingRoles.length === 0;
  };
  const toursCovered = weekSessions.filter(s => getSessionCoverage(s)).length;
  const toursNeedingStaff = weekSessions.filter(s => !getSessionCoverage(s)).length;

  // Ref for scroll-to-first-needing-staff
  const firstNeedsStaffRef = useRef(null);
  const scrollToFirstNeedingStaff = () => {
    if (firstNeedsStaffRef.current) {
      firstNeedsStaffRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Track which session is the first needing staff this week
  const firstNeedsStaffId = weekSessions.find(s => !getSessionCoverage(s))?.id ?? null;

  const overviewCards = [
    { label: "Total Staff",         value: totalStaff,        color: "var(--ink)",   sub: "registered",          onClick: null },
    { label: "Tours Covered",        value: toursCovered,      color: "var(--sage)",  sub: "this week",            onClick: null },
    { label: "Tours Needing Staff",  value: toursNeedingStaff, color: "var(--amber)", sub: "click to find first",  onClick: scrollToFirstNeedingStaff },
  ];

  const staffRules = [
    { id: 1, title: "Instructor Requirement",       logic: "When activity = Guided Jetski Tour", items: ["1 × Instructor"] },
    { id: 2, title: "Sunset Tour Guide Requirement", logic: "When activity = Sunset Jetski Tour",  items: ["1 × Guide"] },
  ];

  return (
    <div>
      {/* ── HEADER ── */}
      <div className="page-header">
        <div>
          <div className="page-title">Staff</div>
          <div className="page-sub">Staff scheduling & assignment</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" style={{ fontSize: 12 }}><I n="users" s={13} /> Roster</button>
          <button className="btn-primary"><I n="plus" s={14} /> New Session</button>
        </div>
      </div>

      {/* ── OVERVIEW CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}>
        {overviewCards.map(c => (
          <div key={c.label}
            onClick={c.onClick || undefined}
            style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 16px", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 12, cursor: c.onClick ? "pointer" : "default", transition: "box-shadow 0.15s" }}
            onMouseEnter={e => { if (c.onClick) e.currentTarget.style.boxShadow = "0 4px 12px rgba(26,23,20,0.1)"; }}
            onMouseLeave={e => { if (c.onClick) e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `${c.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: c.color }}>{c.value}</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{c.label}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-4)", marginTop: 1 }}>{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CALENDAR CONTROLS ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
        {/* Date nav with clickable popover */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setWeekOffset(w => w - 1)} className="tbl-btn" style={{ width: 30, height: 30 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div ref={datePickerRef} style={{ position: "relative" }}>
            <button onClick={() => setShowDatePicker(p => !p)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: showDatePicker ? "var(--cream-darker)" : "var(--cream-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 500, color: "var(--ink)", transition: "all 0.15s" }}>
              <I n="cal" s={13} />
              {view === "week"
                ? `${formatShort(weekDays[0])} – ${formatShort(weekDays[6])}, ${weekDays[0].getFullYear()}`
                : formatFull(weekDays[activeDayIdx])
              }
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showDatePicker && <WeekJumpPopover onJumpToWeek={(offset) => { setWeekOffset(offset); }} onClose={() => setShowDatePicker(false)} />}
          </div>
          <button onClick={() => setWeekOffset(w => w + 1)} className="tbl-btn" style={{ width: 30, height: 30 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button onClick={() => { setWeekOffset(0); setActiveDayIdx(0); }} className="btn-secondary" style={{ fontSize: 11.5, padding: "5px 11px" }}>Today</button>
        </div>

        {/* Legend + view toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(ACTIVITY_COLORS).map(([name, col]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: col.border, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{name}</span>
              </div>
            ))}
          </div>
          <div className="filter-tabs">
            <button className={`filter-tab ${view === "day" ? "active" : ""}`} onClick={() => setView("day")}>Day</button>
            <button className={`filter-tab ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>Week</button>
          </div>
        </div>
      </div>

      {/* ── WEEK VIEW ── */}
      {view === "week" && (
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden", marginBottom: 24 }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "var(--cream)", borderBottom: "2px solid var(--border)" }}>
            {weekDays.map((d, i) => {
              const today = isToday(d);
              return (
                <div key={i} style={{ padding: "10px 10px 8px", borderRight: i < 6 ? "1px solid var(--border)" : "none", textAlign: "center", background: today ? "rgba(59,111,160,0.06)" : "transparent" }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: today ? "var(--sky)" : "var(--ink-4)", marginBottom: 4 }}>{DAYS_SHORT[i]}</div>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: today ? "var(--sky)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: today ? "white" : "var(--ink-2)" }}>{d.getDate()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Session columns */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", alignItems: "start" }}>
            {Array.from({ length: 7 }, (_, i) => {
              const daySessions = getSessionsFor(weekOffset, i);
              const today = isToday(weekDays[i]);
              return (
                <div key={i} style={{ padding: "8px 6px 10px", borderRight: i < 6 ? "1px solid var(--border)" : "none", minHeight: 180, background: today ? "rgba(59,111,160,0.025)" : i % 2 === 0 ? "transparent" : "rgba(26,23,20,0.008)" }}>
                  {daySessions.length === 0
                    ? <div style={{ fontSize: 10.5, color: "var(--ink-5)", textAlign: "center", marginTop: 16 }}>—</div>
                    : daySessions.map(s => {
                        const isFirst = s.id === firstNeedsStaffId;
                        return (
                          <div key={s.id} ref={isFirst ? firstNeedsStaffRef : null}>
                            <SessionCard session={s} onAssign={handleAssign} onUnassign={handleUnassign} unavailableIds={unavailableIds} />
                          </div>
                        );
                      })
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DAY VIEW ── */}
      {view === "day" && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 2, marginBottom: 14, background: "var(--cream-dark)", border: "1px solid var(--border)", borderRadius: 10, padding: 3, width: "fit-content" }}>
            {weekDays.map((d, i) => {
              const active = i === activeDayIdx;
              return (
                <button key={i} onClick={() => setActiveDayIdx(i)}
                  style={{ background: active ? "white" : "none", border: active ? "1px solid var(--border)" : "1px solid transparent", borderRadius: 7, padding: "5px 12px", fontSize: 12.5, fontWeight: active ? 600 : 400, color: active ? "var(--ink)" : "var(--ink-4)", cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: active ? "var(--shadow-sm)" : "none", transition: "all 0.15s" }}>
                  {DAYS_SHORT[i]} {d.getDate()}
                </button>
              );
            })}
          </div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <div className="card-header">
              <div className="card-title">{formatFull(weekDays[activeDayIdx])}</div>
              <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{getSessionsFor(weekOffset, activeDayIdx).length} sessions</div>
            </div>
            <div style={{ padding: "12px 20px 20px" }}>
              {getSessionsFor(weekOffset, activeDayIdx).length === 0 ? (
                <div className="empty-state" style={{ padding: 36 }}>
                  <div className="empty-icon"><I n="cal" s={20} /></div>
                  <div className="empty-title">No sessions</div>
                  <div className="empty-sub">Click + New Session to schedule one.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {getSessionsFor(weekOffset, activeDayIdx).map(s => <SessionCard key={s.id} session={s} onAssign={handleAssign} onUnassign={handleUnassign} unavailableIds={unavailableIds} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STAFF MINI CARDS ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>Staff Overview</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>{DATA.staff.filter(s => availability[s.id]).length} of {totalStaff} available</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {DATA.staff.map(s => {
            const isAvail = availability[s.id];
            return (
              <div key={s.id} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 9, opacity: isAvail ? 1 : 0.6, transition: "opacity 0.2s" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `hsl(${s.hue},38%,88%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 700, color: `hsl(${s.hue},38%,34%)`, flexShrink: 0 }}>
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name.split(" ")[0]}</div>
                  <div style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.role}</div>
                </div>
                {/* Toggle */}
                <div onClick={() => toggleAvail(s.id)}
                  title={isAvail ? "Mark unavailable" : "Mark available"}
                  style={{ width: 28, height: 16, borderRadius: 8, background: isAvail ? "var(--sage)" : "var(--cream-darker)", border: `1px solid ${isAvail ? "var(--sage)" : "var(--border)"}`, position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", top: 2, left: isAvail ? 13 : 2, width: 10, height: 10, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STAFF RULES ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Staff Management</div>
          <button className="btn-secondary" style={{ fontSize: 12 }}><I n="plus" s={12} /> Add Rule</button>
        </div>
        <div style={{ padding: "8px 22px 22px" }}>
          {staffRules.map(rule => (
            <div key={rule.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 0", borderBottom: rule.id < staffRules.length ? "1px solid var(--border)" : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink)", marginBottom: 4 }}>{rule.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 8 }}>{rule.logic}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {rule.items.map((item, i) => (
                    <span key={i} style={{ background: "var(--cream-dark)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 9px", fontSize: 11.5, color: "var(--ink-2)", fontFamily: "var(--font-mono)" }}>{item}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 16, marginTop: 2 }}>
                <div className="tbl-btn"><I n="edit" s={13} /></div>
                <div className="tbl-btn" style={{ color: "var(--rose)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Customers() {
  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Customers</div><div className="page-sub">22 registered customers</div></div>
        <button className="btn-primary"><I n="plus" s={14} /> Add Customer</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>Total Bookings</th><th>Total Spent</th><th>Last Activity</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {DATA.bookings.slice(0, 8).map((b, i) => (
                <tr key={b.id}>
                  <td>
                    <div className="customer-cell">
                      <div className="avatar" style={{ background: `hsl(${b.hue},45%,88%)`, color: `hsl(${b.hue},50%,35%)` }}>{b.initials}</div>
                      <div><div className="customer-name">{b.name}</div><div style={{ fontSize: 11, color: "var(--ink-4)" }}>Customer #{1000 + i}</div></div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{Math.floor(Math.random() * 4) + 1}</span></td>
                  <td><div className="amount-cell">${(b.amount * (Math.floor(Math.random() * 3) + 1)).toFixed(2)}</div></td>
                  <td><div className="date-cell"><div className="date">{b.activity.substring(0, 22)}</div><div className="time">{b.date}</div></div></td>
                  <td><Badge status="confirmed" /></td>
                  <td><div className="actions-cell"><div className="tbl-btn"><I n="eye" s={13} /></div><div className="tbl-btn"><I n="edit" s={13} /></div></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Waivers() {
  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Waivers</div><div className="page-sub">1 unsigned waiver pending</div></div>
        <button className="btn-primary"><I n="plus" s={14} /> New Waiver Template</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Signatures</div></div>
          <div style={{ padding: "0 22px" }}>
            {DATA.waivers.map((w, i) => (
              <div key={i} className="waiver-row">
                <div className="waiver-avatar" style={{ background: `hsl(${w.hue},45%,88%)`, color: `hsl(${w.hue},50%,35%)` }}>{w.initials}</div>
                <div><div className="waiver-name">{w.name}</div><div className="waiver-activity">{w.activity}</div></div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-confirmed"><span className="badge-dot" />Signed</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-4)" }}>{w.signed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Templates</div></div>
          <div style={{ padding: "0 22px" }}>
            {[{ name: "Jet Ski Punta Cana Terms & Conditions", activities: 11 }, { name: "Standard Activity Waiver", activities: 5 }].map((t, i) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: i === 0 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--sage-bg)", border: "1px solid rgba(74,124,111,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sage)" }}><I n="file" s={16} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: "var(--ink)" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>{t.activities} activities</div>
                  </div>
                  <div className="tbl-btn"><I n="eye" s={13} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <div className="page-header"><div className="page-title">Settings</div></div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
        <div>
          {[["Business", "General", "Branding"], ["Payments", "Stripe", "Bank Accounts"], ["Notifications", "Email", "SMS"], ["Advanced", "Users", "API Keys"]].map(([section, ...items]) => (
            <div key={section} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-4)", padding: "4px 10px 6px" }}>{section}</div>
              {items.map(item => (
                <button key={item} style={{ display: "block", width: "100%", textAlign: "left", background: item === "General" ? "var(--cream-dark)" : "none", border: item === "General" ? "1px solid var(--border)" : "1px solid transparent", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: item === "General" ? "var(--ink)" : "var(--ink-3)", cursor: "pointer", fontFamily: "var(--font-body)", marginBottom: 1 }}>{item}</button>
              ))}
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Business Settings</div><button className="btn-sage" style={{ fontSize: 12 }}>Save Changes</button></div>
          <div className="card-body">
            {[["Business Name", "Jet Ski Punta Cana"], ["Website", "jetskipuntacana.roverd.com"], ["Timezone", "UTC-4 (Atlantic Standard Time)"], ["Currency", "USD — US Dollar"], ["Default Language", "English"]].map(([label, value]) => (
              <div key={label} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-3)", marginBottom: 6, letterSpacing: "0.03em" }}>{label}</div>
                <input defaultValue={value} style={{ width: "100%", background: "var(--cream)", border: "1.5px solid var(--border)", borderRadius: 9, padding: "9px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-body)", outline: "none" }}
                  onFocus={e => { e.target.style.borderColor = "var(--sage)"; e.target.style.boxShadow = "0 0 0 3px rgba(74,124,111,0.1)" }}
                  onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FINANCIALS: OVERVIEW ─────────────────────────────────────────────────────
function FinancialsOverview() {
  const [activeMetricIdx, setActiveMetricIdx] = useState(null);
  const totalCollected = 18420;
  const outstanding = DATA.outstanding.reduce((s, o) => s + o.due, 0);
  const projectedRevenue = 4820;
  const avgBookingValue = Math.round(totalCollected / 47); // ~$391
  const discountCost = DATA.taxRows.reduce((s, r) => s + r.discount, 0);
  const actColors = ["#4A7C6F", "#3B6FA0", "#C4772A", "#7B5EA7", "#B85C5C"];

  const finMetrics = [
    { label: "Collected", value: `$${totalCollected.toLocaleString()}`, raw: totalCollected, change: "+14.2%", up: true, sub: "vs last month", color: "#4A7C6F", spark: METRIC_SERIES["Revenue"]["Last 30 days"] },
    { label: "Outstanding", value: `$${outstanding.toFixed(2)}`, raw: outstanding, change: "Needs attention", up: false, sub: "balance due", color: "#C4772A", spark: [80,95,70,110,100,120,115,130,125,140,135,150,145,160,155,170,165,180,175,185] },
    { label: "Projected Revenue", value: `$${projectedRevenue.toLocaleString()}`, raw: projectedRevenue, change: "+8.1%", up: true, sub: "vs last month", color: "#3B6FA0", spark: [2800,3100,2600,3400,3100,3600,3300,3800,3500,4000,3800,4200,4000,4400,4200,4600,4400,4800,4600,4820] },
    { label: "Avg. Booking Value", value: `$${avgBookingValue}`, raw: avgBookingValue, change: "+11.3%", up: true, sub: "vs last month", color: "#7B5EA7", spark: METRIC_SERIES["Avg. Value"]["Last 30 days"] },
  ];

  return (
    <div>
      {activeMetricIdx !== null && <StatModal metrics={finMetrics} initialIndex={activeMetricIdx} onClose={() => setActiveMetricIdx(null)} />}
      <div className="page-header">
        <div>
          <div className="page-title">Financials</div>
          <div className="page-sub">Overview · March 2026</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary"><I n="file" s={14} /> Export</button>
          <div style={{ display: "flex", gap: 4, background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: 4 }}>
            {["This Month", "Last Month", "This Year"].map((t, i) => (
              <button key={t} style={{ background: i === 0 ? "var(--ink)" : "none", color: i === 0 ? "white" : "var(--ink-4)", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: i === 0 ? 500 : 400 }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="fin-hero">
        {finMetrics.map((c, i) => (
          <div key={c.label} className="fin-hero-card" onClick={() => setActiveMetricIdx(i)} style={{ cursor: "pointer" }}>
            <div className="fin-hero-accent" style={{ background: `linear-gradient(90deg, ${c.color}60, ${c.color}20)` }} />
            <div className="fin-hero-eyebrow">{c.label}</div>
            <div className="fin-hero-val">{c.value}</div>
            <div className="fin-hero-sub">{i === 0 ? "Cash in hand this month" : i === 1 ? "3 bookings with balance due" : i === 2 ? "From confirmed future bookings" : "Total revenue ÷ bookings"}</div>
            <div className={`fin-hero-tag ${c.up ? "up" : i === 1 ? "warn" : "down"}`}>{i === 0 ? "+14.2%" : i === 1 ? "Needs attention" : i === 2 ? "If all show up" : `$${avgBookingValue} avg`}</div>
          </div>
        ))}
      </div>

      {/* Payout + Cash Flow */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, marginBottom: 20 }}>
        {/* Stripe payout card */}
        <StripeWidget />

        {/* Cash flow summary */}
        <div className="card">
          <div className="card-header"><div className="card-title">Cash Flow Summary · March</div></div>
          <div className="card-body" style={{ padding: "0 22px" }}>
            {[
              { label: "Gross Revenue", sub: "All confirmed bookings", val: `$${totalCollected.toLocaleString()}`, cls: "green" },
              { label: "Discount Cost", sub: `${DATA.promotions.length} promo codes applied`, val: `-$${discountCost.toFixed(2)}`, cls: "red" },
              { label: "Refunds Issued", sub: "0 refunds this month", val: "$0.00", cls: "" },
              { label: "Cancellation Loss", sub: "1 booking cancelled", val: `-$396.00`, cls: "red" },
              { label: "Net Revenue", sub: "After discounts & losses", val: `$${(totalCollected - discountCost - 396).toFixed(2)}`, cls: "green" },
            ].map((r, i) => (
              <div key={r.label} className="fin-row" style={i === 4 ? { borderTop: "2px solid var(--border)", marginTop: 4, paddingTop: 14 } : {}}>
                <div><div className="fin-row-label" style={i === 4 ? { fontWeight: 600 } : {}}>{r.label}</div><div className="fin-row-sub">{r.sub}</div></div>
                <div className={`fin-row-val ${r.cls}`} style={i === 4 ? { fontSize: 15 } : {}}>{r.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outstanding Balances + Activity Revenue */}
      <div className="fin-section-grid">
        {/* Outstanding */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Outstanding Balances</div>
            <span style={{ background: "var(--amber-bg)", color: "var(--amber)", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "var(--font-mono)" }}>${outstanding.toFixed(2)} owed</span>
          </div>
          <div style={{ padding: "0 22px" }}>
            {DATA.outstanding.map(o => {
              const pct = ((o.total - o.due) / o.total) * 100;
              return (
                <div key={o.id} className="outstanding-item">
                  <div className="avatar" style={{ background: `hsl(${o.hue},45%,88%)`, color: `hsl(${o.hue},50%,35%)`, width: 34, height: 34 }}>{o.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: "var(--ink)" }}>{o.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 1 }}>{o.activity} · {o.date}</div>
                    <div style={{ height: 3, background: "var(--cream-darker)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "var(--sage)", borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, color: "var(--amber)" }}>${o.due.toFixed(2)}</div>
                    <div style={{ fontSize: 10.5, color: "var(--ink-4)", marginTop: 1 }}>of ${o.total.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by activity */}
        <div className="card">
          <div className="card-header"><div className="card-title">Revenue by Activity</div></div>
          <div className="card-body">
            {DATA.activities.filter(a => a.revenue > 0).map((a, i) => {
              const max = 6090;
              return (
                <div key={a.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500 }}>{a.name}</div>
                      <div style={{ fontSize: 10.5, color: "var(--ink-4)", marginTop: 1 }}>{a.bookings} bookings · avg ${(a.revenue / a.bookings).toFixed(0)}/ticket</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13.5, color: "var(--ink)" }}>${a.revenue.toLocaleString()}</div>
                  </div>
                  <div style={{ height: 6, background: "var(--cream-darker)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${(a.revenue / max) * 100}%`, height: "100%", background: actColors[i], borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Discount impact */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Discount Impact</div>
          <div style={{ fontSize: 12, color: "var(--ink-4)" }}>How much are promo codes costing you?</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Code</th><th>Title</th><th>Discount</th><th>Uses</th><th>Revenue Lost (est.)</th><th>Expires</th></tr></thead>
            <tbody>
              {DATA.promotions.map(p => (
                <tr key={p.id}>
                  <td><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, background: "var(--ink)", color: "var(--cream)", padding: "3px 8px", borderRadius: 5 }}>{p.code}</span></td>
                  <td style={{ color: "var(--ink-2)", fontSize: 13 }}>{p.title}</td>
                  <td><span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sage)" }}>{p.discount}</span></td>
                  <td><span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{p.uses}</span></td>
                  <td><span className="fin-row-val red">-${(p.uses * 15 * parseFloat(p.discount) / 100).toFixed(2)}</span></td>
                  <td style={{ color: "var(--ink-4)", fontSize: 12, fontFamily: "var(--font-mono)" }}>{p.expires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── FINANCIALS: STATEMENTS ───────────────────────────────────────────────────
function FinancialStatements() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Financial Statements</div>
          <div className="page-sub">Monthly settlement records from Stripe</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary"><I n="file" s={14} /> Export PDF</button>
          <button className="btn-secondary"><I n="copy" s={14} /> Export CSV</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "YTD Revenue", val: "$6,311.00", sub: "Jan – Mar 2026" },
          { label: "Last Payout", val: "$3,421.00", sub: "Feb 28, 2026 · R2026033975" },
          { label: "Bank Account", val: "BPDODOSX", sub: "Banco Popular Dominicano · USD" },
        ].map(s => (
          <div key={s.label} className="fin-hero-card">
            <div className="fin-hero-eyebrow">{s.label}</div>
            <div className="fin-hero-val">{s.val}</div>
            <div className="fin-hero-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>State</th><th>ID</th><th>Reference</th><th>Period</th><th>Amount</th><th>Updated</th><th></th></tr></thead>
            <tbody>
              {DATA.statements.map(s => (
                <tr key={s.id}>
                  <td><span className={`stmt-state ${s.state}`}>{s.state.charAt(0).toUpperCase() + s.state.slice(1)}</span></td>
                  <td><span className="booking-id">#{s.id}</span></td>
                  <td><span className="stmt-ref">{s.ref}</span></td>
                  <td style={{ color: "var(--ink-2)", fontSize: 13 }}>{s.period}</td>
                  <td><span className="amount-cell">{s.amount}</span></td>
                  <td style={{ color: "var(--ink-4)", fontSize: 12, fontFamily: "var(--font-mono)" }}>{s.updated}</td>
                  <td>
                    <div className="actions-cell">
                      <div className="tbl-btn"><I n="eye" s={13} /></div>
                      <div className="tbl-btn"><I n="file" s={13} /></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── FINANCIALS: TAX REPORT ───────────────────────────────────────────────────
function TaxReport() {
  const [period, setPeriod] = useState("Mar 2026");
  const totalTax = DATA.taxRows.reduce((s, r) => s + r.taxAmt, 0);
  const totalPaid = DATA.taxRows.reduce((s, r) => s + r.paid, 0);
  const totalDiscount = DATA.taxRows.reduce((s, r) => s + r.discount, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tax Report</div>
          <div className="page-sub">Per-booking tax breakdown · exportable for your accountant</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary"><I n="file" s={14} /> Export PDF</button>
          <button className="btn-secondary"><I n="copy" s={14} /> Export CSV</button>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Tax Collected", val: `$${totalTax.toFixed(2)}`, sub: "0% tax rate applied", color: "#4A7C6F" },
          { label: "Total Discounts", val: `-$${totalDiscount.toFixed(2)}`, sub: "Applied across all bookings", color: "#C4772A" },
          { label: "Total Paid Incl. Tax", val: `$${totalPaid.toFixed(2)}`, sub: "Net amount received", color: "#3B6FA0" },
          { label: "Tax Mode", val: "Included", sub: "Tax is built into prices", color: "#7B5EA7" },
        ].map(s => (
          <div key={s.label} className="fin-hero-card">
            <div className="fin-hero-accent" style={{ background: `linear-gradient(90deg, ${s.color}60, ${s.color}20)` }} />
            <div className="fin-hero-eyebrow">{s.label}</div>
            <div className="fin-hero-val">{s.val}</div>
            <div className="fin-hero-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--ink-4)" }}>Period:</span>
          <div style={{ display: "flex", gap: 2, background: "var(--cream-dark)", border: "1px solid var(--border)", borderRadius: 9, padding: 3 }}>
            {["Mar 2026", "Feb 2026", "Jan 2026", "All Time"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{ background: period === p ? "white" : "none", border: period === p ? "1px solid var(--border)" : "1px solid transparent", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: period === p ? "var(--ink)" : "var(--ink-4)", cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: period === p ? "var(--shadow-sm)" : "none" }}>{p}</button>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{DATA.taxRows.length} transactions</div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Status</th><th>Created</th><th>Activity Date</th>
                <th>Item</th><th>Price</th><th>Discount</th><th>Tax Rate</th>
                <th>Tax Amt</th><th>Tax Mode</th><th>Pay Ratio</th><th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {DATA.taxRows.map(r => (
                <tr key={r.id}>
                  <td><span className="booking-id">#{r.id}</span></td>
                  <td><Badge status={r.status} /></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-3)" }}>{r.created}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-3)" }}>{r.actDate}</td>
                  <td style={{ fontSize: 12.5, color: "var(--ink-2)", maxWidth: 200 }}>{r.item}</td>
                  <td><span className="amount-cell">${r.price.toFixed(2)}</span></td>
                  <td style={{ fontFamily: "var(--font-mono)", color: r.discount > 0 ? "var(--rose)" : "var(--ink-4)", fontSize: 13 }}>{r.discount > 0 ? `-$${r.discount.toFixed(2)}` : "—"}</td>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)", fontSize: 13 }}>{r.taxRate}%</td>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)", fontSize: 13 }}>${r.taxAmt.toFixed(2)}</td>
                  <td><span className="tax-mode-pill">{r.mode}</span></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{r.payRatio}%</td>
                  <td><span className="amount-cell" style={{ color: r.paid > 0 ? "var(--sage)" : "var(--ink-4)" }}>${r.paid.toFixed(2)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Totals row */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 32, padding: "14px 22px", borderTop: "2px solid var(--border)", background: "var(--cream)" }}>
          {[
            { label: "Total Discounts", val: `-$${totalDiscount.toFixed(2)}`, color: "var(--rose)" },
            { label: "Total Tax", val: `$${totalTax.toFixed(2)}`, color: "var(--ink-4)" },
            { label: "Total Collected", val: `$${totalPaid.toFixed(2)}`, color: "var(--sage)" },
          ].map(t => (
            <div key={t.label} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{t.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 16, color: t.color }}>{t.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NAV CONFIG ──────────────────────────────────────────────────────────────
// Items with `children` render as collapsible dropdown groups in sidebar
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "grid", section: "Operations" },
  { id: "bookings", label: "Bookings", icon: "book", section: "Operations", badge: 2 },
  { id: "calendar", label: "Calendar", icon: "cal", section: "Operations" },
  { id: "activities", label: "Activities", icon: "zap", section: "Manage" },
  { id: "resources", label: "Resources", icon: "box", section: "Manage" },
  { id: "staff", label: "Staff", icon: "person", section: "Manage" },
  { id: "customers", label: "Customers", icon: "users", section: "Marketing" },
  { id: "promotions", label: "Promotions", icon: "tag", section: "Marketing" },
  { id: "waivers", label: "Waivers", icon: "shield", section: null, badge: 1 },
  {
    id: "financials", label: "Financials", icon: "money", section: "Finance",
    children: [
      { id: "fin-overview", label: "Overview" },
      { id: "fin-statements", label: "Statements" },
      { id: "fin-tax", label: "Tax Report" },
    ]
  },
  { id: "settings", label: "Settings", icon: "settings", section: null },
];

const PAGES = {
  dashboard: Dashboard,
  bookings: Bookings,
  calendar: CalendarPage,
  activities: Activities,
  resources: Resources,
  staff: Staff,
  customers: Customers,
  promotions: Promotions,
  waivers: Waivers,
  "fin-overview": FinancialsOverview,
  "fin-statements": FinancialStatements,
  "fin-tax": TaxReport,
  settings: Settings,
};

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({ financials: false });

  const PageComponent = PAGES[page] || Dashboard;

  // Build grouped sections (flat items only — groups handled separately)
  const sections = {};
  NAV.forEach(n => {
    const s = n.section || "__end";
    if (!sections[s]) sections[s] = [];
    sections[s].push(n);
  });

  // Resolve current page label (could be a child)
  const allItems = NAV.flatMap(n => n.children ? [n, ...n.children] : [n]);
  const currentPage = allItems.find(n => n.id === page);

  const isChildActive = (item) => item.children?.some(c => c.id === page);

  const toggleGroup = (id) => setOpenGroups(g => ({ ...g, [id]: !g[id] }));

  const navChevron = (open) => (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`nav-group-chevron ${open ? "open" : ""}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <NavContext.Provider value={setPage}>
    <>
      <style>{css}</style>
      <div className="app">
        {/* ── SIDEBAR ── */}
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-mark" style={{ background: "none", padding: 0, overflow: "visible" }}>
              {/* Koala logo */}
              <svg width="34" height="34" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                {/* Ears */}
                <circle cx="18" cy="30" r="16" fill="#C8C3BC"/>
                <circle cx="18" cy="30" r="10" fill="#EDE8DF"/>
                <circle cx="82" cy="30" r="16" fill="#C8C3BC"/>
                <circle cx="82" cy="30" r="10" fill="#EDE8DF"/>
                {/* Head */}
                <circle cx="50" cy="52" r="34" fill="#C8C3BC"/>
                {/* Face */}
                <ellipse cx="50" cy="58" rx="22" ry="18" fill="#EDE8DF"/>
                {/* Nose */}
                <ellipse cx="50" cy="50" rx="11" ry="8" fill="#6B6560"/>
                <ellipse cx="47" cy="48" rx="3" ry="2" fill="rgba(255,255,255,0.3)"/>
                {/* Eyes */}
                <circle cx="36" cy="42" r="5" fill="#3D3833"/>
                <circle cx="64" cy="42" r="5" fill="#3D3833"/>
                <circle cx="37.5" cy="40.5" r="1.5" fill="white"/>
                <circle cx="65.5" cy="40.5" r="1.5" fill="white"/>
                {/* Mouth */}
                <path d="M44 57 Q50 63 56 57" fill="none" stroke="#9E9892" strokeWidth="1.5" strokeLinecap="round"/>
                {/* Body */}
                <ellipse cx="50" cy="88" rx="20" ry="14" fill="#C8C3BC"/>
                {/* Arms hint */}
                <ellipse cx="32" cy="82" rx="8" ry="5" fill="#C8C3BC" transform="rotate(-30 32 82)"/>
                <ellipse cx="68" cy="82" rx="8" ry="5" fill="#C8C3BC" transform="rotate(30 68 82)"/>
              </svg>
            </div>
            <div className="logo-text">
              <div className="logo-name">Bookeroo</div>
            </div>
          </div>

          <div className="sidebar-nav">
            {Object.entries(sections).map(([section, items]) => (
              <div key={section}>
                {section !== "__end" && <div className="nav-section-label">{section}</div>}
                {items.map(item => {
                  // Dropdown group item
                  if (item.children) {
                    const isOpen = openGroups[item.id];
                    const hasActive = isChildActive(item);
                    return (
                      <div key={item.id} className="nav-group">
                        <button
                          className={`nav-group-trigger ${isOpen ? "open" : ""} ${hasActive ? "active-group" : ""}`}
                          onClick={() => toggleGroup(item.id)}
                        >
                          <div className="nav-item-icon" style={{ opacity: hasActive || isOpen ? 1 : 0.55, color: hasActive ? "#6A9E90" : "#F5F0E8", flexShrink: 0 }}>
                            <I n={item.icon} s={16} />
                          </div>
                          <span className="nav-item-label" style={{ color: hasActive ? "#F5F0E8" : "rgba(245,240,232,0.6)", fontWeight: hasActive ? 500 : 400 }}>{item.label}</span>
                          {navChevron(isOpen)}
                        </button>
                        <div className={`nav-group-children ${isOpen ? "open" : ""}`}>
                          {item.children.map(child => (
                            <button key={child.id} className={`nav-child ${page === child.id ? "active" : ""}`} onClick={() => setPage(child.id)}>
                              <div className="nav-child-dot" />
                              <span className="nav-child-label">{child.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  // Regular nav item
                  return (
                    <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
                      <div className="nav-item-icon"><I n={item.icon} s={16} /></div>
                      <span className="nav-item-label">{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                      {item.badge && <div className="nav-dot" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">P</div>
              <div className="user-info">
                <div className="user-name">Pierre Roverd</div>
                <div className="user-role">Admin · Jet Ski PC</div>
              </div>
            </div>
          </div>

          <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* ── MAIN ── */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <span style={{ color: "var(--ink-4)", fontSize: 13 }}>Jet Ski PC</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">{currentPage?.label}</span>
            </div>
            <div className="search-bar">
              <I n="search" s={14} />
              <input placeholder="Search bookings, customers, activities…" />
              <span className="search-kbd">⌘K</span>
            </div>
            <div className="topbar-right">
              <div className="icon-btn" style={{ position: "relative" }}>
                <I n="bell" s={16} />
                <div className="notif-dot" />
              </div>
              <div style={{ display: "flex", gap: 4, background: "var(--cream-dark)", border: "1px solid var(--border)", borderRadius: 9, padding: 3 }}>
                {["Today", "Week", "Month"].map((t, i) => (
                  <button key={t} style={{ background: i === 0 ? "white" : "none", border: i === 0 ? "1px solid var(--border)" : "1px solid transparent", borderRadius: 6, padding: "4px 10px", fontSize: 11.5, color: i === 0 ? "var(--ink)" : "var(--ink-4)", cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: i === 0 ? "var(--shadow-sm)" : "none" }}>{t}</button>
                ))}
              </div>
              <button className="btn-sage" style={{ padding: "8px 14px" }}><I n="plus" s={14} /> New Booking</button>
            </div>
          </div>

          <div className="page-content">
            <PageComponent />
          </div>
        </div>
      </div>
    </>
    </NavContext.Provider>
  );
}
