'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TipoTransacao } from '@/app/tipos';
import { Combobox } from '@headlessui/react';
import toast from 'react-hot-toast';
import styles from './EntradaSaidaForm.module.css';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { account, databases } from '@/lib/appwrite';
import { ID, Query, Models } from 'appwrite';
import { DATABASES, COLLECTIONS } from '@/lib/appwrite';

interface Categoria {
  $id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
}

interface FormData {
  descricao: string;
  valor: string;
  categoria: string;
  data: string;
  tipo: 'entrada' | 'saida';
}

interface FormState {
  descricao: string;
  valor: string;
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
  
  const initialFormState: FormState = {
    descricao: '',
    valor: '',
    tipo: 'entrada',
    data: new Date().toISOString().split('T')[0],
    categoria: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const { register, handleSubmit: submitForm, formState: { errors }, reset, setValue } = useForm<FormData>();

  // Carregar descrições existentes do usuário
  useEffect(() => {
    const carregarDescricoes = async () => {
      try {
        const user = await account.get();
        if (!user) return;

        const response = await databases.listDocuments(
          DATABASES.MAIN,
          COLLECTIONS.TRANSACTIONS,
          [
            Query.equal('userId', user.$id),
            Query.equal('status', 'ativo')
          ]
        );

        const descricaoSet = new Set<string>();
        response.documents.forEach((doc: Models.Document) => {
          if (doc.description) {
            descricaoSet.add(doc.description);
          }
        });
        const descricoesArray = Array.from(descricaoSet);
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
    try {
      const user = await account.get();
      if (!user) return;

      const response = await databases.listDocuments(
        DATABASES.MAIN,
        COLLECTIONS.CATEGORIES,
        [Query.equal('userId', user.$id)]
      );
      
      setCategorias(response.documents as unknown as Categoria[]);
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

  useEffect(() => {
    setValue('tipo', 'entrada');
  }, [setValue]);

  const onSubmitForm = async (data: FormData) => {
    console.log('onSubmitForm iniciado com data:', data);
    setLoading(true);
    setError(null);

    try {
      const user = await account.get();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      if (!data.descricao || !data.valor || !data.categoria || !data.data) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const valorNumerico = parseFloat(data.valor.replace(/\./g, '').replace(',', '.'));
      console.log('Valor numérico convertido:', valorNumerico);

      const [ano, mes, dia] = data.data.split('-').map(Number);
      const dataObj = new Date(ano, mes - 1, dia);
      const dataISO = dataObj.toISOString();

      const transacao = {
        userId: user.$id,
        description: data.descricao,
        amount: valorNumerico.toString(), // Appwrite não suporta números, então salvamos como string
        type: data.tipo === 'entrada' ? 'income' : 'expense',
        categoryId: data.categoria,
        date: dataISO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'ativo',
        month: dataObj.getMonth() + 1,
        year: dataObj.getFullYear(),
      };

      console.log('Salvando transação:', transacao);
      await databases.createDocument(
        DATABASES.MAIN,
        COLLECTIONS.TRANSACTIONS,
        ID.unique(),
        transacao
      );
      console.log('Transação salva com sucesso');
      
      const novoFormData = {
        ...initialFormState,
        data: new Date().toISOString().split('T')[0],
        tipo: data.tipo
      };

      console.log('Resetando formulário com:', novoFormData);
      
      // Reset all form states
      setFormData(novoFormData);
      setSearchQuery('');
      
      // Reset react-hook-form
      reset(novoFormData);

      // Reset Combobox value
      const comboboxInput = document.querySelector('.headlessui-combobox-input') as HTMLInputElement;
      if (comboboxInput) {
        comboboxInput.value = '';
      }

      // Reset valor input
      const valorInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (valorInput) {
        valorInput.value = '';
      }

      // Atualizar todos os campos manualmente
      setValue('descricao', '');
      setValue('valor', '');
      setValue('categoria', '');
      setValue('data', novoFormData.data);
      setValue('tipo', novoFormData.tipo);
      
      toast.success('Transação salva com sucesso!');
      console.log('Formulário resetado com sucesso');
      
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Erro ao salvar transação. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    console.log('handleFormSubmit called with data:', data);
    
    if (!data.descricao || !data.valor || !data.categoria || !data.data) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      console.log('Iniciando submissão do formulário...');
      await onSubmitForm(data);
      console.log('Formulário submetido com sucesso');
    } catch (error) {
      console.error('Erro na submissão do formulário:', error);
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
    
    setFormData(prev => ({ ...prev, valor: valorFormatado }));
    setValue('valor', valorFormatado);
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        console.log('Form submit event triggered');
        submitForm(handleFormSubmit)(e);
      }} 
      className={styles.form}
    >
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Tipo de Transação</label>
          <div className={styles.tipoButtons}>
            <button
              type="button"
              className={`${styles.tipoButton} ${formData.tipo === 'entrada' ? styles.active : ''}`}
              onClick={() => {
                setFormData(prev => ({ ...prev, tipo: 'entrada' }));
                setValue('tipo', 'entrada');
              }}
            >
              Entrada
            </button>
            <button
              type="button"
              className={`${styles.tipoButton} ${formData.tipo === 'saida' ? styles.active : ''}`}
              onClick={() => {
                setFormData(prev => ({ ...prev, tipo: 'saida' }));
                setValue('tipo', 'saida');
              }}
            >
              Saída
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="descricao" className={styles.label}>
            Descrição
          </label>
          <Combobox
            value={searchQuery}
            onChange={(value: string) => {
              setSearchQuery(value);
              setFormData(prev => ({ ...prev, descricao: value }));
              setValue('descricao', value);
            }}
          >
            <div className={styles.comboboxContainer}>
              <Combobox.Input
                className={styles.input}
                onChange={(event) => setSearchQuery(event.target.value)}
                displayValue={(item: string) => item}
                placeholder="Digite a descrição"
                {...register('descricao', { required: true })}
              />
              <Combobox.Options className={styles.comboboxOptions}>
                {filteredDescricoes.map((descricao) => (
                  <Combobox.Option
                    key={descricao}
                    value={descricao}
                    className={({ active }) =>
                      `${styles.comboboxOption} ${active ? styles.active : ''}`
                    }
                  >
                    {descricao}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="valor" className={styles.label}>
            Valor
          </label>
          <Input
            type="text"
            id="valor"
            name="valor"
            placeholder="0,00"
            className={styles.input}
            onChange={(e) => {
              handleValorChange(e);
              register('valor').onChange(e);
            }}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="categoria" className={styles.label}>
            Categoria
          </label>
          <select
            id="categoria"
            {...register('categoria', { required: true })}
            className={styles.select}
            value={formData.categoria}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, categoria: e.target.value }));
            }}
          >
            <option value="">Selecione uma categoria</option>
            {categorias
              .filter(cat => 
                (formData.tipo === 'entrada' && cat.type === 'income') || 
                (formData.tipo === 'saida' && cat.type === 'expense')
              )
              .map((categoria) => (
                <option 
                  key={categoria.$id} 
                  value={categoria.$id}
                  style={{ backgroundColor: categoria.color }}
                >
                  {categoria.name}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="data" className={styles.label}>
            Data
          </label>
          <Input
            type="date"
            id="data"
            {...register('data', { required: true })}
            className={styles.input}
            value={formData.data}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, data: e.target.value }));
            }}
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <Button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
} 