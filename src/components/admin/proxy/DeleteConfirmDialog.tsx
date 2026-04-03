import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface Props {
  entryName: string;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ entryName, onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");

  const canDelete = typed === entryName;

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm();
      setOpen(false);
      setTyped("");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setTyped(""); }}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this proxy?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              This proxy link may be in use across live environments. Deleting it is
              <strong className="text-destructive"> irreversible</strong> and will break
              all integrations using it.
            </span>
            <span className="block">
              To confirm, type the proxy name exactly:
            </span>
            <span className="block rounded bg-muted px-2 py-1 font-mono text-sm font-semibold text-foreground">
              {entryName}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="confirm-delete">Type proxy name to confirm</Label>
          <Input
            id="confirm-delete"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={entryName}
            autoComplete="off"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={!canDelete}
            onClick={handleConfirm}
          >
            Delete Permanently
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
