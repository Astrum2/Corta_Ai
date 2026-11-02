import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    appointment_id: number;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column()
    message: string;
    
    @Column()
    status: string;

    @CreateDateColumn()
    scheduled_at: Date

    @CreateDateColumn()
    sent_at: Date

}