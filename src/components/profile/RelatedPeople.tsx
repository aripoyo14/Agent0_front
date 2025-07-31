import { RelatedPerson } from "@/types";
import { ListCard } from "@/components/ui/list-card";
import { CardTitleIcon } from "@/components/ui/card-title-icon";
import { PersonListItem } from "@/components/ui/person-list-item";

interface RelatedPeopleProps {
  people: RelatedPerson[];
}

export function RelatedPeople({ people }: RelatedPeopleProps) {
  // 最大3人まで表示
  const limitedPeople = people.slice(0, 3);
  
  return (
    <ListCard
      title="関連する人物"
      icon="share"
      items={limitedPeople}
      emptyMessage="関連する人物はいません"
      fullHeight={false}
      renderItem={(person) => (
        <PersonListItem
          key={(person as RelatedPerson).id}
          id={(person as RelatedPerson).id}
          name={(person as RelatedPerson).name}
          subtitle={(person as RelatedPerson).company}
        />
      )}
    />
  );
}
