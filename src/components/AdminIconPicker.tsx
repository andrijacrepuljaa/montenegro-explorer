import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { iconOptions, getIconByName } from "@/lib/iconLibrary";
import { cn } from "@/lib/utils";
import { inputClass } from "@/lib/adminUi";

type AdminIconPickerProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

export function AdminIconPicker({ value, onChange, label = "Choose icon" }: AdminIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ActiveIcon = getIconByName(value);

  const filteredIcons = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return iconOptions;
    return iconOptions.filter((option) =>
      option.name.toLowerCase().includes(normalized) ||
      option.label.toLowerCase().includes(normalized) ||
      option.category.toLowerCase().includes(normalized) ||
      option.keywords.some((keyword) => keyword.toLowerCase().includes(normalized)),
    );
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-left text-sm hover:bg-muted">
          <span className="inline-flex items-center gap-3">
            <span className="rounded-md bg-muted p-2">
              <ActiveIcon className="h-4 w-4 text-primary" />
            </span>
            <span>
              <span className="block font-medium text-foreground">{value}</span>
              <span className="block text-xs text-muted-foreground">{label}</span>
            </span>
          </span>
          <span className="text-xs font-semibold text-primary">Change</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose an icon</DialogTitle>
          <DialogDescription>
            Pick from the curated Lucide set used across the website. Search by name, category, or keyword.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            className={cn(inputClass, "pl-10")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search icons"
          />
        </div>
        <div className="mt-4 max-h-[420px] overflow-y-auto rounded-md border border-border">
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4">
            {filteredIcons.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => {
                  onChange(option.name);
                  setOpen(false);
                }}
                className={cn(
                  "bg-background p-4 text-left transition-colors hover:bg-muted",
                  value === option.name && "bg-primary/10",
                )}
              >
                <option.icon className="mb-3 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{option.category}</p>
              </button>
            ))}
          </div>
        </div>
        <a
          href="https://lucide.dev/icons/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Browse the full Lucide catalog
        </a>
      </DialogContent>
    </Dialog>
  );
}
