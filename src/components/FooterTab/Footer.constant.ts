import MessagesNotActive from "@/../public/images/home-page/messages-not.svg";
import GroupNotActive from "@/../public/images/home-page/Group-not.svg";
import SearchNotActive from "@/../public/images/home-page/search-not.svg";
import MapNotActive from "@/../public/images/home-page/map-not.svg";

const FooterData = [
  {
    id: 2,
    title: "گفتگو",
    active: "",
    notActive: MessagesNotActive,
    link: "Conversation",
  },
  { id: 3, title: "رسان", active: "", notActive: GroupNotActive, link: "" },
  {
    id: 4,
    title: "جست و جو",
    active: "",
    notActive: SearchNotActive,
    link: "mresalat-search",
  },
  { id: 5, title: "نقشه", active: "", notActive: MapNotActive, link: "" },
];

export { FooterData };
