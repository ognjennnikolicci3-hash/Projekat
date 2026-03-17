import "reflect-metadata";

import { Dogadjaji } from "src/dogadjaj/dogadjaj.entity";
import { Korisnik } from "src/korisnik/korisnik.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("sportovi")
export class Sportovi
{
    @PrimaryGeneratedColumn({name: "SportId",type: "int"})
    sportId: number;
    
    @Column({name:"Naziv",type:"varchar"})
    naziv:string;

    @OneToMany(() => Dogadjaji, d => d.sport)
  dogadjaji: Dogadjaji[];

}