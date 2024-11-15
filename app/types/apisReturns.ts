
export type IMake = {
    MakeId: number;
    MakeName: string;
    VehicleTypeId: number;
    VehicleTypeName: string;
};

export type ICarModel = {
    Make_ID: number;
    Make_Name: string;
    Model_ID: number;
    Model_Name: string;
};

export type returnHeader<T> = {
    Count: number;
    Message: string;
    SearchCriteria: string;
    Results: T[];
};