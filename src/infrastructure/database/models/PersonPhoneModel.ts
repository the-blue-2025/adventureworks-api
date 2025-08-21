import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelize from '../config';

export interface PersonPhoneInstance extends Model<
  InferAttributes<PersonPhoneInstance>,
  InferCreationAttributes<PersonPhoneInstance>
> {
  businessEntityId: number;
  phoneNumber: string;
  phoneNumberTypeId: number;
  modifiedDate: Date;
}

export const PersonPhone = sequelize.define<PersonPhoneInstance>(
  'PersonPhone',
  {
    businessEntityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'BusinessEntityID',
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      field: 'PhoneNumber',
      allowNull: false
    },
    phoneNumberTypeId: {
      type: DataTypes.INTEGER,
      field: 'PhoneNumberTypeID',
      allowNull: false
    },
    modifiedDate: {
      type: DataTypes.DATE,
      field: 'ModifiedDate',
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'PersonPhone',
    schema: 'Person',
    timestamps: false
  }
);
