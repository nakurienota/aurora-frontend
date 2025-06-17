import HtmlUtil from "../util/htmlutil";
import {Raid, RouteDataV5} from "./models";

export class RoutesTableBuilderV5 {
    parseFileAndCreateHtml(input: ProgressEvent<FileReader>): HTMLDivElement {
        const jsonData: string = HtmlUtil.parseToString(input);
        const flightData: RouteDataV5[] = this.parseRouteDataList(jsonData);
        return this.createHtmlTable(flightData);
    }

    createHtmlTable(input: RouteDataV5[]): HTMLDivElement {
        const container: HTMLDivElement = HtmlUtil.create('div', 'table-data-div');
        const h2: HTMLHeadingElement = HtmlUtil.create('h2');
        h2.textContent = `Total: ${input.length}`;
        container.appendChild(h2);
        for (const el of input) {
            const table: HTMLTableElement = HtmlUtil.create('table');
            const thead: HTMLTableSectionElement = HtmlUtil.create('thead');
            const trHead: HTMLTableRowElement = HtmlUtil.create('tr');

            el.segments.forEach((raid) => {
                const cell: HTMLTableCellElement = HtmlUtil.create('th');
                cell.textContent = raid.departureCode + raid.arrivalCode + ' ' + raid.type;
                trHead.appendChild(cell);
            });

            thead.appendChild(trHead);
            table.appendChild(thead);

            const tbody: HTMLTableSectionElement = HtmlUtil.create('tbody');
            const trBody: HTMLTableRowElement = HtmlUtil.create('tr');
            el.segments.forEach((raid) => {
                trBody.appendChild(this.createRaidTd(raid));
            });

            tbody.appendChild(trBody);
            table.appendChild(tbody);
            container.appendChild(table);
        }

        return container;
    }

    parseRouteDataList(json: any): RouteDataV5[] {
        return json.map((item: any): RouteDataV5 => {
            const raids = (item.segments || []).map((seg: any) => this.parseRaid(seg));
            return new RouteDataV5(raids);
        });
    }

    parseRaid(segment: any): Raid {
        return new Raid(
            segment.airline,
            segment.flight,
            segment.departureDate,
            segment.departureTime,
            segment.arrivalDate,
            segment.arrivalTime,
            segment.departureCode,
            segment.arrivalCode,
            segment.type
        );
    }

    private createRaidTd(flight: Raid): HTMLTableCellElement {
        const td: HTMLTableCellElement = HtmlUtil.create('td');
        const div: HTMLDivElement = HtmlUtil.create('div');
        div.textContent = `${flight.airline}-${flight.flight} ${flight.departureDate}_${flight.departureTime} - ${flight.arrivalDate}_${flight.arrivalTime}`;
        td.appendChild(div);
        return td;
    }
}