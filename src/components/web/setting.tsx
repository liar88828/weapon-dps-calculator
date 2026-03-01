import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useSettingStore } from "@/store/useSettingStore.ts";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";

export default function SettingDialog() {
  const { form, setField, reset } = useSettingStore();
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (!newCategory.trim()) return;

    const newItem = {
      label: newCategory, // unique ID
    };

    setField("category", [...form.category, newItem]);
    setNewCategory(""); // reset input
  };

  const handleRemove = (value: string) => {
    setField(
      "category",
      form.category.filter((c) => c.label !== value),
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <SettingsIcon className="mr-2" />
          <span>Setting</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings DPS</DialogTitle>
          <DialogDescription>Configure your gameplay options</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 items-end">
          {/* Infinity Ammo */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Infinity Ammo
            </Label>
            <Select>
              <Select
                value={form.infinityAmmo ? "enabled" : "disabled"}
                onValueChange={(val) =>
                  setField("infinityAmmo", val === "enabled")
                }
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Choose option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </Select>
          </div>

          {/* No Reload */}
          <div>
            <Label className="block text-sm font-medium mb-1">No Reload</Label>
            <Select
              value={form.noReload ? "enabled" : "disabled"}
              onValueChange={(val) => setField("noReload", val === "enabled")}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Choose option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* rps time */}
          <div>
            <Label className="block text-sm font-medium mb-1">No RPS</Label>
            <Select
              value={form.rps ? "enabled" : "disabled"}
              onValueChange={(val) => setField("rps", val === "enabled")}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Choose option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => {
              reset();
            }}
          >
            Reset
          </Button>
        </div>
        <div className="space-y-3">
          {/* Input + Add button */}
          <div className="flex gap-2">
            <Input
              placeholder="Add category..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>

          {/* List */}
          <ul className="space-y-2 overflow-y-scroll h-96 ">
            {form.category
              .filter((c) => c.label !== newCategory)
              .map((cat) => (
                <li
                  key={cat.label}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <span>{cat.label}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(cat.label)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
