// ==================== Composant AddSkillForm ====================
// Formulaire global d'ajout d'une compétence depuis la vue Categories.
// Le champ catégorie est un input texte libre :
//   - si la catégorie existe déjà (recherche insensible à la casse) → on réutilise son id
//   - si elle n'existe pas → on la crée via POST /categories, puis on crée la skill
//
// Props :
//   - categories : tableau de catégories (id, name) pour la recherche d'existant
//   - onSuccess   : callback appelé après création réussie pour rafraîchir la vue

import { useState } from "react";
import { API_URL } from "../api";

function AddSkillForm({ categories, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("La description est requise.");
      return;
    }
    if (!categoryName.trim()) {
      setError("La catégorie est requise.");
      return;
    }

    try {
      // Cherche si la catégorie existe déjà (insensible à la casse)
      const existing = categories.find(
        (c) => c.name.toLowerCase() === categoryName.trim().toLowerCase(),
      );

      let categoryId;

      if (existing) {
        // Catégorie trouvée → on réutilise son id
        categoryId = existing.id;
      } else {
        // Catégorie inconnue → on la crée
        const catRes = await fetch(`${API_URL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName.trim() }),
        });
        if (!catRes.ok) {
          const data = await catRes.json();
          setError(data.error || "Erreur lors de la création de la catégorie.");
          return;
        }
        const newCategory = await catRes.json();
        categoryId = newCategory.id;
      }

      // Crée la skill dans la catégorie (nouvelle ou existante)
      const skillRes = await fetch(`${API_URL}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          category_id: categoryId,
        }),
      });
      if (!skillRes.ok) {
        const data = await skillRes.json();
        setError(data.error || "Erreur lors de la création de la compétence.");
        return;
      }

      // Réinitialisation et fermeture
      setDescription("");
      setCategoryName("");
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
        onClick={() => {
          setOpen(!open);
          setError("");
        }}
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
            <input
              id="global-skill-category"
              type="text"
              placeholder="HTML/CSS, JavaScript..."
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            <label htmlFor="global-skill-description">Compétence</label>
            <input
              id="global-skill-description"
              type="text"
              placeholder="Je sais..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <p className="add-skill-global-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <button className="btn-validate" onClick={handleSubmit}>
              Ajouter
            </button>
            <button
              className="btn-cancel"
              onClick={() => {
                setOpen(false);
                setError("");
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSkillForm;
