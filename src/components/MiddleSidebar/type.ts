interface IUser {
  id: number;
  fullName: string;
  username: string;
  nationalCode: string;
  dateOfBorn: string | null;
  citizen: string | null;
}

interface IState {
  opened: boolean;
  disabled: boolean;
  selected: boolean;
}

interface IAAttr {
  href: string | null;
  target: string;
}

interface IData {
  aclType: string;
  depth: number;
  method: string | null;
  hidden: boolean;
  invalid: boolean;
  langId: string;
  parentId: string | null;
}

export interface IACLItem {
  id: string;
  text: string;
  icon: string | null;
  state: IState;
  a_attr: IAAttr;
  type: 'operation' | 'menu';
  data: IData;
  children: IACLItem[];
  li_attr: string | null;
}

interface IUserRole {
  eventId: string;
  processUUID: string;
  roleId: number;
  roleName: string;
  roleType: string | null;
  roleAccessType: string | null;
  accessIdList: number[];
  isBackRole: boolean;
  instanceId: number | null;
  instanceTitle: string | null;
  instanceFa: string | null;
  instanceEn: string | null;
  userId: string | null;
  invalid: boolean;
}

export interface IMenuResponseData {
  user: IUser;
  aclList: IACLItem[];
  userRoles: IUserRole[];
}
