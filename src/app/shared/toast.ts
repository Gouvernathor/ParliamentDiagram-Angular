import { inject, Service } from "@angular/core";
import { MatSnackBar, type MatSnackBarConfig } from "@angular/material/snack-bar";

@Service()
export class Toast {
    private readonly snackbar = inject(MatSnackBar);

    error(message: string, options?: MatSnackBarConfig) {
        this.snackbar.open(
            message,
            undefined, {
                duration: 5000,
                horizontalPosition: "right",
                ...options,
        });
    }
}
