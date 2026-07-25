import { IUserGroupMemmerInfo } from "@/types/setting";
import { SwitchButton } from "@/components/Switch/SwitchButton";

interface MemberListItemProps {
  member: IUserGroupMemmerInfo;
  selectedUsers: number[];
  handleUserCheckboxChange: (id: number, checked: boolean) => void;
  handleChangeStatus: (isActive: boolean, id: number, rememberAllocation?: boolean) => void;
  disabledSwitches: number[];
}


export const MemberListItem = ({ member, selectedUsers, handleUserCheckboxChange, handleChangeStatus, disabledSwitches }: MemberListItemProps) => (
  <li className="flex items-center justify-between p-4 hover:bg-gray-50">
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 w-[80%] justify-between">
      <span className="text-gray-800 font-medium">
        {member.userName} {member.userFamily}
      </span>

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-6">
        <span className="text-gray-500 text-sm justify-end">
          نام کاربری: {member.userUsername}
        </span>

        <span className="text-gray-500 text-sm">
          {member.userGender}
        </span>
      </div>

    </div>

    <SwitchButton
      checked={!member.invalid}
      disabled={disabledSwitches.includes(member.introducedUserJTGroupId)}
      onChange={() =>
        handleChangeStatus(member.invalid!, member.introducedUserJTGroupId)
      }
    />
  </li>

);
