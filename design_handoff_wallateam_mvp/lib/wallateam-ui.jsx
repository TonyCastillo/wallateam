/* WallaTeam — UI primitives + icons + theme */
/* eslint-disable no-undef */

const WT_THEMES = {
  light: {
    bg: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceAlt: '#F1F4F6',
    border: '#E5E7EB',
    textPrimary: '#2C3E50',
    textSecondary: '#7F8C8D',
    primary: '#16A085',
    primaryDark: '#138D75',
    secondary: '#1F3A5F',
    accent: '#2ECC71',
    danger: '#E74C3C',
    warning: '#F39C12',
    chipBg: 'rgba(22,160,133,0.10)',
    chipBgBlue: 'rgba(31,58,95,0.08)',
    statusBarBg: '#FFFFFF',
    statusBarFg: '#2C3E50',
    appBarBg: '#FFFFFF',
    elev: '0 2px 6px rgba(31,58,95,0.06), 0 1px 2px rgba(31,58,95,0.04)',
    elevHi: '0 8px 24px rgba(31,58,95,0.12)',
  },
  dark: {
    bg: '#0E1B2C',
    surface: '#15263C',
    surfaceAlt: '#1B2E47',
    border: '#243B58',
    textPrimary: '#ECF0F1',
    textSecondary: '#9AA8B6',
    primary: '#16A085',
    primaryDark: '#138D75',
    secondary: '#5DA9E9',
    accent: '#2ECC71',
    danger: '#FF6B5B',
    warning: '#F39C12',
    chipBg: 'rgba(46,204,113,0.14)',
    chipBgBlue: 'rgba(93,169,233,0.16)',
    statusBarBg: '#0E1B2C',
    statusBarFg: '#ECF0F1',
    appBarBg: '#0E1B2C',
    elev: '0 2px 8px rgba(0,0,0,0.4)',
    elevHi: '0 12px 28px rgba(0,0,0,0.5)',
  },
};

const WT_FONT = "'Inter', 'Poppins', 'Roboto', system-ui, -apple-system, sans-serif";

// Format Guaraníes
function fmtGs(n, { sign = false } = {}) {
  const s = Math.abs(Math.round(n)).toLocaleString('es-PY');
  const prefix = sign ? (n < 0 ? '−' : '+') : (n < 0 ? '−' : '');
  return `${prefix}₲ ${s}`;
}
function fmtGsCompact(n) {
  const a = Math.abs(n);
  if (a >= 1_000_000) return `₲ ${(n / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1)}M`;
  if (a >= 1_000) return `₲ ${(n / 1_000).toFixed(0)}k`;
  return `₲ ${n}`;
}

