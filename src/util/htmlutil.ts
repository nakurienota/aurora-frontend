class HtmlUtil {
    static create<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        id?: string,
        className?: string
    ): HTMLElementTagNameMap[K] {
        const element = document.createElement(tagName);
        if (id) element.id = id;
        if (className) element.className = className;
        return element;
    }

    static parseToString(input: ProgressEvent<FileReader>): string {
        try {
            const result = input.target?.result;
            if (typeof result === 'string') return JSON.parse(result);
            else return '';
        } catch (error) {
            return '';
        }
    }
}

export default HtmlUtil;
