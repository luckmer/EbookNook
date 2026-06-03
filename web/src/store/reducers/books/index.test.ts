import type { IBindingsEpubToc } from '@bindings/epub'
import type { FormatType } from '@bindings/format'
import type {
  IEpubBookStructure,
  IEpubBookType,
  IMobiBookStructure,
  IMobiBookType,
  IPDFBookStructure,
  IPDFBookType,
} from '@interfaces/book/interfaces'
import type { IBookType } from '@interfaces/book/types'
import { describe, expect, test } from 'vitest'
import { actions, booksStore, defaultState, reducers } from '.'

const book: {
  id: string
  book: File
} = {
  id: 'book_1',
  book: new File([], 'epub', { type: 'application/epub+zip' }),
}

const toc: IBindingsEpubToc = {
  label: 'Chapter 1',
  href: 'chapter-1',
  subitems: [
    {
      label: 'Chapter 1.1',
      href: 'chapter-1-1',
    },
  ],
}

const structure: IEpubBookStructure = {
  format: 'EPUB',
  sections: [
    {
      id: 'chapter-1',
      cfi: 'epubcfi(/6/8!/4/2/4)',
      size: 1,
    },
    {
      id: 'chapter-1',
      cfi: 'epubcfi(/6/8!/4/2/4)',
      size: 1,
    },
  ],
  toc: [toc, toc, toc],
}

