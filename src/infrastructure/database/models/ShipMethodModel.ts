import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';
import { PurchaseOrder } from './PurchaseOrderModel';

interface ShipMethodAttributes {
  shipMethodId: number;
  name: string;
  shipBase: number;
  shipRate: number;
  modifiedDate: Date;
}

export class ShipMethod extends Model<ShipMethodAttributes> implements ShipMethodAttributes {
  public shipMethodId!: number;
  public name!: string;
  public shipBase!: number;
  public shipRate!: number;
  public modifiedDate!: Date;

  static initialize(sequelize: Sequelize): void {
    this.init({
      shipMethodId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'ShipMethodID'
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
    }, {
      sequelize,
      tableName: 'ShipMethod',
      schema: 'Purchasing',
      timestamps: false
    });
  }

  static associate(models: { [key: string]: ModelStatic<Model> }): void {
    // Define association with PurchaseOrder
    this.hasMany(models.PurchaseOrder as ModelStatic<PurchaseOrder>, {
      foreignKey: 'shipMethodId',
      as: 'purchaseOrders'
    });
  }
} 