import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({ type: 'int', nullable: true })
    appointment_id: number | null;

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