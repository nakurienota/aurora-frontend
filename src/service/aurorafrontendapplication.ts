import InteractiveGlobe from '../classes/globe';
import HtmlUtil from '../util/htmlutil';
import RoutesTableBuilder from '../classes/routes-table-builder';
import TestingFeesTableBuilder from '../classes/testing-fees-table-builder';
import RoutesTableBuilderV2 from "../classes/routes-table-builder-v2";

class AuroraFrontendApplication {
    private globe: InteractiveGlobe | undefined;
    private readonly routeTableBuilder: RoutesTableBuilder;
    private readonly testingFeesTableBuilder: TestingFeesTableBuilder;
    private readonly routeTableBuilderV2: RoutesTableBuilderV2;

    constructor() {
        this.routeTableBuilder = new RoutesTableBuilder();
        this.testingFeesTableBuilder = new TestingFeesTableBuilder();
        this.routeTableBuilderV2 = new RoutesTableBuilderV2();
    }

    start() {
        const body: HTMLElement = document.body;
        const container: HTMLDivElement = HtmlUtil.create('div', 'container');
        const h1: HTMLHeadingElement = HtmlUtil.create('h1');
        h1.textContent = 'Aurora frontend V1.2.1';
        container.append(h1);
        const globeWrapper: HTMLDivElement = HtmlUtil.create('div', 'div-globe-wrapper');
        const tableWrapper: HTMLDivElement = HtmlUtil.create('div', 'div-table');
        const globe: HTMLDivElement = HtmlUtil.create('div', 'div-globe-modal');
        const openGlobe: HTMLButtonElement = HtmlUtil.create('button', undefined, 'default-btn');
        const closeGlobe: HTMLButtonElement = HtmlUtil.create('button', 'div-globe-modal-close-btn', 'default-btn');
        closeGlobe.textContent = 'close';
        openGlobe.textContent = 'open globe';
        container.append(openGlobe);
        this.globe = new InteractiveGlobe(globe);
        globeWrapper.append(globe);
        globeWrapper.append(closeGlobe);
        container.append(globeWrapper);
        body.append(container);
        openGlobe.addEventListener('click', () => {
            globeWrapper.style.display = 'flex';
        });
        closeGlobe.addEventListener('click', () => {
            globeWrapper.style.display = 'none';
        });

        const inputFilesWrapper = HtmlUtil.create('div', 'input-files-wrapper');
        const jsonInput = HtmlUtil.create('input');
        jsonInput.type = 'file';
        jsonInput.accept = 'application/json';
        inputFilesWrapper.append(jsonInput);

        const dataTypeSelector = HtmlUtil.create('select');
        dataTypeSelector.id = 'dataType';
        const fileTypes = ['ConstructedRoutes', 'ConstructedRoutesV2', 'ReportFares', 'ReportSeatMap', 'ReportFees'];

        const defaultOption = HtmlUtil.create('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Тип таблицы';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        dataTypeSelector.appendChild(defaultOption);

        fileTypes.forEach((type) => {
            const option = HtmlUtil.create('option');
            option.value = type;
            option.textContent = type;
            dataTypeSelector.appendChild(option);
        });
        const errorJsonMessage = HtmlUtil.create('p', 'error-json-message');
        errorJsonMessage.classList.add('hidden');
        inputFilesWrapper.append(dataTypeSelector);
        inputFilesWrapper.append(errorJsonMessage);
        container.append(inputFilesWrapper);

        jsonInput.addEventListener('change', (event) => {
            const fileInput = event.target as HTMLInputElement;
            const file = fileInput.files?.[0];
            if (!file) return;
            tableWrapper.childNodes.forEach((el) => el.remove());

            errorJsonMessage.classList.add('hidden');
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const selectedType = dataTypeSelector.value;
                    if (selectedType === 'ConstructedRoutes') {
                        tableWrapper.append(this.routeTableBuilder.parseFileAndCreateHtml(e));
                        container.append(tableWrapper);
                    } else if (selectedType === 'ConstructedRoutesV2') {
                        tableWrapper.append(this.routeTableBuilderV2.parseFileAndCreateHtml(e));
                        container.append(tableWrapper);
                    } else if (selectedType === 'ReportFees') {
                        tableWrapper.append(this.testingFeesTableBuilder.parseFileAndCreateFeesHtml(e));
                        container.append(tableWrapper);
                    } else if (selectedType === 'ReportFares') {
                        tableWrapper.append(this.testingFeesTableBuilder.parseFileAndCreateFaresHtml(e));
                        container.append(tableWrapper);
                    } else {
                        errorJsonMessage.textContent = 'Нет обработчика для типа ' + selectedType;
                        errorJsonMessage.classList.remove('hidden');
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
