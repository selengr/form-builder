import React, { useState } from "react";
import { MenuItem } from "../menuItem/MenuItem";
import { IMenuListProps, IMenuItemData } from "@/types/menus";
import { STATIC_LINKS } from "@/constants/staticLinks";

const MenuList: React.FC<IMenuListProps> = ({ menuLinks, onItemClick }) => {
  const [expandedMenus, setExpandedMenus] = useState<Set<string | number>>(new Set());

  const serverLinks: IMenuItemData[] =
    menuLinks?.map((item) => ({
      id: item.id,
      title: item.text,
      icon: item.icon,
      link: item.a_attr?.href ?? "#",
      order: parseInt(item.data.order, 10),
      isStatic: false,
      langId: item.data.langId,
    })) || [];

  const staticLinks: IMenuItemData[] = STATIC_LINKS.map((item) => ({
    id: item.id,
    title: item.title,
    icon: item.icon,
    link: item.link,
    order: item.order,
    isStatic: true,
  }));

  const allLinks: IMenuItemData[] = [...serverLinks, ...staticLinks];

  const managementMaster = serverLinks.find((item) => item.langId === "acl.psya.management.master");
  const assessmentsItem = serverLinks.find((item) => item.langId === "acl.psya.packaging.master");

  const linksWithHierarchy = allLinks
    .map((item) => {
      if (managementMaster && assessmentsItem && item.id === managementMaster.id) {
        return { ...item, children: [assessmentsItem] };
      }
      return item;
    })
    .filter((item) => !(managementMaster && assessmentsItem && item.id === assessmentsItem.id));

  const sortedLinks = linksWithHierarchy.sort((a, b) => a.order - b.order);

  const handleToggle = (id: string | number) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <>
      {sortedLinks.map((item) => (
        <MenuItem
          key={item.id}
          id={item.id}
          href={item.link}
          icon={item.icon}
          title={item.title}
          onClick={onItemClick}
          hasChildren={!!item.children?.length}
          isExpanded={expandedMenus.has(item.id)}
          onToggle={() => handleToggle(item.id)}
          children={item.children}
        />
      ))}
    </>
  );
};

export default MenuList;
