export const generateAffiliationHistoryPDF = (data: any[]) => {
  const content = `
AFFILIATION HISTORY REPORT
Generated: ${new Date().toLocaleDateString()}

${data.map((item, index) => `
Product #${index + 1}
Product Name: ${item.productName}
Product Price: $${item.productPrice.toFixed(2)}
Affiliator: ${item.affiliator}
Purchaser: ${item.purchaser}
Commission: ${item.commission}%
Commission Amount: $${item.commissionAmount.toFixed(2)}
${'='.repeat(50)}
`).join('\n')}

Total Commission: $${data.reduce((sum, item) => sum + item.commissionAmount, 0).toFixed(2)}
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `affiliation-history-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generatePayoutHistoryPDF = (data: any[]) => {
  const content = `
PAYOUT HISTORY REPORT
Generated: ${new Date().toLocaleDateString()}

${data.map((item, index) => `
Payout #${index + 1}
Date: ${item.date}
Amount: $${item.amount}
Payment Method: ${item.paymentMethod}
Status: ${item.status}
${'='.repeat(50)}
`).join('\n')}

Total Payouts: $${data.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payout-history-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateOrderDetailsPDF = (order: any) => {
  const content = `
ORDER DETAILS REPORT
Generated: ${new Date().toLocaleDateString()}

ORDER INFORMATION
${'='.repeat(50)}
Order Number: ${order.orderNumber}
Client Name: ${order.clientName}
Shipping Address: ${order.shippingAddress}
Order Date: ${order.orderDate}

ITEMS
${'='.repeat(50)}
${order.items.map((item: any, index: number) => `
Item #${index + 1}
Name: ${item.name}
Color: ${item.color}
Size: ${item.size}
Price: $${item.price.toFixed(2)}
Quantity: ${item.quantity}
`).join('\n')}

ORDER SUMMARY
${'='.repeat(50)}
Subtotal: $${order.subtotal.toFixed(2)}
Shipping: $${order.shipping.toFixed(2)}
Discount: -$${order.discount.toFixed(2)}
Fees: $${order.fees.toFixed(2)}
Total: $${order.total.toFixed(2)}

PAYMENT INFORMATION
${'='.repeat(50)}
Payment Method: ${order.paymentMethod}

DELIVERY INFORMATION
${'='.repeat(50)}
Estimated Delivery: ${order.estimatedDelivery}

TRACKING DETAILS
${'='.repeat(50)}
Tracking Number: ${order.trackingNumber}
Status: ${order.status}
Last Updated: ${order.lastUpdated}
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `order-${order.orderNumber}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateBookingDetailsPDF = (booking: any) => {
  const content = `
BOOKING DETAILS REPORT
Generated: ${new Date().toLocaleDateString()}

BOOKING INFORMATION
${'='.repeat(50)}
Booking ID: ${booking.bookingId}
Client Name: ${booking.clientName}
Booking Date & Time: ${booking.bookingDate}, ${booking.bookingTime}
Service Duration: ${booking.serviceDuration}
Check-out: ${booking.checkOut}
Guests Allowed: ${booking.guestsAllowed}

SERVICES BOOKED
${'='.repeat(50)}
${booking.servicesBooked.map((service: any, index: number) => `
Service #${index + 1}: ${service.description}
`).join('')}

SERVICE LOCATION
${'='.repeat(50)}
Location Name: ${booking.locationName}
Address: ${booking.locationAddress}
Contact: ${booking.contact}

INSTRUCTIONS
${'='.repeat(50)}
${booking.instructions}

BOOKING SUMMARY
${'='.repeat(50)}
Service Fee: $${booking.serviceFee.toFixed(2)}
Booking Fee: $${booking.bookingFee.toFixed(2)}
Cancellation Fee: $${booking.cancellationFee.toFixed(2)}
Total: $${booking.total.toFixed(2)}

PAYMENT INFORMATION
${'='.repeat(50)}
Payment Method: ${booking.paymentMethod}

STATUS
${'='.repeat(50)}
Status: ${booking.status}
Status Date: ${booking.statusDate}

CANCELLATION POLICY
${'='.repeat(50)}
${booking.cancellationPolicy}
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `booking-${booking.bookingId}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateBookingQRCodeJPG = async (svgElement: SVGElement, bookingId: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = 300;
  canvas.height = 300;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    canvas.toBlob((blob) => {
      if (blob) {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `booking-qr-${bookingId}-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }
    }, 'image/jpeg', 0.95);
  };

  img.src = url;
};

