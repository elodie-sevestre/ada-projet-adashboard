// ==================== Composant Categories ====================
// Récupère la liste de toutes les catégories depuis l'API
// et les affiche sous forme de grille de cartes avec leur progression.
//
// Calcule également une progression globale en agrégeant
// total_skills et validated_skills de toutes les catégories.
//
// Le state "refresh" est un compteur incrémenté par les composants enfants
// pour forcer un rechargement de la liste (ex : après ajout d'une skill).

import { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Erreur :", err);
      }
    };
    fetchCategories();
  }, [refresh]);

  // Calcul de la progression globale : somme de toutes les catégories
  const totalSkills = categories.reduce(
    (sum, c) => sum + parseInt(c.total_skills),
    0,
  );
  const validatedSkills = categories.reduce(
    (sum, c) => sum + parseInt(c.validated_skills),
    0,
  );
  const globalPercentage =
    totalSkills === 0 ? 0 : (validatedSkills / totalSkills) * 100;

  return (
    <>
      <h3>Compétences</h3>

      {/* Barre de progression globale */}
      {totalSkills > 0 && (
        <div className="global-progress">
          <div className="global-progress-header">
            <span className="global-progress-label">Progression générale</span>
          </div>
          <div className="global-progress-track">
            <div
              className="global-progress-fill"
              style={{ width: `${globalPercentage}%` }}
            />
          </div>
          <span className="global-progress-pct">
            {globalPercentage.toFixed(0)}%
          </span>
        </div>
      )}

      <div className="categories-grid">
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
