/* WallaTeam — Home (lista de Wallets) */
/* eslint-disable no-undef */

const SAMPLE_WALLETS = [
  { id: 'w1', name: 'Ahorro de Liquidación', balance: 100_000_000, type: 'personal', icon: 'piggy', color: '#16A085', subtitle: 'Personal' },
  { id: 'w2', name: 'Mi Sueldo Mensual', balance: 7_500_000, type: 'personal', icon: 'briefcase', color: '#1F3A5F', subtitle: 'Personal' },
  { id: 'w3', name: 'Viaje en Familia', balance: 2_000_000, type: 'team', icon: 'plane', color: '#2ECC71', subtitle: 'Compartido · 3 miembros', members: ['Camila N.', 'Diego R.', 'Sofi N.'] },
  { id: 'w4', name: 'Casa Compartida', balance: 1_240_000, type: 'team', icon: 'home2', color: '#138D75', subtitle: 'Compartido · 2 miembros', members: ['Camila N.', 'Diego R.'] },
  { id: 'w5', name: 'Gustitos Personales', balance: 5_000_000, type: 'personal', icon: 'gift', color: '#1F3A5F', subtitle: 'Personal' },
  { id: 'w6', name: 'Extras / Freelance', balance: 4_000_000, type: 'personal', icon: 'sparkle', color: '#16A085', subtitle: 'Personal' },
];

function WTScreenHome({ theme }) {
  const totalPersonal = SAMPLE_WALLETS.filter(w => w.type === 'personal').reduce((a, b) => a + b.balance, 0);
  const totalTeam = SAMPLE_WALLETS.filter(w => w.type === 'team').reduce((a, b) => a + b.balance, 0);

  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg, color: theme.textPrimary,
      display: 'flex', flexDirection: 'column', fontFamily: WT_FONT, overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{ padding: '14px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <WTAvatar name="Camila N" size={36} bg={theme.primary}/>
          <div>
            <div style={{ fontSize: 11, color: theme.textSecondary }}>Hola,</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>Camila</div>
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 12, background: theme.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${theme.border}`, position: 'relative',
        }}>
          <Icon name="bell" size={18} color={theme.textPrimary}/>
          <div style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: theme.danger, border: `1.5px solid ${theme.bg}` }}/>
        </div>
      </div>

      {/* scroll body */}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 8 }}>
        {/* Total card */}
        <div style={{ margin: '6px 20px 18px', padding: 18, borderRadius: 20,
          background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 130%)`,
          color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: '0 12px 28px rgba(31,58,95,0.25)',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
          <div style={{ position: 'absolute', right: 30, bottom: -40, width: 100, height: 100, borderRadius: '50%', background: 'rgba(46,204,113,0.18)' }}/>
          <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 500, letterSpacing: 0.4 }}>BALANCE TOTAL</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, letterSpacing: -0.5 }}>{fmtGs(totalPersonal + totalTeam)}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, opacity: 0.75, letterSpacing: 0.3 }}>PERSONAL</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{fmtGsCompact(totalPersonal)}</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, opacity: 0.75, letterSpacing: 0.3 }}>EN EQUIPO</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{fmtGsCompact(totalTeam)}</div>
            </div>
          </div>
        </div>

        {/* quick actions */}
        <div style={{ padding: '0 20px 18px', display: 'flex', gap: 10 }}>
          {[
            { icon: 'plus', label: 'Gasto', primary: true },
            { icon: 'wallet', label: 'Wallet' },
            { icon: 'users', label: 'Invitar' },
            { icon: 'split', label: 'Saldar' },
          ].map((a, i) => (
            <div key={i} style={{
              flex: 1, padding: '10px 6px', borderRadius: 14,
              background: a.primary ? theme.primary : theme.surface,
              border: a.primary ? 'none' : `1px solid ${theme.border}`,
              color: a.primary ? '#fff' : theme.textPrimary,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            }}>
              <Icon name={a.icon} size={18} color={a.primary ? '#fff' : theme.primary}/>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{a.label}</span>
            </div>
          ))}
        </div>

        {/* section: wallets header */}
        <SectionHeader theme={theme} title="Mis wallets" trailing="Ver todas"/>

        {/* wallets list */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SAMPLE_WALLETS.slice(0, 5).map(w => (
            <WalletRow key={w.id} theme={theme} w={w}/>
          ))}
        </div>

        <div style={{ height: 14 }}/>

        {/* Recent activity teaser */}
        <SectionHeader theme={theme} title="Actividad reciente" trailing="Ver todo"/>
        <div style={{ padding: '0 20px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ActivityRow theme={theme} icon="food" cat="Supermercado" wallet="Casa Compartida" amount={-185_000} when="Hoy · 14:20"/>
          <ActivityRow theme={theme} icon="transport" cat="Uber al aeropuerto" wallet="Viaje en Familia" amount={-85_000} when="Ayer · 09:12"/>
        </div>
      </div>

      <WTBottomNav theme={theme} active="home"/>
    </div>
  );
}

function SectionHeader({ theme, title, trailing }) {
  return (
    <div style={{ padding: '6px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary, letterSpacing: -0.2 }}>{title}</div>
      {trailing && <div style={{ fontSize: 12, fontWeight: 600, color: theme.primary }}>{trailing}</div>}
    </div>
  );
}

function WalletRow({ theme, w }) {
  return (
    <div style={{
      padding: 14, borderRadius: 16, background: theme.surface,
      border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${w.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={w.icon} size={22} color={w.color}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 6,
            background: w.type === 'team' ? theme.chipBgBlue : theme.chipBg,
            color: w.type === 'team' ? theme.secondary : theme.primary,
          }}>
            {w.type === 'team' ? 'EQUIPO' : 'PERSONAL'}
          </span>
          <span style={{ fontSize: 11, color: theme.textSecondary }}>{w.subtitle.replace(/^(Personal|Compartido · )/, m => m === 'Personal' ? '' : m)}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>{fmtGsCompact(w.balance)}</div>
        <div style={{ fontSize: 10, color: theme.textSecondary }}>disponible</div>
      </div>
    </div>
  );
}

function ActivityRow({ theme, icon, cat, wallet, amount, when }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: theme.surfaceAlt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} color={theme.textPrimary}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{cat}</div>
        <div style={{ fontSize: 11, color: theme.textSecondary }}>{wallet} · {when}</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: amount < 0 ? theme.danger : theme.accent }}>
        {fmtGs(amount, { sign: true })}
      </div>
    </div>
  );
}

Object.assign(window, { WTScreenHome, SAMPLE_WALLETS });
