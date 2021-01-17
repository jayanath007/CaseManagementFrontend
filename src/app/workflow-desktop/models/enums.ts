export enum ProgressSteps {
    Noop = 0,
    Invisible = 2,
    Started = Invisible * 2, // 4
    Processing = Started * 2, // 8
    ViewDoc = Processing * 2, // 16
    SaveConfirm = ViewDoc * 2, // 32
    EditDoc = SaveConfirm * 2 // 64
}
