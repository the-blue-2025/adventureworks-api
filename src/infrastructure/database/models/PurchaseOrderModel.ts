import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config';
import { ShipMethod, ShipMethodInstance } from './ShipMethodModel';
import { PurchaseOrderDetail, PurchaseOrderDetailInstance } from './PurchaseOrderDetailModel';
import { Person, PersonInstance } from './PersonModel';
import { Vendor, VendorInstance } from './VendorModel';

export interface PurchaseOrderInstance extends Model<
  InferAttributes<PurchaseOrderInstance>,
  InferCreationAttributes<PurchaseOrderInstance>
> {
  purchaseOrderId: CreationOptional<number>;
  status: number;
  employeeId: number;
  vendorId: number;
  shipMethodId: ForeignKey<number>;
  orderDate: Date;
  shipDate: Date | null;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  modifiedDate: Date;
  shipMethod?: ShipMethodInstance;
  purchaseOrderDetails?: PurchaseOrderDetailInstance[];
  employee?: PersonInstance;
  vendor?: VendorInstance;
}

const PurchaseOrder = sequelize.define<PurchaseOrderInstance>(
  'PurchaseOrder',
  {
    purchaseOrderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'PurchaseOrderID',
      autoIncrement: true
    },
    status: {
      type: DataTypes.TINYINT,
      field: 'Status'
    },
    employeeId: {
      type: DataTypes.INTEGER,
      field: 'EmployeeID',
      references: {
        model: 'Person',
        key: 'BusinessEntityID'
      }
    },
    vendorId: {
      type: DataTypes.INTEGER,
      field: 'VendorID',
      references: {
        model: 'Vendor',
        key: 'BusinessEntityID'
      }
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
  },
  {
    tableName: 'PurchaseOrderHeader',
    schema: 'Purchasing',
    timestamps: false
  }
);

// Define relationships
PurchaseOrder.hasMany(PurchaseOrderDetail, {
  foreignKey: 'purchaseOrderId',
  as: 'purchaseOrderDetails',
  sourceKey: 'purchaseOrderId'
});

PurchaseOrderDetail.belongsTo(PurchaseOrder, {
  foreignKey: 'purchaseOrderId',
  as: 'purchaseOrder',
  targetKey: 'purchaseOrderId'
});

// Define relationship with ShipMethod
PurchaseOrder.belongsTo(ShipMethod, {
  foreignKey: 'shipMethodId',
  as: 'shipMethod',
  targetKey: 'shipMethodId'
});

// Define relationship with Person (Employee)
PurchaseOrder.belongsTo(Person, {
  foreignKey: 'employeeId',
  as: 'employee',
  targetKey: 'businessEntityId'
});

// Define relationship with Vendor
PurchaseOrder.belongsTo(Vendor, {
  foreignKey: 'vendorId',
  as: 'vendor',
  targetKey: 'businessEntityId'
});

export { PurchaseOrder }; 