import type { Recipe } from '../api/recipes';

export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) return <p>Aucune recette pour le moment.</p>;

  return (
    <ul className="recipe-list">
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
        </li>
      ))}
    </ul>
  );
}
