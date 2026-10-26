import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    appointment_id: number;

    @Column()
    user_id: number;

    @Column()
    service_id: number;

    @Column()
    barber_id: number;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @CreateDateColumn({ default: Date.now()})
    commentedAt: Date

    @UpdateDateColumn({ default: Date.now()})
    updatedAt: Date
}