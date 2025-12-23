export const orderConfirmationTemplate = (order, customerName) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.productName}</strong><br>
        <span style="color: #6b7280; font-size: 14px;">Qty: ${
          item.quantity
        }</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        £${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  return {
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0284c7; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px 20px; }
            .order-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .total-row { font-weight: bold; font-size: 18px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✓ Order Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Hello ${customerName},</h2>
              <p>Thank you for your order! We've received your order and it's being processed.</p>
              
              <div class="order-details">
                <h3 style="margin-top: 0;">Order Details</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date(
                  order.createdAt
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}</p>
                
                <table class="items-table">
                  <thead>
                    <tr style="background-color: #f3f4f6;">
                      <th style="padding: 12px; text-align: left;">Item</th>
                      <th style="padding: 12px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <tr>
                      <td style="padding: 12px;"><strong>Subtotal</strong></td>
                      <td style="padding: 12px; text-align: right;">£${order.subtotal.toFixed(
                        2
                      )}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px;">Shipping</td>
                      <td style="padding: 12px; text-align: right;">
                        ${
                          order.shipping === 0
                            ? '<span style="color: #10b981;">FREE</span>'
                            : `£${order.shipping.toFixed(2)}`
                        }
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px;">Tax (20%)</td>
                      <td style="padding: 12px; text-align: right;">£${order.tax.toFixed(
                        2
                      )}</td>
                    </tr>
                    <tr class="total-row">
                      <td style="padding: 12px; border-top: 2px solid #e5e7eb;">Total</td>
                      <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb;">£${order.total.toFixed(
                        2
                      )}</td>
                    </tr>
                  </tbody>
                </table>
                
                <h4>Shipping Address</h4>
                <p>
                  ${order.shippingAddress.name}<br>
                  ${order.shippingAddress.street}<br>
                  ${order.shippingAddress.city}, ${
      order.shippingAddress.state || ""
    } ${order.shippingAddress.zipCode}<br>
                  ${order.shippingAddress.country}
                </p>
              </div>
              
              <center>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/orders/${order._id}" class="button">
                  Track Your Order
                </a>
              </center>
              
              <p>You can track your order status anytime by visiting your account.</p>
              <p>If you have any questions, please contact our support team.</p>
              
              <p>Best regards,<br>The MarketHub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Order Confirmation - ${order.orderNumber}

Hello ${customerName},

Thank you for your order! We've received your order and it's being processed.

Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}

Items:
${order.items
  .map(
    (item) =>
      `- ${item.productName} (Qty: ${item.quantity}) - £${(
        item.price * item.quantity
      ).toFixed(2)}`
  )
  .join("\n")}

Subtotal: £${order.subtotal.toFixed(2)}
Shipping: ${order.shipping === 0 ? "FREE" : `£${order.shipping.toFixed(2)}`}
Tax: £${order.tax.toFixed(2)}
Total: £${order.total.toFixed(2)}

Shipping Address:
${order.shippingAddress.name}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state || ""} ${
      order.shippingAddress.zipCode
    }
${order.shippingAddress.country}

