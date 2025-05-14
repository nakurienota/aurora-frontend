import InteractiveGlobe from '../classes/globe';
import HtmlUtil from '../util/htmlutil';
import RoutesTableBuilder from '../classes/routes-table-builder';
import TestingFeesTableBuilder from '../classes/testing-fees-table-builder';
import RoutesTableBuilderV3 from '../classes/routes-table-builder-v3';
import { RoutesTableBuilderV4 } from '../classes/routes-table-builder-v4';

class AuroraFrontendApplication {
    private globe: InteractiveGlobe | undefined;
    private readonly routeTableBuilder: RoutesTableBuilder;
    private readonly testingFeesTableBuilder: TestingFeesTableBuilder;
    private readonly routeTableBuilderV3: RoutesTableBuilderV3;
    private readonly routeTableBuilderV4: RoutesTableBuilderV4;

    constructor() {
        this.routeTableBuilder = new RoutesTableBuilder();
        this.testingFeesTableBuilder = new TestingFeesTableBuilder();
        this.routeTableBuilderV3 = new RoutesTableBuilderV3();
        this.routeTableBuilderV4 = new RoutesTableBuilderV4();
    }

    start() {
        const body: HTMLElement = document.body;
        const container: HTMLDivElement = HtmlUtil.create('div', 'container');
        const h1: HTMLHeadingElement = HtmlUtil.create('h1');
        h1.textContent = 'Aurora frontend V1.3.2';
        container.append(h1);
        const globeWrapper: HTMLDivElement = HtmlUtil.create('div', 'div-globe-wrapper');
        const tableWrapper: HTMLDivElement = HtmlUtil.create('div', 'div-table');
        const globe: HTMLDivElement = HtmlUtil.create('div', 'div-globe-modal');
        const openGlobe: HTMLButtonElement = HtmlUtil.create('button', undefined, 'default-btn');
        const closeGlobe: HTMLButtonElement = HtmlUtil.create('button', 'div-globe-modal-close-btn', 'default-btn');
        closeGlobe.textContent = 'close';
        openGlobe.textContent = 'open globe';
        // container.append(openGlobe);
        this.globe = new InteractiveGlobe(globe);
        globeWrapper.append(globe);
        globeWrapper.append(closeGlobe);
        // container.append(globeWrapper);
        body.append(container);
        openGlobe.addEventListener('click', () => {
            globeWrapper.style.display = 'flex';
        });
        closeGlobe.addEventListener('click', () => {
            globeWrapper.style.display = 'none';
        });

        const inputFilesWrapper: HTMLDivElement = HtmlUtil.create('div', 'input-files-wrapper');
        const jsonInput: HTMLInputElement = HtmlUtil.create('input');
        jsonInput.type = 'file';
        jsonInput.accept = 'application/json';
        inputFilesWrapper.append(jsonInput);

        const dataTypeSelector = HtmlUtil.create('select');
        dataTypeSelector.id = 'dataType';
        const fileTypes: string[] = [
            'ConstructedRoutes',
            'ConstructedRoutesV3',
            'ConstructedRoutesV4',
            'ReportFares',
            'ReportSeatMap',
            'ReportFees',
        ];

        const defaultOption: HTMLOptionElement = HtmlUtil.create('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Тип таблицы';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        dataTypeSelector.appendChild(defaultOption);

        fileTypes.forEach((type: string) => {
            const option: HTMLOptionElement = HtmlUtil.create('option');
            option.value = type;
            option.textContent = type;
            dataTypeSelector.appendChild(option);
        });
        const errorJsonMessage: HTMLParagraphElement = HtmlUtil.create('p', 'error-json-message');
        errorJsonMessage.classList.add('hidden');
        inputFilesWrapper.append(dataTypeSelector);
        inputFilesWrapper.append(errorJsonMessage);
        container.append(inputFilesWrapper);

        jsonInput.addEventListener('change', (event: Event) => {
            const fileInput = event.target as HTMLInputElement;
            const file = fileInput.files?.[0];
            if (!file) return;
            tableWrapper.childNodes.forEach((el) => el.remove());

            errorJsonMessage.classList.add('hidden');
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const selectedType: string = dataTypeSelector.value;
                    let content: HTMLElement | null = null;
                    switch (selectedType) {
                        case 'ConstructedRoutes':
                            content = this.routeTableBuilder.parseFileAndCreateHtml(e);
                            break;
                        case 'ConstructedRoutesV3':
                            content = this.routeTableBuilderV3.parseFileAndCreateHtml(e);
                            break;
                        case 'ConstructedRoutesV4':
                            content = this.routeTableBuilderV4.parseFileAndCreateHtml(e);
                            break;
                        case 'ReportFees':
                            content = this.testingFeesTableBuilder.parseFileAndCreateFeesHtml(e);
                            break;
                        case 'ReportFares':
                            content = this.testingFeesTableBuilder.parseFileAndCreateFaresHtml(e);
                            break;
                        default:
                            errorJsonMessage.textContent = 'Нет обработчика для типа ' + selectedType;
                            errorJsonMessage.classList.remove('hidden');
                            break;
                    }

                    if (content) {
                        tableWrapper.append(content);
                        container.append(tableWrapper);
                    }
                    defaultOption.selected = true;
                } catch (error) {
                    errorJsonMessage.textContent = 'JSON не парсится, проверяйте структуру';
                    errorJsonMessage.classList.remove('hidden');
                }
            };
            reader.readAsText(file);
            fileInput.value = '';
        });

        this.globe.createRoute(4.70138889, -74.14694444, 36.90027778, 30.79277778);
        this.globe.createRoute(55.69194444, 37.62583333, 41.66888889, 44.95472222);
        this.globe.createRoute(59.76388889, 150.81861111, 36.90027778, 30.79277778);
    }
}

export default AuroraFrontendApplication;
