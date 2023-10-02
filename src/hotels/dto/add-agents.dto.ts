import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class AgentDto {
  name: string;
}

export class AddAgentsDto {
  @IsArray()
  @ValidateNested()
  @Type(() => AgentDto)
  agents: AgentDto[];
}
