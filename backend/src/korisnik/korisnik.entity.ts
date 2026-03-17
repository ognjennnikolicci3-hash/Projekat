import { Dogadjaji } from "src/dogadjaj/dogadjaj.entity";
import { Ocene } from "src/ocene/ocene.entity";
import { Sportovi } from "src/sport/sport.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "korisnici"})
export class Korisnik {
  @PrimaryGeneratedColumn({ name: "KorisnikId", type: "int" })
  korisnikId: number;

  @Column({ name: "Ime", type: "varchar" })
  ime: string;

  @Column({ name: "Prezime", type: "varchar" })
  prezime: string;

  @Column({ name: "Email", type: "varchar" })
  email: string;

  @Column({ name: "Lozinka", type: "varchar" })
  lozinka: string;

  @Column({ name: "Grad", type: "varchar" })
  grad: string;

  @Column({ name: "DatumRodjenja", type: "date" })
  datumrodjenja: Date;

  @Column({ name: "Kreirano", type: "datetime" })
  kreirano: Date;

  @ManyToMany(() => Dogadjaji, x => x.korisnici)
   @JoinTable()
   dogadjaji: Dogadjaji[];

 @OneToMany(() => Dogadjaji, d => d.organizator)
  organizovaniDogadjaji: Dogadjaji[];



}