'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

export function Configuracoes() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.delete();
        router.push('/login');
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas configurações e preferências</p>

        {/* Perfil */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Perfil</h2>
          <Card className="p-6 bg-white">
            <h3 className="text-md font-medium mb-4">Perfil</h3>
            <p className="text-sm text-gray-600 mb-4">Visualize e edite suas informações</p>
            <Button variant="outline" size="sm">Editar Perfil</Button>
          </Card>
        </section>

        {/* Preferências */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Preferências</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Tema */}
            <Card className="p-6 bg-white">
              <h3 className="text-md font-medium mb-4">Tema</h3>
              <p className="text-sm text-gray-600 mb-4">Escolha entre tema claro ou escuro</p>
              <div className="flex space-x-4">
                <Button 
                  variant={theme === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                >
                  Claro
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                >
                  Escuro
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-md font-medium mb-4">Notificações</h3>
              <p className="text-sm text-gray-600 mb-4">Configure suas notificações</p>
              <Button variant="outline" size="sm">Configurar</Button>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-md font-medium mb-4">Jornada de Trabalho</h3>
              <p className="text-sm text-gray-600 mb-4">Ajuste sua jornada de trabalho</p>
              <Button variant="outline" size="sm">Ajustar</Button>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-md font-medium mb-4">Feriados e Compensações</h3>
              <p className="text-sm text-gray-600 mb-4">Gerencie feriados que afetam sua jornada</p>
              <Button variant="outline" size="sm">Gerenciar</Button>
            </Card>
          </div>
        </section>

        {/* Ajuda */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Ajuda</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 bg-white">
              <h3 className="text-md font-medium mb-4">Tutorial do App</h3>
              <p className="text-sm text-gray-600 mb-4">Aprenda a usar todas as funcionalidades</p>
              <Button variant="outline" size="sm">Ver Tutorial</Button>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-md font-medium mb-4">Perguntas Frequentes</h3>
              <p className="text-sm text-gray-600 mb-4">Encontre respostas para dúvidas comuns</p>
              <Button variant="outline" size="sm">Ver FAQ</Button>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-md font-medium mb-4">Suporte ao Cliente</h3>
              <p className="text-sm text-gray-600 mb-4">Entre em contato com nossa equipe</p>
              <Button variant="outline" size="sm">Contatar</Button>
            </Card>
          </div>
        </section>

        {/* Sobre */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Sobre</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 bg-white">
              <h3 className="text-md font-medium mb-4">Política de Privacidade</h3>
              <p className="text-sm text-gray-600 mb-4">Leia nossa política de privacidade</p>
              <Button variant="outline" size="sm">Ler Política</Button>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-md font-medium mb-4">Sobre o App</h3>
              <p className="text-sm text-gray-600 mb-4">Informações sobre o aplicativo</p>
              <Button variant="outline" size="sm">Saiba Mais</Button>
            </Card>
          </div>
        </section>

        {/* Zona de Perigo */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-red-600">Zona de Perigo</h2>
          <Card className="p-6 bg-red-50 border border-red-200">
            <h3 className="text-md font-medium text-red-800 mb-4">Excluir Conta</h3>
            <p className="text-sm text-red-600 mb-4">
              Atenção: Esta ação é irreversível e todos os seus dados serão perdidos.
            </p>
            {!showDeleteConfirm ? (
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Excluir Minha Conta
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-medium text-red-800">
                  Tem certeza que deseja excluir sua conta?
                </p>
                <div className="flex space-x-4">
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={handleDeleteAccount}
                  >
                    Sim, Excluir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
} 