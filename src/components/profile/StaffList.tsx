import { ContactStaff } from "@/types";
import { ListCard } from "@/components/ui/list-card";
import { CardTitleIcon } from "@/components/ui/card-title-icon";
import { PersonListItem } from "@/components/ui/person-list-item";

interface StaffListProps {
  staff: ContactStaff[];
}

export function StaffList({ staff }: StaffListProps) {
  return (
    <ListCard
      title="接点職員"
      icon="group"
      items={staff}
      emptyMessage="接点職員はいません"
      fullHeight={true}
      renderItem={(member) => (
        <PersonListItem
          key={(member as ContactStaff).id}
          id={(member as ContactStaff).id}
          name={(member as ContactStaff).name}
          subtitle={(member as ContactStaff).department}
          className="list-item-base"
        />
      )}
    />
  );
}
