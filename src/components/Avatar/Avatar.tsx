// components/Avatar.tsx
import { generateColorForName } from '@/lib/avatarColorGenerator';

interface AvatarProps {
  name: string;
  size?: "lg" | "sm"
}

export default function Avatar({ name,size="sm" }: AvatarProps) {
  const bgColor = generateColorForName(name);
  const sizeClasses = {
    lg: "w-16 h-16 text-xl",  // 64px
    sm: "w-12 h-12 text-base", // 48px
  };
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold opacity-70 ${sizeClasses[size]}`}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      {name[0].toUpperCase()}
    </div>
  );
}
