// src/korisnik/dto/update-profil.dto.ts
import { IsOptional, IsString, IsDateString, IsEmail, Length } from 'class-validator';

export class UpdateProfilDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  ime?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  prezime?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  grad?: string;

  @IsOptional()
  @IsDateString()
  datumrodjenja?: string; // ISO date string
}