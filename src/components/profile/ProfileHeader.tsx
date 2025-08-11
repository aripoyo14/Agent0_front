import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  name: string;
  skillTags: string[];
}

export function ProfileHeader({ name, skillTags }: ProfileHeaderProps) {
  return (
    <div className="h-full flex items-center">
      <div className="max-w-full">
        <h1 className="text-sm lg:text-base font-bold mb-1 lg:mb-1.5 text-white">{name}</h1>
        <div className="flex flex-wrap gap-0.5 lg:gap-1">
          {skillTags.map((tag, index) => (
            <Badge
              key={index}
              className="bg-white text-cyan-600 border-0 hover:bg-white text-[9px] lg:text-[10px] px-1 py-0.5 lg:px-1.5 lg:py-0.5 rounded-full font-bold"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
