import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transporter = env.smtp.host
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    })
  : null

// Never throws: a failed email must not break an order.
const send = async (to, subject, text) => {
  try {
    if (!transporter) {
      console.log(`[email not configured] To: ${to} | ${subject}\n${text}\n`)
      return
    }
    await transporter.sendMail({ from: env.smtp.from, to, subject, text })
  } catch (err) {
    console.error(`Email to ${to} failed: ${err.message}`)
  }
}

const trackUrl = (order) => `${env.clientUrl}/track?order=${encodeURIComponent(order.orderNumber)}`

export const sendOrderConfirmation = (order) =>
  send(
    order.email,
    `Order ${order.orderNumber} received`,
    [
      `Hi ${order.shipping.fullName},`,
      '',
      `Thank you for your order! Your order number is ${order.orderNumber}.`,
      `Total: ${order.total.toFixed(2)} ${order.currency}`,
      '',
      `Track it any time with your order number and this email address: ${trackUrl(order)}`,
      '',
      'Wones Baby',
    ].join('\n')
  )

export const sendPaymentReceived = (order) =>
  send(
    order.email,
    `Payment received for order ${order.orderNumber}`,
    `Hi ${order.shipping.fullName},\n\nWe've received your payment for order ${order.orderNumber}. We'll start preparing it now.\n\nTrack it: ${trackUrl(order)}\n\nWones Baby`
  )

export const sendStatusUpdate = (order, note) =>
  send(
    order.email,
    `Order ${order.orderNumber} is now ${order.status}`,
    [
      `Hi ${order.shipping.fullName},`,
      '',
      `Your order ${order.orderNumber} is now: ${order.status}.`,
      note ? `Note: ${note}` : '',
      order.trackingNumber ? `Tracking number: ${order.trackingNumber}` : '',
      '',
      `Track it: ${trackUrl(order)}`,
      '',
      'Wones Baby',
    ]
      .filter((line, i, arr) => line !== '' || arr[i - 1] !== '')
      .join('\n')
  )
