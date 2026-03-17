import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginKorisnikDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  lozinka: string;
}
