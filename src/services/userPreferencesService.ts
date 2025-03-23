import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASES, COLLECTIONS } from '@/lib/appwrite';

export interface UserPreferences {
    id: string;
    userId: string;    // One-way relationship with users collection
    currency: 'BRL' | 'USD' | 'EUR' | 'GBP';
    language: 'pt-BR' | 'en-US' | 'es-ES';
    theme: 'light' | 'dark' | 'system';
    email: string;
}

export const userPreferencesService = {
    async create(data: Omit<UserPreferences, 'id'>) {
        // Verifica se já existe uma preferência para este usuário
        const existing = await this.getByUserId(data.userId);
        if (existing) {
            throw new Error('User preferences already exist');
        }

        return await databases.createDocument(
            DATABASES.MAIN,
            COLLECTIONS.USER_PREFERENCES,
            ID.unique(),
            data
        );
    },

    async update(id: string, data: Partial<Omit<UserPreferences, 'id' | 'userId'>>) {
        return await databases.updateDocument(
            DATABASES.MAIN,
            COLLECTIONS.USER_PREFERENCES,
            id,
            data
        );
    },

    async getByUserId(userId: string) {
        const response = await databases.listDocuments(
            DATABASES.MAIN,
            COLLECTIONS.USER_PREFERENCES,
            [Query.equal('userId', userId)]
        );

        if (response.documents.length > 0) {
            return response.documents[0];
        }

        // Se não encontrar preferências, cria com valores padrão
        return await this.create({
            userId,
            currency: 'BRL',
            language: 'pt-BR',
            theme: 'system',
            email: '' // Será preenchido com o email do usuário
        });
    }
}; 