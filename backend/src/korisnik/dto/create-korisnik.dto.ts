import { IsEmail, IsNotEmpty} from 'class-validator';

export class CreateKorisnikDto {
  @IsNotEmpty()
  ime: string;

  @IsNotEmpty()
  prezime: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  lozinka: string;

  @IsNotEmpty()
  grad: string;

  @IsNotEmpty()
  datumrodjenja: Date;
}
