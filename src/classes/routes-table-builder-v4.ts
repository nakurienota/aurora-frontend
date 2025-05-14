import HtmlUtil from '../util/htmlutil';
import { Raid, RouteDataV4 } from './models';

export class RoutesTableBuilderV4 {
    parseFileAndCreateHtml(input: ProgressEvent<FileReader>): HTMLDivElement {
        const jsonData: string = HtmlUtil.parseToString(input);
        const flightData: RouteDataV4[] = this.parseRouteDataList(jsonData);
        return this.createHtmlTable(flightData);
    }

    createHtmlTable(input: RouteDataV4[]): HTMLDivElement {
        const container: HTMLDivElement = HtmlUtil.create('div', 'table-data-div');
        const h2: HTMLHeadingElement = HtmlUtil.create('h2');
        h2.textContent = `Total: ${input.length}`;
        container.appendChild(h2);
        for (const el of input) {
            const table: HTMLTableElement = HtmlUtil.create('table');
            const thead: HTMLTableSectionElement = HtmlUtil.create('thead');
            const trHead: HTMLTableRowElement = HtmlUtil.create('tr');

            const th1: HTMLTableCellElement = HtmlUtil.create('th');
            th1.textContent = el.segment1?.departureCode + el.segment1?.arrivalCode + ' ' + el.segment1.type;
            trHead.appendChild(th1);
            if (el.segment2) {
                const th2: HTMLTableCellElement = HtmlUtil.create('th');
                th2.textContent = el.segment2.departureCode + el.segment2.arrivalCode + ' ' + el.segment1.type;
                trHead.appendChild(th2);
            }
            if (el.segment3) {
                const th3: HTMLTableCellElement = HtmlUtil.create('th');
                th3.textContent = el.segment3.departureCode + el.segment3.arrivalCode + ' ' + el.segment1.type;
                trHead.appendChild(th3);
            }
            if (el.segment4) {
                const th4: HTMLTableCellElement = HtmlUtil.create('th');
                th4.textContent = el.segment4.departureCode + el.segment4.arrivalCode + ' ' + el.segment1.type;
                trHead.appendChild(th4);
            }

            thead.appendChild(trHead);
            table.appendChild(thead);

            const tbody: HTMLTableSectionElement = HtmlUtil.create('tbody');
            const trBody: HTMLTableRowElement = HtmlUtil.create('tr');
            trBody.appendChild(this.createRaidTd(el.segment1));
            if (el.segment2) trBody.appendChild(this.createRaidTd(el.segment2));
            if (el.segment3) trBody.appendChild(this.createRaidTd(el.segment3));
            if (el.segment4) trBody.appendChild(this.createRaidTd(el.segment4));

            tbody.appendChild(trBody);
            table.appendChild(tbody);
            container.appendChild(table);
        }

        return container;
    }

    parseRouteDataList(json: any): RouteDataV4[] {
        return json.map(
            (item: RouteDataV4) =>
                new RouteDataV4(
                    this.parseRaid(item.segment1),
                    item.segment2 ? this.parseRaid(item.segment2) : null,
                    item.segment3 ? this.parseRaid(item.segment3) : null,
                    item.segment4 ? this.parseRaid(item.segment4) : null
                )
        );
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
