import { cva } from 'class-variance-authority'

export const typography = cva('not-italic select-none', {
  variants: {
    text: {
      h1: 'text-h1 font-[400] leading-[30px] tracking-[0.02em]',
      h2: 'text-h2 font-[400] leading-[24px] tracking-[0.02em]',
      h3: 'text-h3 font-[400] leading-[22px] tracking-[0.02em]',
      h2Medium: 'text-h2 font-bold leading-[26px] tracking-[0.02em]',
      caption: 'text-caption font-[400] leading-[16px] tracking-[0.02em]',
      captionMedium: 'text-caption font-[700] leading-[14px] tracking-[0.02em]',
      body: 'text-body font-[400] leading-[16px] tracking-[0.02em]',
      bodyBold: 'text-body font-bold leading-[16px] tracking-[0.02em]',
      small: 'text-smallText font-[400] leading-[14px] tracking-[0.02em]',
      smallBold: 'text-smallText font-bold leading-[14px] tracking-[0.02em]',
      tiny: 'text-textXs leading-[12px] tracking-[0.02em]',
      tinyBold: 'text-textXs font-bold leading-[12px] tracking-[0.02em]',
    },
    color: {
      white: 'text-white-100',
    },
    ellipsis: {
      true: 'text-ellipsis overflow-hidden whitespace-nowrap',
    },
    center: {
      true: 'text-center',
    },
    right: {
      true: 'text-right',
    },
    left: {
      true: 'text-left',
    },
    uppercase: {
      true: 'uppercase',
    },
    lowercase: {
      true: 'lowercase',
    },
    capitalize: {
      true: 'capitalize',
    },
    font: {
      default: 'font-ubuntu',
    },
  },
  defaultVariants: {
    font: 'default',
    color: 'white',
  },
})
