'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './registroUser.module.css';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { databases } from '@/lib/appwrite';
import { DATABASES, COLLECTIONS } from '@/lib/appwrite';
import { ID } from 'appwrite';

interface FormData {
  name: string;
  email: string;
  password: string;
}

export function Registro() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create user account and sign in
      const newUser = await signUp(formData.email, formData.password, formData.name);
      
      // Create user preferences
      await databases.createDocument(
        DATABASES.MAIN,
        COLLECTIONS.USER_PREFERENCES,
        ID.unique(),
        {
          userId: newUser.$id,
          currency: 'BRL',
          language: 'pt-BR',
          theme: 'system',
          email: formData.email
        }
      );

      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Criar Conta</h1>
        
        <div className={styles.inputGroup}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </button>

        <p className={styles.loginLink}>
          Já tem uma conta?{' '}
          <Link href="/login">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
} 