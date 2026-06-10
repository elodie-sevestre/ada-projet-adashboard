// ==================== Composant Categories ====================
// Récupère la liste de toutes les catégories depuis l'API
// et les affiche sous forme de grille de cartes avec leur progression.
//
// Calcule également une progression globale en agrégeant
// total_skills et validated_skills de toutes les catégories.

import { useState, useEffect } from "react";
import { API_URL } from "../api";
import CategoryCard from "./CategoryCard";
import AddSkillForm from "./AddSkillForm";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Erreur :", err);
      }
    };
    fetchCategories();
  }, [refresh]);

  const totalSkills = categories.reduce((sum, c) => sum + parseInt(c.total_skills), 0);
  const validatedSkills = categories.reduce((sum, c) => sum + parseInt(c.validated_skills), 0);
  const globalPercentage = totalSkills === 0 ? 0 : (validatedSkills / totalSkills) * 100;

  return (
    <>
      <h3>Compétences</h3>

      {totalSkills > 0 && (
        <div className="global-progress">
          <div className="global-progress-header">
            <span className="global-progress-label">Progression générale</span>
            <span className="global-progress-detail">
              {validatedSkills} / {totalSkills} compétences validées
            </span>
          </div>
          {/* role="progressbar" pour les lecteurs d'écran */}
          <div
            className="global-progress-track"
            role="progressbar"
            aria-valuenow={Math.round(globalPercentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progression générale : ${Math.round(globalPercentage)}%`}
          >
            <div
              className="global-progress-fill"
              style={{ width: `${globalPercentage}%` }}
            />
          </div>
          <span className="global-progress-pct" aria-hidden="true">
            {globalPercentage.toFixed(0)}%
          </span>
        </div>
      )}

      {/* Formulaire global d'ajout d'une compétence */}
      <AddSkillForm
        categories={categories}
        onSuccess={() => setRefresh((prev) => prev + 1)}
      />

      {/* aria-live annonce les mises à jour au lecteur d'écran */}
      <div
        className="categories-grid"
        aria-live="polite"
        aria-label="Liste des catégories de compétences"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onRefresh={() => setRefresh((prev) => prev + 1)}
          />
        ))}
      </div>
    </>
  );
}

export default Categories;
