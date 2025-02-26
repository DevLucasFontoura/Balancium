interface AvatarProps {
  src?: string;
  alt?: string;
}

export function Avatar({ src, alt }: AvatarProps) {
  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
      {src ? (
        <img 
          src={src} 
          alt={alt || 'Avatar'} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          {/* Ícone de usuário padrão ou primeira letra do nome */}
          {alt ? alt[0].toUpperCase() : 'U'}
        </div>
      )}
    </div>
  );
} 