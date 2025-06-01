import Action from './action';

/**
 * Encapsulates information required to perform specified action when supported by receiver.
 */
export default class Command extends Action {
    processingInstuctions;
    result;

    constructor(type, payload, processingInstuctions, result) {
        super(type, payload);
        this.processingInstuctions = processingInstuctions;
        this.result = result;
    }
}