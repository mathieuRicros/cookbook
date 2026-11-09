// Stockage du jeton de session dans le navigateur.
// try/catch : le stockage peut être indisponible (navigation privée, blocage).

const KEY = 'cookbook.token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(KEY, token);
    else localStorage.removeItem(KEY);
  } catch {
    // ignoré : l'utilisateur devra se reconnecter au rechargement
  }
}
