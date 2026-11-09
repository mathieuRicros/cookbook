// Bouton « Se connecter avec Google » (Google Identity Services).

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

function loadGoogleScript(): Promise<void> {
  if (window.google) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Impossible de charger Google Sign-In'));
    document.head.appendChild(script);
  });
}

export function GoogleSignInButton() {
  const { loginWithGoogleCredential } = useAuth();
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CLIENT_ID) return;
    loadGoogleScript()
      .then(() => {
        if (!container.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) =>
            loginWithGoogleCredential(response.credential).catch((e: Error) => setError(e.message)),
        });
        window.google.accounts.id.renderButton(container.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
        });
      })
      .catch((e: Error) => setError(e.message));
  }, [loginWithGoogleCredential]);

  if (!CLIENT_ID) return <p className="error">VITE_GOOGLE_CLIENT_ID n’est pas configuré.</p>;

  return (
    <>
      <div ref={container} />
      {error && <p className="error">{error}</p>}
    </>
  );
}
