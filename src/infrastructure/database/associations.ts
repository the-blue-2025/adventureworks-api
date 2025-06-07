import { PurchaseOrder } from './models/PurchaseOrderModel';
import { ShipMethod } from './models/ShipMethodModel';

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
} 