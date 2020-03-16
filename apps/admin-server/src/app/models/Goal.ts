import { Model, Table, Column, CreatedAt, UpdatedAt, ForeignKey, BelongsToMany, BelongsTo, HasOne } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Experiment } from './Experiment';

/**
 * Association table for Goals <-> Experiments
 */
@Table({ tableName: 'experiment_goals', timestamps: false })
export class ExperimentGoal extends Model<ExperimentGoal> {
  /**
   * Experiment association
   */
  @ForeignKey(() => Experiment)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'experiment_id',
  })
  experimentID: number;

  /**
   * Goal association
   */
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  @ForeignKey(() => Goal)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'goal_id',
  })
  goalID: number;

  /**
   * Is primary?
   */
  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_primary',
  })
  isPrimary: boolean;
}

/**
 * Goals table
 */
@Table({ tableName: 'goals', timestamps: true })
export class Goal extends Model<Goal>{
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
  @BelongsToMany(() => Experiment, () => ExperimentGoal)
  experiments: Experiment[];

  ExperimentGoal: ExperimentGoal | undefined;

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