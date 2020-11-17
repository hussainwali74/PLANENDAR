export class Person {
  _id: string;
  name: string;
  mail: string;
  email?: string;
  class: string;
  selected?: boolean;
  friends?: [];
  friendrequests?: [];
  notifications?: [];
  photo?: string = "";
}
