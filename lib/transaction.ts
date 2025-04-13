import Tesseract from "tesseract.js";

interface TesseractResult {
  data: { text: string };
}

export const extractTransactionId = async (
  imageFile: string
): Promise<string> => {
  try {
    const {
      data: { text },
    }: TesseractResult = await Tesseract.recognize(imageFile, "eng");
    console.log("Extracted Text:", text);

    const transactionIdPatterns = [
      // Handle OCR errors (1D instead of ID) and various label formats
      /(Wallet[\s-]?(?:Txn|Txm)[\s-]?(?:ID|1D)|Transaction[\s-]?ID|Txn[\s-]?ID)[:\s-]*(\d{10,15})/i,
      /(UPI[\s-]?(?:Ref|Reference)|Order[\s-]?ID)[:\s-]*(\d{10,15})/i,
      // Context-aware standalone numeric IDs
      /(?<!\bBalance\s|\bGroup\s|\b\,\s\d{4}\b)\b(\d{10,15})\b/,
    ];

    for (const pattern of transactionIdPatterns) {
      const match = text.match(pattern);
      if (match) {
        const id = match[2] || match[1];
        if (id.length >= 10 && !isDateComponent(id, text)) {
          return id;
        }
      }
    }

    return "Transaction ID not found";
  } catch (error) {
    console.error("Error:", error);
    return "Error extracting transaction ID";
  }
};

const isDateComponent = (id: string, fullText: string): boolean => {
  const datePattern = new RegExp(
    `\\b(?:${id}\\b.*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)|` +
      `(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).*\\b${id}\\b)`,
    "i"
  );
  return datePattern.test(fullText);
};
