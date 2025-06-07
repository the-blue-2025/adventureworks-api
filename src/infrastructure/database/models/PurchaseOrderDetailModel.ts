import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
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
  lineTotal: number;
  receivedQty: number;
  rejectedQty: number;
  stockedQty: number;
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
      autoIncrement: true
    },
    purchaseOrderId: {
      type: DataTypes.INTEGER,
      field: 'PurchaseOrderID',
      references: {
        model: 'PurchaseOrder',
        key: 'PurchaseOrderID'
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      field: 'DueDate'
    },
    orderQty: {
      type: DataTypes.SMALLINT,
      field: 'OrderQty'
    },
    productId: {
      type: DataTypes.INTEGER,
      field: 'ProductID'
    },
    unitPrice: {
      type: DataTypes.DECIMAL(19, 4),
      field: 'UnitPrice'
    },
    lineTotal: {
      type: DataTypes.DECIMAL(19, 4),
      field: 'LineTotal'
    },
    receivedQty: {
      type: DataTypes.DECIMAL(8, 2),
      field: 'ReceivedQty'
    },
    rejectedQty: {
      type: DataTypes.DECIMAL(8, 2),
      field: 'RejectedQty'
    },
    stockedQty: {
      type: DataTypes.DECIMAL(9, 2),
      field: 'StockedQty'
    },
    modifiedDate: {
      type: DataTypes.DATE,
      field: 'ModifiedDate'
    }
  },
  {
    tableName: 'PurchaseOrderDetail',
    schema: 'Purchasing',
    timestamps: false
  }
); 