Track your order: ${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/orders/${order._id}

Best regards,
The MarketHub Team
    `,
  };
};

export const orderStatusUpdateTemplate = (order, customerName, newStatus) => {
  const statusMessages = {
    processing: {
      title: "Order is Being Processed",
      message: "Great news! Your order is now being prepared for shipment.",
      icon: "📦",
    },
    shipped: {
      title: "Order Has Been Shipped",
      message: "Your order is on its way! You should receive it soon.",
      icon: "🚚",
    },
    delivered: {
      title: "Order Delivered",
      message: "Your order has been delivered! We hope you love your purchase.",
      icon: "✓",
    },
    cancelled: {
      title: "Order Cancelled",
      message:
        "Your order has been cancelled. If you did not request this, please contact us.",
      icon: "✗",
    },
  };

  const statusInfo = statusMessages[newStatus] || statusMessages.processing;

  return {
    subject: `${statusInfo.icon} ${statusInfo.title} - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0284c7; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px 20px; }
            .status-badge { display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; border-radius: 20px; font-weight: bold; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 40px;">${statusInfo.icon}</h1>
              <h2 style="margin: 10px 0 0 0;">${statusInfo.title}</h2>
            </div>
            <div class="content">
              <h2>Hello ${customerName},</h2>
              <p>${statusInfo.message}</p>
              
              <center>
                <div class="status-badge">
                  Status: ${newStatus.toUpperCase()}
                </div>
              </center>
              
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              
              ${
                newStatus === "delivered"
                  ? `
              <p style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <strong>Love your purchase?</strong><br>
                We'd love to hear your feedback! Leave a review to help other customers.
              </p>
              `
                  : ""
              }
              
              <center>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/orders/${order._id}" class="button">
                  View Order Details
                </a>
              </center>
              
              <p>Thank you for shopping with MarketHub!</p>
              
              <p>Best regards,<br>The MarketHub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${statusInfo.icon} ${statusInfo.title}

Hello ${customerName},

${statusInfo.message}

Order Number: ${order.orderNumber}
Status: ${newStatus.toUpperCase()}

${
  newStatus === "delivered"
    ? "Love your purchase? Leave a review to help other customers!"
    : ""
}

View order details: ${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/orders/${order._id}

Thank you for shopping with MarketHub!

Best regards,
The MarketHub Team
    `,
  };
};

export const welcomeEmailTemplate = (userName, userEmail) => {
  return {
    subject: "Welcome to MarketHub! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0284c7; color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px 20px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .features { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .feature { margin: 15px 0; padding-left: 30px; position: relative; }
            .feature:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 48px;">🎉</h1>
              <h1 style="margin: 10px 0;">Welcome to MarketHub!</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>We're thrilled to have you join our marketplace community!</p>
              
              <div class="features">
                <h3>Here's what you can do on MarketHub:</h3>
                <div class="feature">Browse thousands of products from trusted vendors</div>
                <div class="feature">Enjoy secure payments with Stripe</div>
                <div class="feature">Track your orders in real-time</div>
                <div class="feature">Leave reviews to help other shoppers</div>
                <div class="feature">Get exclusive deals and offers</div>
              </div>
              
              <center>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/products" class="button">
                  Start Shopping
                </a>
              </center>
              
              <p>Your account email: <strong>${userEmail}</strong></p>
              
              <p>If you have any questions, our support team is always here to help!</p>
              
              <p>Happy Shopping!<br>The MarketHub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to MarketHub! 🎉

Hello ${userName},

We're thrilled to have you join our marketplace community!

Here's what you can do on MarketHub:
✓ Browse thousands of products from trusted vendors
✓ Enjoy secure payments with Stripe
✓ Track your orders in real-time
✓ Leave reviews to help other shoppers
✓ Get exclusive deals and offers

Your account email: ${userEmail}

Start shopping: ${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/products

If you have any questions, our support team is always here to help!

Happy Shopping!
The MarketHub Team
    `,
  };
};

export const sendVendorApplicationEmail = (
  userName,
  approved,
  rejectionReason = ""
) => {
  if (approved) {
    return {
      subject: "✓ Your Vendor Application Has Been Approved!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #10b981; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 30px 20px; }
              .button { display: inline-block; padding: 12px 30px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 40px;">✓</h1>
                <h2 style="margin: 10px 0 0 0;">Application Approved!</h2>
              </div>
              <div class="content">
                <h2>Congratulations ${userName}!</h2>
                <p>Great news! Your vendor application has been approved. You can now start selling on MarketHub!</p>
                
                <h3>What's Next?</h3>
                <ul>
                  <li>Access your vendor dashboard</li>
                  <li>Add your first products</li>
                  <li>Start receiving orders</li>
                  <li>Track your sales and analytics</li>
                </ul>
                
                <center>
                  <a href="${
                    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                  }/vendor-dashboard" class="button">
                    Go to Vendor Dashboard
                  </a>
                </center>
                
                <p>We're excited to have you as part of our vendor community!</p>
                
                <p>If you have any questions, please don't hesitate to contact our support team.</p>
                
                <p>Best regards,<br>The MarketHub Team</p>
              </div>
              <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Congratulations ${userName}!

Great news! Your vendor application has been approved. You can now start selling on MarketHub!

What's Next?
- Access your vendor dashboard
- Add your first products
- Start receiving orders
- Track your sales and analytics

Go to your vendor dashboard: ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/vendor-dashboard

We're excited to have you as part of our vendor community!

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The MarketHub Team
      `,
    };
  } else {
    return {
      subject: "Update on Your Vendor Application",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #ef4444; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 30px 20px; }
              .reason-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 30px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">Vendor Application Update</h2>
              </div>
              <div class="content">
                <h2>Hello ${userName},</h2>
                <p>Thank you for your interest in becoming a vendor on MarketHub.</p>
                
                <p>After careful review, we regret to inform you that we are unable to approve your vendor application at this time.</p>
                
                <div class="reason-box">
                  <strong>Reason:</strong><br>
                  ${rejectionReason}
                </div>
                
                <p>We encourage you to address the concerns mentioned above and reapply in the future.</p>
                
                <p>If you have any questions about this decision, please contact our support team.</p>
                
                <center>
                  <a href="${
                    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                  }/vendor/apply" class="button">
                    Reapply
                  </a>
                </center>
                
                <p>Thank you for your understanding.</p>
                
                <p>Best regards,<br>The MarketHub Team</p>
              </div>
              <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Hello ${userName},

Thank you for your interest in becoming a vendor on MarketHub.

After careful review, we regret to inform you that we are unable to approve your vendor application at this time.

Reason:
${rejectionReason}

We encourage you to address the concerns mentioned above and reapply in the future.

If you have any questions about this decision, please contact our support team.

Thank you for your understanding.

Best regards,
The MarketHub Team
      `,
    };
  }
};
