import { scroller } from "react-scroll";

export const scrollToSection = (name) => {
  scroller.scrollTo(name, {
    duration: 700,
    smooth: true,
    offset: -80, // agar navbar fixed hai
  });
};
