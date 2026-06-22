// ==================== Hook useToast ====================
// Centralise la logique d'affichage des notifications toast.
// Retourne :
//   - toast    : { message, type } | null — état courant du toast
//   - showToast(message, type?) — déclenche l'affichage
//   - hideToast() — ferme le toast

import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "error") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}
