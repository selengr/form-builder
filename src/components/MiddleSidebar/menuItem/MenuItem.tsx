import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";

import { MenuIcon } from "./MenuIcon";
import SubMenuItem from "./subMenu/SubMenuItem";

// type
import { IMenuItemProps } from "@/types/menus";

export const MenuItem = React.memo(
  ({
    href,
    icon,
    title,
    onClick,
    hasChildren = false,
    isExpanded = false,
    onToggle,
    children,
  }: IMenuItemProps) => {
    const pathname = usePathname();
    const iconPath = `/api/images?folder=menu&file=${icon}`;

    const isActive =
      pathname === href ||
      children?.some((child) => pathname === child.link);

    return (
      <div className="w-full">
        <div
          style={{ userSelect: "none" }}
          className={`
            group relative w-full rounded-xl pt-3
            transition-all duration-300 ease-out
            overflow-hidden
            ${isActive
              ? "bg-[#F7F9FC]"
              : "hover:bg-[#F7F9FC] active:bg-[#EEF2F6]"
            }
          `}
        >
          <div className="border-b border-[#DDE1E6]">
            {/* active indicator */}
            <div
              className={`
                absolute right-0 top-0 h-full w-[4px]
                rounded-l-full transition-all duration-300
                ${isActive
                  ? "bg-[#2CDFC9] opacity-100"
                  : "opacity-0 group-hover:opacity-40 bg-[#2CDFC9]"
                }
              `}
            />

            {hasChildren ? (
              <button
                onClick={onToggle}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2
                  transition-transform duration-200
                  ${isActive ? "translate-x-[4px]" : "group-hover:translate-l-[1px]"}
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      transition-transform duration-300
                      ${isActive ? "scale-105" : "group-hover:scale-105"}
                    `}
                  >
                    <MenuIcon src={iconPath} size={22} />
                  </div>

                  <p
                    className="
                      text-[13px] sm:text-[14px]
                      font-semibold sm:font-bold
                      text-[#1F2937]
                      transition-all duration-200
                    "
                  >
                    {title}
                  </p>
                </div>


                {isExpanded ? (
                  <IoIosArrowDown size="1.3rem" color="#292D32" />
                ) : (
                  <IoIosArrowBack
                    size="1.3rem"
                    color="#292D32"
                    className="group-hover:ml-0.5 transition-transform "
                  />
                )}
              </button>
            ) : (
              <Link
                href={href}
                onClick={onClick}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2
                  transition-transform duration-200
                  ${isActive ? "translate-x-[4px]" : "group-hover:translate-l-[1px]"}
                `}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      transition-transform duration-300
                      ${isActive ? "scale-105" : "group-hover:scale-105"}
                    `}
                  >
                    <MenuIcon src={iconPath} size={22} />
                  </div>

                  <p
                    className="
                      text-[13px] sm:text-[14px]
                      font-semibold sm:font-bold
                      text-[#1F2937]
                      transition-all duration-200
                    "
                  >
                    {title}
                  </p>
                </div>

                <IoIosArrowBack
                  size="1.1rem"
                  color={isActive ? "#0066CC" : "#4B5563"}
                  className="transition-all duration-300 group-hover:-translate-x-1"
                />
              </Link>
            )}
          </div>

          {hasChildren && isExpanded && children && (
            <div className="bg-[#F8F9FA]">
              <div
                className="
                  mr-3 pr-2
                  flex flex-col
                "
              >
                {children.map((child) => (
                  <SubMenuItem
                    key={child.id}
                    id={child.id}
                    href={child.link}
                    icon={child.icon}
                    title={child.title}
                    onClick={onClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);


// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";

// import { MenuIcon } from "./MenuIcon";
// import SubMenuItem from "./subMenu/SubMenuItem";

// // type
// import { IMenuItemProps } from "@/types/menus";

// export const MenuItem = React.memo(
//   ({
//     href,
//     icon,
//     title,
//     onClick,
//     hasChildren = false,
//     isExpanded = false,
//     onToggle,
//     children,
//   }: IMenuItemProps) => {
//     const pathname = usePathname();

//     const iconPath = `/api/images?folder=menu&file=${icon}`;

//     // active states
//     const isActive =
//       pathname === href ||
//       children?.some((child) => pathname === child.link);

//     return (
//       <div className="w-full">
//         <div
//           style={{ userSelect: "none" }}
//           className={`
//             group relative w-full rounded-xl
//             transition-all duration-300 ease-out
//             overflow-hidden
//             ${
//               isActive
//                 ? "bg-[#F3F8FF]"
//                 : "hover:bg-[#F7F9FC] active:bg-[#EEF2F6]"
//             }
//           `}
//         >
//           {/* active left indicator */}
//           <div
//             className={`
//               absolute right-0 top-0 h-full w-[4px]
//               rounded-l-full transition-all duration-300
//               ${
//                 isActive
//                   ? "bg-[#0066CC] opacity-100"
//                   : "opacity-0 group-hover:opacity-40 bg-[#0066CC]"
//               }
//             `}
//           />

//           {hasChildren ? (
//             <button
//               onClick={onToggle}
//               className="
//                 w-full flex items-center justify-between
//                 px-4 py-3
//               "
//             >
//               {/* left content */}
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`
//                     transition-transform duration-300
//                     ${isActive ? "scale-105" : "group-hover:scale-105"}
//                   `}
//                 >
//                   <MenuIcon src={iconPath} size={22} />
//                 </div>

//                 <p
//                   className={`
//                     text-[13px] sm:text-[14px]
//                     transition-all duration-200
//                     ${
//                       isActive
//                         ? "text-[#0066CC] font-semibold"
//                         : "text-[#1F2937] font-medium"
//                     }
//                   `}
//                 >
//                   {title}
//                 </p>
//               </div>

//               {/* arrow */}
//               <div
//                 className={`
//                   transition-all duration-300
//                   ${isExpanded ? "rotate-0" : "rotate-0"}
//                 `}
//               >
//                 {isExpanded ? (
//                   <IoIosArrowDown
//                     size="1.1rem"
//                     color={isActive ? "#0066CC" : "#4B5563"}
//                     className="transition-all duration-300"
//                   />
//                 ) : (
//                   <IoIosArrowBack
//                     size="1.1rem"
//                     color={isActive ? "#0066CC" : "#4B5563"}
//                     className="
//                       transition-all duration-300
//                       group-hover:-translate-x-0.5
//                     "
//                   />
//                 )}
//               </div>
//             </button>
//           ) : (
//             <Link
//               href={href}
//               onClick={onClick}
//               className="
//                 w-full flex items-center justify-between
//                 px-4 py-3
//               "
//             >
//               {/* left content */}
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`
//                     transition-transform duration-300
//                     ${isActive ? "scale-105" : "group-hover:scale-105"}
//                   `}
//                 >
//                   <MenuIcon src={iconPath} size={22} />
//                 </div>

//                 <p
//                   className={`
//                     text-[13px] sm:text-[14px]
//                     transition-all duration-200
//                     ${
//                       isActive
//                         ? "text-[#0066CC] font-semibold"
//                         : "text-[#1F2937] font-medium"
//                     }
//                   `}
//                 >
//                   {title}
//                 </p>
//               </div>

//               <IoIosArrowBack
//                 size="1.1rem"
//                 color={isActive ? "#0066CC" : "#4B5563"}
//                 className="
//                   transition-all duration-300
//                   group-hover:-translate-x-0.5
//                 "
//               />
//             </Link>
//           )}
//         </div>

//         {/* submenu wrapper */}
//         {hasChildren && children && (
//           <div
//             className={`
//               overflow-hidden transition-all duration-300 ease-in-out
//               ${
//                 isExpanded
//                   ? "max-h-[1000px] opacity-100 mt-1"
//                   : "max-h-0 opacity-0"
//               }
//             `}
//           >
//             <div
//               className="
//                 mr-3 pr-2
//                 border-r border-[#E4E7EB]
//                 flex flex-col gap-1
//               "
//             >
//               {children.map((child) => (
//                 <SubMenuItem
//                   key={child.id}
//                   id={child.id}
//                   href={child.link}
//                   icon={child.icon}
//                   title={child.title}
//                   onClick={onClick}
//                 />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// );




// import React from 'react';
// import Link from 'next/link';
// import { MenuIcon } from './MenuIcon';
// import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
// // type
// import { IMenuItemProps } from '@/types/menus';
// import SubMenuItem from './subMenu/SubMenuItem'

// export const MenuItem = React.memo(
//   ({
//     id,
//     href,
//     icon,
//     title,
//     onClick,
//     hasChildren = false,
//     isExpanded = false,
//     onToggle,
//     children,
//   }: IMenuItemProps) => {
//     const iconPath = `/api/images?folder=menu&file=${icon}`;

//     return (
//       <div className="w-full">
//         <div
//           className="gap-1 w-full py-2 rounded-sm duration-300 group border-b border-[#DDE1E6]"
//           style={{ userSelect: 'none' }}
//         >
//           {hasChildren ? (
//             <button
//               onClick={onToggle}
//               className="w-full flex items-center justify-between"
//             >
//               <div className="flex items-center gap-2">
//                 <MenuIcon src={iconPath} />
//                 <p className="text-[14px] text-black font-bold">{title}</p>
//               </div>

//               {isExpanded ? (
//                 <IoIosArrowDown size="1.3rem" color="#292D32" />
//               ) : (
//                 <IoIosArrowBack
//                   size="1.3rem"
//                   color="#292D32"
//                   className="group-hover:ml-0.5 transition-all "
//                 />
//               )}
//             </button>
//           ) : (
//             <Link
//               href={href}
//               onClick={onClick}
//               className="w-full flex items-center justify-between"
//             >
//               <div className="flex items-center gap-2">
//                 <MenuIcon src={iconPath} />
//                 <p className="text-xs sm:text-[14px] text-black font-bold">{title}</p>
//               </div>

//               <IoIosArrowBack
//                 size="1.3rem"
//                 color="#292D32"
//                 className="group-hover:ml-0.5 transition-all size-[1rem] sm:size-[1.3rem]"
//               />
//             </Link>
//           )}
//         </div>

//         {hasChildren && isExpanded && children && (
//           <div className="bg-[#F8F9FA]">
//             {children.map((child) => (
//               <SubMenuItem
//                 key={child.id}
//                 id={child.id}
//                 href={child.link}
//                 icon={child.icon}
//                 title={child.title}
//                 onClick={onClick}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }
// );
