/* WallaTeam — Detalle de Wallet (en equipo: Viaje en Familia) */
/* eslint-disable no-undef */

const VIAJE_GASTOS = [
  { id: 'g1', cat: 'Hospedaje', icon: 'home2', amount: 850_000, who: 'Camila', when: 'Mar 18', split: '50/50' },
  { id: 'g2', cat: 'Vuelos ASU-IGU', icon: 'plane', amount: 1_200_000, who: 'Diego', when: 'Mar 15', split: '60/40' },
  { id: 'g3', cat: 'Cena Restaurant', icon: 'food', amount: 320_000, who: 'Sofi', when: 'Mar 17', split: 'Equitativo' },
  { id: 'g4', cat: 'Souvenirs', icon: 'shopping', amount: 180_000, who: 'Camila', when: 'Mar 19', split: '50/50' },
  { id: 'g5', cat: 'Taxi al hotel', icon: 'transport', amount: 95_000, who: 'Diego', when: 'Mar 16', split: 'Equitativo' },
];

function WTScreenWalletDetail({ theme }) {
  const total = VIAJE_GASTOS.reduce((a, b) => a + b.amount, 0);
  const balance = 2_000_000 - total;

  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg, color: theme.textPrimary,
      display: 'flex', flexDirection: 'column', fontFamily: WT_FONT, overflow: 'hidden',
    }}>
      {/* Header with gradient */}
      <div style={{
        padding: '12px 18px 18px',
        background: `linear-gradient(160deg, ${theme.secondary} 0%, ${theme.primary} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow-left" size={20} color="#fff"/>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="settings" size={18} color="#fff"/>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plane" size={26} color="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: 'rgba(46,204,113,0.30)', color: '#fff', letterSpacing: 0.5 }}>
                EQUIPO · 3
              </span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, letterSpacing: -0.3 }}>Viaje en Familia</div>
          </div>
        </div>

        {/* metrics */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Metric label="Presupuesto" value={fmtGsCompact(2_000_000)}/>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.18)' }}/>
          <Metric label="Gastado" value={fmtGsCompact(total)}/>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.18)' }}/>
          <Metric label="Restante" value={fmtGsCompact(balance)} highlight={balance > 0}/>
        </div>

        {/* progress */}
        <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, total / 2_000_000 * 100)}%`, height: '100%', background: theme.accent }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.85, marginTop: 6 }}>
          <span>{Math.round(total / 2_000_000 * 100)}% usado</span>
          <span>15 días restantes</span>
        </div>
      </div>

      {/* members + balance breakdown */}
      <div style={{ padding: '14px 20px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ display: 'flex' }}>
            <WTAvatar name="Camila N" size={28} bg="#16A085" ring={theme.bg}/>
            <div style={{ marginLeft: -8 }}><WTAvatar name="Diego R" size={28} bg="#1F3A5F" ring={theme.bg}/></div>
            <div style={{ marginLeft: -8 }}><WTAvatar name="Sofi N" size={28} bg="#2ECC71" ring={theme.bg}/></div>
          </div>
          <div style={{ fontSize: 12, color: theme.textSecondary }}>Camila, Diego y Sofi</div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.primary }}>+ Invitar</div>
        </div>

        {/* Balance per member */}
        <div style={{ background: theme.surface, borderRadius: 14, border: `1px solid ${theme.border}`, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase' }}>Balance del grupo</div>
          <BalanceLine theme={theme} name="Camila" amount={420_000} status="te deben"/>
          <BalanceLine theme={theme} name="Diego" amount={-310_000} status="debés"/>
          <BalanceLine theme={theme} name="Sofi" amount={-110_000} status="debés"/>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '6px 20px 8px', display: 'flex', gap: 18, borderBottom: `1px solid ${theme.border}` }}>
        <Tab theme={theme} active>Gastos</Tab>
        <Tab theme={theme}>Resumen</Tab>
        <Tab theme={theme}>Miembros</Tab>
      </div>

      {/* expenses */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 14px' }}>
        {VIAJE_GASTOS.map(g => (
          <ExpenseRow key={g.id} theme={theme} g={g}/>
        ))}
      </div>

      <WTBottomNav theme={theme} active="home"/>
    </div>
  );
}

function Metric({ label, value, highlight }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, opacity: 0.75, letterSpacing: 0.4, fontWeight: 600 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2, color: highlight ? '#A8F0CB' : '#fff' }}>{value}</div>
    </div>
  );
}

function BalanceLine({ theme, name, amount, status }) {
  const positive = amount > 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <WTAvatar name={name} size={28} bg={positive ? theme.primary : theme.secondary}/>
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: theme.textPrimary }}>{name}</div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: positive ? theme.accent : theme.danger }}>
          {fmtGs(amount, { sign: true })}
        </div>
        <div style={{ fontSize: 10, color: theme.textSecondary }}>{status}</div>
      </div>
    </div>
  );
}

function Tab({ theme, active, children }) {
  return (
    <div style={{
      padding: '8px 0', fontSize: 13, fontWeight: 600,
      color: active ? theme.primary : theme.textSecondary,
      borderBottom: active ? `2px solid ${theme.primary}` : '2px solid transparent',
      marginBottom: -1,
    }}>{children}</div>
  );
}

function ExpenseRow({ theme, g }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px',
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, background: theme.surface,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={g.icon} size={20} color={theme.primary}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{g.cat}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <span style={{ fontSize: 11, color: theme.textSecondary }}>Pagó {g.who} · {g.when}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5,
            background: theme.chipBg, color: theme.primary, letterSpacing: 0.3,
          }}>{g.split}</span>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>{fmtGsCompact(g.amount)}</div>
    </div>
  );
}

Object.assign(window, { WTScreenWalletDetail });
