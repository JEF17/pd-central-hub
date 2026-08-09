import { UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { divisionCode, type OfficerProfile } from "@/lib/officer-profile";

type Props = {
  onFill: (values: {
    name: string;
    serialNo: string;
    rank: string;
    division: string;
    profile: OfficerProfile;
  }) => void;
  label?: string;
};

export function ProfileFillButton({ onFill, label = "Profilden Doldur" }: Props) {
  const profile = useOfficerProfile();

  if (!profile || (!profile.name && !profile.serialNo && !profile.division)) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => {
        onFill({
          name: profile.name,
          serialNo: profile.serialNo,
          rank: profile.rank,
          division: divisionCode(profile.division),
          profile,
        });
        toast.success("Personel bilgileri profilden dolduruldu");
      }}
    >
      <UserCheck className="size-4" />
      {label}
    </Button>
  );
}
