import InteractiveGlobe from "../classes/globe";
import HtmlUtil from "../util/htmlutil";

class AuroraFrontendApplication {
    private globe: InteractiveGlobe | undefined;

    start() {
        const body = document.body;
        const container = HtmlUtil.create('div', 'container');
        const h1 = HtmlUtil.create('h1');
        h1.textContent = "Aurora frontend V1.0.0";
        container.append(h1);
        const globeWrapper = HtmlUtil.create('div', 'div_globe_wrapper');
        const results = HtmlUtil.create('div', 'div_table');
        results.textContent = 'THERE TABLE'
        const globe = HtmlUtil.create('div', 'div_globe_modal');
        const openGlobe = HtmlUtil.create('button', undefined, 'default-btn');
        const closeGlobe = HtmlUtil.create('button', 'div_globe_modal__close_btn', 'default-btn');
        closeGlobe.textContent = 'close';
        openGlobe.textContent = 'open globe';
        container.append(openGlobe);
        this.globe = new InteractiveGlobe(globe);
        container.append(results);
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
        this.globe.createRoute(4.70138889, -74.14694444, 36.90027778, 30.79277778);
        this.globe.createRoute(55.69194444, 37.62583333, 41.66888889, 44.95472222);
        this.globe.createRoute(59.76388889, 150.81861111, 36.90027778, 30.79277778);
    }

}

export default AuroraFrontendApplication;