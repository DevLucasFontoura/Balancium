'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './dadosdaconta.module.css';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface UserData {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  uid: string;
  settings: {
    currency: string;
    language: string;
  };
}

const CURRENCIES = [
  { value: 'BRL', label: 'Real Brasileiro (R$)' },
  { value: 'USD', label: 'Dólar Americano ($)' },
  { value: 'EUR', label: 'Euro (€)' }
];

const LANGUAGES = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' }
];

export function DadosDaConta() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!userData) return;
    
    const user = auth.currentUser;
    if (user) {
      setIsSaving(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const updateData = {
          name: userData.name,
          settings: {
            currency: userData.settings.currency,
            language: userData.settings.language
          },
          updatedAt: new Date().toISOString()
        };
        await updateDoc(userRef, updateData);
        const updatedDoc = await getDoc(userRef);
        if (updatedDoc.exists()) {
          setUserData(updatedDoc.data() as UserData);
        }
        setIsEditing(false);
        toast.success('Dados atualizados com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
        toast.error('Erro ao atualizar dados. Tente novamente.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR
    });
  };

  if (!userData) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          variant="ghost"
          className={styles.backButton}
          onClick={() => router.push('/configuracoes')}
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Voltar para Configurações
        </Button>
      </div>

      <Card className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Dados da Conta</h1>
        <p className={styles.heroSubtitle}>Gerencie suas informações pessoais</p>
      </Card>

      <Card className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Informações Pessoais</h2>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome Completo</label>
            <Input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              disabled={!isEditing}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <Input
              type="email"
              value={userData.email}
              disabled={true}
              className={styles.input}
            />
            <p className={styles.helpText}>O e-mail não pode ser alterado</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Moeda</label>
            <Select
              value={userData.settings.currency}
              onChange={(e) => setUserData({
                ...userData,
                settings: { ...userData.settings, currency: e.target.value }
              })}
              disabled={!isEditing}
              className={styles.select}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </Select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Idioma</label>
            <Select
              value={userData.settings.language}
              onChange={(e) => setUserData({
                ...userData,
                settings: { ...userData.settings, language: e.target.value }
              })}
              disabled={!isEditing}
              className={styles.select}
            >
              {LANGUAGES.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              <svg 
                className={styles.infoIcon} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <div>
                <span className={styles.infoLabel}>Conta criada em</span>
                <p className={styles.infoValue}>{formatDate(userData.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className={styles.formActions}>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
