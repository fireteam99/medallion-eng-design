import validator from "validator";

import Doctor from "importableModels/Doctor";
import Form from "importableModels/Form";
import { fillNY, fillCA } from "utils/forms";

export default async function handler(req, res) {
  const { doctor: doctorId, form: formId } = req.query;

  try {
    // make sure the doctor exists
    if (!validator.isUUID(doctorId)) {
      res
        .status(400)
        .json({ error: `Doctor must be type UUIDV4: ${doctorId}` });
    }
    const doctor = await Doctor.findOne({ where: { id: doctorId } });
    if (doctor == null) {
      res
        .status(404)
        .json({ error: `Error, doctor not found with id: ${doctorId}` });
    }

    // make sure the form exists
    if (!validator.isUUID(formId)) {
      res.status(400).json({ error: `Form must be type UUIDV4: ${doctorId}` });
    }
    const form = await Form.findOne({ where: { id: formId } });
    if (doctor == null) {
      res
        .status(404)
        .json({ error: `Error, form not found with id: ${formId}` });
    }

    const pdfBytes = await getFilledForm(doctor, form);
    if (pdfBytes == null) {
      res.status(500).json({ error: `Form type unsupported: ${form.name}` });
    }

    const filename = encodeURIComponent("test.pdf");
    res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
    res.setHeader("Content-Type", "application/pdf");
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
}

async function getFilledForm(doctor, form) {
  switch (form.name) {
    case "NY State Licensing Application":
      return await fillNY(doctor, form);
    case "CA State Licensing Application":
      return await fillCA(doctor, form);
    default:
      return null;
  }
}
