export function createWhatsappUrl({
  phone,
  productName,
  productUrl,
  price,
}: {
  phone: string
  productName: string
  productUrl: string
  price: string
}) {
  const message = `Olá! Tenho interesse neste produto:

${productName}
Preço: ${price}
Link: ${productUrl}`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}