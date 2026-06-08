// ==================== Composant Categories ====================
// Récupère la liste de toutes les catégories depuis l'API
// et les affiche sous forme de grille de cartes avec leur progression.
//
// Le state "refresh" est un compteur incrémenté par les composants enfants
// pour forcer un rechargement de la liste (ex : après ajout d'une skill).

import { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";

function Categories() {
  const [categories, setCategories] = useState([]);

  // Compteur utilisé comme déclencheur de rechargement :
  // chaque fois qu'un enfant appelle onRefresh(), refresh s'incrémente
  // ce qui relance le useEffect
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
  }, [refresh]); // se relance à chaque changement de "refresh"

  return (
    <>
      <h3>Compétences</h3>
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
