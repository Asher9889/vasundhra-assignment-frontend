interface AxiosApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}
 
export type { AxiosApiResponse };