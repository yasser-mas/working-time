export default class TimerError extends Error {

    constructor( public message: string ){
        super();
    }
}