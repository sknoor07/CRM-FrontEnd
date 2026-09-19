"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus } from "lucide-react";
import { FinalQuoteComponentInput } from "@/features/cs/cs.types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ComponentsEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  components: FinalQuoteComponentInput[];
  onSave: (components: FinalQuoteComponentInput[]) => void;
}

export function ComponentsEditorDialog({
  open,
  onOpenChange,
  components,
  onSave,
}: ComponentsEditorDialogProps) {
  const [rows, setRows] = useState<FinalQuoteComponentInput[]>(components);

  useEffect(() => {
    if (open) setRows(components);
  }, [open, components]);

  const updateRow = (
    index: number,
    patch: Partial<FinalQuoteComponentInput>,
  ) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { name: "", quantity: 1, unitPrice: 0 }]);
  };

  const subtotal = rows.reduce((sum, r) => sum + r.quantity * r.unitPrice, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Repair components</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-72">
          <div className="flex flex-col gap-2 pr-3">
            {rows.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  placeholder="Component name"
                  value={row.name}
                  onChange={(e) => updateRow(index, { name: e.target.value })}
                />
                <Input
                  className="w-16"
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) =>
                    updateRow(index, { quantity: Number(e.target.value) || 1 })
                  }
                />
                <Input
                  className="w-24"
                  type="number"
                  min={0}
                  value={row.unitPrice}
                  onChange={(e) =>
                    updateRow(index, { unitPrice: Number(e.target.value) || 0 })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}

            {rows.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No components added yet.
              </p>
            )}
          </div>
        </ScrollArea>

        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          className="self-start"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add component
        </Button>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <span className="text-sm font-medium">
            Subtotal: ₹{subtotal.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave(rows.filter((r) => r.name.trim() !== ""));
                onOpenChange(false);
              }}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
