import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class DocumentsService {
  listDocuments(): never {
    throw new NotImplementedException("Study documents are not implemented yet.");
  }
}
