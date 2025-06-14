import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config';

export interface VendorInstance extends Model<
  InferAttributes<VendorInstance>,
  InferCreationAttributes<VendorInstance>
> {
  businessEntityId: CreationOptional<number>;
  accountNumber: string;
  name: string;
  creditRating: number;
  preferredVendorStatus: boolean;
  activeFlag: boolean;
  purchasingWebServiceURL: string | null;

}

export const CreateVendor = sequelize.define<VendorInstance>(
  'Vendor',
  {
    businessEntityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'BusinessEntityID',
      autoIncrement: true
    },
    accountNumber: {
      type: DataTypes.STRING(15),
      field: 'AccountNumber',
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      field: 'Name',
      allowNull: false
    },
    creditRating: {
      type: DataTypes.TINYINT,
      field: 'CreditRating',
      allowNull: false
    },
    preferredVendorStatus: {
      type: DataTypes.BOOLEAN,
      field: 'PreferredVendorStatus',
      allowNull: false,
      defaultValue: true
    },
    activeFlag: {
      type: DataTypes.BOOLEAN,
      field: 'ActiveFlag',
      allowNull: false,
      defaultValue: true
    },
    purchasingWebServiceURL: {
      type: DataTypes.STRING(1024),
      field: 'PurchasingWebServiceURL',
      allowNull: true
    },
  },
  {
    tableName: 'Vendor',
    schema: 'Purchasing',
    timestamps: false
  }
); 