import ServicesNotActive from "@/../public/images/home-page/services-not.svg";
import MessagesNotActive from "@/../public/images/home-page/messages-not.svg";
import GroupNotActive from "@/../public/images/home-page/Group-not.svg";
import SearchNotActive from "@/../public/images/home-page/search-not.svg";
import MapNotActive from "@/../public/images/home-page/map-not.svg";

const endPoint = process.env.NEXT_PUBLIC_MRESALAT_ENDPOINT;
const MenuData = [
  {
    id: 1,
    title: "خانه",
    active: "",
    notActive: ServicesNotActive,
    link: `${endPoint}/`,
  },
  {
    id: 2,
    title: "ام پیام",
    active: "",
    notActive: MessagesNotActive,
    link: `${endPoint}/messenger`,
  },
  {id: 3,
    title: "رسان",
    active: "",
    notActive: GroupNotActive,
    link: `/`},
  {
    id: 4,
    title: "جست و جو",
    active: "",
    notActive: SearchNotActive,
    link: `${endPoint}/mresalat-search`,
  },
  {
    id: 5,
    title: "نقشه",
    active: "",
    notActive: MapNotActive,
    link: `${endPoint}/map`
  },
];

export {MenuData};
