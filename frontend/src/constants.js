// ==================== Constantes partagées ====================
// Ce fichier centralise les valeurs utilisées dans plusieurs composants.
// Importer ici plutôt que de les redéfinir localement évite les divergences.

// Palette de couleurs désaturées pour les cartes catégorie.
// Utilisée dans CategoryCard et SkillPopup (bordure supérieure de la popup).
// L'index est calculé par : category.id % CARD_COLORS.length
export const CARD_COLORS = [
  "#D6E8F0",
  "#F0DDE6",
  "#D4ECD2",
  "#F0ECD4",
  "#E4D8EE",
  "#EFE0C8",
];
