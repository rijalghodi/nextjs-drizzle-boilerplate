import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleList } from "@/app/constants/roles";

type RoleSelectProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function RoleSelect({
  value,
  onChange,
  disabled,
  className,
  placeholder = "Pilih Peran",
}: RoleSelectProps) {
  return (
    <Select
      clearable
      value={value || undefined}
      onValueChange={(val) => onChange?.(val || null)}
      disabled={disabled}
    >
      <SelectTrigger className={className ?? "w-full sm:w-36"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {roleList?.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
