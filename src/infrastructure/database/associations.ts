import { PurchaseOrder } from './models/PurchaseOrderModel';
import { ShipMethod } from './models/ShipMethodModel';
import { Person } from './models/PersonModel';
import { Vendor } from './models/VendorModel';

export function initializeAssociations(): void {
  // Define associations between ShipMethod and PurchaseOrder
  ShipMethod.hasMany(PurchaseOrder, {
    foreignKey: 'shipMethodId',
    as: 'purchaseOrders',
    sourceKey: 'shipMethodId'
  });

  PurchaseOrder.belongsTo(ShipMethod, {
    foreignKey: 'shipMethodId',
    as: 'shipMethod',
    targetKey: 'shipMethodId'
  });

  // Define associations between Person and PurchaseOrder
  Person.hasMany(PurchaseOrder, {
    foreignKey: 'employeeId',
    as: 'purchaseOrders',
    sourceKey: 'businessEntityId'
  });

  PurchaseOrder.belongsTo(Person, {
    foreignKey: 'employeeId',
    as: 'employee',
    targetKey: 'businessEntityId'
  });

  // Define associations between Vendor and PurchaseOrder
  Vendor.hasMany(PurchaseOrder, {
    foreignKey: 'vendorId',
    as: 'purchaseOrders',
    sourceKey: 'businessEntityId'
  });

  PurchaseOrder.belongsTo(Vendor, {
    foreignKey: 'vendorId',
    as: 'vendor',
    targetKey: 'businessEntityId'
  });
} 