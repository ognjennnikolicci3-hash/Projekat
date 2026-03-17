import { Dogadjaji } from "src/dogadjaj/dogadjaj.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("tereni")
export class Tereni
{
    @PrimaryGeneratedColumn({name:"TerenId",type:"int"})
    terenId:number;
    
    @Column({name:"Naziv",type:"varchar"})
    naziv:string;

    @Column({name:"Adresa",type:"varchar"})
    adresa:string;

    @Column({name:"Grad",type:"varchar"})
    grad:string;

    @Column({name:"Kontakt",type:"varchar"})
    kontakt:string;

    @Column({name:"Sirina",type:"float"})
    sirina:number;

    @Column({name:"Duzina",type:"float"})
    duzina:number;

    @OneToMany(() => Dogadjaji, d => d.teren)
  dogadjaji: Dogadjaji[];

}