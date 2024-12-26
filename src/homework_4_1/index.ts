type UUID = string;

interface IAuthor {
    id: UUID;
    firstName: string;
    lastName: string;
    birthDate: Date;
    nationality: string;
    biography?: string;
}

interface IBook {
    id: UUID;
    title: string;
    authorId: UUID;
    genre: BookGenre;
    publicationYear: number;
    isbn: string;
    description: string;
    rating: number;
    pageCount: number;
    language: string;
}

enum BookGenre {
    NonFiction = "Non-Fiction",
    ScienceFiction = "Science Fiction",
}

interface SearchCriteria {
    title?: string;
    genre?: BookGenre;
    year?: number;
    authorName?: string;
}

interface IBookService {
    getBooks(): Promise<IBook[]>;
    getBookById(id: UUID): Promise<IBook | null>;
    getAuthors(): Promise<IAuthor[]>;
    getAuthorById(id: UUID): Promise<IAuthor | null>;
    getBooksByAuthor(authorIdOrName: UUID | string): Promise<IBook[]>;
    getAuthorByBookId(bookId: UUID): Promise<IAuthor | null>;
    search(criteria: SearchCriteria): Promise<IBook[]>;
}

class BookService implements IBookService {
    private authors: IAuthor[] = [
        {
            id: "1",
            firstName: "Frank",
            lastName: "Herbert",
            birthDate: new Date("1920-10-08"),
            nationality: "American",
            biography: "Frank Herbert was an American science fiction author best known for the novel Dune"
        },
        {
            id: "2",
            firstName: "Douglas",
            lastName: "Adams",
            birthDate: new Date("1952-03-11"),
            nationality: "British",
            biography: "Douglas Adams was an English author best known for The Hitchhiker's Guide to the Galaxy"
        },
        {
            id: "3",
            firstName: "Yuval Noah",
            lastName: "Harari",
            birthDate: new Date("1976-02-24"),
            nationality: "Israeli",
            biography: "Yuval Noah Harari is an Israeli historian and professor"
        }
    ];

    private books: IBook[] = [
        {
            id: "1",
            title: "Dune",
            authorId: "1",
            genre: BookGenre.ScienceFiction,
            publicationYear: 1965,
            isbn: "978-0441172719",
            description: "Set in the distant future amidst a feudal interstellar society.",
            rating: 4.8,
            pageCount: 896,
            language: "English"
        },
        {
            id: "2",
            title: "The Hitchhiker's Guide to the Galaxy",
            authorId: "2",
            genre: BookGenre.ScienceFiction,
            publicationYear: 1979,
            isbn: "978-0345391803",
            description: "Seconds before Earth is demolished to make way for a galactic freeway.",
            rating: 4.7,
            pageCount: 224,
            language: "English"
        },
        {
            id: "3",
            title: "Sapiens: A Brief History of Humankind",
            authorId: "3",
            genre: BookGenre.NonFiction,
            publicationYear: 2011,
            isbn: "978-0062316097",
            description: "A brief history of human evolution and civilization.",
            rating: 4.9,
            pageCount: 464,
            language: "English"
        },
        {
            id: "4",
            title: "Homo Deus: A Brief History of Tomorrow",
            authorId: "3",
            genre: BookGenre.NonFiction,
            publicationYear: 2015,
            isbn: "978-1910701881",
            description: "An exploration of humanity's future and potential developments.",
            rating: 4.7,
            pageCount: 448,
            language: "English"
        }
    ];

    async getBooks(): Promise<IBook[]> {
        return [...this.books];
    }

    async getBookById(id: UUID): Promise<IBook | null> {
        return this.books.find(book => book.id === id) || null;
    }

    async getAuthors(): Promise<IAuthor[]> {
        return [...this.authors];
    }

    async getAuthorById(id: UUID): Promise<IAuthor | null> {
        return this.authors.find(author => author.id === id) || null;
    }

    async getBooksByAuthor(authorIdOrName: UUID | string): Promise<IBook[]> {
        if (this.isUUID(authorIdOrName)) {
            return this.books.filter(book => book.authorId === authorIdOrName);
        }

        const authorName = authorIdOrName.toLowerCase();
        const authorIds = this.authors
            .filter(author =>
                `${author.firstName} ${author.lastName}`.toLowerCase().includes(authorName))
            .map(author => author.id);

        return this.books.filter(book => authorIds.includes(book.authorId));
    }

    async getAuthorByBookId(bookId: UUID): Promise<IAuthor | null> {
        const book = await this.getBookById(bookId);
        if (!book) return null;

        return this.getAuthorById(book.authorId);
    }

    async search(criteria: SearchCriteria): Promise<IBook[]> {
        return this.books.filter(book => {
            if (criteria.title &&
                !book.title.toLowerCase().includes(criteria.title.toLowerCase())) {
                return false;
            }

            if (criteria.genre && book.genre !== criteria.genre) {
                return false;
            }

            if (criteria.year && book.publicationYear !== criteria.year) {
                return false;
            }

            if (criteria.authorName) {
                const author = this.authors.find(a => a.id === book.authorId);
                if (!author) return false;

                const authorFullName =
                    `${author.firstName} ${author.lastName}`.toLowerCase();
                if (!authorFullName.includes(criteria.authorName.toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    }

    private isUUID(value: string): boolean {
        return value.length === 1;
    }
}

async function example() {
    const bookService = new BookService();

    const allBooks = await bookService.getBooks();
    console.log('All books:', allBooks);

    const harariBooks = await bookService.getBooksByAuthor('Yuval Noah Harari');
    console.log('Harari books:', harariBooks);

    const searchResults = await bookService.search({
        genre: BookGenre.ScienceFiction,
        year: 1965
    });
    console.log('Search results:', searchResults);
}

example().then(() => console.log('Done'));