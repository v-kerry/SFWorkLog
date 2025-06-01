export const ACTION_TYPE = {
    // Navigation commands
    NavigateBack: 'navigate-back',
    NavigateForward: 'navigate-forward',
    NavigateFinish: 'navigate-finish',
    NavigateCancel: 'navigate-cancel',
    NavigatePause: 'navigate-pause',
    // Navigation notifications
    BeforeNavigateBack: 'before-navigate-back',
    BeforeNavigateForward: 'before-navigate-forward',
    BeforeNavigateFinish: 'before-navigate-finish',
    BeforeNavigateCancel: 'before-navigate-cancel',
    // refresh view notification
    RefreshView: 'refresh-view',
    // MLRS UI events processed via as a Platform Event
    MLRSUserEvent: 'mlrs-user-event',
    // Close view command
    Close: 'close',
    Cancel: 'cancel',
    BeforeCommit: 'before-commit',
    BrandedButtonClick: 'branded-button-click',
    PopoverOpen: 'popover-open',
    PopoverClose: 'popover-close',
    LandStatusOpen: 'land-status-open'
    
};

export const REFRESH_TYPE = {
    // specfies scope/type for refresh
    RelatedCases: 'related-cases',
    RelatedCaseBatch: 'related-case-batch'
};