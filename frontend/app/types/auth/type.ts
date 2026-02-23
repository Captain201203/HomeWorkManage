
export interface IUser {
  username: string;
  role: 'admin' | 'teacher' | 'student';
  accountId: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}