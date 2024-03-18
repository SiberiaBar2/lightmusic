import cloud from "assets/cloud.jpg";
import light from "assets/light.jpg";
import night from "assets/night.jpg";
import settingSun from "assets/setting-sun.jpg";
import sky from "assets/sky.jpg";

const backList = [cloud, light, night, settingSun, sky];

export const getBack = () => {
  return backList[Math.floor(Math.random() * 5)];
};
