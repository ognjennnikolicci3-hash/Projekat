import { Dogadjaji } from "src/dogadjaj/dogadjaj.entity";
import { Korisnik } from "src/korisnik/korisnik.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("ucesnicidogadjaja")
export class Ucesnicidogadjaja
{
    @PrimaryColumn({name: "DogadjajId",type:"int"})
    dogadjajId:number;

    @PrimaryColumn({name: "korisnikId",type:"int"})
    korisnikId:number;

    @PrimaryColumn({name: "SportId",type:"int" })
    sportId:number;

    @Column({name:"Pridruzen",type:"datetime"})
    pridruzen:Date;


}