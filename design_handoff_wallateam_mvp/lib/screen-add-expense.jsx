/* WallaTeam — Agregar Gasto (con split por porcentajes) */
/* eslint-disable no-undef */

function WTScreenAddExpense({ theme }) {
  const total = 320_000;
  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg, color: theme.textPrimary,
      display: 'flex', flexDirection: 'column', fontFamily: WT_FONT, overflow: 'hidden',
    }}>
      {/* App bar */}
      <div style={{ padding: '14px 18px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}` }}>
          <Icon name="arrow-left" size={20} color={theme.textPrimary}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, letterSpacing: -0.2 }}>Nuevo gasto</div>
          <div style={{ fontSize: 11, color: theme.textSecondary }}>Registrá un movimiento</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '6px 18px 14px' }}>
        {/* Amount big input */}
        <div style={{
          padding: 18, borderRadius: 18, background: theme.surface,
          border: `1px solid ${theme.border}`, marginTop: 6,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, letterSpacing: 0.3, textTransform: 'uppercase' }}>Monto</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: theme.textSecondary }}>₲</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: theme.textPrimary, letterSpacing: -1 }}>320.000</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4,
            padding: '4px 10px', borderRadius: 8, background: theme.chipBg,
            fontSize: 11, fontWeight: 600, color: theme.primary,
          }}>
            <Icon name="tag" size={12} color={theme.primary}/> Guaraníes (PYG)
          </div>
        </div>

        {/* Form fields */}
        <FormRow theme={theme} icon="tag" label="Descripción" value="Cena restaurant" subValue="Comida"/>
        <FormRow theme={theme} icon="wallet" label="Wallet" value="Viaje en Familia"
          chip={{ text: 'EQUIPO', color: theme.secondary, bg: theme.chipBgBlue }}/>
        <FormRow theme={theme} icon="calendar" label="Fecha" value="Hoy · 17 mar 2026" subValue="20:30"/>
        <FormRow theme={theme} icon="user" label="Pagado por" value="Camila Núñez" trailing={<WTAvatar name="Camila N" size={26} bg={theme.primary}/>}/>

        {/* Split */}
        <div style={{ marginTop: 14, padding: 16, borderRadius: 18, background: theme.surface, border: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary }}>Cómo dividir</div>
              <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>Por porcentajes personalizados</div>
            </div>
            <div style={{ display: 'flex', gap: 4, padding: 3, background: theme.bg, borderRadius: 10, border: `1px solid ${theme.border}` }}>
              <SplitMode theme={theme}>=</SplitMode>
              <SplitMode theme={theme} active>%</SplitMode>
              <SplitMode theme={theme}>₲</SplitMode>
            </div>
          </div>

          <SplitRow theme={theme} name="Camila" pct={50} amount={total * 0.5}/>
          <SplitRow theme={theme} name="Diego" pct={30} amount={total * 0.3}/>
          <SplitRow theme={theme} name="Sofi" pct={20} amount={total * 0.2}/>

          <div style={{ marginTop: 12, padding: '10px 12px', background: theme.bg, borderRadius: 10, border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Total asignado</span>
            <span style={{ color: theme.accent, fontWeight: 700 }}>100% · {fmtGs(total)}</span>
          </div>
        </div>

        {/* Note + photo */}
        <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, padding: '12px 14px', borderRadius: 14, background: theme.surface, border: `1px dashed ${theme.border}`, display: 'flex', alignItems: 'center', gap: 8, color: theme.textSecondary, fontSize: 12 }}>
            <Icon name="camera" size={16} color={theme.textSecondary}/> Adjuntar ticket
          </div>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: theme.surface, border: `1px dashed ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={18} color={theme.textSecondary}/>
          </div>
        </div>
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
          <Icon name="check" size={18} color="#fff"/> Guardar gasto
        </button>
      </div>
      <WTNavBar theme={theme}/>
    </div>
  );
}

function FormRow({ theme, icon, label, value, subValue, chip, trailing }) {
  return (
    <div style={{
      marginTop: 10, padding: '12px 14px', borderRadius: 14,
      background: theme.surface, border: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={16} color={theme.primary}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: theme.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{value}</span>
          {chip && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: chip.bg, color: chip.color, letterSpacing: 0.3 }}>{chip.text}</span>
          )}
          {subValue && <span style={{ fontSize: 11, color: theme.textSecondary }}>· {subValue}</span>}
        </div>
      </div>
      {trailing || <Icon name="chevron-right" size={18} color={theme.textSecondary}/>}
    </div>
  );
}

function SplitMode({ theme, children, active }) {
  return (
    <div style={{
      width: 36, padding: '6px 0', textAlign: 'center', borderRadius: 7,
      fontSize: 12, fontWeight: 700,
      background: active ? theme.primary : 'transparent',
      color: active ? '#fff' : theme.textSecondary,
    }}>{children}</div>
  );
}

function SplitRow({ theme, name, pct, amount }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
      <WTAvatar name={name} size={32} bg={theme.primary}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{name}</div>
        <div style={{ height: 5, marginTop: 5, borderRadius: 3, background: theme.bg, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` }}/>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, minWidth: 70, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary }}>{pct}</span>
        <span style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 600 }}>%</span>
      </div>
      <div style={{ minWidth: 64, fontSize: 11, color: theme.textSecondary, textAlign: 'right' }}>
        {fmtGsCompact(amount)}
      </div>
    </div>
  );
}

Object.assign(window, { WTScreenAddExpense });
