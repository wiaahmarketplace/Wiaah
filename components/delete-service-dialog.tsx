'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string;
  serviceName: string;
  onConfirm: () => void;
}

export function DeleteServiceDialog({
  open,
  onOpenChange,
  serviceId,
  serviceName,
  onConfirm,
}: DeleteServiceDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete this service?</p>
            <div className="bg-gray-50 p-3 rounded-lg mt-3">
              <p className="text-sm font-medium text-gray-900">{serviceName}</p>
              <p className="text-xs text-gray-500">{serviceId}</p>
            </div>
            <p className="text-sm text-red-600 mt-3">
              This action cannot be undone. All data associated with this service will be permanently deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete Service
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
