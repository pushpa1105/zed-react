import type { LucideIcon } from "lucide-react";

interface DynamicIconProps {
    icon: LucideIcon;
    size?: number;
    className?: string;
}

export function DynamicIcon({
    icon: Icon,
    size = 18,
    className,
}: DynamicIconProps) {
    return <Icon size={size} className={className} />;
}