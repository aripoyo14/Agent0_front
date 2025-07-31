import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardTitleIcon } from "@/components/ui/card-title-icon";

interface ContactInfoProps {
  email: string;
  phone: string;
}

export function ContactInfo({ email, phone }: ContactInfoProps) {
  return (
    <Card className="profile-card--contact h-full">
      <CardHeader className="card-header-padding">
        <CardTitle className="card-title-base">
          <CardTitleIcon>share</CardTitleIcon>
          連絡先
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content-padding space-y-2">
        <div className="flex items-center gap-2 text-secondary">
          <span className="text-xs text-gray-500">アドレス</span>
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2 text-secondary">
          <span className="text-xs text-gray-500">電話番号</span>
          <span>{phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}
