import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Maximize2, Move, RotateCcw, ZoomIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const BOX = 320; // önizleme kutusu (px)
const OUT = 512; // çıktı boyutu (px)

type Props = {
  /** Düzenlenecek görselin data URL'i; null iken pencere kapalı olur */
  src: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (dataUrl: string) => void;
};

export function PhotoEditor({ src, open, onOpenChange, onApply }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    if (!src || !open) return;
    const el = new Image();
    el.onload = () => {
      setImg(el);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    el.src = src;
  }, [src, open]);

  /** Görselin kutuyu tam kaplaması için gereken temel ölçek */
  const baseScale = img ? Math.max(BOX / img.width, BOX / img.height) : 1;
  const scale = baseScale * zoom;
  const dispW = img ? img.width * scale : 0;
  const dispH = img ? img.height * scale : 0;

  const clamp = useCallback(
    (o: { x: number; y: number }) => {
      const maxX = Math.max(0, (dispW - BOX) / 2);
      const maxY = Math.max(0, (dispH - BOX) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, o.x)),
        y: Math.min(maxY, Math.max(-maxY, o.y)),
      };
    },
    [dispW, dispH],
  );

  useEffect(() => {
    setOffset((o) => clamp(o));
  }, [clamp]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setOffset(clamp({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) }));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const apply = () => {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const k = OUT / BOX;
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, OUT, OUT);
    ctx.drawImage(
      img,
      (BOX / 2 + offset.x - dispW / 2) * k,
      (BOX / 2 + offset.y - dispH / 2) * k,
      dispW * k,
      dispH * k,
    );
    onApply(canvas.toDataURL("image/jpeg", 0.9));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fotoğrafı Düzenle</DialogTitle>
          <DialogDescription>
            Fotoğrafı sürükleyerek konumlandır, kaydırıcı ile büyütüp küçült.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div
            className="relative touch-none overflow-hidden rounded-xl border border-border bg-muted/40"
            style={{ width: BOX, height: BOX, cursor: dragRef.current ? "grabbing" : "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {img ? (
              <img
                src={img.src}
                alt="Düzenlenen fotoğraf"
                draggable={false}
                className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
                style={{
                  width: dispW,
                  height: dispH,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                }}
              />
            ) : null}
            {/* Yerleştirme yardımı: ızgara ve güvenli alan */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-6 rounded-lg border border-dashed border-primary/50" />
              <div className="absolute inset-y-0 left-1/3 w-px bg-foreground/15" />
              <div className="absolute inset-y-0 left-2/3 w-px bg-foreground/15" />
              <div className="absolute inset-x-0 top-1/3 h-px bg-foreground/15" />
              <div className="absolute inset-x-0 top-2/3 h-px bg-foreground/15" />
            </div>
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Move className="size-3.5" />
            Sürükleyerek konumlandır
          </p>

          <div className="flex w-full items-center gap-3">
            <ZoomIn className="size-4 text-muted-foreground" />
            <Slider
              value={[zoom]}
              min={1}
              max={4}
              step={0.01}
              onValueChange={(v) => setZoom(v[0] ?? 1)}
            />
            <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">
              {zoom.toFixed(2)}x
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setZoom(1);
              setOffset({ x: 0, y: 0 });
            }}
          >
            <RotateCcw className="size-4" />
            Sıfırla
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setZoom(1)}>
              <Maximize2 className="size-4" />
              Sığdır
            </Button>
            <Button type="button" onClick={apply} disabled={!img}>
              <Check className="size-4" />
              Uygula
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
