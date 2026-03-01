import { toast } from "sonner";
import { useFormWeaponStore } from "@/store/useFormWeaponStore";
import { useSettingStore } from "@/store/useSettingStore";
import { useWeaponFilterStore } from "@/store/useWeaponFilterStore";
import { useWeaponListStore } from "@/store/useWeaponListStore";
import * as XLSX from "xlsx";
import { useCallback } from "react";
import { z } from "zod";

// helper: apply bold fill header and auto column widths
function styleHeaderAndColumns(ws: XLSX.WorkSheet) {
  const range = XLSX.utils.decode_range(ws["!ref"] || "");
  if (!range || range.s.r > range.e.r) return;
  // header row = first row
  const headerRow = range.s.r;
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const addr = XLSX.utils.encode_cell({ r: headerRow, c: C });
    const cell = ws[addr];
    if (cell) {
      cell.s = cell.s || {};
      cell.s.font = { bold: true, color: { rgb: "FFFFFFFF" } };
      cell.s.fill = { fgColor: { rgb: "FF0000FF" } }; // blue background
    }
  }
  // auto width by max text length in each column
  const colWidths: { wch: number }[] = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let max = 10;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
      const text = cell ? String(cell.v) : "";
      if (text.length > max) max = text.length;
    }
    colWidths.push({ wch: max + 2 });
  }
  ws["!cols"] = colWidths;
}

// Validation schemas
const WeaponSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  category: z.string(),
  damage: z.number(),
  magazine: z.number(),
  fireTime: z.number(),
  criticalChange: z.number(),
  criticalMultiplier: z.number(),
  reloadTime: z.number(),
  multiplier: z.number(),
  elementalDps: z.number(),
});

const SettingCategorySchema = z.object({
  label: z.string(),
});

const SettingSchema = z.object({
  category: z.array(SettingCategorySchema).optional().default([]),
  rps: z.boolean().optional(),
  infinityAmmo: z.boolean().optional(),
  noReload: z.boolean().optional(),
});

const FilterSchema = z.object({
  searchTerm: z.string().optional(),
  categoryFilter: z.string().optional(),
  shortNameSort: z.enum(["asc", "desc"]).optional(),
  minDps: z.string().optional(),
  maxDps: z.string().optional(),
  sortOrder: z.enum(["asc", "desc", ""]).optional(),
});

