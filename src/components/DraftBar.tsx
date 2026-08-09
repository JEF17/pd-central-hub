import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DraftBarProps = {
  savedAt: Date | null;
  onClear: () => void;
};

export function DraftBar({ savedAt, onClear }: DraftBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/60 px-4 py-2.5">
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        <Check className="size-3.5 text-success" />
        {savedAt
          ? `Taslak otomatik kaydedildi · ${savedAt.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "Girdiğin bilgiler bu tarayıcıda otomatik saklanır"}
      </span>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <RotateCcw className="size-4" />
        Şablonu Temizle
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Şablon temizlensin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu formdaki tüm alanlar sıfırlanacak ve kayıtlı taslak silinecek. Bu işlem geri
              alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClear();
                setOpen(false);
              }}
            >
              Temizle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
