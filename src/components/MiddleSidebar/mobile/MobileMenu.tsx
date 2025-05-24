"use client"
import Image from "next/image";
import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

// public
import Logo from "@/../public/images/home-page/psya-logo.svg";
import MenuIcon from "@/../public/images/home-page/menu/ic_menu.svg";
import Wallet from "@/../public/images/home-page/menu/wallet-minus.svg";
import ChartSquare from "@/../public/images/home-page/menu/chart-square.svg";
import GroupSquare from "@/../public/images/home-page/menu/group-square.svg";
import ShoppingCart from "@/../public/images/home-page/menu/shopping-cart.svg";
import MusicPlaylist from "@/../public/images/home-page/menu/music-playlist.svg";
import MenuItem from "../menuItem/MenuItem";
// import MenuItem from "../menuItem/MenuItem";

interface StaticLink {
    id: number;
    title: string;
    icon: any;
    link: string;
  }


const STATIC_LINKS: StaticLink[] = [
    { id: 2, title: "فرم‌های عمومی", icon: MusicPlaylist, link: "/public-form" },
    { id: 5, title: "آموزش", icon: ChartSquare, link: "/underconstruction" },
    { id: 6, title: "ارتباط با ما", icon: GroupSquare, link: "/underconstruction" },
    { id: 8, title: "سوالات پرتکرار", icon: ShoppingCart,link: "/underconstruction"},
    { id: 9, title: "قوانین و مقررات", icon: Wallet, link: "/underconstruction" },
  ];

  
const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  const list = () => (
    // <div
    //   role="presentation"
    //   onClick={toggleDrawer(false)}
    //   onKeyDown={toggleDrawer(false)}
    // >
      <>
        {STATIC_LINKS.map((item) => (
             <MenuItem
             key={item.id}
             title={item.title}
             href={item.link}
             icon={item.icon}
           />
        //   <ListItem button key={item.id}>
        //     <ListItemIcon>
        //       <img src={item.icon.src} alt={item.title} width={24} height={24} />
        //     </ListItemIcon>
        //     <ListItemText primary={item.title} />
        //   </ListItem>
        ))}
      </>
    // </div>
  );

  return (
    <>

          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
             <Image src={MenuIcon} alt="icon" width={32} height={32} priority />
          </IconButton>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div
              className="max-w-[400px] min-w-full w-full min-h-screen bg-white px-5 py-5 flex flex-col gap-8 overflow-y-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="w-full flex flex-col gap-5 items-start">
                <Image src={Logo} width={111} height={38} alt="Psya-Logo" priority />
                <div className="flex flex-col items-start w-full gap-5">
                 
          {list()}
        </div>
        </div>
      </div>
    
      </Drawer>
    </>
  );
};

export default MobileMenu;
