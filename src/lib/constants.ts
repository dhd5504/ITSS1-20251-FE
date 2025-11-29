// Helper function to parse and format hours
export const formatHours = (
  hours: string
): { normal: string; weekend: string } => {
  try {
    // Try to parse as JSON format from API
    // Format: "{\"normal\": \"07:00\", \"weekend\": \"07:00\"} - {\"normal\": \"23:00\", \"weekend\": \"23:00\"}"
    const parts = hours.split("-");
    if (parts.length === 2) {
      const openHours = JSON.parse(parts[0]);
      const closeHours = JSON.parse(parts[1]);

      if (openHours.weekend === "closed" || closeHours.weekend === "closed") {
        return {
          normal: `${openHours.normal} - ${closeHours.normal}`,
          weekend: "休日",
        };
      }
      // Display normal hours (weekday hours)
      return {
        normal: `${openHours.normal} - ${closeHours.normal}`,
        weekend: `${openHours.weekend} - ${closeHours.weekend}`,
      };
    }
  } catch (error) {
    // If parsing fails, return original string (for mock data format like "09:00 - 22:00")
    return { normal: hours, weekend: hours };
  }
  return { normal: hours, weekend: hours };
};

export const formatPrice = (price: string): string => {
  try {
    const priceData = JSON.parse(price);
    if (priceData.isFree) return "無料";
    if (priceData.card_fee) return priceData.card_fee.replace("/year", "đ/年");
    if (priceData.ticket) return `切符: ${priceData.ticket}đ`;
    if (priceData.children && priceData.adult) {
      return `子供: ${priceData.children}đ - 大人: ${priceData.adult}đ`;
    }
    if (priceData.adult && priceData.student) {
      return `学生: ${priceData.student}đ - 大人: ${priceData.adult}đ`;
    }
    if (priceData.adult) return `大人: ${priceData.adult}đ`;
    return `${priceData.min} - ${priceData.max}đ`;
  } catch (error) {
    return price;
  }
};
