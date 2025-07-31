import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  name: string;
  skillTags: string[];
}

export function ProfileHeader({ name, skillTags }: ProfileHeaderProps) {
  return (
    <div className="profile-header-gradient h-full flex items-center">
      <div className="max-w-full px-0 lg:px-0 pl-0 lg:pl-0">
        <h1 className="text-base lg:text-lg font-bold mb-2 lg:mb-3 text-white">{name}</h1>
        <div className="flex flex-wrap gap-1.5 lg:gap-2">
          {skillTags.map((tag, index) => (
            <Badge
              key={index}
              className="bg-white text-blue-700 border-0 hover:bg-white text-xs px-2 py-0.5 lg:px-3 lg:py-1 rounded-full font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
