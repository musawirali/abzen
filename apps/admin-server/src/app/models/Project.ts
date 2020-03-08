import { Model, Table, Column, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Experiment } from './Experiment';

@Table({ tableName: 'projects', timestamps: true })
export class Project extends Model<Project>{
  /**
   * Name
   */
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  name: string;

  /**
   * Experiments association
   */
  @HasMany(() => Experiment)
  experiments: Experiment[];

  /**
   * Date archived
   */
  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    field: 'archived_at',
  })
  archivedAt: Date;

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