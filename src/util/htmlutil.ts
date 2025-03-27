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
}

export default HtmlUtil;