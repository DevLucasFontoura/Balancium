'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { TipoTransacao } from '@/app/tipos';
import { Combobox } from '@headlessui/react';
import toast from 'react-hot-toast';
import styles from './EntradaSaidaForm.module.css';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

interface FormData {
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: 'entrada' | 'saida';
}

export function EntradaSaidaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descricoes, setDescricoes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('saida');
  
  const initialFormState = {
    descricao: '',
    valor: '',
    tipo: 'entrada' as TipoTransacao,
    data: new Date().toISOString().split('T')[0],
    categoria: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const { register, handleSubmit: submitForm, formState: { errors }, reset } = useForm<FormData>();

  // Carregar descrições existentes do usuário
  useEffect(() => {
    const carregarDescricoes = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('status', '==', 'ativo')
        );
        const querySnapshot = await getDocs(q);
        const descricaoSet = new Set<string>();
        querySnapshot.forEach((doc) => {
          const transacao = doc.data();
          if (transacao.descricao) {
            descricaoSet.add(transacao.descricao);
          }
        });
        const descricoesArray = Array.from(descricaoSet);
        console.log('Descrições carregadas:', descricoesArray); // Debug
        setDescricoes(descricoesArray);
      } catch (error) {
        console.error('Erro ao carregar descrições:', error);
      }
    };

    carregarDescricoes();
  }, []);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().categorias) {
        setCategorias(docSnap.data().categorias);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    }
  };

  const filteredDescricoes = searchQuery === ''
    ? descricoes
    : descricoes.filter((descricao) =>
        descricao.toLowerCase().includes(searchQuery.toLowerCase())
      );

  console.log('Query atual:', searchQuery); // Debug
  console.log('Descrições filtradas:', filteredDescricoes); // Debug

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const valorNumerico = parseFloat(formData.valor.replace(/\./g, '').replace(',', '.'));

      // Ajusta a data para meia-noite no fuso horário local
      const dataObj = new Date(formData.data);
      const dataLocal = new Date(dataObj.getTime() - dataObj.getTimezoneOffset() * 60000);
      const dataISO = dataLocal.toISOString();

      const transacao = {
        userId: user.uid,
        descricao: formData.descricao,
        valor: valorNumerico,
        tipo: formData.tipo,
        categoria: formData.categoria,
        data: dataISO,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'ativo',
        mes: dataObj.getMonth() + 1,
        ano: dataObj.getFullYear(),
      };

      await addDoc(collection(db, 'transacoes'), transacao);
      
      setFormData(initialFormState);
      setSearchQuery('');
      
      toast.success('Transação salva com sucesso!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '✅',
      });
      
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      toast.error('Erro ao salvar transação. Tente novamente.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '❌',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    const numero = parseInt(value, 10) / 100;
    const valorFormatado = numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setFormData({ ...formData, valor: valorFormatado });
  };

  const handleFormSubmit = (data: FormData) => {
    onSubmitForm({ ...data, tipo });
    reset();
  };

  return (
    <form onSubmit={onSubmitForm} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Tipo de Transação</label>
          <div className={styles.tipoButtons}>
            <button
              type="button"
              className={`${styles.tipoButton} ${formData.tipo === 'entrada' ? styles.tipoButtonActive : ''}`}
              onClick={() => setFormData({ ...formData, tipo: 'entrada' })}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0-16l-4 4m4-4l4 4" />
              </svg>
              Entrada
            </button>
            <button
              type="button"
              className={`${styles.tipoButton} ${formData.tipo === 'saida' ? styles.tipoButtonActive : ''}`}
              onClick={() => setFormData({ ...formData, tipo: 'saida' })}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m0 16l4-4m-4 4l-4-4" />
              </svg>
              Saída
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Descrição</label>
          <div className={styles.comboboxContainer}>
            <Combobox
              value={formData.descricao}
              onChange={(value) => setFormData({ ...formData, descricao: value })}
            >
              <div className={styles.comboboxWrapper}>
                <Combobox.Input
                  className={styles.input}
                  placeholder="Ex: Salário, Aluguel, Compras..."
                  displayValue={(descricao: string) => descricao}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearchQuery(value);
                    setFormData({ ...formData, descricao: value });
                  }}
                />
                <Combobox.Button className={styles.comboboxButton}>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    />
                  </svg>
                </Combobox.Button>
              </div>
              <Combobox.Options className={styles.comboboxOptions}>
                {filteredDescricoes.length > 0 ? (
                  filteredDescricoes.map((descricao) => (
                    <Combobox.Option
                      key={descricao}
                      value={descricao}
                      className={({ active }) =>
                        `${styles.comboboxOption} ${
                          active ? styles.comboboxOptionActive : ''
                        }`
                      }
                    >
                      {descricao}
                    </Combobox.Option>
                  ))
                ) : (
                  <div className={styles.comboboxEmpty}>
                    Nenhuma sugestão encontrada
                  </div>
                )}
              </Combobox.Options>
            </Combobox>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Valor</label>
          <div className={styles.valorInput}>
            <span className={styles.valorPrefix}>R$</span>
            <input
              type="text"
              value={formData.valor}
              onChange={handleValorChange}
              className={styles.input}
              placeholder="0,00"
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Categoria</label>
          <select
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            className={styles.select}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option 
                key={categoria.id} 
                value={categoria.id}
                style={{ backgroundColor: categoria.cor }}
              >
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Data</label>
          <input
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            className={styles.input}
            required
          />
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.cancelButton}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? (
            <span className={styles.loadingSpinner}>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </span>
          ) : (
            'Salvar Transação'
          )}
        </button>
      </div>
    </form>
  );
} 