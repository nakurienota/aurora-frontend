import {Report, TariffTestingServiceInput, TestCaseData, TestFareData, TestTaxData} from './models';
import HtmlUtil from '../util/htmlutil';

class TestingFeesTableBuilder {

    parseFileAndCreateFeesHtml(input: ProgressEvent<FileReader>): HTMLDivElement {
        const jsonData: string = HtmlUtil.parseToString(input);
        const flightData = this.parseTestingFeesData(jsonData);
        return this.createHtml(flightData);
    }

    parseFileAndCreateFaresHtml(input: ProgressEvent<FileReader>): HTMLDivElement {
        const jsonData: string = HtmlUtil.parseToString(input);
        const flightData = this.parseTestingFaresData(jsonData);
        return this.createHtmlFares(flightData);
    }

    private createHtml(data: TariffTestingServiceInput): HTMLDivElement {
        const htmlContainer = this.createDefaultHeaderForTariffTesting(data);

        const table = HtmlUtil.create('table');
        const thead = HtmlUtil.create('thead');
        const trHead = HtmlUtil.create('tr');
        const headers = ['From', 'To', 'Carrier', 'Date', 'Pax', 'Flight', 'Rbd', 'ATPCO/CST',
            'Source', 'FeeCode', 'FeeType', 'Amount', 'Currency', 'Error',];

        headers.forEach((headerText) => {
            const th = HtmlUtil.create('th');
            th.textContent = headerText;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);

        const tbody = HtmlUtil.create('tbody');

        data.reports.forEach((item) => {
            item.feeTaxMixvel.forEach((entry, subIndex) => {
                const tr = HtmlUtil.create('tr');
                tr.classList.add(entry.exists ? 'green' : 'red');

                const cellsData = [
                    subIndex === 0 ? item.testCaseDto.from : '',
                    subIndex === 0 ? item.testCaseDto.to : '',
                    subIndex === 0 ? item.testCaseDto.carrier : '',
                    subIndex === 0 ? item.testCaseDto.date || '' : '',
                    subIndex === 0 ? item.testCaseDto.passengerCode || '' : '',
                    subIndex === 0 ? item.testCaseDto.flightNumber || '' : '',
                    subIndex === 0 ? item.testCaseDto.bookingCode || '' : '',
                    item.testCaseDto.tariffSourceCode,
                    'feeTaxMixvel',
                    entry.feeCode,
                    entry.feeType,
                    entry.amount,
                    entry.currency,
                ];

                cellsData.forEach((cellText) => {
                    tr.appendChild(this.createTdWithContent(cellText));
                });

                tbody.appendChild(tr);
            });
            item.feeTaxGds.forEach((entry, subIndex) => {
                const tr = HtmlUtil.create('tr');
                tr.classList.add(entry.exists ? 'green' : 'red');

                const cellsData = [
                    subIndex === 0 ? item.testCaseDto.from : '',
                    subIndex === 0 ? item.testCaseDto.to : '',
                    subIndex === 0 ? item.testCaseDto.carrier : '',
                    subIndex === 0 ? item.testCaseDto.date || '' : '',
                    subIndex === 0 ? item.testCaseDto.passengerCode || '' : '',
                    subIndex === 0 ? item.testCaseDto.flightNumber || '' : '',
                    subIndex === 0 ? item.testCaseDto.bookingCode || '' : '',
                    item.testCaseDto.tariffSourceCode, 'feeTaxGds', entry.feeCode, entry.feeType, entry.amount, entry.currency,];

                cellsData.forEach((cellText) => {
                    tr.appendChild(this.createTdWithContent(cellText));
                });

                tbody.appendChild(tr);
            });

            if (item.calcError !== null) {
                const trError = HtmlUtil.create('tr');
                trError.classList.add('red');

                const errorCells = [item.testCaseDto.from, item.testCaseDto.to, item.testCaseDto.carrier,
                    item.testCaseDto.date, item.testCaseDto.passengerCode, item.testCaseDto.flightNumber, item.testCaseDto.bookingCode,
                    item.testCaseDto.tariffSourceCode, '', '', '', '', '', item.calcError,];

                errorCells.forEach((cellText) => {
                    const td = document.createElement('td');
                    td.textContent = cellText;
                    td.classList.add('error-cell');
                    trError.appendChild(td);
                });

                tbody.appendChild(trError);
            }
        });

        table.appendChild(tbody);
        htmlContainer.appendChild(table);

        return htmlContainer;
    }

    private createHtmlFares(data: TariffTestingServiceInput): HTMLDivElement {
        const htmlContainer = this.createDefaultHeaderForTariffTesting(data);

        const table = HtmlUtil.create('table');
        const thead = HtmlUtil.create('thead');
        const trHead = HtmlUtil.create('tr');
        const headers = ['From', 'To', 'Carrier', 'Date', 'Pax', 'Flight', 'Rbd', 'ATPCO/CST',
            'Source', 'BaseFareCode', 'Level','Currency', 'Error',];

        headers.forEach((headerText) => {
            const th = HtmlUtil.create('th');
            th.textContent = headerText;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);

        const tbody = HtmlUtil.create('tbody');

        data.reports.forEach((item) => {
            item.gds.forEach((entry, subIndex) => {
                const tr = HtmlUtil.create('tr');
                tr.classList.add(entry.exists ? 'green' : 'red');

                const cellsData = [
                    subIndex === 0 ? item.testCaseDto.from : '',
                    subIndex === 0 ? item.testCaseDto.to : '',
                    subIndex === 0 ? item.testCaseDto.carrier : '',
                    subIndex === 0 ? item.testCaseDto.date || '' : '',
                    subIndex === 0 ? item.testCaseDto.passengerCode || '' : '',
                    subIndex === 0 ? item.testCaseDto.flightNumber || '' : '',
                    subIndex === 0 ? item.testCaseDto.bookingCode || '' : '',
                    item.testCaseDto.tariffSourceCode,
                    'gds', entry.baseFareCode, entry.fareLevel, entry.fareCurrency,
                ];

                cellsData.forEach((cellText) => {
                    tr.appendChild(this.createTdWithContent(cellText));
                });

                tbody.appendChild(tr);
            });
            item.mixvel.forEach((entry, subIndex) => {
                const tr = HtmlUtil.create('tr');
                tr.classList.add(entry.exists ? 'green' : 'red');

                const cellsData = [
                    subIndex === 0 ? item.testCaseDto.from : '',
                    subIndex === 0 ? item.testCaseDto.to : '',
                    subIndex === 0 ? item.testCaseDto.carrier : '',
                    subIndex === 0 ? item.testCaseDto.date || '' : '',
                    subIndex === 0 ? item.testCaseDto.passengerCode || '' : '',
                    subIndex === 0 ? item.testCaseDto.flightNumber || '' : '',
                    subIndex === 0 ? item.testCaseDto.bookingCode || '' : '',
                    item.testCaseDto.tariffSourceCode, 'mixvel',
                    entry.baseFareCode, entry.fareLevel, entry.fareCurrency,];

                cellsData.forEach((cellText) => {
                    tr.appendChild(this.createTdWithContent(cellText));
                });

                tbody.appendChild(tr);
            });

            if (item.calcError !== null) {
                const trError = HtmlUtil.create('tr');
                trError.classList.add('red');

                const errorCells = [item.testCaseDto.from, item.testCaseDto.to, item.testCaseDto.carrier,
                    item.testCaseDto.date, item.testCaseDto.passengerCode, item.testCaseDto.flightNumber, item.testCaseDto.bookingCode,
                    item.testCaseDto.tariffSourceCode, '', '', '', '', item.calcError,];

                errorCells.forEach((cellText) => {
                    const td = document.createElement('td');
                    td.textContent = cellText;
                    td.classList.add('error-cell');
                    trError.appendChild(td);
                });

                tbody.appendChild(trError);
            }
        });

        table.appendChild(tbody);
        htmlContainer.appendChild(table);

        return htmlContainer;
    }

    private parseTestingFeesData(json: any): TariffTestingServiceInput {
        const reports = json.reports.map(
            (report: Report) =>
                new Report(
                    new TestCaseData(report.testCaseDto.from, report.testCaseDto.to, report.testCaseDto.carrier,
                        report.testCaseDto.date, report.testCaseDto.passengerCode, report.testCaseDto.flightNumber,
                        report.testCaseDto.bookingCode, report.testCaseDto.tariffSourceCode, report.testCaseDto.currency),
                    [],[],
                    report.feeTaxMixvel.map(
                        (fee: TestTaxData) =>
                            new TestTaxData(fee.feeCode, fee.feeType, fee.amount, fee.currency, fee.exists)
                    ),
                    report.feeTaxGds.map(
                        (fee: TestTaxData) =>
                            new TestTaxData(fee.feeCode, fee.feeType, fee.amount, fee.currency, fee.exists)
                    ),
                    report.calcError
                )
        );
        return new TariffTestingServiceInput(
            String(json.mixvelTotal),
            String(json.gdsTotal),
            String(json.testCasesSuccess),
            String(json.separateFareSuccess),
            reports
        );
    }

    private parseTestingFaresData(json: any): TariffTestingServiceInput {
        const reports = json.reports.map(
            (report: Report) =>
                new Report(
                    new TestCaseData(report.testCaseDto.from, report.testCaseDto.to, report.testCaseDto.carrier,
                        report.testCaseDto.date, report.testCaseDto.passengerCode, report.testCaseDto.flightNumber,
                        report.testCaseDto.bookingCode, report.testCaseDto.tariffSourceCode, report.testCaseDto.currency),
                    report.gds.map(
                        (fee: TestFareData) =>
                            new TestFareData(fee.baseFareCode, fee.fareLevel, fee.fareCurrency, fee.exists)
                    ),
                    report.mixvel.map(
                        (fee: TestFareData) =>
                            new TestFareData(fee.baseFareCode, fee.fareLevel, fee.fareCurrency, fee.exists)
                    ),[],[],
                    report.calcError
                )
        );
        return new TariffTestingServiceInput(
            String(json.mixvelTotal),
            String(json.gdsTotal),
            String(json.testCasesSuccess),
            String(json.separateFareSuccess),
            reports
        );
    }

    private createDefaultHeaderForTariffTesting(data: TariffTestingServiceInput, ): HTMLDivElement {
        const result = HtmlUtil.create('div', 'table-data-div');
        const header = HtmlUtil.create('h2');
        header.textContent = `${new Date()}`;
        result.appendChild(header);
        const totalMixvel = HtmlUtil.create('h4');
        totalMixvel.textContent = `Total mixvel ${data.mixvelTotal}`;
        result.appendChild(totalMixvel);
        const totalGds = HtmlUtil.create('h4');
        totalGds.textContent = `Total gds ${data.gdsTotal}`;
        result.appendChild(totalGds);
        const testCasesSuccess = HtmlUtil.create('h4');
        testCasesSuccess.textContent = `gds full answer in mixvel ${data.testCasesSuccess}`;
        result.appendChild(testCasesSuccess);
        const separateFareSuccess = HtmlUtil.create('h4');
        separateFareSuccess.textContent = `gds separate result in mixvel ${data.separateFareSuccess}`;
        result.appendChild(separateFareSuccess);
        return result;
    }

    private createTdWithContent(input: string): HTMLTableCellElement {
        const td = document.createElement('td');
        td.textContent = input;
        td.classList.add('error-cell');
        return td;
    }
}

export default TestingFeesTableBuilder;
