import { PartialType } from "@nestjs/swagger";
import { CreateIrbSubmissionDto } from "./create-irb-submission.dto";

export class UpdateIrbSubmissionDto extends PartialType(CreateIrbSubmissionDto) {}
