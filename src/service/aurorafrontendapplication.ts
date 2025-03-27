import InteractiveGlobe from "../classes/globe";
import HtmlUtil from "../util/htmlutil";
import RoutesTableBuilder from "../classes/routes-table-builder";

class AuroraFrontendApplication {
    private globe: InteractiveGlobe | undefined;
    private readonly routeTableBuilder: RoutesTableBuilder;

    constructor(){
        this.routeTableBuilder = new RoutesTableBuilder();
    }

    start() {
        const body = document.body;
        const container = HtmlUtil.create('div', 'container');
        const h1 = HtmlUtil.create('h1');
        h1.textContent = "Aurora frontend V1.0.0";
        container.append(h1);
        const globeWrapper = HtmlUtil.create('div', 'div_globe_wrapper');
        const tableWrapper = HtmlUtil.create('div', 'div_table');
        const globe = HtmlUtil.create('div', 'div_globe_modal');
        const openGlobe = HtmlUtil.create('button', undefined, 'default-btn');
        const closeGlobe = HtmlUtil.create('button', 'div_globe_modal__close_btn', 'default-btn');
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
        })

        const jsonInput = HtmlUtil.create("input");
        jsonInput.type = "file";
        jsonInput.accept = "application/json"; // Только JSON-файлы
        container.append(jsonInput);

        jsonInput.addEventListener("change", (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData: string = JSON.parse(e.target?.result as string);
                    const flightData = this.routeTableBuilder.parseFlightData(jsonData);
                    const tablesDiv = this.routeTableBuilder.createHtmlTable(flightData);
                    tableWrapper.append(tablesDiv);
                    container.append(tableWrapper);
                    console.log("Parsed Flight Data:", flightData);
                } catch (error) {
                    console.error("Ошибка парсинга JSON:", error);
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