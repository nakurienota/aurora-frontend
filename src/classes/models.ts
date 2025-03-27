export class Raid {
    constructor(
        public airline: string,
        public flight: string,
        public departureDate: string,
        public departureTime: string,
        public arrivalDate: string,
        public arrivalTime: string,
        public departureCode: string,
        public arrivalCode: string
    ) {
    }
}

export class Models {
    constructor(public flights: Record<string, Raid[]>) {
    }
}

export class RouteData {
    constructor(public routes: Record<string, Models>) {
    }
}