// ── Icons (line icons; minimal) ─────────────────────────────────
function Icon({ name, size = 22, color = 'currentColor', stroke = 1.8 }) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'wallet':
      return (<svg {...p}><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H19a2 2 0 0 1 2 2v2"/><path d="M3 7.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5"/><path d="M21 9.5h-4a3 3 0 0 0 0 6h4z"/><circle cx="17" cy="12.5" r="1" fill={color} stroke="none"/></svg>);
    case 'plus':
      return (<svg {...p}><path d="M12 5v14M5 12h14"/></svg>);
    case 'arrow-left':
      return (<svg {...p}><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>);
    case 'arrow-right':
      return (<svg {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
    case 'chevron-right':
      return (<svg {...p}><path d="m9 6 6 6-6 6"/></svg>);
    case 'chevron-down':
      return (<svg {...p}><path d="m6 9 6 6 6-6"/></svg>);
    case 'users':
      return (<svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
    case 'user':
      return (<svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
    case 'home':
      return (<svg {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>);
    case 'activity':
      return (<svg {...p}><path d="M22 12h-4l-3 9-6-18-3 9H2"/></svg>);
    case 'settings':
      return (<svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>);
    case 'mail':
      return (<svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>);
    case 'lock':
      return (<svg {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>);
    case 'eye':
      return (<svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>);
    case 'google':
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>);
    case 'food':
      return (<svg {...p}><path d="M4 3v8a4 4 0 0 0 4 4v6"/><path d="M8 3v8"/><path d="M16 3c-1.5 0-3 2-3 5s1.5 5 3 5v8"/></svg>);
    case 'shopping':
      return (<svg {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>);
    case 'transport':
      return (<svg {...p}><path d="M5 17h14"/><rect x="3" y="6" width="18" height="11" rx="2"/><path d="M3 11h18"/><circle cx="7.5" cy="14.5" r="1" fill={color} stroke="none"/><circle cx="16.5" cy="14.5" r="1" fill={color} stroke="none"/></svg>);
    case 'home2':
      return (<svg {...p}><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>);
    case 'plane':
      return (<svg {...p}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19.5 2.5S16 1 14.5 2.5L11 6 2.8 4.2 1.5 5.5l6 3-3.5 3.5L1 11l-1 1 3 2 2 3 1-1-1-3 3.5-3.5 3 6 1.3-1.3z"/></svg>);
    case 'gift':
      return (<svg {...p}><path d="M20 12v9H4v-9"/><rect x="2" y="7" width="20" height="5"/><path d="M12 21V7"/><path d="M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></svg>);
    case 'card':
      return (<svg {...p}><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20"/></svg>);
    case 'piggy':
      return (<svg {...p}><path d="M19 8h2v4h-2"/><path d="M3 13a8 8 0 0 1 16 0v3a4 4 0 0 1-4 4h-1l-1 2h-3l-1-2H7a4 4 0 0 1-4-4z"/><circle cx="15" cy="11" r="1" fill={color} stroke="none"/></svg>);
    case 'briefcase':
      return (<svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M2 13h20"/></svg>);
    case 'sparkle':
      return (<svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>);
    case 'check':
      return (<svg {...p}><path d="m5 12 5 5L20 7"/></svg>);
    case 'camera':
      return (<svg {...p}><path d="M3 8h3l2-3h8l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/></svg>);
    case 'calendar':
      return (<svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>);
    case 'tag':
      return (<svg {...p}><path d="M20 12 12 20l-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.2" fill={color} stroke="none"/></svg>);
    case 'split':
      return (<svg {...p}><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>);
    case 'trending':
      return (<svg {...p}><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>);
    case 'bell':
      return (<svg {...p}><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>);
    case 'eye-off':
      return (<svg {...p}><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.5 13.5 0 0 0 2 11s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="M14.12 14.12a3 3 0 0 1-4.24-4.24"/><path d="M2 2l20 20"/></svg>);
    default:
      return null;
  }
}

// ── Logo (W mark) ──────────────────────────────────────────────
function WTLogo({ size = 56, color1 = '#16A085', color2 = '#1F3A5F', color3 = '#2ECC71' }) {
  const id = 'wt' + Math.round(Math.random() * 1e6);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color3}/>
          <stop offset="100%" stopColor={color2}/>
        </linearGradient>
      </defs>
      {/* wallet body */}
      <rect x="6" y="20" width="52" height="36" rx="8" fill="none" stroke={`url(#${id})`} strokeWidth="3"/>
      {/* coin pocket */}
      <path d="M58 32h-8a4 4 0 0 0 0 8h8" fill="none" stroke={color2} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="51" cy="36" r="1.6" fill={color2}/>
      {/* W stylized */}
      <path d="M16 28 L22 46 L28 34 L34 46 L40 28" fill="none" stroke={color2} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/>
      {/* heads (3 dots) */}
      <circle cx="14" cy="14" r="3.5" fill={color3}/>
      <circle cx="32" cy="11" r="3.5" fill={color2}/>
      <circle cx="50" cy="14" r="3.5" stroke={color1} strokeWidth="1" fill="#3B82F6"/>
      {/* arms */}
      <path d="M14 17 L20 22 M32 14 L32 20 M50 17 L44 22" stroke={color2} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ── Avatar ──────────────────────────────────────────────────────
function WTAvatar({ name = 'A', size = 36, bg, fg = '#fff', ring }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg || '#16A085', color: fg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: WT_FONT, fontSize: size * 0.38, fontWeight: 600,
      boxShadow: ring ? `0 0 0 2px ${ring}` : 'none',
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// ── Status bar override (theme-aware, replaces android starter) ─
function WTStatusBar({ theme }) {
  return (
    <div style={{
      height: 28, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 16px',
      fontFamily: WT_FONT, fontSize: 12, fontWeight: 600,
      color: theme.statusBarFg, background: theme.statusBarBg,
      letterSpacing: 0.2,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {/* signal */}
        <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1 9h2V7H1zM5 9h2V5H5zM9 9h2V3H9zM13 9h-2V1h2z" fill={theme.statusBarFg}/></svg>
        {/* wifi */}
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none"><path d="M1 4a8 8 0 0 1 11 0M3 6a5 5 0 0 1 7 0M5 8a2 2 0 0 1 3 0" stroke={theme.statusBarFg} strokeWidth="1.2" strokeLinecap="round"/></svg>
        {/* battery */}
        <svg width="20" height="10" viewBox="0 0 20 10"><rect x="1" y="1" width="16" height="8" rx="1.5" stroke={theme.statusBarFg} strokeWidth="1" fill="none"/><rect x="2.5" y="2.5" width="11" height="5" rx="0.5" fill={theme.statusBarFg}/><rect x="18" y="3.5" width="1.5" height="3" rx="0.5" fill={theme.statusBarFg}/></svg>
      </div>
    </div>
  );
}

function WTNavBar({ theme }) {
  return (
    <div style={{
      height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: theme.bg,
    }}>
      <div style={{ width: 108, height: 4, borderRadius: 2, background: theme.textPrimary, opacity: 0.35 }} />
    </div>
  );
}

// ── Phone shell wrapper (uses theme) ───────────────────────────
function WTPhone({ theme, children, label, sublabel }) {
  return (
    <div style={{
      width: 360, display: 'flex', flexDirection: 'column', gap: 10,
      fontFamily: WT_FONT,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1F3A5F', letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: '#7F8C8D', marginTop: 2 }}>{sublabel}</div>}
      </div>
      <div style={{
        width: 360, height: 740, borderRadius: 36, overflow: 'hidden',
        background: theme.bg,
        border: `9px solid #14202E`,
        boxShadow: '0 30px 60px rgba(31,58,95,0.20), 0 8px 16px rgba(31,58,95,0.10)',
        display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
        position: 'relative',
      }}>
        <WTStatusBar theme={theme} />
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>
        <WTNavBar theme={theme} />
      </div>
    </div>
  );
}

// ── Bottom nav ──────────────────────────────────────────────────
function WTBottomNav({ theme, active = 'home' }) {
  const items = [
    { id: 'home', icon: 'wallet', label: 'Wallets' },
    { id: 'activity', icon: 'activity', label: 'Actividad' },
    { id: 'add', icon: 'plus', label: '' },
    { id: 'stats', icon: 'trending', label: 'Resumen' },
    { id: 'profile', icon: 'user', label: 'Perfil' },
  ];
  return (
    <div style={{
      borderTop: `1px solid ${theme.border}`,
      background: theme.bg,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '8px 6px 10px', position: 'relative',
    }}>
      {items.map(it => {
        if (it.id === 'add') {
          return (
            <div key={it.id} style={{
              width: 52, height: 52, borderRadius: 18,
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(22,160,133,0.35)',
              marginTop: -22,
            }}>
              <Icon name="plus" size={26} color="#fff" stroke={2.4}/>
            </div>
          );
        }
        const isActive = it.id === active;
        return (
          <div key={it.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? theme.primary : theme.textSecondary,
            minWidth: 48,
          }}>
            <Icon name={it.icon} size={22} color={isActive ? theme.primary : theme.textSecondary}/>
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500 }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  WT_THEMES, WT_FONT, fmtGs, fmtGsCompact,
  Icon, WTLogo, WTAvatar, WTStatusBar, WTNavBar, WTPhone, WTBottomNav,
});
