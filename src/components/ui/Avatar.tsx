interface AvatarProps {
  src?: string | null;
  fallback: string;
}

export function Avatar({ src, fallback }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt="Profile"
        className="h-10 w-10 rounded-full"
      />
    );
  }

  return (
    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
      <span className="text-sm font-medium text-primary">
        {fallback}
      </span>
    </div>
  );
} 