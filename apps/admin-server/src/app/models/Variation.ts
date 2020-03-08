import { Model, Table, Column, CreatedAt, UpdatedAt, Max, Min, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Experiment } from './Experiment';

@Table({ tableName: 'variations', timestamps: true })
export class Variation extends Model<Variation>{
  /**
   * Name
   */
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  name: string;

  /**
   * Traffic allocation
   */
  @Min(0)
  @Max(1)
  @Column({
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'traffic_allocation',
  })
  trafficAllocation: number;

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
 
  @BelongsTo(() => Experiment)
  experiment: Experiment;

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