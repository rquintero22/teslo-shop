import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        default: '001'
    })
    type: string;

    @Column('text', {
        unique: true
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @Column({
        type: 'text',
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[];

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '');
        } else {
            this.slug = this.slug
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '');
        }
    }

    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');

    }

}
