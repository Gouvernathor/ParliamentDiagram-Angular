import { FieldValidator } from "@angular/forms/signals";

export const validateIsInteger: FieldValidator<number, any> = ({ value }) => {
    if (!Number.isInteger(value())) {
        return {
            kind: "integer",
            message: "The value must be an integer",
        };
    }
    return;
};
