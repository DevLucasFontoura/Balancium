import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Constantes para collections e databases
export const DATABASES = {
    MAIN: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
};

export const COLLECTIONS = {
    TRANSACTIONS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TRANSACTIONS!,
    CATEGORIES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CATEGORIES!,
    USER_PREFERENCES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_PREFERENCES!,
    USERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS!
};

export { client }; 