import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @CreateDateColumn()
    commentedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}