export interface ScreenViewBoostrapComponent {
  token: string;
  inputData: ScreenViewInitials;
}

export interface ScreenViewInitials {
   appId: Number;
   screenId: string;
   screenIds: Array<string>;
}

