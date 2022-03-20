import Form from "importableModels/Form";

export default async function handler(req, res) {
  const forms = await Form.findAll();
  res.status(200).json({ forms });
}
