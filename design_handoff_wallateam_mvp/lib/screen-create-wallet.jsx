/* WallaTeam — Crear Wallet (form) */
/* eslint-disable no-undef */

const WALLET_ICONS = [
  { id: 'piggy', color: '#16A085' },
  { id: 'home2', color: '#1F3A5F' },
  { id: 'plane', color: '#2ECC71' },
  { id: 'briefcase', color: '#138D75' },
  { id: 'gift', color: '#E67E22' },
  { id: 'sparkle', color: '#9B59B6' },
  { id: 'shopping', color: '#E74C3C' },
  { id: 'food', color: '#F39C12' },
];

function WTScreenCreateWallet({ theme }) {
  const [type, setType] = React.useState('team');
  const [iconIdx, setIconIdx] = React.useState(2); // plane
  const selectedIcon = WALLET_ICONS[iconIdx];

  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg, color: theme.textPrimary,
      display: 'flex', flexDirection: 'column', fontFamily: WT_FONT, overflow: 'hidden',
    }}>
      {/* App bar */}
      <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}` }}>
          <Icon name="arrow-left" size={20} color={theme.textPrimary}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, letterSpacing: -0.2 }}>Nueva wallet</div>
          <div style={{ fontSize: 11, color: theme.textSecondary }}>Configurá tu billetera</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 18px 14px' }}>
        {/* Preview header */}
        <div style={{
          marginTop: 4, padding: 18, borderRadius: 18,
          background: `linear-gradient(135deg, ${selectedIcon.color} 0%, ${theme.secondary} 130%)`,
          color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 24px rgba(31,58,95,0.18)',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={selectedIcon.id} size={26} color="#fff"/>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: 'rgba(46,204,113,0.30)', color: '#fff', letterSpacing: 0.5 }}>
                {type === 'team' ? 'EQUIPO · 3' : 'PERSONAL'}
              </span>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, letterSpacing: -0.3 }}>Viaje en Familia</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>Vista previa</div>
            </div>
          </div>
        </div>

        {/* Type selector */}
        <SectionLabel theme={theme}>Tipo de wallet</SectionLabel>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <TypeCard theme={theme} active={type === 'personal'} onClick={() => setType('personal')}
            icon="user" title="Personal" subtitle="Solo para vos"/>
          <TypeCard theme={theme} active={type === 'team'} onClick={() => setType('team')}
            icon="users" title="En equipo" subtitle="Compartida"/>
        </div>

        {/* Name */}
        <SectionLabel theme={theme}>Nombre</SectionLabel>
        <InputBox theme={theme} value="Viaje en Familia" placeholder="Ej: Ahorro, Casa, Vacaciones..." trailing={<span style={{ fontSize: 11, color: theme.textSecondary }}>17/40</span>}/>

        {/* Icon + color */}
        <SectionLabel theme={theme}>Ícono y color</SectionLabel>
        <div style={{ marginTop: 8, padding: 12, borderRadius: 14, background: theme.surface, border: `1px solid ${theme.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
            {WALLET_ICONS.map((it, i) => (
              <div key={i} onClick={() => setIconIdx(i)} style={{
                aspectRatio: '1 / 1', borderRadius: 10,
                background: i === iconIdx ? it.color : `${it.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i === iconIdx ? `0 0 0 2px ${theme.bg}, 0 0 0 4px ${it.color}` : 'none',
                transition: 'all 0.15s',
              }}>
                <Icon name={it.id} size={18} color={i === iconIdx ? '#fff' : it.color}/>
              </div>
            ))}
          </div>
        </div>

        {/* Currency */}
        <SectionLabel theme={theme}>Moneda</SectionLabel>
        <div style={{
          marginTop: 8, padding: '12px 14px', borderRadius: 14, background: theme.surface,
          border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.chipBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: theme.primary }}>₲</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>Guaraníes (PYG)</div>
            <div style={{ fontSize: 11, color: theme.textSecondary }}>Moneda predeterminada</div>
          </div>
          <Icon name="chevron-down" size={18} color={theme.textSecondary}/>
        </div>

        {/* Initial budget */}
        <SectionLabel theme={theme}>Presupuesto / saldo inicial</SectionLabel>
        <div style={{
          marginTop: 8, padding: 16, borderRadius: 14, background: theme.surface,
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: theme.textSecondary }}>₲</span>
            <span style={{ fontSize: 30, fontWeight: 700, color: theme.textPrimary, letterSpacing: -0.8 }}>2.000.000</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['+100k', '+500k', '+1M', '+5M'].map((q, i) => (
              <span key={i} style={{
                fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 8,
                background: theme.bg, color: theme.primary,
                border: `1px solid ${theme.border}`,
              }}>{q}</span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 10, lineHeight: 1.4 }}>
            💡 Es el monto con el que arranca esta wallet. Después podés ajustarlo o agregar ingresos.
          </div>
        </div>

        {/* Members (only if team) */}
        {type === 'team' && (
          <React.Fragment>
            <SectionLabel theme={theme}>Miembros</SectionLabel>
            <div style={{ marginTop: 8, padding: 12, borderRadius: 14, background: theme.surface, border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <MemberRow theme={theme} name="Camila Núñez" role="Admin · vos" bg={theme.primary} you/>
              <MemberRow theme={theme} name="Diego Ruiz" role="Miembro" bg={theme.secondary}/>
              <MemberRow theme={theme} name="Sofía Núñez" role="Miembro" bg={theme.accent}/>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px',
                color: theme.primary, fontSize: 13, fontWeight: 600,
                borderTop: `1px dashed ${theme.border}`, paddingTop: 12, marginTop: 4,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: theme.chipBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="plus" size={16} color={theme.primary}/>
                </div>
                Invitar por email o link
              </div>
            </div>
          </React.Fragment>
        )}

        {/* Optional fields */}
        <SectionLabel theme={theme}>Opcional</SectionLabel>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ToggleRow theme={theme} icon="calendar" title="Fecha objetivo" subtitle="15 abr 2026" active/>
          <ToggleRow theme={theme} icon="bell" title="Avisos de presupuesto" subtitle="Notificar al 80% usado" active/>
          <ToggleRow theme={theme} icon="lock" title="Wallet privada" subtitle="No aparece en resumen general"/>
        </div>

        <div style={{ height: 8 }}/>
      </div>

      {/* CTA */}
      <div style={{ padding: '10px 18px 14px', borderTop: `1px solid ${theme.border}`, background: theme.bg, display: 'flex', gap: 10 }}>
        <button style={{
          flex: 1, padding: '14px', borderRadius: 14, border: `1px solid ${theme.border}`,
          background: theme.surface, color: theme.textPrimary, fontFamily: WT_FONT,
          fontSize: 14, fontWeight: 600,
        }}>Cancelar</button>
        <button style={{
          flex: 2, padding: '14px', borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 130%)`,
          color: '#fff', fontFamily: WT_FONT, fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 6px 16px rgba(22,160,133,0.30)',
        }}>
          <Icon name="check" size={18} color="#fff"/> Crear wallet
        </button>
      </div>
      <WTNavBar theme={theme}/>
    </div>
  );
}

function SectionLabel({ theme, children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: theme.textSecondary,
      letterSpacing: 0.4, textTransform: 'uppercase',
      marginTop: 18, marginBottom: 0,
    }}>{children}</div>
  );
}

