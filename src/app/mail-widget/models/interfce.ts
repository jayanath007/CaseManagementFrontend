import { Message } from '../../core/lib/microsoft-graph';

export class MailItemResponse {
    constructor(public items: Message[], public total: number) { }
}
