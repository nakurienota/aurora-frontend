import HtmlUtil from '../util/htmlutil';
import {Models, Raid, RouteData} from './models';

class RoutesTableBuilder {

    parseFileAndCreateHtml(input: ProgressEvent<FileReader>): HTMLDivElement {
        const jsonData: string = HtmlUtil.parseToString(input);
        const flightData = this.parseFlightData(jsonData);
        return this.createHtmlTable(flightData);
    }

    createHtmlTable(input: RouteData): HTMLDivElement {
        const container = HtmlUtil.create('div', 'table-data-div');

        for (const [routeKey, route] of Object.entries(input.routes)) {
            const title = HtmlUtil.create('h2');
            title.textContent = routeKey;
            container.appendChild(title);

            const table = HtmlUtil.create('table');
            const thead = HtmlUtil.create('thead');
            const trHead = HtmlUtil.create('tr');

            const segmentKeys = Object.keys(route.flights);
            segmentKeys.sort((a, b) => {
                const routeSegments = routeKey.split('-');
                return routeSegments.indexOf(a.substring(0, 3)) - routeSegments.indexOf(b.substring(0, 3));
            });
            segmentKeys.forEach((segmentKey) => {
                const th = HtmlUtil.create('th');
                th.textContent = segmentKey;
                trHead.appendChild(th);
            });
            thead.appendChild(trHead);
            table.appendChild(thead);

            const tbody = HtmlUtil.create('tbody');
            const trBody = HtmlUtil.create('tr');

            segmentKeys.forEach((segmentKey) => {
                const td = HtmlUtil.create('td');
                const flights = route.flights[segmentKey].sort((a, b) => {
                    const dateA = new Date(`${a.departureDate}T${a.departureTime}`);
                    const dateB = new Date(`${b.departureDate}T${b.departureTime}`);
                    return dateA.getTime() - dateB.getTime();
                });

                flights.forEach((flight) => {
                    const div = HtmlUtil.create('div');
                    div.textContent = `${flight.airline}-${flight.flight} ${flight.departureDate}_${flight.departureTime}-${flight.arrivalDate}_${flight.arrivalTime}`;
                    td.appendChild(div);
                });

                trBody.appendChild(td);
            });

            tbody.appendChild(trBody);
            table.appendChild(tbody);
            container.appendChild(table);
        }

        return container;
    }

    parseFlightData(json: any): RouteData {
        const parsedRoutes: Record<string, Models> = {};

        for (const [routeKey, segments] of Object.entries(json)) {
            const parsedSegments: Record<string, Raid[]> = {};

            for (const [segmentKey, flights] of Object.entries(segments as Models)) {
                parsedSegments[segmentKey] = (flights as Raid[]).map(
                    (flight: Raid) =>
                        new Raid(flight.airline, flight.flight, flight.departureDate, flight.departureTime,
                            flight.arrivalDate, flight.arrivalTime, flight.departureCode, flight.arrivalCode));
            }
            parsedRoutes[routeKey] = new Models(parsedSegments);
        }
        return new RouteData(parsedRoutes);
    }
}

export default RoutesTableBuilder;
