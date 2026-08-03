import { Injectable, WritableSignal } from "@angular/core";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Injectable({
    providedIn: "root",
})
export class ReorderingService {
    add<T>(list: WritableSignal<readonly T[]>, item: T) {
        list.update(p => p.concat([item]));
    }

    remove<T>(list: WritableSignal<readonly T[]>, index: number) {
        list.update(p => {
            const s = p.slice();
            s.splice(index, 1);
            return s;
        });
    }

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
