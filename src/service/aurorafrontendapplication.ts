import InteractiveGlobe from '../classes/globe';
import HtmlUtil from '../util/htmlutil';
import RoutesTableBuilder from '../classes/routes-table-builder';
import TestingFeesTableBuilder from '../classes/testing-fees-table-builder';
import RoutesTableBuilderV3 from '../classes/routes-table-builder-v3';
import { RoutesTableBuilderV4 } from '../classes/routes-table-builder-v4';
import {RoutesTableBuilderV5} from "../classes/route-table-builder-v5";

class AuroraFrontendApplication {
    private globe: InteractiveGlobe | undefined;
    private readonly routeTableBuilder: RoutesTableBuilder;
    private readonly testingFeesTableBuilder: TestingFeesTableBuilder;
    private readonly routeTableBuilderV3: RoutesTableBuilderV3;
    private readonly routeTableBuilderV4: RoutesTableBuilderV4;
    private readonly routeTableBuilderV5: RoutesTableBuilderV5;

    constructor() {
        this.routeTableBuilder = new RoutesTableBuilder();
        this.testingFeesTableBuilder = new TestingFeesTableBuilder();
        this.routeTableBuilderV3 = new RoutesTableBuilderV3();
        this.routeTableBuilderV4 = new RoutesTableBuilderV4();
        this.routeTableBuilderV5 = new RoutesTableBuilderV5();
    }

    start() {
        const body: HTMLElement = document.body;
        const container: HTMLDivElement = HtmlUtil.create('div', 'container');
        const h1: HTMLHeadingElement = HtmlUtil.create('h1');
        h1.textContent = 'Aurora frontend V1.5.2';
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
            'ConstructedRoutesV5Array',
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
                        case 'ConstructedRoutesV5Array':
                            content = this.routeTableBuilderV5.parseFileAndCreateHtml(e);
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

        this.globe.createRoute(46.9541, 142.736,55.75, 37.62); //uus-mow
        this.globe.createRoute(55.75, 37.62, 	41.2646, 69.2163); //mow-tas
        this.globe.createRoute(46.9541, 142.736, 	52.2978, 104.296);//uus-ikt
        this.globe.createRoute(52.2978, 104.296, 41.2646, 69.2163); //ikt-tas

        this.globe.createRoute(46.9541, 142.736, 	43.1333,  131.9000);//uus-vvo
        this.globe.createRoute(43.1333,  131.9000, 41.2646, 69.2163); //vvo-tas
        this.globe.createRoute(46.9541, 142.736, 	56.0097,  92.7917);//uus-kja
        this.globe.createRoute(56.0097,  92.7917, 41.2646, 69.2163); //kja-tas
    }
}

export default AuroraFrontendApplication;
