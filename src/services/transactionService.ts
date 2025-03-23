import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASES, COLLECTIONS } from '@/lib/appwrite';

export interface Transaction {
    id: string;
    userId: string;        // Relationship (two-way) with users collection
    categoryId: string;    // Relationship (two-way) with categories collection
    amount: string;        // Storing as string for precision
    type: 'income' | 'expense';
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export const transactionService = {
    async create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
        const now = new Date().toISOString();
        return await databases.createDocument(
            DATABASES.MAIN,
            COLLECTIONS.TRANSACTIONS,
            ID.unique(),
            {
                ...data,
                createdAt: now,
                updatedAt: now,
            }
        );
    },

    async update(id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>) {
        const now = new Date().toISOString();
        return await databases.updateDocument(
            DATABASES.MAIN,
            COLLECTIONS.TRANSACTIONS,
            id,
            {
                ...data,
                updatedAt: now,
            }
        );
    },

    async delete(id: string) {
        return await databases.deleteDocument(
            DATABASES.MAIN,
            COLLECTIONS.TRANSACTIONS,
            id
        );
    },

    async getById(id: string) {
        return await databases.getDocument(
            DATABASES.MAIN,
            COLLECTIONS.TRANSACTIONS,
            id
        );
    },

    async list(userId: string) {
        return await databases.listDocuments(
            DATABASES.MAIN,
            COLLECTIONS.TRANSACTIONS,
            [
                Query.equal('userId', userId),
                Query.orderDesc('date')
            ]
        );
    },

    async getByDateRange(userId: string, startDate: string, endDate: string) {
        return await databases.listDocuments(
            DATABASES.MAIN,
            COLLECTIONS.TRANSACTIONS,
            [
                Query.equal('userId', userId),
                Query.greaterThanEqual('date', startDate),
                Query.lessThanEqual('date', endDate),
                Query.orderDesc('date')
            ]
        );
    },

    // Novo método para listar transações por categoria
    async listByCategory(categoryId: string) {
        return await databases.listDocuments(
            DATABASES.MAIN,
            COLLECTIONS.TRANSACTIONS,
            [
                Query.equal('categoryId', categoryId),
                Query.orderDesc('date')
            ]
        );
    },

    // Novo método para obter o total por categoria em um período
    async getTotalByCategory(userId: string, categoryId: string, startDate: string, endDate: string) {
        const transactions = await databases.listDocuments(
            DATABASES.MAIN,
            COLLECTIONS.TRANSACTIONS,
            [
                Query.equal('userId', userId),
                Query.equal('categoryId', categoryId),
                Query.greaterThanEqual('date', startDate),
                Query.lessThanEqual('date', endDate)
            ]
        );

        return transactions.documents.reduce((total, transaction) => {
            return total + parseFloat(transaction.amount);
        }, 0);
    }
}; 