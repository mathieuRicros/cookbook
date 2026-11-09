import { useState, type FormEvent } from 'react';

interface Props {
  onSubmit: (input: { title: string; description: string }) => Promise<void>;
}

export function AddRecipeForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit({ title, description });
    setTitle('');
    setDescription('');
  }

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre"
        required
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}
