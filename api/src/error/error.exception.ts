import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorException extends HttpException {
  constructor(props: string) {
    super(props, HttpStatus.BAD_REQUEST);
  }
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}
export class invalidLoginException extends HttpException {
  constructor(props: string) {
    super(props, HttpStatus.FORBIDDEN);
  }
}
export class invalidUserTypeException extends HttpException {
  constructor(props: string) {
    super(props, HttpStatus.UNAUTHORIZED);
  }
}
