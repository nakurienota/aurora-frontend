import InteractiveGlobe from '../classes/globe';
import HtmlUtil from '../util/htmlutil';
import RoutesTableBuilder from '../classes/routes-table-builder';
import TestingFeesTableBuilder from '../classes/testing-fees-table-builder';

class AuroraFrontendApplication {
    private globe: InteractiveGlobe | undefined;
    private readonly routeTableBuilder: RoutesTableBuilder;
    private readonly testingFeesTableBuilder: TestingFeesTableBuilder;

    constructor() {
        this.routeTableBuilder = new RoutesTableBuilder();
        this.testingFeesTableBuilder = new TestingFeesTableBuilder();
    }

    start() {
        const body = document.body;
        const container = HtmlUtil.create('div', 'container');
        const h1 = HtmlUtil.create('h1');
        h1.textContent = 'Aurora frontend V1.1.0';
        container.append(h1);
        const globeWrapper = HtmlUtil.create('div', 'div-globe-wrapper');
        const tableWrapper = HtmlUtil.create('div', 'div-table');
        const globe = HtmlUtil.create('div', 'div-globe-modal');
        const openGlobe = HtmlUtil.create('button', undefined, 'default-btn');
        const closeGlobe = HtmlUtil.create('button', 'div-globe-modal-close-btn', 'default-btn');
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
        const fileTypes = ['ConstructedRoutes', 'ReportFares', 'ReportSeatMap', 'ReportFees'];
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
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;
            errorJsonMessage.classList.add('hidden');
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const selectedType = dataTypeSelector.value;
                    if (selectedType === 'ConstructedRoutes') {
                        const jsonData: string = JSON.parse(e.target?.result as string);
                        const flightData = this.routeTableBuilder.parseFlightData(jsonData);
                        const tablesDiv = this.routeTableBuilder.createHtmlTable(flightData);
                        tableWrapper.append(tablesDiv);
                        container.append(tableWrapper);
                    } else if (selectedType === 'ReportFees') {
                        const jsonData: string = JSON.parse(e.target?.result as string);
                        const feesData = this.testingFeesTableBuilder.parseTestingFeesData(jsonData);
                        const tableDiv = this.testingFeesTableBuilder.createReportTable(feesData);
                        tableWrapper.append(tableDiv);
                        container.append(tableWrapper);
                    } else {
                        errorJsonMessage.textContent = 'Нет обработчика для типа ' + selectedType;
                        errorJsonMessage.classList.remove('hidden');
                    }
                } catch (error) {
                    errorJsonMessage.textContent = 'JSON не парсится, проверяйте структуру';
                    errorJsonMessage.classList.remove('hidden');
                }
            };

            reader.readAsText(file);
        });

        this.globe.createRoute(4.70138889, -74.14694444, 36.90027778, 30.79277778);
        this.globe.createRoute(55.69194444, 37.62583333, 41.66888889, 44.95472222);
        this.globe.createRoute(59.76388889, 150.81861111, 36.90027778, 30.79277778);
    }
}

export default AuroraFrontendApplication;
