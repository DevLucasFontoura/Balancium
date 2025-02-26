import { useState, useEffect } from 'react';
import { 
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createUserDocument = async (user: UserCredential['user'], name: string) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Dados iniciais do usuário
        settings: {
          currency: 'BRL',
          language: 'pt-BR',
          theme: 'light'
        },
        // Você pode adicionar mais campos conforme necessário
      });
    } catch (err) {
      console.error('Erro ao criar documento do usuário:', err);
      throw err;
    }
  };

  const signUp = async ({ name, email, password }: SignUpData): Promise<UserCredential | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug
      console.log('Iniciando criação de usuário');
      console.log('Auth disponível:', !!auth);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário criado com sucesso');
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        console.log('Perfil atualizado com sucesso');
        
        // 3. Criar o documento do usuário no Firestore
        await createUserDocument(userCredential.user, name);
        
        // Redirecionar para o dashboard após criar a conta
        window.location.href = '/dashboard';
      }

      return userCredential;
    } catch (err) {
      console.error('Erro detalhado:', {
        error: err,
        errorCode: (err as AuthError)?.code,
        errorMessage: (err as AuthError)?.message,
        authInstance: !!auth
      });
      
      const firebaseError = err as AuthError;
      let message = 'Ocorreu um erro ao criar a conta';
      
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          message = 'Este email já está em uso';
          break;
        case 'auth/invalid-email':
          message = 'Email inválido';
          break;
        case 'auth/operation-not-allowed':
          message = 'Autenticação por email/senha não está habilitada';
          break;
        case 'auth/weak-password':
          message = 'A senha deve ter pelo menos 6 caracteres';
          break;
        case 'auth/network-request-failed':
          message = 'Erro de conexão. Verifique sua internet';
          break;
        case 'auth/configuration-not-found':
          message = 'Erro de configuração do Firebase. Verifique as credenciais.';
          break;
        default:
          message = `Erro: ${firebaseError.message}`;
          break;
      }
      
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password }: SignInData): Promise<UserCredential | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (err) {
      console.error('Erro detalhado:', err);
      
      const firebaseError = err as AuthError;
      let message = 'Ocorreu um erro ao fazer login';
      
      switch (firebaseError.code) {
        case 'auth/invalid-email':
          message = 'Email inválido';
          break;
        case 'auth/user-disabled':
          message = 'Usuário desativado';
          break;
        case 'auth/user-not-found':
          message = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          message = 'Senha incorreta';
          break;
        default:
          message = `Erro: ${firebaseError.message}`;
          break;
      }
      
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn
  };
} 