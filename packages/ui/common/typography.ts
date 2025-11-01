import { cva } from "class-variance-authority";

export const typography = cva("not-italic select-none", {
  variants: {
    text: {},
    color: {
      white: "text-white-100",
    },
    ellipsis: {
      true: "text-ellipsis overflow-hidden whitespace-nowrap",
    },
    font: {
      default: "font-[family-name:Akatab], sans-serif",
    },
  },
  defaultVariants: {
    font: "default",
    // text: "body",
    color: "white",
  },
});
