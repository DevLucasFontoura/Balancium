import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASES, COLLECTIONS } from '@/lib/appwrite';

export interface Category {
    id: string;
    userId: string;    // One-way relationship with users collection
    name: string;
    type: 'income' | 'expense';
    color: string;
    order?: number;    // Optional field for custom ordering
}

export const categoryService = {
    async create(data: Omit<Category, 'id'>) {
        return await databases.createDocument(
            DATABASES.MAIN,
            COLLECTIONS.CATEGORIES,
            ID.unique(),
            {
                ...data,
                order: await this.getNextOrder(data.userId, data.type)
            }
        );
    },

    async update(id: string, data: Partial<Omit<Category, 'id' | 'userId'>>) {
        return await databases.updateDocument(
            DATABASES.MAIN,
            COLLECTIONS.CATEGORIES,
            id,
            data
        );
    },

    async delete(id: string) {
        return await databases.deleteDocument(
            DATABASES.MAIN,
            COLLECTIONS.CATEGORIES,
            id
        );
    },

    async getById(id: string) {
        return await databases.getDocument(
            DATABASES.MAIN,
            COLLECTIONS.CATEGORIES,
            id
        );
    },

    async list(userId: string) {
        return await databases.listDocuments(
            DATABASES.MAIN,
            COLLECTIONS.CATEGORIES,
            [
                Query.equal('userId', userId),
                Query.orderAsc('order'),
                Query.orderAsc('name')
            ]
        );
    },

    async listByType(userId: string, type: 'income' | 'expense') {
        return await databases.listDocuments(
            DATABASES.MAIN,
            COLLECTIONS.CATEGORIES,
            [
                Query.equal('userId', userId),
                Query.equal('type', type),
                Query.orderAsc('order'),
                Query.orderAsc('name')
            ]
        );
    },

    // Método auxiliar para obter a próxima ordem disponível
    private async getNextOrder(userId: string, type: 'income' | 'expense') {
        const categories = await this.listByType(userId, type);
        if (categories.documents.length === 0) return 0;
        
        const maxOrder = Math.max(...categories.documents.map(cat => cat.order || 0));
        return maxOrder + 1;
    }
}; 