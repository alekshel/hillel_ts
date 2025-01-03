type Translations = {
    [key: string]: string | undefined;
};

type OptionalTranslations = {
    [key: string]: string | undefined;
    default?: string;
};

const appTranslations: Translations = {
    en: "Hello",
    ua: "Привіт",
    de: "Hallo",
    fr: undefined
};

const appTranslationsWithDefault: OptionalTranslations = {
    en: "Hello",
    ua: "Привіт",
    default: "Hello"
};

function demonstrateTranslations() {
    const language = "ua";
    console.log(appTranslations[language]); // OK: "Привіт"

    const unknownLang = "es";
    const translation = appTranslations[unknownLang];

    if (translation) {
        console.log(translation.toUpperCase());
    }

    console.log(translation?.toUpperCase());

    const getTranslation = (lang: string): string => {
        return appTranslationsWithDefault[lang] ?? appTranslationsWithDefault.default ?? "No translation";
    };

    console.log(getTranslation("ua"));
    console.log(getTranslation("es"));
}

type NestedTranslations = {
    [key: string]: {
        title: string;
        description?: string;
        errors?: {
            [key: string]: string;
        };
    } | undefined;
};

const appNestedTranslations: NestedTranslations = {
    en: {
        title: "Welcome",
        description: "Welcome to our app",
        errors: {
            required: "This field is required",
            invalid: "Invalid input"
        }
    },
    ua: {
        title: "Ласкаво просимо",
        description: "Вітаємо у нашому додатку",
        errors: {
            required: "Це поле є обов'язковим",
            invalid: "Некоректне введення"
        }
    }
};

class TranslationService {
    constructor(
        private translations: Translations | OptionalTranslations,
        private fallbackLanguage: string = 'en'
    ) {}

    getTranslation(key: string): string {
        const translation = this.translations[key];
        if (translation) return translation;

        if ('default' in this.translations && this.translations.default) {
            return this.translations.default;
        }

        return this.translations[this.fallbackLanguage] ?? 'NO_TRANSLATION';
    }

    hasTranslation(key: string): boolean {
        return key in this.translations && this.translations[key] !== undefined;
    }

    addTranslation(key: string, value: string): void {
        this.translations[key] = value;
    }
}

function demonstrateTranslationService() {
    const service = new TranslationService(appTranslationsWithDefault);

    console.log(service.getTranslation('ua'));
    console.log(service.getTranslation('es'));
    console.log(service.hasTranslation('ua'));
    console.log(service.hasTranslation('es'));

    service.addTranslation('es', 'Hola');
    console.log(service.hasTranslation('es'));
}

demonstrateTranslations();
demonstrateTranslationService();
