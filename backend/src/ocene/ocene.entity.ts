import { Dogadjaji } from "src/dogadjaj/dogadjaj.entity";
import { Korisnik } from "src/korisnik/korisnik.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("ocene")
export class Ocene {
    @PrimaryGeneratedColumn({ name: "OcenaId", type: "int" })
    ocenaId: number;

    @Column({ name: "OcenjivacId", type: "int" })
    ocenjivacId: number;

    @Column({ name: "DogadjajId", type: "int" })
    dogadjajId: number;

    @Column({ name: "Ocena", type: "int" })
    ocena: number;

    @Column({ name: "Komentar", type: "varchar" })
    komentar: string;

    @Column({ name: "Kreirano", type: "datetime" })
    kreirano: Date;

    // @OneToMany(()=>Korisnik,x=>x.ocene)
    // @JoinTable()
    // korisnik:Korisnik;


    @ManyToOne(() => Dogadjaji, x => x.ocene)
    @JoinColumn({ name: "DogadjajId" }) 
    dogadjaj: Dogadjaji;
}