module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Handle nested route for purchase order details
  if (req.method === 'GET' && req.url.match(/^\/purchase-orders\/\d+\/details$/)) {
    const purchaseOrderId = parseInt(req.url.match(/\/purchase-orders\/(\d+)\/details/)[1]);
    
    // Get the purchase order details from the database
    const db = require('./db.json');
    const details = db['purchase-order-details'].filter(detail => detail.purchaseOrderId === purchaseOrderId);
    
    res.json(details);
    return;
  }
  
  // Handle purchase orders to include vendor information
  if (req.method === 'GET' && (req.url === '/purchase-orders' || req.url.match(/^\/purchase-orders\/\d+$/))) {
    const db = require('./db.json');
    
    // Get the original response from json-server
    const originalJson = res.json;
    res.json = function(data) {
      if (Array.isArray(data)) {
        // Handle list of purchase orders
        data = data.map(order => {
          const vendor = db.vendors.find(v => v.businessEntityId === order.vendorId);
          return {
            ...order,
            vendor: vendor ? {
              businessEntityId: vendor.businessEntityId,
              name: vendor.name,
              accountNumber: vendor.accountNumber
            } : undefined
          };
        });
      } else if (data && data.purchaseOrderId) {
        // Handle single purchase order
        const vendor = db.vendors.find(v => v.businessEntityId === data.vendorId);
        data = {
          ...data,
          vendor: vendor ? {
            businessEntityId: vendor.businessEntityId,
            name: vendor.name,
            accountNumber: vendor.accountNumber
          } : undefined
        };
      }
      
      return originalJson.call(this, data);
    };
  }
  
  next();
}; 