const bindingsBook: IEpubBookType = {
  id: '123',
  format: 'EPUB',
  createdAt: '1780510075459',
  updatedAt: '1780510075459',
  percentageProgress: '0',
  progress: {},
  sections: [],
  rendition: {},
  metadata: {
    title: 'Book title',
    author: 'Book author',
    cover: '',
    language: 'en',
  },
}
describe(booksStore, () => {
  describe('load', () => {
    test('Load initial state', () => {
      expect(reducers(undefined, actions.load())).toEqual(defaultState)
    })
  })

  describe('setOpenBook', () => {
    test('dispatches without modifying state', () => {
      expect(
        reducers(
          undefined,
          actions.setOpenBook({
            id: 'book_1',
            format: 'EPUB',
          }),
        ),
      ).toEqual(defaultState)
    })
  })

  describe('importBook', () => {
    test('dispatches without modifying state', () => {
      const file = new File([], 'epub', { type: 'application/epub+zip' })

      expect(reducers(undefined, actions.importBook(file))).toEqual(defaultState)
    })
  })

  describe('setDeleteBook', () => {
    test('dispatches without modifying state', () => {
      expect(
        reducers(
          undefined,
          actions.setDeleteBook({
            id: 'book_1',
            format: 'EPUB',
          }),
        ),
      ).toEqual(defaultState)
    })
  })

  describe('updateBookMetadata', () => {
    test('dispatches without modifying state', () => {
      expect(
        reducers(
          undefined,
          actions.updateBookMetadata({
            id: 'book_1',
            format: 'EPUB',
            metadata: {
              title: 'title',
              author: 'author',
            },
          }),
        ),
      ).toEqual(defaultState)
    })
  })

  describe('updateBookProgress', () => {
    test('dispatches without modifying state', () => {
      expect(
        reducers(
          undefined,
          actions.updateBookProgress({
            id: 'book_1',
            format: 'EPUB',
            percentageProgress: '10%',
            progress: {
              CFI: 'epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/42[rw-p_43542-151052214]/1:283)',
            },
          }),
        ),
      ).toEqual(defaultState)
    })
  })

  describe('setActiveBook', () => {
    test('sets active book', () => {
      const result = reducers(defaultState, actions.setActiveBook(book))

      expect(result.files[book.id]).not.toBeUndefined()
      expect(result.files[book.id]).not.toBeNull()
      expect(result.files[book.id]).toEqual(book.book)
    })

    test('overwrites existing book', () => {
      const stateWithBook = reducers(defaultState, actions.setActiveBook(book))
      const updatedBook = { ...book, book: { ...book.book, title: 'Updated title' } }
      const result = reducers(stateWithBook, actions.setActiveBook(updatedBook))

      expect(result.files[book.id]).not.toBeUndefined()
      expect(result.files[book.id]).not.toBeNull()
      expect(result.files[book.id]).toEqual(updatedBook.book)
    })

    test('sets multiple books independently', () => {
      const secondBook = { ...book, id: '456' }
      const stateWithBook = reducers(defaultState, actions.setActiveBook(book))
      const result = reducers(stateWithBook, actions.setActiveBook(secondBook))

      expect(result.files[book.id]).not.toBeUndefined()
      expect(result.files[book.id]).not.toBeNull()
      expect(result.files[book.id]).toEqual(book.book)

      expect(result.files[secondBook.id]).not.toBeUndefined()
      expect(result.files[secondBook.id]).not.toBeNull()
      expect(result.files[secondBook.id]).toEqual(secondBook.book)
    })
  })

  describe('setSelectedChapter', () => {
    test('Sets selected chapter', () => {
      const result = reducers(defaultState, actions.setSelectedChapter(book.id))

      expect(result.selectedChapter).not.toBeUndefined()
      expect(result.selectedChapter).not.toBeNull()
      expect(result.selectedChapter).toEqual(book.id)
    })

    test('overwrites existing selected chapter', () => {
      const stateWithChapter = reducers(defaultState, actions.setSelectedChapter(book.id))
      const result = reducers(stateWithChapter, actions.setSelectedChapter('new-chapter-id'))

      expect(result.selectedChapter).not.toBeUndefined()
      expect(result.selectedChapter).not.toBeNull()
      expect(result.selectedChapter).toEqual('new-chapter-id')
    })
  })

  describe('setActiveToc', () => {
    test('Sets active toc', () => {
      const result = reducers(defaultState, actions.setActiveToc(toc))
      expect(result.activeToc).not.toBeUndefined()
      expect(result.activeToc).not.toBeNull()
      expect(result.activeToc).toEqual(toc)
    })

    test('overwrites existing active toc', () => {
      const stateWithToc = reducers(defaultState, actions.setActiveToc(toc))
      const updatedToc = { ...toc, label: 'Updated label' }

      const result = reducers(stateWithToc, actions.setActiveToc(updatedToc))
      expect(result.activeToc).not.toBeUndefined()
      expect(result.activeToc).not.toBeNull()
      expect(result.activeToc).toEqual(updatedToc)
    })
  })

  describe('setBook', () => {
    test('sets book', () => {
      const result = reducers(
        defaultState,
        actions.setBook({ id: bindingsBook.id, book: bindingsBook }),
      )

      expect(result.books.EPUB![bindingsBook.id]).not.toBeUndefined()
      expect(result.books.EPUB![bindingsBook.id]).not.toBeNull()
      expect(result.books.EPUB![bindingsBook.id]).toEqual(bindingsBook)
    })

    test('creates format entry when it does not exist', () => {
      const result = reducers(
        defaultState,
        actions.setBook({ id: bindingsBook.id, book: bindingsBook }),
      )

      expect(result.books.EPUB).toBeDefined()
    })

    test('overwrites existing book', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBook({ id: bindingsBook.id, book: bindingsBook }),
      )
      const updatedBook = { ...bindingsBook, percentageProgress: '50' }
      const result = reducers(
        stateWithBook,
        actions.setBook({ id: bindingsBook.id, book: updatedBook }),
      )

      expect(result.books.EPUB![bindingsBook.id]).not.toBeUndefined()
      expect(result.books.EPUB![bindingsBook.id]).not.toBeNull()
      expect(result.books.EPUB![bindingsBook.id]).toEqual(updatedBook)
    })

    test('sets multiple books independently', () => {
      const secondBook = { ...bindingsBook, id: '456' }
      const stateWithBook = reducers(
        defaultState,
        actions.setBook({ id: bindingsBook.id, book: bindingsBook }),
      )
      const result = reducers(
        stateWithBook,
        actions.setBook({ id: secondBook.id, book: secondBook }),
      )

      expect(result.books.EPUB![bindingsBook.id]).not.toBeUndefined()
      expect(result.books.EPUB![bindingsBook.id]).not.toBeNull()
      expect(result.books.EPUB![bindingsBook.id]).toEqual(bindingsBook)

      expect(result.books.EPUB![secondBook.id]).not.toBeUndefined()
      expect(result.books.EPUB![secondBook.id]).not.toBeNull()
      expect(result.books.EPUB![secondBook.id]).toEqual(secondBook)
    })

    test('ignores missing id when shelf exists', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBook({ id: bindingsBook.id, book: bindingsBook }),
      )
      const result = reducers(
        stateWithBook,
        actions.setBookStructure({ id: 'non-existent', structure }),
      )
      expect(result).toEqual(stateWithBook)
    })
  })

  describe('setBookStructure', () => {
    test('sets book structure', () => {
      const state = reducers(
        defaultState,
        actions.setBook({ id: bindingsBook.id, book: bindingsBook }),
      )
      const result = reducers(state, actions.setBookStructure({ id: bindingsBook.id, structure }))

      expect(result.books.EPUB![bindingsBook.id]).not.toBeUndefined()
      expect(result.books.EPUB![bindingsBook.id]).not.toBeNull()
      expect(result.books.EPUB![bindingsBook.id]).toEqual({
        ...bindingsBook,
        sections: structure.sections,
        toc: structure.toc,
      })
    })

    test('ignores unknown MOBI book id', () => {
      const result = reducers(
        defaultState,
        actions.setBookStructure({
          id: 'non-existent',
          structure: { format: 'MOBI', sections: [], toc: [] },
        }),
      )
      expect(result).toEqual(defaultState)
    })

    test('ignores unknown PDF book id', () => {
      const result = reducers(
        defaultState,
        actions.setBookStructure({
          id: 'non-existent',
          structure: { format: 'PDF', sections: [], toc: [] },
        }),
      )
      expect(result).toEqual(defaultState)
    })

    test('ignores unknown book id', () => {
      const result = reducers(
        defaultState,
        actions.setBookStructure({ id: 'non-existent', structure }),
      )

      expect(result).toEqual(defaultState)
    })

    test('Sets MOBI structure', () => {
      const mobiBook: IMobiBookType = {
        id: '456',
        format: 'MOBI',
        createdAt: '1780510075459',
        updatedAt: '1780510075459',
        percentageProgress: '0',
        progress: {},
        sections: [],
        metadata: {
          title: 'Book title',
          author: 'Book author',
          cover: '',
          language: 'en',
        },
      }

      const state = reducers(defaultState, actions.setBook({ id: mobiBook.id, book: mobiBook }))

      const mobiStructure: IMobiBookStructure = {
        format: 'MOBI',
        sections: [
          {
            id: 2,
            size: 1,
          },
          {
            id: 2,
            size: 1,
          },
        ],
        toc: [toc, toc, toc],
      }

      const result = reducers(
        state,
        actions.setBookStructure({ id: mobiBook.id, structure: mobiStructure }),
      )

      expect(result.books.MOBI![mobiBook.id]).not.toBeUndefined()
      expect(result.books.MOBI![mobiBook.id]).not.toBeNull()
      expect(result.books.MOBI![mobiBook.id]).toEqual({
        ...mobiBook,
        sections: mobiStructure.sections,
        toc: mobiStructure.toc,
      })
    })

    test('Sets PDF structure', () => {
      const pdfBook: IPDFBookType = {
        id: '789',
        format: 'PDF',
        createdAt: '1780510075459',
        updatedAt: '1780510075459',
        percentageProgress: '0',
        progress: {},
        sections: [],
        metadata: {
          title: 'Book title',
          author: 'Book author',
          cover: '',
          language: 'en',
        },
      }

      const state = reducers(defaultState, actions.setBook({ id: pdfBook.id, book: pdfBook }))

      const pdfStructure: IPDFBookStructure = {
        format: 'PDF',
        sections: [
          {
            id: 2,
            size: 1,
          },
        ],
        toc: [toc, toc, toc],
      }

      const result = reducers(
        state,
        actions.setBookStructure({ id: pdfBook.id, structure: pdfStructure }),
      )

      expect(result.books.PDF![pdfBook.id]).not.toBeUndefined()
      expect(result.books.PDF![pdfBook.id]).not.toBeNull()
      expect(result.books.PDF![pdfBook.id]).toEqual({
        ...pdfBook,
        sections: pdfStructure.sections,
        toc: pdfStructure.toc,
      })
    })
  })

  describe('setBooks', () => {
    test('sets books', () => {
      const state: Partial<Record<FormatType, Partial<Record<string, IBookType>>>> = {
        EPUB: {
          '123': {
            ...bindingsBook,
            sections: [],
            toc: [],
          },
        },
      }

      const result = reducers(defaultState, actions.setBooks(state))
      expect(result.books).toEqual(state)
    })

    test('overwrites existing books', () => {
      const initialState = { EPUB: { '123': { ...bindingsBook } } }
      const stateWithBooks = reducers(defaultState, actions.setBooks(initialState))
      const updatedState = { EPUB: { '123': { ...bindingsBook, percentageProgress: '50' } } }
      const result = reducers(stateWithBooks, actions.setBooks(updatedState))

      expect(result.books).toEqual(updatedState)
    })

    test('sets empty books', () => {
      const stateWithBooks = reducers(
        defaultState,
        actions.setBooks({ EPUB: { '123': bindingsBook } }),
      )
      const result = reducers(stateWithBooks, actions.setBooks({}))

      expect(result.books).toEqual({})
    })
  })

  describe('setUpdateBookMetadata', () => {
    test('updates book metadata', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ EPUB: { '123': { ...bindingsBook, sections: [], toc: [] } } }),
      )

      const updatedMetadata = {
        author: 'Updated author',
        description: 'Updated description',
        published: 'Updated published',
        publisher: 'Updated publisher',
        title: 'Updated title',
      }

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: '123',
          format: 'EPUB',
          metadata: { format: 'EPUB', metadata: updatedMetadata },
        }),
      )

      const book = result.books.EPUB!['123']!
      expect(book).not.toBeUndefined()
      expect(book).not.toBeNull()

      expect(book.metadata).toMatchObject(updatedMetadata)
    })

    test('ignores unknown book id', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ EPUB: { '123': { ...bindingsBook, sections: [], toc: [] } } }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: 'non-existent',
          format: 'EPUB',
          metadata: { format: 'EPUB', metadata: { title: 'Updated title' } },
        }),
      )

      expect(result).toEqual(stateWithBook)
    })

    test('ignores unknown format', () => {
      const result = reducers(
        defaultState,
        actions.setUpdateBookMetadata({
          id: '123',
          format: 'EPUB',
          metadata: { format: 'EPUB', metadata: { title: 'Updated title' } },
        }),
      )
      expect(result).toEqual(defaultState)
    })

    test('updates MOBI book metadata', () => {
      const mobiBook: IMobiBookType = {
        id: '456',
        format: 'MOBI',
        createdAt: '1780510075459',
        updatedAt: '1780510075459',
        percentageProgress: '0',
        progress: {},
        sections: [],
        metadata: {
          title: 'Book title',
          author: 'Book author',
          cover: '',
          language: 'en',
        },
      }

      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ MOBI: { [mobiBook.id]: { ...mobiBook, sections: [], toc: [] } } }),
      )

      const updatedMetadata = {
        author: 'Updated author',
        description: 'Updated description',
        published: 'Updated published',
        publisher: 'Updated publisher',
        title: 'Updated title',
      }

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: mobiBook.id,
          format: 'MOBI',
          metadata: { format: 'MOBI', metadata: updatedMetadata },
        }),
      )

      const metadata = result.books.MOBI![mobiBook.id]!.metadata

      expect(metadata).not.toBeUndefined()
      expect(metadata).not.toBeNull()
      expect(metadata).toMatchObject(updatedMetadata)
    })

    test('updates PDF book metadata', () => {
      const pdfBook: IPDFBookType = {
        id: '789',
        format: 'PDF',
        createdAt: '1780510075459',
        updatedAt: '1780510075459',
        percentageProgress: '0',
        progress: {},
        sections: [],
        metadata: {
          title: 'Book title',
          author: 'Book author',
          cover: '',
          language: 'en',
        },
      }

      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ PDF: { [pdfBook.id]: { ...pdfBook, sections: [], toc: [] } } }),
      )

      const updatedMetadata = {
        author: 'Updated author',
        description: 'Updated description',
        published: 'Updated published',
        publisher: 'Updated publisher',
        title: 'Updated title',
      }

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: pdfBook.id,
          format: 'PDF',
          metadata: { format: 'PDF', metadata: updatedMetadata },
        }),
      )

      const metadata = result.books.PDF![pdfBook.id]!.metadata

      expect(metadata).not.toBeUndefined()
      expect(metadata).not.toBeNull()

      expect(metadata).toMatchObject(updatedMetadata)
    })

    test('keeps existing values for non updated fields', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ EPUB: { '123': { ...bindingsBook, sections: [], toc: [] } } }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: '123',
          format: 'EPUB',
          metadata: { format: 'EPUB', metadata: { title: 'Only title updated' } },
        }),
      )

      const book = result.books.EPUB!['123']!
      expect(book.metadata.title).toEqual('Only title updated')
      expect(book.metadata.author).toEqual(bindingsBook.metadata.author)
      expect(book.metadata.description).toEqual(bindingsBook.metadata.description)
      expect(book.metadata.published).toEqual(bindingsBook.metadata.published)
      expect(book.metadata.publisher).toEqual(bindingsBook.metadata.publisher)
    })

    test('keeps existing title when title is not provided', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ EPUB: { '123': { ...bindingsBook, sections: [], toc: [] } } }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: '123',
          format: 'EPUB',
          metadata: { format: 'EPUB', metadata: { author: 'Only author updated' } },
        }),
      )

      const book = result.books.EPUB!['123']!
      expect(book.metadata.title).toEqual(bindingsBook.metadata.title)
      expect(book.metadata.author).toEqual('Only author updated')
    })
  })

  describe('setUpdateBookProgress', () => {
    test('Updates book progress', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ EPUB: { '123': { ...bindingsBook, sections: [], toc: [] } } }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookProgress({
          id: '123',
          format: 'EPUB',
          progress: {
            CFI: 'epubcfi(/6/8!/4/2/4)',
          },
          percentageProgress: '50',
        }),
      )

      const percentageProgress = result.books.EPUB!['123']!.percentageProgress

      expect(percentageProgress).not.toBeUndefined()
      expect(percentageProgress).not.toBeNull()

      const epubCFI = result.books.EPUB!['123']!.progress.CFI!

      expect(epubCFI).not.toBeUndefined()
      expect(epubCFI).not.toBeNull()

      expect(percentageProgress).toEqual('50')
      expect(epubCFI).toEqual('epubcfi(/6/8!/4/2/4)')
    })

    test('ignores unknown book id', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ EPUB: { '123': { ...bindingsBook, sections: [], toc: [] } } }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookProgress({
          id: 'non-existent',
          format: 'EPUB',
          progress: { CFI: 'epubcfi(/6/8!/4/2/4)' },
          percentageProgress: '50',
        }),
      )

      expect(result).toEqual(stateWithBook)
    })

    test('ignores unknown format', () => {
      const result = reducers(
        defaultState,
        actions.setUpdateBookProgress({
          id: '123',
          format: 'EPUB',
          progress: { CFI: 'epubcfi(/6/8!/4/2/4)' },
          percentageProgress: '50',
        }),
      )
      expect(result).toEqual(defaultState)
    })
  })

  describe('deleteBook', () => {
    test('deletes book', () => {
      const state: Partial<Record<FormatType, Partial<Record<string, IBookType>>>> = {
        EPUB: {
          '123': {
            ...bindingsBook,
            sections: [],
            toc: [],
          },
        },
      }

      const result = reducers(defaultState, actions.setBooks(state))
      expect(result.books).toEqual(state)

      const stateAfterDelete = reducers(result, actions.deleteBook({ id: '123', format: 'EPUB' }))
      expect(stateAfterDelete.books).toEqual({})
    })

    test('ignores unknown book id', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ EPUB: { '123': { ...bindingsBook, sections: [], toc: [] } } }),
      )

      const result = reducers(
        stateWithBook,
        actions.deleteBook({ id: 'non-existent', format: 'EPUB' }),
      )

      expect(result).toEqual(stateWithBook)
    })

    test('deletes one book while keeping others in the same format', () => {
      const secondBook = { ...bindingsBook, id: '456' }
      const stateWithBooks = reducers(
        defaultState,
        actions.setBooks({
          EPUB: { '123': bindingsBook, '456': secondBook },
        }),
      )

      const result = reducers(stateWithBooks, actions.deleteBook({ id: '123', format: 'EPUB' }))

      expect(result.books.EPUB!['123']).toBeUndefined()

      expect(result.books.EPUB!['456']).not.toBeUndefined()
      expect(result.books.EPUB!['456']).not.toBeNull()
      expect(result.books.EPUB!['456']).toEqual(secondBook)
    })

    test('ignores unknown format', () => {
      const result = reducers(defaultState, actions.deleteBook({ id: '123', format: 'EPUB' }))
      expect(result).toEqual(defaultState)
    })
  })

  describe('setFile', () => {
    test('sets file', () => {
      const file = new File([], 'epub', { type: 'application/epub+zip' })
      const result = reducers(defaultState, actions.setFile({ id: '123', file }))

      expect(result.files['123']).not.toBeUndefined()
      expect(result.files['123']).not.toBeNull()
      expect(result.files['123']).toEqual(file)
    })
  })
})
