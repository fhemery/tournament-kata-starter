import {HttpException} from "@nestjs/common";

export function generateException(statusCode: number, errorMessage: string): HttpException {

    return new HttpException({
        statusCode: statusCode,
        error: errorMessage,
    }, statusCode)
}
