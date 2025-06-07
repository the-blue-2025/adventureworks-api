import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';
import { ShipMethod } from './ShipMethodModel';

// Database schema interface (includes all database fields)
interface PurchaseOrderSchema {
  purchaseOrderId: number;
  status: number;
  employeeId: number;
  vendorId: number;
  shipMethodId: number;
  orderDate: Date;
  shipDate: Date | null;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  modifiedDate: Date;
}

// Domain interface (what we expose to the application)
interface PurchaseOrderAttributes extends Omit<PurchaseOrderSchema, 'shipMethodId'> {
  shipMethod?: ShipMethod;
}

export class PurchaseOrder extends Model<PurchaseOrderSchema> implements PurchaseOrderAttributes {
  public purchaseOrderId!: number;
  public status!: number;
  public employeeId!: number;
  public vendorId!: number;
  public orderDate!: Date;
  public shipDate!: Date | null;
  public subTotal!: number;
  public taxAmt!: number;
  public freight!: number;
  public totalDue!: number;
  public modifiedDate!: Date;
  public shipMethod?: ShipMethod;

  // This is needed for the database but not exposed in the interface
  public shipMethodId!: number;

  static initialize(sequelize: Sequelize): void {
    this.init({
      purchaseOrderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'PurchaseOrderID'
      },
      status: {
        type: DataTypes.TINYINT,
        field: 'Status'
      },
      employeeId: {
        type: DataTypes.INTEGER,
        field: 'EmployeeID'
      },
      vendorId: {
        type: DataTypes.INTEGER,
        field: 'VendorID'
      },
      shipMethodId: {
        type: DataTypes.INTEGER,
        field: 'ShipMethodID',
        references: {
          model: 'ShipMethod',
          key: 'ShipMethodID'
        }
      },
      orderDate: {
        type: DataTypes.DATE,
        field: 'OrderDate'
      },
      shipDate: {
        type: DataTypes.DATE,
        field: 'ShipDate'
      },
      subTotal: {
        type: DataTypes.DECIMAL(19, 4),
        field: 'SubTotal'
      },
      taxAmt: {
        type: DataTypes.DECIMAL(19, 4),
        field: 'TaxAmt'
      },
      freight: {
        type: DataTypes.DECIMAL(19, 4),
        field: 'Freight'
      },
      totalDue: {
        type: DataTypes.DECIMAL(19, 4),
        field: 'TotalDue'
      },
      modifiedDate: {
        type: DataTypes.DATE,
        field: 'ModifiedDate'
      }
    }, {
      sequelize,
      tableName: 'PurchaseOrderHeader',
      schema: 'Purchasing',
      timestamps: false
    });
  }

  static associate(models: { [key: string]: ModelStatic<Model> }): void {
    // Define association with ShipMethod
    this.belongsTo(models.ShipMethod as ModelStatic<ShipMethod>, {
      foreignKey: 'shipMethodId',
      as: 'shipMethod',
      targetKey: 'shipMethodId'
    });
  }
} 