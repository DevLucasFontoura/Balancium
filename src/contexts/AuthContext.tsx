'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Models } from 'appwrite';
import { account } from '@/lib/appwrite';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<Models.User<Models.Preferences>>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rotas que não requerem autenticação
const publicRoutes = [
    '/',
    '/login',
    '/registro',
    '/bem-vindo',
    '/recursos',
    '/precos',
    '/como-funciona'
];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const isPublicRoute = (path: string | null) => {
        if (!path) return false;
        // Remove trailing slash for consistency
        const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
        const isPublic = publicRoutes.some(route => {
            const normalizedRoute = route.endsWith('/') ? route.slice(0, -1) : route;
            return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
        });
        console.log('Rota atual:', path, 'É pública:', isPublic);
        return isPublic;
    };

    useEffect(() => {
        let mounted = true;
        console.log('AuthContext - pathname:', pathname);

        const init = async () => {
            // Verifica se é uma rota pública antes de qualquer coisa
            const isPublic = isPublicRoute(pathname);
            
            if (isPublic) {
                console.log('Rota pública detectada, ignorando verificação de autenticação');
                if (mounted) {
                    setLoading(false);
                }
                return;
            }

            console.log('Iniciando verificação de autenticação para rota protegida');

            if (!mounted) return;

            try {
                const session = await account.getSession('current');
                
                if (!mounted) return;

                if (session) {
                    try {
                        const currentUser = await account.get();
                        if (mounted) {
                            setUser(currentUser);
                            console.log('Usuário autenticado:', currentUser.$id);
                        }
                    } catch (error) {
                        if (mounted) {
                            console.error('Erro ao obter usuário:', error);
                            setUser(null);
                            router.push('/login');
                        }
                    }
                } else {
                    if (mounted) {
                        console.log('Sessão não encontrada, redirecionando para login');
                        setUser(null);
                        router.push('/login');
                    }
                }
            } catch (error) {
                if (mounted) {
                    console.error('Erro ao verificar sessão:', error);
                    setUser(null);
                    if (!isPublic) {
                        router.push('/login');
                    }
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        // Executa a inicialização
        init();

        // Cleanup
        return () => {
            mounted = false;
        };
    }, [pathname]);

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            await account.createEmailSession(email, password);
            const currentUser = await account.get();
            setUser(currentUser);
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Erro ao fazer login:', error);
            setError(error.message || 'Falha ao fazer login');
            throw error;
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            setError(null);
            const newUser = await account.create('unique()', email, password, name);
            await signIn(email, password);
            return newUser;
        } catch (error: any) {
            console.error('Erro ao criar conta:', error);
            setError(error.message || 'Falha ao criar conta');
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            router.push('/login');
        } catch (error: any) {
            console.error('Erro ao fazer logout:', error);
            setError(error.message || 'Falha ao fazer logout');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
} 