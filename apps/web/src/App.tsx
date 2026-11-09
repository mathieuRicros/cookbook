import { useEffect, useState } from 'react';
import { addRecipe, fetchRecipes, type Recipe } from './api/recipes';
import { useAuth } from './auth/AuthContext';
import { AddRecipeForm } from './components/AddRecipeForm';
import { Header } from './components/Header';
import { RecipeList } from './components/RecipeList';

export function App() {
  const { user, loading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Les recettes ne sont chargées qu'une fois connecté, et vidées à la déconnexion.
  useEffect(() => {
    setError(null);
    if (!user) {
      setRecipes([]);
      return;
    }
    fetchRecipes().then(setRecipes).catch((e: Error) => setError(e.message));
  }, [user]);

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
      {loading ? null : user ? (
        <>
          <h2>Mes recettes</h2>
          <RecipeList recipes={recipes} />
          <AddRecipeForm onSubmit={handleAdd} />
        </>
      ) : (
        <p>Connectez-vous avec Google pour voir et ajouter vos recettes.</p>
      )}
    </main>
  );
}
