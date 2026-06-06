import type { IBindingsBook, IBindingsBookStructure } from '@bindings/book'
import type { IBindingsMetadata } from '@bindings/metadata'
import type { IBindingsSection } from '@bindings/sections'
import type { IBindingsToc, IBindingsTocStructure } from '@bindings/toc'
import { describe, expect, test } from 'vitest'
import { actions, booksStore, defaultState, reducers } from '.'

const book: {
  id: string
  book: File
} = {
  id: 'book_1',
  book: new File([], 'epub', { type: 'application/epub+zip' }),
}

const subitems: Array<IBindingsTocStructure> = [
  {
    label: 'Section 1',
    href: 'section-1',
    subitems: [],
  },
]

const toc: IBindingsToc = {
  id: '123',
  toc: [
    {
      label: 'Chapter 1',
      href: 'chapter-1',
      subitems: subitems,
    },
  ],
}

const sections: IBindingsSection = {
  id: '123',
  sections: [
    {
      id: 'chapter-1',
      size: '2',
    },
    {
      id: 'chapter-1',
      size: '2',
    },
  ],
}

const structure: IBindingsBookStructure = {
  id: '123',
  sections,
  toc,
}

const bindingsBook: IBindingsBook = {
  id: '123',
  format: 'EPUB',
  createdAt: '1780510075459',
  updatedAt: '1780510075459',
  percentageProgress: '0',
  progress: {},
  sections,
  toc,
  metadata: {
    title: 'Book title',
    author: 'Book author',
    cover: '',
    language: 'en',
    format: 'EPUB',
    id: '123',
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
      const data: IBindingsMetadata = {
        id: 'book_1',
        format: 'EPUB',
        cover: '',
        language: 'en',
        title: 'title',
        author: 'author',
      }

      expect(reducers(undefined, actions.updateBookMetadata(data))).toEqual(defaultState)
    })
  })

  describe('updateBookProgress', () => {
    test('dispatches without modifying state', () => {
      expect(
        reducers(
          undefined,
          actions.updateBookProgress({
            id: 'book_1',
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
      const activeToc = {
        label: 'label',
        href: 'chapter-1',
      }

      const result = reducers(defaultState, actions.setActiveToc(activeToc))
      expect(result.activeToc).not.toBeUndefined()
      expect(result.activeToc).not.toBeNull()
      expect(result.activeToc).toEqual(activeToc)
    })

    test('overwrites existing active toc', () => {
      const activeToc = {
        label: 'label',
        href: 'chapter-1',
      }

      const stateWithToc = reducers(defaultState, actions.setActiveToc(activeToc))
      const updatedToc = { label: 'Updated label', href: 'chapter-1', id: 1 }

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

      expect(result.books![bindingsBook.id]).not.toBeUndefined()
      expect(result.books![bindingsBook.id]).not.toBeNull()
      expect(result.books![bindingsBook.id]).toEqual(bindingsBook)
    })

    test('creates format entry when it does not exist', () => {
      const result = reducers(
        defaultState,
        actions.setBook({ id: bindingsBook.id, book: bindingsBook }),
      )

      expect(result.books[bindingsBook.id]).toBeDefined()
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

      expect(result.books![bindingsBook.id]).not.toBeUndefined()
      expect(result.books![bindingsBook.id]).not.toBeNull()
      expect(result.books![bindingsBook.id]).toEqual(updatedBook)
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

      expect(result.books![bindingsBook.id]).not.toBeUndefined()
      expect(result.books![bindingsBook.id]).not.toBeNull()
      expect(result.books![bindingsBook.id]).toEqual(bindingsBook)

      expect(result.books![secondBook.id]).not.toBeUndefined()
      expect(result.books![secondBook.id]).not.toBeNull()
      expect(result.books![secondBook.id]).toEqual(secondBook)
    })

    test('ignores missing id when shelf exists', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBook({ id: bindingsBook.id, book: bindingsBook }),
      )

      const randomStructure = {
        ...structure,
        id: '999',
      }

      const result = reducers(stateWithBook, actions.setBookStructure(randomStructure))
      expect(result).toEqual(stateWithBook)
    })
  })

  describe('setBookStructure', () => {
    test('sets book structure', () => {
      const state = reducers(
        defaultState,
        actions.setBook({ id: bindingsBook.id, book: bindingsBook }),
      )
      const result = reducers(state, actions.setBookStructure(structure))

      expect(result.books![bindingsBook.id]).not.toBeUndefined()
      expect(result.books![bindingsBook.id]).not.toBeNull()
      expect(result.books![bindingsBook.id]).toEqual({
        ...bindingsBook,
        sections: structure.sections,
        toc: structure.toc,
      })
    })

    test('ignores unknown book id', () => {
      const result = reducers(
        defaultState,
        actions.setBookStructure({
          ...structure,
          id: 'non-existent',
        }),
      )
      expect(result).toEqual(defaultState)
    })
  })

  describe('setBooks', () => {
    test('sets books', () => {
      const state: Record<string, IBindingsBook> = {
        [bindingsBook.id]: bindingsBook,
      }

      const result = reducers(defaultState, actions.setBooks(state))
      expect(result.books).toEqual(state)
    })

    test('sets empty books', () => {
      const stateWithBooks = reducers(
        defaultState,
        actions.setBooks({
          [bindingsBook.id]: bindingsBook,
        }),
      )
      const result = reducers(stateWithBooks, actions.setBooks({}))

      expect(result.books).toEqual({})
    })
  })

  describe('setUpdateBookMetadata', () => {
    test('updates book metadata', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook }),
      )

      const updatedMetadata: IBindingsMetadata = {
        language: bindingsBook.metadata.language,
        author: 'Updated author',
        description: 'Updated description',
        published: 'Updated published',
        publisher: 'Updated publisher',
        title: 'Updated title',
        cover: '',
        format: 'EPUB',
        id: bindingsBook.id,
      }

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: bindingsBook.id,
          metadata: updatedMetadata,
        }),
      )

      const book = result.books![bindingsBook.id]!
      expect(book).not.toBeUndefined()
      expect(book).not.toBeNull()
      expect(book.metadata).toMatchObject(updatedMetadata)
    })

    test('ignores unknown book id', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: 'non-existent',
          metadata: {
            id: bindingsBook.id,
            title: 'updated title',
            author: bindingsBook.metadata.author,
            description: bindingsBook.metadata.description,
            published: bindingsBook.metadata.published,
            publisher: bindingsBook.metadata.publisher,
            cover: bindingsBook.metadata.cover,
            format: bindingsBook.metadata.format,
            language: bindingsBook.metadata.language,
          },
        }),
      )

      expect(result).toEqual(stateWithBook)
    })

    test('ignores unknown book id in empty state', () => {
      const result = reducers(
        defaultState,
        actions.setUpdateBookMetadata({
          id: 'non-existent',
          metadata: {
            id: bindingsBook.id,
            title: 'updated title',
            author: bindingsBook.metadata.author,
            description: bindingsBook.metadata.description,
            published: bindingsBook.metadata.published,
            publisher: bindingsBook.metadata.publisher,
            cover: bindingsBook.metadata.cover,
            format: bindingsBook.metadata.format,
            language: bindingsBook.metadata.language,
          },
        }),
      )
      expect(result).toEqual(defaultState)
    })

    test('keeps existing values for non updated fields', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: bindingsBook.id,
          metadata: {
            id: bindingsBook.id,
            title: 'Only title updated',
            author: bindingsBook.metadata.author,
            description: bindingsBook.metadata.description,
            published: bindingsBook.metadata.published,
            publisher: bindingsBook.metadata.publisher,
            cover: bindingsBook.metadata.cover,
            format: bindingsBook.metadata.format,
            language: bindingsBook.metadata.language,
          },
        }),
      )

      const book = result.books![bindingsBook.id]!
      expect(book.metadata.title).toEqual('Only title updated')
      expect(book.metadata.author).toEqual(bindingsBook.metadata.author)
    })

    test('keeps existing title when title is not provided', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: bindingsBook.id,
          metadata: {
            id: bindingsBook.id,
            title: bindingsBook.metadata.title,
            author: 'Only author updated',
            description: bindingsBook.metadata.description,
            published: bindingsBook.metadata.published,
            publisher: bindingsBook.metadata.publisher,
            cover: bindingsBook.metadata.cover,
            format: bindingsBook.metadata.format,
            language: bindingsBook.metadata.language,
          },
        }),
      )

      const book = result.books![bindingsBook.id]!
      expect(book.metadata.title).toEqual(bindingsBook.metadata.title)
      expect(book.metadata.author).toEqual('Only author updated')
    })

    test('Expect empty metadata', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookMetadata({
          id: bindingsBook.id,
          metadata: {},
        }),
      )

      const book = result.books![bindingsBook.id]!
      expect(book.metadata.description).toEqual(bindingsBook.metadata.description)
      expect(book.metadata.title).toEqual(bindingsBook.metadata.title)
    })
  })

  describe('setUpdateBookProgress', () => {
    test('Updates book progress', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookProgress({
          id: bindingsBook.id,
          progress: { CFI: 'epubcfi(/6/8!/4/2/4)' },
          percentageProgress: '50',
        }),
      )

      const book = result.books![bindingsBook.id]!
      expect(book.percentageProgress).toEqual('50')
      expect(book.progress.CFI).toEqual('epubcfi(/6/8!/4/2/4)')
    })

    test('ignores unknown book id', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook }),
      )

      const result = reducers(
        stateWithBook,
        actions.setUpdateBookProgress({
          id: 'non-existent',
          progress: { CFI: 'epubcfi(/6/8!/4/2/4)' },
          percentageProgress: '50',
        }),
      )

      expect(result).toEqual(stateWithBook)
    })

    test('ignores unknown book id in empty state', () => {
      const result = reducers(
        defaultState,
        actions.setUpdateBookProgress({
          id: 'non-existent',
          progress: { CFI: 'epubcfi(/6/8!/4/2/4)' },
          percentageProgress: '50',
        }),
      )
      expect(result).toEqual(defaultState)
    })
  })

  describe('deleteBook', () => {
    test('deletes book', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook }),
      )

      const result = reducers(
        stateWithBook,
        actions.deleteBook({ id: bindingsBook.id, format: 'EPUB' }),
      )
      expect(result.books![bindingsBook.id]).toBeUndefined()
    })

    test('ignores unknown book id', () => {
      const stateWithBook = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook }),
      )

      const result = reducers(
        stateWithBook,
        actions.deleteBook({ id: 'non-existent', format: 'EPUB' }),
      )

      expect(result).toEqual(stateWithBook)
    })

    test('deletes one book while keeping others', () => {
      const secondBook = { ...bindingsBook, id: '456' }
      const stateWithBooks = reducers(
        defaultState,
        actions.setBooks({ [bindingsBook.id]: bindingsBook, [secondBook.id]: secondBook }),
      )

      const result = reducers(
        stateWithBooks,
        actions.deleteBook({ id: bindingsBook.id, format: 'EPUB' }),
      )

      expect(result.books![bindingsBook.id]).toBeUndefined()
      expect(result.books![secondBook.id]).toEqual(secondBook)
    })

    test('ignores unknown book id in empty state', () => {
      const result = reducers(
        defaultState,
        actions.deleteBook({ id: 'non-existent', format: 'EPUB' }),
      )
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
