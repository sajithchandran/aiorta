import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class JobsService {
  queueDatasetMaterialization(): never {
    throw new NotImplementedException("Dataset materialization jobs are not implemented yet.");
  }

  queueAnalysisExecution(): never {
    throw new NotImplementedException("Analysis execution jobs are not implemented yet.");
  }

  queueManuscriptGeneration(): never {
    throw new NotImplementedException("Manuscript generation jobs are not implemented yet.");
  }

  queueAiReview(): never {
    throw new NotImplementedException("AI review jobs are not implemented yet.");
  }
}
