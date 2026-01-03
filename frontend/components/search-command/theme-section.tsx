import { Sun, Moon, Laptop } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";

interface ThemeSectionProps {
  onSelectTheme: (theme: string) => void;
}

export function ThemeSection({ onSelectTheme }: ThemeSectionProps) {
  return (
    <CommandGroup heading="Theme">
      <CommandItem onSelect={() => onSelectTheme("light")}>
        <Sun className="mr-2 h-4 w-4" />
        <span>Light</span>
      </CommandItem>
      <CommandItem onSelect={() => onSelectTheme("dark")}>
        <Moon className="mr-2 h-4 w-4" />
        <span>Dark</span>
      </CommandItem>
      <CommandItem onSelect={() => onSelectTheme("system")}>
        <Laptop className="mr-2 h-4 w-4" />
        <span>System</span>
      </CommandItem>
    </CommandGroup>
  );
}
