import { useAuth } from '../auth/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';

export function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="header">
      <h1>Cookbook</h1>
      <div className="header-user">
        {loading ? null : user ? (
          <>
            {user.picture && <img src={user.picture} alt="" referrerPolicy="no-referrer" />}
            <span>{user.name}</span>
            <button onClick={logout}>Se déconnecter</button>
          </>
        ) : (
          <GoogleSignInButton />
        )}
      </div>
    </header>
  );
}
