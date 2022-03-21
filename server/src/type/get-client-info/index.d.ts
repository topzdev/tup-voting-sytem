declare namespace Express {
  export interface Request {
    ua: string;
    client_ip: string | any;
  }
}