export function useExcelService() {
  const weaponFilter = useWeaponFilterStore();
  const { form: weapon, setForm: setWeapon } = useFormWeaponStore();
  const { form: setting, setForm: setSetting } = useSettingStore();
  const { weapons: weaponList, addWeapon } = useWeaponListStore();
  const {
    setSearchTerm,
    setCategoryFilter,
    setShortNameSort,
    setMinDps,
    setMaxDps,
    setSortOrder,
  } = useWeaponFilterStore();

  const exportExcel = useCallback(() => {
    try {
      const wb = XLSX.utils.book_new();

      // Export current form
      const formSheet = XLSX.utils.json_to_sheet([weapon || {}]);
      styleHeaderAndColumns(formSheet);
      XLSX.utils.book_append_sheet(wb, formSheet, "Form");

      // Export settings
      const settingSheet = XLSX.utils.json_to_sheet([setting || {}]);
      styleHeaderAndColumns(settingSheet);
      XLSX.utils.book_append_sheet(wb, settingSheet, "Setting");

      // also export categories separately so values don't disappear
      const cats = (setting.category || []).map((c) => ({ label: c.label }));
      const categorySheet = XLSX.utils.json_to_sheet(cats);
      styleHeaderAndColumns(categorySheet);
      XLSX.utils.book_append_sheet(wb, categorySheet, "Categories");
      console.log("Exporting settings and categories:", setting, cats);

      // XLSX.utils.book_append_sheet(wb, settingSheet, "Setting");

      // Export weapons list
      const weaponsSheet = XLSX.utils.json_to_sheet(weaponList || []);
      styleHeaderAndColumns(weaponsSheet);
      XLSX.utils.book_append_sheet(wb, weaponsSheet, "Weapons");

      // Export weapon filter state (only serializable fields)
      const filterData = [
        {
          searchTerm: weaponFilter.searchTerm,
          categoryFilter: weaponFilter.categoryFilter,
          shortNameSort: weaponFilter.shortNameSort,
          minDps: weaponFilter.minDps,
          maxDps: weaponFilter.maxDps,
          sortOrder: weaponFilter.sortOrder,
        },
      ];
      const filterSheet = XLSX.utils.json_to_sheet(filterData);
      styleHeaderAndColumns(filterSheet);
      XLSX.utils.book_append_sheet(wb, filterSheet, "Filters");

      // Trigger file download
      XLSX.writeFile(wb, "dps-react-export.xlsx");
      toast.success("Export successful", {
        description:
          "Your weapon data has been exported to dps-react-export.xlsx",
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Export failed:", err);
      toast.error("Export failed", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  }, [weapon, setting, weaponList, weaponFilter]);

  const importExcel = useCallback(() => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".xlsx,.xls";
      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const bstr = evt.target?.result as string;
            const wb = XLSX.read(bstr, { type: "binary" });
            console.log("File content read, parsing workbook...", wb);

            // Parse and validate Form sheet
            if (wb.SheetNames.includes("Form")) {
              const formData = XLSX.utils.sheet_to_json(wb.Sheets["Form"]);
              if (formData.length > 0) {
                const validated = WeaponSchema.parse(formData[0]);
                setWeapon(validated as typeof weapon);
              }
            }

            // Parse and validate Setting sheet
            let parsedSetting: any = {};
            if (wb.SheetNames.includes("Setting")) {
              const settingData = XLSX.utils.sheet_to_json(
                wb.Sheets["Setting"],
              );
              if (settingData.length > 0) {
                parsedSetting = { ...(settingData[0] as any) };
              }
            }
            // if categories sheet exists, read it and add to parsedSetting
            if (wb.SheetNames.includes("Categories")) {
              const catData = XLSX.utils.sheet_to_json(wb.Sheets["Categories"]);
              if (catData.length > 0) {
                parsedSetting.category = catData.map((c: any) => ({
                  label: c.label,
                }));
              }
            }
            if (Object.keys(parsedSetting).length > 0) {
              // ensure category array exists
              if (!Array.isArray(parsedSetting.category)) {
                parsedSetting.category = [];
              }
              const validated = SettingSchema.parse(parsedSetting);
              setSetting(validated as typeof setting);
            }

            // Parse and validate Weapons sheet
            if (wb.SheetNames.includes("Weapons")) {
              const weaponsData = XLSX.utils.sheet_to_json(
                wb.Sheets["Weapons"],
              );
              weaponsData.forEach((w) => {
                const validated = WeaponSchema.parse(w);
                addWeapon(validated as Omit<typeof weapon, "id">);
              });
            }

            // Parse and validate Filters sheet
            if (wb.SheetNames.includes("Filters")) {
              const filtersData = XLSX.utils.sheet_to_json(
                wb.Sheets["Filters"],
              );
              if (filtersData.length > 0) {
                const validated = FilterSchema.parse(filtersData[0]);
                setSearchTerm(validated.searchTerm || "");
                setCategoryFilter(validated.categoryFilter || "");
                setShortNameSort(
                  (validated.shortNameSort as "asc" | "desc") || "asc",
                );
                setMinDps(validated.minDps || "");
                setMaxDps(validated.maxDps || "");
                setSortOrder(
                  (validated.sortOrder as "asc" | "desc" | "") || "",
                );
              }
            }

            toast.success("Import successful", {
              description: "Your weapon data has been imported and saved",
            });
          } catch (importErr) {
            // eslint-disable-next-line no-console
            console.error("Import parse error:", importErr);
            const errorMsg =
              importErr instanceof z.ZodError
                ? `Validation error: ${importErr.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
                : importErr instanceof Error
                  ? importErr.message
                  : "Failed to parse file";
            toast.error("Import failed", {
              description: errorMsg,
            });
          }
        };
        reader.readAsBinaryString(file);
      };
      input.click();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Import dialog error:", err);
      toast.error("Import error", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  }, [
    setWeapon,
    setSetting,
    addWeapon,
    setSearchTerm,
    setCategoryFilter,
    setShortNameSort,
    setMinDps,
    setMaxDps,
    setSortOrder,
  ]);

  return { exportExcel, importExcel };
}
