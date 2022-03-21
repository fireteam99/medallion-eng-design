import { PDFDocument } from "pdf-lib";
import axios from "axios";
import { DateTime } from "luxon";

export default async function fillCA(doctor, form) {
  const { data: formPdfBytes } = await axios.get(form.url, {
    responseType: "arraybuffer",
  });

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const pdfForm = pdfDoc.getForm();

  const nameField = pdfForm.getTextField("dhFormfield-2749127007");
  const maleCheckBox = pdfForm.getCheckBox("dhFormfield-2749127702");
  const femaleCheckBox = pdfForm.getCheckBox("dhFormfield-2749127704");
  const birthdayField = pdfForm.getTextField("dhFormfield-2749127036");

  nameField.setText(`${doctor.firstName} ${doctor.lastName}`);
  doctor.gender === "male" && maleCheckBox.check();
  doctor.gender === "female" && femaleCheckBox.check();
  const birthday = DateTime.fromISO(doctor.birthday);
  birthdayField.setText(birthday.toFormat("yyyy-mm-dd"));

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
