import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class GovernanceService {
  listApprovals(): never {
    throw new NotImplementedException("Governance flows are not implemented yet.");
  }
}
