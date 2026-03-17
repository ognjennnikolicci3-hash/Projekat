import { IsDateString, isInt, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDogadjajDto {
  @IsInt()
  sportId: number;

  @IsInt()
  terenId: number;

  @IsDateString()
  datumVreme: string;

  @IsInt()
  maxIgraca: number;

  @IsInt()
  organizatorId:number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  opis?: string;
}
