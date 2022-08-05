// object for storing airport information
// including port name, region and so on

class Airports {
    constructor() {
        this.data = this._getDataFromDB();
    }

    // get airport data object from database
    _getDataFromDB() {
        // dummy data
        const data = {
            ADL: { region: "AUS", },
            AKL: { region: "AUS", },
            AMD: { region: "SEA", },
            AMS: { region: "EUR", },
            ANC: { region: "NAM", },
            ATL: { region: "NAM", },
            AUH: { region: "MEA", },
            BAH: { region: "MEA", },
            BCN: { region: "EUR", },
            BJS: { region: "SEA", },
            BKK: { region: "SEA", },
            BNE: { region: "AUS", },
            BOM: { region: "SEA", },
            BOS: { region: "NAM", },
            BRU: { region: "EUR", },
            CDG: { region: "EUR", },
            CEB: { region: "SEA", },
            CGQ: { region: "SEA", },
            CGK: { region: "SEA", },
            CHC: { region: "AUS", },
            CHI: { region: "NAM", },
            CMB: { region: "SEA", },
            CMH: { region: "SEA", },
            CNS: { region: "AUS", },
            CPH: { region: "EUR", },
            CPT: { region: "SAF", },
            CTS: { region: "SEA", },
            DEL: { region: "SEA", },
            DFW: { region: "NAM", },
            DOH: { region: "MEA", },
            DPS: { region: "SEA", },
            DRW: { region: "AUS", },
            DUB: { region: "EUR", },
            DUS: { region: "EUR", },
            DXB: { region: "MEA", },
            EWR: { region: "NAM", },
            FCO: { region: "EUR", },
            FRA: { region: "EUR", },
            FUK: { region: "SEA", },
            GDL: { region: "NAM", },
            HAN: { region: "SEA", },
            HKG: { region: "SEA", },
            HOU: { region: "NAM", },
            HYD: { region: "SEA", },
            IAD: { region: "NAM", },
            IST: { region: "MEA", },
            JKT: { region: "SEA", },
            JNB: { region: "SAF", },
            KHI: { region: "MEA", },
            KIX: { region: "SEA", },
            KUL: { region: "SEA", },
            LAX: { region: "NAM", },
            LGW: { region: "EUR", },
            LON: { region: "EUR", },
            MAA: { region: "SEA", },
            MAD: { region: "EUR", },
            MAN: { region: "EUR", },
            MEL: { region: "AUS", },
            MEX: { region: "NAM", },
            MIA: { region: "NAM", },
            MIL: { region: "EUR", },
            MLE: { region: "SEA", },
            MNL: { region: "SEA", },
            MOW: { region: "EUR", },
            MUC: { region: "EUR", },
            NGO: { region: "SEA", },
            NYC: { region: "NAM", },
            OSA: { region: "SEA", },
            PAR: { region: "EUR", },
            PDX: { region: "NAM", },
            PEN: { region: "SEA", },
            PER: { region: "AUS", },
            PNH: { region: "SEA", },
            ROM: { region: "EUR", },
            RUH: { region: "MEA", },
            SEA: { region: "NAM", },
            SEL: { region: "SEA", },
            SFO: { region: "NAM", },
            SGN: { region: "SEA", },
            SHA: { region: "SEA", },
            SIN: { region: "SEA", },
            SPK: { region: "SEA", },
            SUB: { region: "SEA", },
            SYD: { region: "AUS", },
            TLV: { region: "MEA", },
            TNA: { region: "SEA", },
            TPE: { region: "SEA", },
            TWB: { region: "AUS", },
            TXG: { region: "SEA", },
            TYO: { region: "SEA", },
            WAS: { region: "NAM", },
            WNZ: { region: "SEA", },
            YTO: { region: "NAM", },
            YVR: { region: "NAM", },
            YYC: { region: "NAM", },
            ZHE: { region: "SEA", },
            ZRH: { region: "EUR", },
        }

        return (data);
    }

    // extract port list from data
    getPortList = () => {
        let portList = [];
        portList.push(...Object.keys(this.data))
        return (portList)
    }

    // extract port by region
    getPortListByRegion = (region) => {
        let portList = [];
        for (let port in this.data) {
            if (this.data[port].region === region) {
                portList.push(port);
            }
        }
        return (portList)
    }

    // extract port by list of regions
    getPortListByRegionList = (regionList) => {
        let portList = [];
        for (let region of regionList) {
            portList = portList.concat(this.getPortListByRegion(region))
        }
        return portList
    }


    // extract region list
    getRegionList = () => {
        let regionList = [];
        let region = '';
        for (let port in this.data) {
            region = this.data[port].region;
            // if region is not found in regionList, push to list
            if (!regionList.includes(region)) {
                regionList.push(region)
            }
        }
        return (regionList)
    }

    // return region of selected port
    getRegionByPort = (port) => {
        return this.data(port).region
    }

    // return airport object {region: port list}
    getGroupedPortList = () => {
        const regionList = this.getRegionList();
        let portObject = {};
        for (let region of regionList) {
            portObject = {
                ...portObject,
                [region]: this.getPortListByRegion(region),
            }
        }
        return portObject
    }
}

export default Airports;