/* WallaTeam — Login / Registro */
/* eslint-disable no-undef */

function WTScreenLogin({ theme }) {
  const [tab, setTab] = React.useState('login');
  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg, color: theme.textPrimary,
      display: 'flex', flexDirection: 'column', fontFamily: WT_FONT,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* gradient hero */}
      <div style={{
        position: 'absolute', top: -120, left: -60, right: -60, height: 360,
        background: `radial-gradient(60% 60% at 50% 40%, ${theme.primary}33 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>
      <div style={{ padding: '36px 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <WTLogo size={68}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: theme.secondary, letterSpacing: -0.5 }}>
            Walla<span style={{ color: theme.primary }}>Team</span>
          </div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>
            Gastos compartidos, sin enredos.
          </div>
        </div>
      </div>

      {/* tab selector */}
      <div style={{
        margin: '32px 24px 0', padding: 4, borderRadius: 14,
        background: theme.surface, display: 'flex', gap: 4,
        border: `1px solid ${theme.border}`,
      }}>
        {['login', 'signup'].map(t => (
          <div key={t} style={{
            flex: 1, textAlign: 'center', padding: '10px 0',
            borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: tab === t ? theme.bg : 'transparent',
            color: tab === t ? theme.primary : theme.textSecondary,
            boxShadow: tab === t ? theme.elev : 'none',
          }}>
            {t === 'login' ? 'Ingresar' : 'Registrarme'}
          </div>
        ))}
      </div>

      {/* form */}
      <div style={{ padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <WTField theme={theme} icon="user" label="Nombre" value="Camila Núñez" hideIfLogin={tab === 'login'}/>
        <WTField theme={theme} icon="mail" label="Email" value="camila@walla.team"/>
        <WTField theme={theme} icon="lock" label="Contraseña" value="••••••••••" trailing={<Icon name="eye-off" size={18} color={theme.textSecondary}/>}/>

        {tab === 'login' && (
          <div style={{ alignSelf: 'flex-end', fontSize: 12, color: theme.primary, fontWeight: 600 }}>
            ¿Olvidaste tu contraseña?
          </div>
        )}

        {/* CTA */}
        <button style={{
          marginTop: 8, padding: '14px', borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 120%)`,
          color: '#fff', fontFamily: WT_FONT, fontSize: 15, fontWeight: 600,
          boxShadow: '0 6px 16px rgba(22,160,133,0.30)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {tab === 'login' ? 'Ingresar' : 'Crear mi cuenta'}
          <Icon name="arrow-right" size={18} color="#fff"/>
        </button>

        {/* divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0', color: theme.textSecondary, fontSize: 11 }}>
          <div style={{ flex: 1, height: 1, background: theme.border }}/>
          <span>o continuar con</span>
          <div style={{ flex: 1, height: 1, background: theme.border }}/>
        </div>

        <button style={{
          padding: '12px', borderRadius: 14, border: `1px solid ${theme.border}`,
          background: theme.bg, color: theme.textPrimary, fontFamily: WT_FONT,
          fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10,
        }}>
          <Icon name="google" size={18}/> Google
        </button>
      </div>

      <div style={{ flex: 1 }}/>
      <div style={{ textAlign: 'center', padding: '12px 24px 20px', fontSize: 12, color: theme.textSecondary }}>
        {tab === 'login' ? '¿Nuevo en WallaTeam?' : '¿Ya tenés cuenta?'}{' '}
        <span style={{ color: theme.primary, fontWeight: 600 }}>
          {tab === 'login' ? 'Crear cuenta' : 'Ingresá'}
        </span>
      </div>
    </div>
  );
}

function WTField({ theme, icon, label, value, trailing, hideIfLogin }) {
  if (hideIfLogin) return null;
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
        background: theme.surface, borderRadius: 12, border: `1px solid ${theme.border}`,
      }}>
        <Icon name={icon} size={18} color={theme.textSecondary}/>
        <span style={{ flex: 1, fontSize: 14, color: theme.textPrimary }}>{value}</span>
        {trailing}
      </div>
    </div>
  );
}

Object.assign(window, { WTScreenLogin });
