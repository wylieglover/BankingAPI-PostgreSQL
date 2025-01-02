export interface CreateCustomerDTO {
    name: string;
    homeAddress: string;
    email: string;
    username: string;
    password: string;
}

export interface UpdateCustomerDTO {
    customerId: string;
    name: string;
    homeAddress: string;
    email: string;
    password: string;
}

export interface CustomerPaginationParams {
    page: number;
    pageSize: number;
    customerId?: string;
}