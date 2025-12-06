export const setStylesImportant = (el: HTMLElement, styles: Record<string, string>) => {
  Object.entries(styles).forEach(([k, v]) => el.style.setProperty(k, v, 'important'))
}

export const getStyles = (lineHeight: string) => {
  return `
    a[href], a[href]:link, a[href]:visited, a[href]:hover, a[href]:active {
      color: #fff !important;
      text-decoration: underline dotted !important;
    }
    
    p, li, blockquote, dd {
      line-height: ${lineHeight || '1.5'};
      text-align: start;
      -webkit-hyphens: manual;
      hyphens: manual;
      -webkit-hyphenate-limit-before: 3;
      -webkit-hyphenate-limit-after: 2;
      -webkit-hyphenate-limit-lines: 2;
      hanging-punctuation: allow-end last;
      widows: 2;
    }
    
    [align="left"] { 
      text-align: left; 
    }

    [align="right"] { 
      text-align: right;
    }
      
    [align="center"] { 
      text-align: center;
    }

    [align="justify"] {
      text-align: justify;
    }

    pre {
      white-space: pre-wrap !important;
    }
  `
}
