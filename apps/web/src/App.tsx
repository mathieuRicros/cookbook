import { useEffect, useState } from 'react';
import { addRecipe, fetchRecipes, type Recipe } from './api/recipes';
import { useAuth } from './auth/AuthContext';
import { AddRecipeForm } from './components/AddRecipeForm';
import { Header } from './components/Header';
import { RecipeList } from './components/RecipeList';

export function App() {
  const { user } = useAuth();
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
      <Header />
      {error && <p className="error">Erreur : {error}</p>}
      <RecipeList recipes={recipes} />
      {user ? (
        <AddRecipeForm onSubmit={handleAdd} />
      ) : (
        <p>Connectez-vous avec Google pour ajouter une recette.</p>
      )}
    </main>
  );
}