export const generateReturnedOrderPDF = (returnOrder: any, orderData: any) => {
  const content = `
RETURNED ORDER DETAIL
Generated: ${new Date().toLocaleDateString()}

ORDER INFORMATION
${'='.repeat(50)}
Order Number: ${returnOrder.orderNumber}
Client Information: ${orderData.clientName}
Shipping Address: ${orderData.shippingAddress}
Order Date: ${orderData.orderDate}

ITEMS
${'='.repeat(50)}
${returnOrder.items.map((item: any, index: number) => `
Item #${index + 1}
Name: ${item.name}
Color: Brown
Size: ${item.size}
Price: $${item.price.toFixed(2)}
Quantity: ${item.quantity}
`).join('\n')}

ORDER SUMMARY
${'='.repeat(50)}
Subtotal: $${orderData.subtotal.toFixed(2)}
Shipping: $${orderData.shipping.toFixed(2)}
Discount / Promo Code: -$${Math.abs(orderData.discount).toFixed(2)}
Fees: $${orderData.fees.toFixed(2)}
Total: $${orderData.total.toFixed(2)}

RETURNED INFORMATION
${'='.repeat(50)}
Return Reason: Damaged
Other Reason: ${orderData.otherReason}

PAYMENT INFORMATION
${'='.repeat(50)}
Payment Method: ${orderData.paymentMethod}

DELIVERY DATE
${'='.repeat(50)}
Delivery Date: ${orderData.deliveryDate}

TRACKING DETAILS
${'='.repeat(50)}
Tracking Number: ${orderData.trackingNumber}
Status: Delivered
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `returned-order-${returnOrder.orderNumber}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateAffiliateEarningsPDF = (earning: any) => {
  const content = `
AFFILIATE EARNINGS DETAIL
Generated: ${new Date().toLocaleDateString()}

PURCHASE DETAILS
${'='.repeat(50)}
Purchase Date: ${earning.purchaseDate}
Contract ID: ${earning.contractId}

${earning.type === 'service' ? 'SERVICE' : 'PRODUCT'} INFORMATION
${'='.repeat(50)}
Name: ${earning.productName}
Type: ${earning.type}
Price: $${earning.price.toFixed(2)}
Affiliation Owner: ${earning.affiliationOwner}

COMMISSION DETAILS
${'='.repeat(50)}
Commission Percentage: ${earning.commissionRate}%
Commission Amount: $${earning.commissionEarned.toFixed(2)}

SUMMARY
${'='.repeat(50)}
Total Earned from this Affiliation: $${earning.commissionEarned.toFixed(2)}
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `affiliate-earning-${earning.contractId}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateCashbackHistoryPDF = (cashback: any) => {
  const content = `
CASHBACK HISTORY DETAIL
Generated: ${new Date().toLocaleDateString()}

PURCHASE DETAILS
${'='.repeat(50)}
Purchase Date: ${cashback.purchaseDate}
Contract ID: ${cashback.contractId}
Cashback Date: ${cashback.date}
Recipient: ${cashback.recipient}

${cashback.type === 'service' ? 'SERVICE' : 'PRODUCT'} INFORMATION
${'='.repeat(50)}
Name: ${cashback.productName}
Type: ${cashback.type}
Original Price: $${cashback.price.toFixed(2)}
Shop: ${cashback.shop}

CASHBACK DETAILS
${'='.repeat(50)}
Cashback Percentage: ${cashback.commissionPercentage}%
Cashback Amount: $${cashback.commissionAmount.toFixed(2)}

SUMMARY
${'='.repeat(50)}
Total Cashback Received: $${cashback.commissionAmount.toFixed(2)}
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cashback-history-${cashback.contractId}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
