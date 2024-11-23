import MemberShipNot from "@/../public/images/home-page/membership-not.svg";
import MemberShipActive from "@/../public/images/home-page/membership-active.svg";
import BazarNot from "@/../public/images/home-page/bazar-not-ac.svg";
import BazarActive from "@/../public/images/home-page/bazar-act.svg";
import BookNot from "@/../public/images/home-page/book-not.svg";
import BookActive from "@/../public/images/home-page/book-act.svg";
import AllFilterNot from "@/../public/images/home-page/allFilter-not.svg";
import AllFilterIcon from "@/../public/images/home-page/allFilter.svg";
import BankNot from "@/../public/images/home-page/bancking-not.svg";
import BankAct from "@/../public/images/home-page/bancking-act.svg";
import MsgNot from "@/../public/images/home-page/msg-not.svg";
import MsgAct from "@/../public/images/home-page/msg-act.svg";

export const TabData = [
  {
    id: 0,
    title: "همه",
    activeIcon: AllFilterIcon,
    notActiveIcon: AllFilterNot,
    show: true,
  },
  {
    id: 1,
    title: "عضویت ام رسالت",
    activeIcon: MemberShipActive,
    notActiveIcon: MemberShipNot,
    show: true,
  },
  {
    id: 2,
    title: "ام حامی",
    activeIcon: MemberShipActive,
    notActiveIcon: MemberShipNot,
    show: true,
  },
  {
    id: 3,
    title: "انجمن حامیان",
    show: true,
  },
  {
    id: 4,
    title: "خدمات غیر حضوری",
    show: false,
  },
  {
    id: 5,
    title: "ام بازار",
    activeIcon: BazarActive,
    notActiveIcon: BazarNot,
    show: true,
  },
  {
    id: 6,
    title: "حسابداری",
    activeIcon: BookActive,
    notActiveIcon: BookNot,
    show: true,
  },
  {
    id: 7,
    title: "رسالت آسمانی",
    activeIcon: AllFilterIcon,
    notActiveIcon: AllFilterNot,
    show: true,
  },
  {
    id: 8,
    title: "خدمات بانکی",
    activeIcon: BankAct,
    notActiveIcon: BankNot,
    show: true,
  },
  {
    id: 10,
    title: "رسان",
    activeIcon: MsgAct,
    notActiveIcon: MsgNot,
    show: true,
  },
  {
    id: 11,
    title: "ام بیمه",
    show: true,
  },
  {
    id: 12,
    title: "سامانه های مرتبط",
    show: true,
  },
];
