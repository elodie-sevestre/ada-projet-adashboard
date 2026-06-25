// ==================== Composant Toast ====================
// Notification temporaire affichée en bas de l'écran.
// Disparaît automatiquement après `duration` ms (défaut : 3000).
//
// Props :
//   - message  : texte à afficher
//   - type     : "error" | "success" (défaut : "error")
//   - onClose  : callback appelé à la fermeture (automatique ou manuelle)
//   - duration : durée en ms avant fermeture automatique (défaut : 3000)

import { useEffect } from "react";

function Toast({ message, type = "error", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`toast toast--${type}`}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Fermer la notification"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
