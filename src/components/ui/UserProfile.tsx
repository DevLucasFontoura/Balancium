import { Avatar } from './Avatar';
import { useAuth } from '@/hooks/useAuth';

export function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <Avatar 
        src={user.photoURL || undefined} 
        alt={user.displayName || 'User'} 
      />
      <div>
        <p className="text-sm font-medium">{user.displayName || 'Usuário'}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
  );
} 