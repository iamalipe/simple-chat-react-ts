export interface UserInterface extends Realm.Services.MongoDB.Document {
  _id: string;
  email: string;
  profileImage: string;
  createdAt: Date;
  modifyAt: Date;
}
