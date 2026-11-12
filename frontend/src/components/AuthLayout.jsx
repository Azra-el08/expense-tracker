import Brand from "./Brand";
import ThemeToggle from "./ThemeToggle";

// The shared frame for the login and register screens
function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-toggle">
        <ThemeToggle />
      </div>
      <div className="auth-card">
        <Brand />
        <h1>{title}</h1>
        <p className="muted auth-subtitle">{subtitle}</p>
        {children}
        <p className="auth-footer">{footer}</p>
      </div>
    </div>
  );
}

export default AuthLayout;
