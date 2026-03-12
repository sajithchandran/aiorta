import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class ProtocolsService {
  listProtocols(): never {
    throw new NotImplementedException("Protocol flows are not implemented yet.");
  }
}
