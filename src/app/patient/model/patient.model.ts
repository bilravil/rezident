export class Patient {
    id: string;
    first: string;
    last: string;
    middle: string;
    sex: number;

    constructor( first: string, last: string, middle: string, sex: number) {
        this.first = first;
        this.last = last;
        this.middle = middle;
        this.sex = sex;
    }
}
