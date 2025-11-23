export type BookFormat = 'EPUB'

export type ChapterContentNumber = string // later we have to grab chapter number by toc hash
export type TocLeftNumberProgress = number // position from left to right

export type IProgress = [ChapterContentNumber, TocLeftNumberProgress]
