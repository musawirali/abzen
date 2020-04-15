import {
  Model, Table, Column, CreatedAt, UpdatedAt,
  Index,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'assignments', timestamps: true })
export class Assignment extends Model<Assignment>{
  /**
   * Session ID
   */
  @Index
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    field: 'session_id',
  })
  sessionID: string;

  /**
   * User ID
   * NOTE: This is not referencing a user account on A/B testing system.
   * It is a user identifer from the client apps.
   */
  @Index
  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    field: 'user_id',
  })
  userID: string;

  /**
   * Variation assignment for each experiment.
   */
  @Column({
    type: DataTypes.JSONB,
    allowNull: false,
  })
  experiments: {[key in string]: string};

  /**
   * Time stamps
   */
  @CreatedAt
  @Column({ allowNull: false, field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ allowNull: false, field: 'updated_at' })
  updatedAt: Date;
}