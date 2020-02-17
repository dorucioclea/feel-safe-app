export interface UserSource {
  id: string,
  username: string,
  avatar: string,
  email: string,
}

export class UserModel {
  public id: string;
  public username: string;
  public avatarId: string;
  public email: string;
  public providerLogin: boolean;

  constructor(source: UserSource) {
    this.id = source.id;
    this.username = source.username;
    this.avatarId = source.avatar;
    this.email = source.email;
    this.providerLogin = /@.+\.passport/.test(this.email);
  }
}