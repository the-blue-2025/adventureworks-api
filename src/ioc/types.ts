export const TYPES = {
  // Repositories
  IPurchaseOrderRepository: Symbol.for('IPurchaseOrderRepository'),
  IShipMethodRepository: Symbol.for('IShipMethodRepository'),
  IPersonRepository: Symbol.for('IPersonRepository'),
  IVendorRepository: Symbol.for('IVendorRepository'),

  // Services
  PurchaseOrderService: Symbol.for('PurchaseOrderService'),
  ShipMethodService: Symbol.for('ShipMethodService'),
  PersonService: Symbol.for('PersonService'),
  VendorService: Symbol.for('VendorService'),
  PurchaseOrderDetailService: Symbol.for('PurchaseOrderDetailService')
}; 