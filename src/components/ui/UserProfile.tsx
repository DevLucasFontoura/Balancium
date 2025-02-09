import { Avatar } from './Avatar';
import { useSession } from 'next-auth/react';

export function UserProfile() {
  const { data: session } = useSession();

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <Avatar 
          src={session?.user?.image} 
          fallback={session?.user?.name?.[0] || '?'} 
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {session?.user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {session?.user?.email}
          </p>
        </div>
      </div>
    </div>
  );
} 