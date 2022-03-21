import { PDFDocument } from "pdf-lib";
import axios from "axios";
import { DateTime } from "luxon";

export default async function fillNY(doctor, form) {
  const { data: formPdfBytes } = await axios.get(form.url, {
    responseType: "arraybuffer",
  });

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const pdfForm = pdfDoc.getForm();

  const firstNameField = pdfForm.getTextField("dhFormfield-2749128176");
  const lastNameField = pdfForm.getTextField("dhFormfield-2749128805");
  const genderField = pdfForm.getTextField("dhFormfield-2749128809");
  const birthdayField = pdfForm.getTextField("dhFormfield-2749129177");

  firstNameField.setText(doctor.firstName);
  lastNameField.setText(doctor.lastName);
  genderField.setText(doctor.gender);
  const birthday = DateTime.fromISO(doctor.birthday);
  birthdayField.setText(
    birthday.setLocale("en-US").toLocaleString(DateTime.DATE_SHORT)
  );

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
