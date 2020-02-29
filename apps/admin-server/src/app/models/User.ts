import { Model, Table, Column, CreatedAt, UpdatedAt, Is } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { generateSalt, encryptPassword } from '../utils/crypto';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User>{
  /**
   * Name
   */
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  name: string;

  /**
   * Username
   */
  @Is('unique', async (val: string) => {
    const cnt = await User.count({
      where: {
        username: val,
      },
    });
    if (cnt > 0) {
      throw new Error(`Username "${val}" is taken.`);
    }
  })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  username: string;

  /**
   * Salt (for password)
   */
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  salt: string;

  /**
   * Password
   */
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    set(this: User, val: string) {
      const salt = generateSalt();
      const password = encryptPassword(val, salt);
      this.setDataValue('salt', salt);
      this.setDataValue('password', password);
    },
  })
  password: string;

  /**
   * Checks the provided password against the one in the
   * database.
   *
   * @param password
   */
  checkPassword(password: string) {
    return this.password === encryptPassword(password, this.salt);
  }

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