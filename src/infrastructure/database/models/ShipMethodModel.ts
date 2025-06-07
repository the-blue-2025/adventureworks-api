import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config';

export interface ShipMethodInstance extends Model<
  InferAttributes<ShipMethodInstance>,
  InferCreationAttributes<ShipMethodInstance>
> {
  shipMethodId: CreationOptional<number>;
  name: string;
  shipBase: number;
  shipRate: number;
  modifiedDate: Date;
}

export const ShipMethod = sequelize.define<ShipMethodInstance>(
  'ShipMethod',
  {
    shipMethodId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'ShipMethodID',
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      field: 'Name'
    },
    shipBase: {
      type: DataTypes.DECIMAL(19, 4),
      field: 'ShipBase'
    },
    shipRate: {
      type: DataTypes.DECIMAL(19, 4),
      field: 'ShipRate'
    },
    modifiedDate: {
      type: DataTypes.DATE,
      field: 'ModifiedDate'
    }
  },
  {
    tableName: 'ShipMethod',
    schema: 'Purchasing',
    timestamps: false
  }
); 