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

interface StatusToggleConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityName: string;
  entityType: string;
  currentStatus: "active" | "inactive";
  onConfirm: () => void;
}

const StatusToggleConfirmDialog = ({
  open,
  onOpenChange,
  entityName,
  entityType,
  currentStatus,
  onConfirm,
}: StatusToggleConfirmDialogProps) => {
  const isDeactivating = currentStatus === "active";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDeactivating ? "Deactivate" : "Activate"} {entityType}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {isDeactivating ? "deactivate" : "activate"}{" "}
            <strong>{entityName}</strong>?
            {isDeactivating
              ? ` This ${entityType.toLowerCase()} will become inactive and won't be accessible until reactivated.`
              : ` This ${entityType.toLowerCase()} will become active and accessible again.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            style={{
              backgroundColor: isDeactivating ? undefined : "#0d9488",
            }}
            className={isDeactivating ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "text-white hover:opacity-90"}
          >
            {isDeactivating ? "Deactivate" : "Activate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusToggleConfirmDialog;
