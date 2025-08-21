import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config';

export interface EmailAddressInstance extends Model<
  InferAttributes<EmailAddressInstance>,
  InferCreationAttributes<EmailAddressInstance>
> {
  businessEntityId: number;
  emailAddressId: CreationOptional<number>;
  emailAddress: string;
  rowguid: string;
  modifiedDate: Date;
}

export const EmailAddress = sequelize.define<EmailAddressInstance>(
  'EmailAddress',
  {
    businessEntityId: {
      type: DataTypes.INTEGER,
      field: 'BusinessEntityID',
      allowNull: false
    },
    emailAddressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'EmailAddressID',
      autoIncrement: true
    },
    emailAddress: {
      type: DataTypes.STRING(50),
      field: 'EmailAddress',
      allowNull: false
    },
    rowguid: {
      type: DataTypes.UUID,
      field: 'rowguid',
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    modifiedDate: {
      type: DataTypes.DATE,
      field: 'ModifiedDate',
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'EmailAddress',
    schema: 'Person',
    timestamps: false
  }
);
