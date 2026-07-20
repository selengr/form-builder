import React, { useMemo, useState } from "react";
import { MenuItem } from "../menuItem/MenuItem";
// constants
import { STATIC_LINKS } from "@/constants/staticLinks";
// types
import { IMenuListProps, IMenuItemData } from "@/types/menus";

const MenuList: React.FC<IMenuListProps> = ({ menuLinks, onItemClick }) => {
    const [expandedMenus, setExpandedMenus] = useState<Set<string | number>>(new Set());

    const sortedLinks = useMemo(() => {
        const serverLinks: IMenuItemData[] =
            menuLinks?.map((item) => ({
                id: item.id,
                title: item.text,
                icon: item.icon ?? "",
                link: item.a_attr?.href ?? "#",
                order: Number(item?.data?.order ?? 0),
                isStatic: false,
                langId: item?.data?.langId,
            })) ?? [];

        const staticLinks: IMenuItemData[] = STATIC_LINKS.map((item) => ({
            id: item.id,
            title: item.title,
            icon: item.icon,
            link: item.link,
            order: item.order,
            isStatic: true,
        }));

        const allLinks: IMenuItemData[] = [...serverLinks, ...staticLinks];

        const langMap = new Map(serverLinks.map((i) => [i.langId, i]));

        const managementMaster = langMap.get("acl.psya.management.master");
        const assessmentsItem = langMap.get("acl.psya.packaging.master");
        const surveyItem = langMap.get("acl.psya.survey.master");
        const dataCollection = langMap.get("acl.psya.admin.data-collection.master");
        const userreportsItem = langMap.get("acl.psya.userreports.master");
        const adminPackagingRequestItem = langMap.get("acl.psya.admin.packagingRequest.master");

        const linksWithHierarchy = allLinks
            .map((item) => {
                if (managementMaster && item.id === managementMaster.id) {
                    const children = [
                        assessmentsItem,
                        surveyItem,
                        userreportsItem,
                        dataCollection,
                        adminPackagingRequestItem,
                    ].filter(Boolean) as IMenuItemData[];

                    return { ...item, children };
                }
                return item;
            })
            .filter((item) => {
                if (!managementMaster) return true;

                return ![
                    assessmentsItem?.id,
                    surveyItem?.id,
                    userreportsItem?.id,
                    dataCollection?.id,
                    adminPackagingRequestItem?.id,
                ].includes(item.id);
            });

        return [...linksWithHierarchy].sort((a, b) => a.order - b.order);
    }, [menuLinks]);

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
                >
                    {item.children}
                </MenuItem>
            ))}
        </>
    );
};

export default MenuList;
