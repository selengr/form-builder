interface IconProps {
  size?: number;
}

export function GalleryIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.2526 20.1663H13.7526C18.3359 20.1663 20.1693 18.333 20.1693 13.7497V8.24967C20.1693 3.66634 18.3359 1.83301 13.7526 1.83301H8.2526C3.66927 1.83301 1.83594 3.66634 1.83594 8.24967V13.7497C1.83594 18.333 3.66927 20.1663 8.2526 20.1663Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.2474 9.16667C8.73363 9.16667 9.19994 8.97351 9.54376 8.6297C9.88757 8.28588 10.0807 7.81956 10.0807 7.33333C10.0807 6.8471 9.88757 6.38079 9.54376 6.03697C9.19994 5.69315 8.73363 5.5 8.2474 5.5C7.76117 5.5 7.29485 5.69315 6.95103 6.03697C6.60722 6.38079 6.41406 6.8471 6.41406 7.33333C6.41406 7.81956 6.60722 8.28588 6.95103 8.6297C7.29485 8.97351 7.76117 9.16667 8.2474 9.16667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.44531 17.3712L6.96448 14.337C7.68865 13.8512 8.73365 13.9062 9.38448 14.4653L9.68698 14.7312C10.402 15.3453 11.557 15.3453 12.272 14.7312L16.0853 11.4587C16.8003 10.8445 17.9553 10.8445 18.6703 11.4587L20.1645 12.742"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MusicIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.60708 17.16C8.60708 18.8205 7.26095 20.1667 5.60042 20.1667C3.93988 20.1667 2.59375 18.8205 2.59375 17.16C2.59375 15.4995 3.93988 14.1533 5.60042 14.1533C7.26095 14.1533 8.60708 15.4995 8.60708 17.16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.1071 15.4002C19.1071 17.0608 17.761 18.4069 16.1004 18.4069C14.4399 18.4069 13.0938 17.0608 13.0938 15.4002C13.0938 13.7397 14.4399 12.3936 16.1004 12.3936C17.761 12.3936 19.1071 13.7397 19.1071 15.4002Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.60938 17.1597V8.70799M8.60938 8.70799V5.77466C8.60938 4.58299 9.33354 3.75799 10.3785 3.47382L16.0985 1.91549C17.611 1.50299 19.1052 1.83299 19.1052 4.21632V5.84799M8.60938 8.70799L19.1052 5.84799M19.1052 5.84799V15.3997"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReplaceIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.625 7.12535C2.85256 5.81342 3.4852 4.60566 4.43413 3.6716C5.38307 2.73753 6.60066 2.12404 7.91602 1.91722C9.23138 1.7104 10.5785 1.92064 11.7683 2.51843C12.9581 3.11622 13.9308 4.07155 14.55 5.25035M15.375 10.8753C15.1474 12.1873 14.5148 13.395 13.5659 14.3291C12.6169 15.2632 11.3993 15.8767 10.084 16.0835C8.76862 16.2903 7.42151 16.0801 6.23172 15.4823C5.04193 14.8845 4.06918 13.9291 3.45 12.7503"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.625 2.25V5.4H11.475M3.375 15.75V12.6H6.525"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.75 4.485C13.2525 4.2375 10.74 4.11 8.235 4.11C6.75 4.11 5.265 4.185 3.78 4.335L2.25 4.485M6.375 3.7275L6.54 2.745C6.66 2.0325 6.75 1.5 8.0175 1.5H9.9825C11.25 1.5 11.3475 2.0625 11.46 2.7525L11.625 3.7275M14.1375 6.855L13.65 14.4075C13.5675 15.585 13.5 16.5 11.4075 16.5H6.5925C4.5 16.5 4.4325 15.585 4.35 14.4075L3.8625 6.855M7.7475 12.375H10.245M7.125 9.375H10.875"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
