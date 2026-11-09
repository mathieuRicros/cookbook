import { useEffect, useState } from 'react';
import { addRecipe, fetchRecipes, type Recipe } from './api/recipes';
import { AddRecipeForm } from './components/AddRecipeForm';
import { RecipeList } from './components/RecipeList';

export function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes().then(setRecipes).catch((e: Error) => setError(e.message));
  }, []);

  async function handleAdd(input: { title: string; description: string }) {
    try {
      const created = await addRecipe(input);
      setRecipes((current) => [...current, created]);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main>
      <h1>Cookbook</h1>
      {error && <p className="error">Erreur : {error}</p>}
      <RecipeList recipes={recipes} />
      <AddRecipeForm onSubmit={handleAdd} />
    </main>
  );
}
