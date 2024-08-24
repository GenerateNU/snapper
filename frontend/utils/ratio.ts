import { Dimensions } from "react-native";

// Figma design dimensions
const designWidth = 393;
const designHeight = 852;

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const widthRatio = windowWidth / designWidth;
export const heightRatio = windowHeight / designHeight;

export const scaleWidth = (size: number) => size * widthRatio;

export const scaleHeight = (size: number) => size * heightRatio;
