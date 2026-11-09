// Types minimaux de la bibliothèque Google Identity Services (chargée par script).

interface GoogleCredentialResponse {
  credential: string;
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: GoogleCredentialResponse) => void;
        }) => void;
        renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        disableAutoSelect: () => void;
      };
    };
  };
}
