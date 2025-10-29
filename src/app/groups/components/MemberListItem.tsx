import { SwitchButton } from "@/components/Switch/SwitchButton";
import { IUserGroupMemmerInfo } from "@/types/setting";
import { Checkbox } from "@mui/material";

interface MemberListItemProps {
  member: IUserGroupMemmerInfo;
  selectedUsers: number[];
  handleUserCheckboxChange: (id: number, checked: boolean) => void;
  handleChangeStatus: (isActive: boolean, id: number, rememberAllocation?: boolean) => void;
  disabledSwitches: number[];
}


export const MemberListItem = ({ member, selectedUsers, handleUserCheckboxChange, handleChangeStatus, disabledSwitches }: MemberListItemProps) => (
  <li className='relative flex items-center justify-between p-4 hover:bg-gray-50'>
    <div className='flex items-center gap-3'>
      <Checkbox
        checked={selectedUsers.includes(member.introducedUserJTGroupId)}
        onChange={(e) => handleUserCheckboxChange(member.introducedUserJTGroupId, e.target.checked)}
        sx={{ color: '#1758BA', '&.Mui-checked': { color: '#1758BA' } }}
      />
      <span className='text-gray-800 font-medium'>{member.userName} {member.userFamily}</span>
      <span className='text-gray-500 text-sm hidden sm:block'>نام کاربری: {member.userUsername}</span>
    </div>
    <SwitchButton
      sx={{ position: 'absolute', top: 20, right: 25 }}
      checked={member.invalid}
      disabled={disabledSwitches.includes(member.introducedUserJTGroupId)}
      onChange={() => handleChangeStatus(member.invalid!, member.introducedUserJTGroupId)}
    />
  </li>
);
