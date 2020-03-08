import { Model, Table, Column, CreatedAt, UpdatedAt, IsIn, BelongsTo, BelongsToMany, ForeignKey, HasMany } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Project } from './Project';
import { Variation } from './Variation';
import { Goal, ExperimentGoal } from './Goal';

export enum ExperimentType {
  A_B = 'ab',
  Multivariate = 'multivariate',
}

export enum ExperimentStatus {
  NotStarted = 'not_started',
  Running = 'running',
  Paused = 'paused',
}

@Table({ tableName: 'experiments', timestamps: true })
export class Experiment extends Model<Experiment>{
  /**
   * Name
   */
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  name: string;

  /**
   * Type
   */
  @IsIn({
    msg: 'Invalid experiment type provided',
    args: [[
      ExperimentType.A_B,
      ExperimentType.Multivariate,
    ]],
  })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  type: ExperimentType;

  /**
   * Status
   */
  @IsIn({
    msg: 'Invalid experiment status provided',
    args: [[
      ExperimentStatus.NotStarted,
      ExperimentStatus.Running,
      ExperimentStatus.Paused,
    ]],
  })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ExperimentStatus.NotStarted,
  })
  status: ExperimentStatus;

  /**
   * Project association
   */
  @ForeignKey(() => Project)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'project_id',
  })
  projectID?: number | null;
 
  @BelongsTo(() => Project)
  project?: Project | null;

  /**
   * Variations association
   */
  @HasMany(() => Variation)
  variations: Variation[];

  /**
   * Goals association
   */
  @BelongsToMany(() => Goal, () => ExperimentGoal)
  goals: Goal[];

  /**
   * Date archived
   */
  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    field: 'archived_at',
  })
  archived_at: Date;

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