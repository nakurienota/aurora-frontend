import HtmlUtil from '../util/htmlutil';
import {Raid, RouteDataV2, SegmentV2} from './models';

class RoutesTableBuilderV2 {
    parseFileAndCreateHtml(input: ProgressEvent<FileReader>): HTMLDivElement {
        const jsonData: string = HtmlUtil.parseToString(input);
        const flightData: RouteDataV2[] = this.parseRouteDataList(jsonData);
        return this.createHtmlTable(flightData);
    }

    createHtmlTable(input: RouteDataV2[]): HTMLDivElement {
        const container: HTMLDivElement = HtmlUtil.create('div', 'table-data-div');
        for (const el of input) {
            const title: HTMLHeadingElement = HtmlUtil.create('h2');
            title.textContent = el.path;
            container.appendChild(title);

            const table: HTMLTableElement = HtmlUtil.create('table');
            const thead: HTMLTableSectionElement = HtmlUtil.create('thead');
            const trHead: HTMLTableRowElement = HtmlUtil.create('tr');

            const th1: HTMLTableCellElement = HtmlUtil.create('th');
            th1.textContent = el.segment1?.dep + el.segment1?.dest;
            trHead.appendChild(th1);
            if (el.segment2) {
                const th2: HTMLTableCellElement = HtmlUtil.create('th');
                th2.textContent = el.segment2.dep + el.segment2.dest;
                trHead.appendChild(th2);
            }
            if (el.segment3) {
                const th3: HTMLTableCellElement = HtmlUtil.create('th');
                th3.textContent = el.segment3.dep + el.segment3.dest;
                trHead.appendChild(th3);
            }
            if (el.segment4) {
                const th4: HTMLTableCellElement = HtmlUtil.create('th');
                th4.textContent = el.segment4?.dep + el.segment4?.dest;
                trHead.appendChild(th4);
            }

            thead.appendChild(trHead);
            table.appendChild(thead);

            const tbody: HTMLTableSectionElement = HtmlUtil.create('tbody');
            const trBody: HTMLTableRowElement = HtmlUtil.create('tr');
            trBody.appendChild(this.createRaidTd(el.segment1.flights));
            if (el.segment2)
                trBody.appendChild(this.createRaidTd(el.segment2.flights));
            if (el.segment3)
                trBody.appendChild(this.createRaidTd(el.segment3.flights));
            if (el.segment4)
                trBody.appendChild(this.createRaidTd(el.segment4.flights));

            tbody.appendChild(trBody);
            table.appendChild(tbody);
            container.appendChild(table);
        }

        return container;
    }

    parseRouteDataList(json: any): RouteDataV2[] {
        return json.map((item: RouteDataV2) => new RouteDataV2(
            item.path,
            this.parseSegment(item.segment1),
            item.segment2 ? this.parseSegment(item.segment2) : null,
            item.segment3 ? this.parseSegment(item.segment3) : null,
            item.segment4 ? this.parseSegment(item.segment4) : null
        ));
    }

    parseSegment(segment: any): SegmentV2 {
        const flights: any = (segment.flights ?? []).map((raid: Raid) => new Raid(
            raid.airline, raid.flight, raid.departureDate, raid.departureTime, raid.arrivalDate,
            raid.arrivalTime, raid.departureCode, raid.arrivalCode));

        return new SegmentV2(flights, segment.dep, segment.dest);
    }

    private createRaidTd(input: Raid[]): HTMLTableCellElement {
        const td: HTMLTableCellElement = HtmlUtil.create('td');
        const sorted: Raid[] = input.sort((a: Raid, b: Raid) => {
            const dateA = new Date(`${a.departureDate}T${a.departureTime}`);
            const dateB = new Date(`${b.departureDate}T${b.departureTime}`);
            return dateA.getTime() - dateB.getTime();
        });
        sorted.forEach((flight: Raid) => {
            const div: HTMLDivElement = HtmlUtil.create('div');
            div.textContent = `${flight.airline}-${flight.flight} ${flight.departureDate}_${flight.departureTime} - ${flight.arrivalDate}_${flight.arrivalTime}`;
            td.appendChild(div);
        });
        return td;
    }
}

export default RoutesTableBuilderV2;
