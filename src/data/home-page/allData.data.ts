import {
  memberShipData,
  mhami,
  bazarData,
  accountingData,
  heavenlyMissionData,
  banckingServicesData,
  messangerData,
  nonAttendanceServices,
} from "@/data/home-page";
import { loanData } from "./loan.data";
import { bimeData } from "./bime.data";
import { otherData } from "./other.data";

export const AllData = [
  {
    id: 1,
    name: "عضویت ام رسالت",
    tab: "عضویت ام رسالت",
    data: memberShipData,
    showMenu: true,
  },
  { id: 2, name: "ام حامی", tab: "ام حامی", data: mhami, showMenu: true },
  {
    id: 3,
    name: "انجمن حامیان فرهنگ قرض الحسنه و کار آفرینی اجتماعی",
    tab: "انجمن حامیان",
    data: loanData,
    showMenu: true,
  },
  {
    id: 4,
    name: "خدمات غیر حضوری",
    tab: "خدمات غیر حضوری",
    data: nonAttendanceServices,
    showMenu: false,
  },
  { id: 5, name: "ام بازار", tab: "ام بازار", data: bazarData, showMenu: true },
  {
    id: 6,
    name: "حسابداری اعضا",
    tab: "حسابداری اعضا",
    data: accountingData,
    showMenu: true,
  },
  {
    id: 7,
    name: "رسالت آسمانی",
    tab: "رسالت آسمانی",
    data: heavenlyMissionData,
    showMenu: true,
  },
  {
    id: 8,
    name: "خدمات بانکی",
    tab: "خدمات بانکی",
    data: banckingServicesData,
    showMenu: true,
  },
  {
    id: 9,
    name: "رسان",
    tab: "رسان",
    data: messangerData,
    showMenu: true,
  },
  { id: 10, name: "ام بیمه", tab: "ام بیمه", data: bimeData, showMenu: true },
  {
    id: 11,
    name: "سامانه های مرتبط",
    tab: "سامانه های مرتبط",
    data: otherData,
    showMenu: true,
  },
];
