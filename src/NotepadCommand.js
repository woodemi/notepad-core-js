export default class NotepadCommand {
    request;
    intercept;
    handle;

    constructor(request, intercept, handle) {
        this.request = request;
        this.intercept = intercept;
        this.handle = handle;
    }
}
