import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config';

export interface AddressInstance extends Model<
  InferAttributes<AddressInstance>,
  InferCreationAttributes<AddressInstance>
> {
  addressId: CreationOptional<number>;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateProvinceId: number;
  postalCode: string;
  spatialLocation: string | null;
  rowguid: string;
  modifiedDate: Date;
}

export const Address = sequelize.define<AddressInstance>(
  'Address',
  {
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'AddressID',
      autoIncrement: true
    },
    addressLine1: {
      type: DataTypes.STRING(60),
      field: 'AddressLine1',
      allowNull: false
    },
    addressLine2: {
      type: DataTypes.STRING(60),
      field: 'AddressLine2',
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(30),
      field: 'City',
      allowNull: false
    },
    stateProvinceId: {
      type: DataTypes.INTEGER,
      field: 'StateProvinceID',
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING(15),
      field: 'PostalCode',
      allowNull: false
    },
    spatialLocation: {
      type: DataTypes.GEOMETRY,
      field: 'SpatialLocation',
      allowNull: true
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
    tableName: 'Address',
    schema: 'Person',
    timestamps: false
  }
);
