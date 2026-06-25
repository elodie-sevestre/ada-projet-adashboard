// ==================== Composant Categories ====================
// Récupère catégories et projets depuis l'API et les distribue aux enfants.
// Charge les projets une seule fois ici pour éviter N fetch dans CategoryCard.
//
// Gère les états de chargement et d'erreur visibles à l'utilisateur.
// Affiche les notifications d'erreur via le composant Toast.

import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../api";
import CategoryCard from "./CategoryCard";
import AddSkillForm from "./AddSkillForm";
import Toast from "./Toast";
import { useToast } from "../hooks/useToast";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        // Charge catégories et projets en parallèle
        const [catRes, projRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/projects`),
        ]);
        const [cats, projs] = await Promise.all([catRes.json(), projRes.json()]);
        setCategories(cats);
        setAllProjects(projs);
      } catch (err) {
        console.error("Erreur :", err);
        setError("Impossible de charger les données. Vérifiez que le serveur est démarré.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  const handleRefresh = useCallback(() => {
    setRefresh((prev) => prev + 1);
  }, []);

  const totalSkills = categories.reduce((sum, c) => sum + parseInt(c.total_skills), 0);
  const validatedSkills = categories.reduce((sum, c) => sum + parseInt(c.validated_skills), 0);
  const globalPercentage = totalSkills === 0 ? 0 : (validatedSkills / totalSkills) * 100;

  return (
    <>
      <h3>Compétences</h3>

      {isLoading && <p className="state-message">Chargement...</p>}
      {error && <p className="state-message state-message--error" role="alert">{error}</p>}

      {!isLoading && !error && (
        <>
          {totalSkills > 0 && (
            <div className="global-progress">
              <div className="global-progress-header">
                <span className="global-progress-label">Progression générale</span>
                <span className="global-progress-detail">
                  {validatedSkills} / {totalSkills} compétences validées
                </span>
              </div>
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

          <AddSkillForm
            categories={categories}
            onSuccess={handleRefresh}
          />

          <div
            className="categories-grid"
            aria-live="polite"
            aria-label="Liste des catégories de compétences"
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                allProjects={allProjects}
                onRefresh={handleRefresh}
                onError={showToast}
              />
            ))}
          </div>
        </>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
}

export default Categories;
