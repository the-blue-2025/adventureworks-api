import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, QueryOptions } from 'sequelize';
import sequelize from '../config';
import { PurchaseOrder, PurchaseOrderInstance } from './PurchaseOrderModel';

export interface PurchaseOrderDetailInstance extends Model<
  InferAttributes<PurchaseOrderDetailInstance>,
  InferCreationAttributes<PurchaseOrderDetailInstance>
> {
  purchaseOrderDetailId: CreationOptional<number>;
  purchaseOrderId: ForeignKey<number>;
  dueDate: Date;
  orderQty: number;
  productId: number;
  unitPrice: number;
  lineTotal?: number;
  receivedQty: number;
  rejectedQty: number;
  stockedQty?: number;
  modifiedDate: Date;
  purchaseOrder?: PurchaseOrderInstance;
}

export const PurchaseOrderDetail = sequelize.define<PurchaseOrderDetailInstance>(
  'PurchaseOrderDetail',
  {
    purchaseOrderDetailId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'PurchaseOrderDetailID',
      autoIncrement: true,
      allowNull: false
    },
    purchaseOrderId: {
      type: DataTypes.INTEGER,
      field: 'PurchaseOrderID',
      allowNull: false,
      references: {
        model: 'PurchaseOrder',
        key: 'PurchaseOrderID'
      }
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      field: 'DueDate',
      allowNull: false
    },
    orderQty: {
      type: DataTypes.SMALLINT,
      field: 'OrderQty',
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      field: 'ProductID',
      allowNull: false
    },
    unitPrice: {
      type: DataTypes.DECIMAL(19, 4),
      field: 'UnitPrice',
      allowNull: false
    },
    receivedQty: {
      type: DataTypes.DECIMAL(8, 2),
      field: 'ReceivedQty',
      allowNull: false,
      defaultValue: 0
    },
    rejectedQty: {
      type: DataTypes.DECIMAL(8, 2),
      field: 'RejectedQty',
      allowNull: false,
      defaultValue: 0
    },
    modifiedDate: {
      type: DataTypes.DATEONLY,
      field: 'ModifiedDate',
      allowNull: false
    }
  },
  {
    tableName: 'PurchaseOrderDetail',
    schema: 'Purchasing',
    timestamps: false,
    modelName: 'PurchaseOrderDetail'
  }
); 