export interface DatasetsList {
    TotalResults: number;
    TotalPages: number;
    CurrentPage: number;
    PreviousPage: string;
    NextPage: string;
    Seed: null;
    Items: {
        Id: string;
        Self: string;
        Type: string;
        _Meta: {
            Id: string;
            Type: string;
            Source: string;
            Reduced: boolean;
            LastUpdate: string;
            UpdateInfo: {
                UpdatedBy: string;
                UpdateSource: string;
            };
        };
        ApiUrl: string;
        Output: any | null;
        ApiType: string;
        BaseUrl: string;
        ODHTags: string[];
        OdhType: any | null;
        Sources: any | null;
        Category: string[];
        ApiAccess: any | null;
        ApiFilter: string[];
        Dataspace: string;
        OdhTagIds: any | null;
        PathParam: string[];
        Shortname: string;
        Deprecated: boolean;
        LastChange: string;
        SwaggerUrl: string;
        FirstImport: string;
        LicenseInfo: {
            Author: string;
            License: string;
            ClosedData: boolean;
            LicenseHolder: string;
        };
        PublishedOn: string[];
        RecordCount: any | null;
        DataProvider: string[];
        ImageGallery: {
            Width: number | null;
            Height: number | null;
            License: string;
            ValidTo: string | null;
            ImageUrl: string;
            CopyRight: string | null;
            ImageDesc: Record<string, string>;
            ImageName: string | null;
            ImageTags: string[] | null;
            ValidFrom: string | null;
            ImageTitle: Record<string, string>;
            ImageSource: string;
            IsInGallery: boolean | null;
            ImageAltText: Record<string, string>;
            ListPosition: number | null;
            LicenseHolder: string | null;
        }[];
        ApiDescription: Record<string, string>;
    }[];
}
