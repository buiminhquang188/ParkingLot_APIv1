export class HttpException extends Error {
  public status: number;
  public message: string;
  public httpCode?: number;
  public errors?: any;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
