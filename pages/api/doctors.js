import Doctor from "importableModels/Doctor";

export default async function handler(req, res) {
  const doctors = await Doctor.findAll();
  res.status(200).json({ doctors });
}
