import { Injectable, WritableSignal } from "@angular/core";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Injectable({
    providedIn: "root",
})
export class ReorderingService {
    moveUp<T>(list: WritableSignal<readonly T[]>, originalIndex: number) {
        this.switch(list, originalIndex, originalIndex-1);
    }

    moveDown<T>(list: WritableSignal<readonly T[]>, originalIndex: number) {
        this.switch(list, originalIndex, originalIndex+1);
    }

    drop<T>(list: WritableSignal<readonly T[]>, { previousIndex, currentIndex }: CdkDragDrop<unknown, unknown, unknown>) {
        this.switch(list, previousIndex, currentIndex);
    }

    private switch<T>(list: WritableSignal<readonly T[]>, indexA: number, indexB: number) {
        list.update(p => {
            const s = p.slice();
            s.splice(indexA, 0, ...s.splice(indexB, 1));
            return s;
        });
    }
}