function TypeCard({ theme, active, icon, title, subtitle, onClick }) {
  return (
    <div onClick={onClick} style={{
      flex: 1, padding: 14, borderRadius: 14,
      background: active ? theme.chipBg : theme.surface,
      border: active ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: active ? theme.primary : theme.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} color={active ? '#fff' : theme.textPrimary}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: active ? theme.primary : theme.textPrimary }}>{title}</div>
        <div style={{ fontSize: 10, color: theme.textSecondary }}>{subtitle}</div>
      </div>
    </div>
  );
}

function InputBox({ theme, value, placeholder, trailing }) {
  return (
    <div style={{
      marginTop: 8, padding: '12px 14px', borderRadius: 14,
      background: theme.surface, border: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: value ? theme.textPrimary : theme.textSecondary }}>
        {value || placeholder}
      </span>
      {trailing}
    </div>
  );
}

function MemberRow({ theme, name, role, bg, you }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px' }}>
      <WTAvatar name={name} size={32} bg={bg}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{name}</div>
        <div style={{ fontSize: 10, color: theme.textSecondary }}>{role}</div>
      </div>
      {!you && <Icon name="chevron-right" size={16} color={theme.textSecondary}/>}
    </div>
  );
}

function ToggleRow({ theme, icon, title, subtitle, active }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 14, background: theme.surface,
      border: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={16} color={theme.primary}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{title}</div>
        <div style={{ fontSize: 11, color: theme.textSecondary }}>{subtitle}</div>
      </div>
      <div style={{
        width: 38, height: 22, borderRadius: 12, padding: 2,
        background: active ? theme.primary : theme.border,
        display: 'flex', alignItems: 'center',
        justifyContent: active ? 'flex-end' : 'flex-start',
        transition: 'all 0.2s',
      }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
      </div>
    </div>
  );
}

Object.assign(window, { WTScreenCreateWallet });
