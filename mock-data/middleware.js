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
  
  // Handle single purchase order with details - bypass json-server entirely
  if (req.method === 'GET' && req.url.match(/^\/purchase-orders\/\d+$/)) {
    const purchaseOrderId = parseInt(req.url.match(/\/purchase-orders\/(\d+)/)[1]);
    console.log('Directly handling purchase order with details for ID:', purchaseOrderId);
    
    // Disable caching
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    
    const db = require('./db.json');
    
    // Find the purchase order
    const purchaseOrder = db['purchase-orders'].find(po => po.purchaseOrderId === purchaseOrderId);
    if (!purchaseOrder) {
      res.status(404).json({ error: 'Purchase order not found' });
      return;
    }
    
    // Find the vendor
    const vendor = db.vendors.find(v => v.businessEntityId === purchaseOrder.vendorId);
    
    // Find the details
    const details = db['purchase-order-details'].filter(detail => detail.purchaseOrderId === purchaseOrderId);
    console.log('Found details count:', details.length);
    
    // Create the response
    const response = {
      ...purchaseOrder,
      vendor: vendor ? {
        businessEntityId: vendor.businessEntityId,
        name: vendor.name,
        accountNumber: vendor.accountNumber
      } : undefined,
      details: details
    };
    
    console.log('Sending response with', details.length, 'details');
    res.json(response);
    return;
  }
  
  // Handle list of purchase orders to include vendor information
  if (req.method === 'GET' && req.url === '/purchase-orders') {
    console.log('Middleware triggered for purchase orders list request:', req.url);
    
    // Disable caching for purchase order requests to ensure fresh data
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    
    const db = require('./db.json');
    
    // Get the original response from json-server
    const originalJson = res.json;
    
    res.json = function(data) {
      console.log('Processing purchase orders list data:', data ? 'has data' : 'no data');
      
      if (Array.isArray(data)) {
        // Handle list of purchase orders
        console.log('Processing array of purchase orders');
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
      }
      
      return originalJson.call(this, data);
    };
  }
  
  next();
}; 