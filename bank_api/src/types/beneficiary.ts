export interface CreateBeneficiaryDTO {
    customerId: string;
    name: string;
    accountNumber: string;
    bankDetails: string;
}

export interface UpdateBeneficiaryDTO {
    beneficiaryId: string;
    name: string;
    accountNumber: string;
    bankDetails: string;
}

export interface BeneficiaryPaginationParams {
    page: number;
    pageSize: number;
    customerId: string;
}
