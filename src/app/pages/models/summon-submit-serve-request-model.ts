export interface SummonSubmitServeRequestModel {
    processId: string;
    cino: string;
    caseStatus: string;
    policeStationCd: string;
    policeStationName: string;
    longitude: string;
    latitude: string;
    serveDate: string;
    serveType: number;
    userId: string;
    base64String: string;
    fileName: string;
    location: string;
    reasonType: number;
    reason: string;
    summonDescription: string;
    servePersonName?: string;
    servePersonAddress?: string;
    servePersonMobile?: string;
    servePersonRelation?: string;
    servePersonEmail?: string;
    category: string;
  }
  