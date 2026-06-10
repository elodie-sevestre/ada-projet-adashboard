// ==================== Composant AddSkillForm ====================
// Formulaire global d'ajout d'une compétence depuis la vue Categories.
// Permet de choisir la catégorie dans un select et de saisir la description.
//
// Props :
//   - categories : tableau de catégories (id, name) pour alimenter le select
//   - onSuccess   : callback appelé après création réussie pour rafraîchir la vue

import { useState } from "react";
import { API_URL } from "../api";

function AddSkillForm({ categories, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("La description est requise.");
      return;
    }
    if (!categoryId) {
      setError("Choisir une catégorie.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim(), category_id: parseInt(categoryId) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la création.");
        return;
      }
      // Réinitialisation et fermeture
      setDescription("");
      setCategoryId("");
      setError("");
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="add-skill-global">
      <button
        className="btn-add"
        onClick={() => { setOpen(!open); setError(""); }}
        aria-expanded={open}
        aria-controls="add-skill-global-form"
      >
        + nouvelle compétence
      </button>

      {open && (
        <div
          className="add-skill-global-form"
          id="add-skill-global-form"
          role="form"
          aria-label="Ajouter une compétence"
        >
          <div className="add-skill-global-fields">
            <label htmlFor="global-skill-category">Catégorie</label>
            <select
              id="global-skill-category"
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setError(""); }}
            >
              <option value="" disabled>Choisir une catégorie...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label htmlFor="global-skill-description">Compétence</label>
            <input
              id="global-skill-description"
              type="text"
              placeholder="Je sais..."
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <p className="add-skill-global-error" role="alert">{error}</p>
          )}

          <div className="form-actions">
            <button className="btn-validate" onClick={handleSubmit}>Ajouter</button>
            <button className="btn-cancel" onClick={() => { setOpen(false); setError(""); }}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSkillForm;
