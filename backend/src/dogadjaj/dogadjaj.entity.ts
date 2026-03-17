import { Korisnik } from "src/korisnik/korisnik.entity";
import { Ocene } from "src/ocene/ocene.entity";
import { Sportovi } from "src/sport/sport.entity";
import { Tereni } from "src/tereni/tereni.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity("dogadjaji")
export class Dogadjaji {
  @PrimaryGeneratedColumn({ name: "DogadjajId", type: "int" })
  dogadjajId: number;

   
   @Column({ name: "SportID", type: "int" })
   sportId: number

   @Column({ name: "TerenId", type: "int" })
   terenId: number

   @Column({ name: "OrganizatorId", type: "int" })
   organizatorId: number

  @Column({ name: "DatumVreme", type: "datetime" })
  datumVreme: Date

  @Column({ name: "MaxIgraca", type: "int" })
  maxIgraca: number

  @Column({ name: "Opis", type: "varchar" })
  opis: string

  @Column({ name: "Kreirano", type: "datetime" })
  kreirano: Date

  
  @ManyToOne(() => Sportovi, s => s.dogadjaji, { eager: false })
  @JoinColumn({ name: "SportID" })
  sport: Sportovi;

  
  @ManyToOne(() => Tereni, t => t.dogadjaji, { eager: false })
  @JoinColumn({ name: "TerenId" })
  teren: Tereni;


  @ManyToOne(() => Korisnik, k => k.organizovaniDogadjaji, { eager: false })
  @JoinColumn({ name: "OrganizatorId" })
  organizator: Korisnik;

  @OneToMany(() => Ocene, x => x.dogadjaj)
  ocene: Ocene[];

 
  @ManyToMany(() => Korisnik, x => x.dogadjaji)
  korisnici: Korisnik[];
}