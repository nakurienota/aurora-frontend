export class Raid {
    constructor(
        public airline: string,
        public flight: string,
        public departureDate: string,
        public departureTime: string,
        public arrivalDate: string,
        public arrivalTime: string,
        public departureCode: string,
        public arrivalCode: string,
        public type: string
    ) {}
}

export class Models {
    constructor(public flights: Record<string, Raid[]>) {}
}

export class RouteData {
    constructor(public routes: Record<string, Models>) {}
}

export class RouteDataV3 {
    constructor(
        public path: string,
        public segment1: SegmentV3,
        public segment2: SegmentV3 | null,
        public segment3: SegmentV3 | null,
        public segment4: SegmentV3 | null
    ) {}
}

export class RouteDataV4 {
    constructor(
        public segment1: Raid,
        public segment2: Raid | null,
        public segment3: Raid | null,
        public segment4: Raid | null
    ) {}
}

export class SegmentV3 {
    constructor(
        public flights: Raid[],
        public dep: string,
        public dest: string
    ) {}
}

export class TariffTestingServiceInput {
    constructor(
        public mixvelTotal: string,
        public gdsTotal: string,
        public testCasesSuccess: string,
        public separateFareSuccess: string,
        public reports: Report[]
    ) {}
}

export class Report {
    constructor(
        public testCaseDto: TestCaseData,
        public gds: TestFareData[],
        public mixvel: TestFareData[],
        public feeTaxMixvel: TestTaxData[],
        public feeTaxGds: TestTaxData[],
        public calcError: string
    ) {}
}

export class TestCaseData {
    constructor(
        public from: string,
        public to: string,
        public carrier: string,
        public date: string,
        public passengerCode: string,
        public flightNumber: string,
        public bookingCode: string,
        public tariffSourceCode: string,
        public currency: string
    ) {}
}

export class TestTaxData {
    constructor(
        public feeCode: string,
        public feeType: string,
        public amount: string,
        public currency: string,
        public exists: boolean
    ) {}
}

export class TestFareData {
    constructor(
        public baseFareCode: string,
        public fareLevel: string,
        public fareCurrency: string,
        public exists: boolean
    ) {}
}
