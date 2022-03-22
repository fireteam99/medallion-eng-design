# medallion-eng-design

A simple web application to automatically fill out PDF forms [(more info)](https://github.com/fireteam99/medallion-eng-design/blob/main/Medallion_Engineering_Design_Problem.pdf). Demo hosted at: https://medallion-eng-design.herokuapp.com/.

## Getting Started

1. Clone and `cd` into the repository
2. Start up the database using docker `docker compose up db`
3. Install your dependencies `npm i`
4. Start up Next.js `npm run dev`
5. Navigate to `http://localhost:8080`

Note: you can also run `docker compose up` to run both Postgres and Next.js using Docker, but there are a couple issues with hot reloading using this method and as such is not reccomended for development.

## Architecture

### Client

A client side rendered app bootstraped using Next.js. Uses Chakra UI for styling.

### Server

Exposes a simple REST api using Next.js API routes. Uses Sequelize to connect and manage a Postgres database.

#### Endpoints

- `/doctors` - Fetches a list of all doctors.
- `/forms` - Fetches a list of all forms.
- `/doctors/{doctor_id}/forms/{form_id}` - Generates a prefilled form with data belonging to a specified doctor.

### Database

A Postgres database with Doctors and Forms tables. The unfilled PDFs are stored in a bucket using Supabase.

### Deployment
This project is deployed using Heroku for the app and Supabase for the database. I used Heroku over Vercel due to issues with getting Sequelize to play nice with serverless functions (more on that later).

## Further Considerations
This project was quickly hacked together within a couple hours. If I had additional time and/if this were to be a long term project, there are a few things I would change.
### Modularize Form Fields

To avoid having to write a different "fill script" for each specific form, we can generalize each form element into a JSON object. Examples of form elements would include Text Inputs, Checkboxes, and Dates. Each form database entry can contain a "formElements" field which stores a list of JSON form elements. To fill a particular form, the "fill script" inspects the `type` field to determine which action to take while the `sourceKey` field determines how the field relates to the doctor object.

#### Text Input
For text inputs, we can simply map each PDF form field to the value of our `sourceKey` field. In the example below, a field with the id `dhFormfield-123` is filled with the contents of a doctor's first name.

```json
{
  "type": "TEXT_INPUT",
  "formId": "dhFormfield-123",
  "sourceKey": "firstName"
}
```

```js
// formObj represents a form field object 
// doctor represents a doctor object
if (formObj.type === 'TEXT_INPUT') {
  const { formId, sourceKey } = formObj;
  const textField = pdfForm.getTextField(formId);
  textField.setText(doctor[sourceKey]);
}

```
#### Checkbox Group
For checkbox groups we can loop through the list of provided checkboxes and "check" the box if the `value` property equals the value of our `sourceKey`.

```json
{
  "type": "CHECKBOX_GROUP"
  "checkBoxes": [
    {
      "type": "CHECKBOX",
      "value": "male",
      "sourceKey": "gender"
      "formId": "dhFormfield-123"
    },
    {
      "type": "CHECKBOX",
      "value": "female",
      "sourceKey": "gender"
      "formId": "dhFormfield-456"
    }
  ]
}
```

```js
// formObj represents a form field object 
// doctor represents a doctor object
if (formObj.type === 'CHECKBOX_GROUP') {
  formObj.checkBoxes.map(checkBoxObj => {
    if (checkBoxObj.value === doctor[sourceKey]) {
      const { formId } = checkBoxObj;
      const checkBoxField = pdfForm.getCheckBox(formId);
      checkBoxField.check();
    }
  });
}
```

#### Date
Date fields are very similar to Text Inputs with an additional `format` field which contains a format string.
```json
{
  "type": "DATE",
  "formId": "dhFormfield-123",
  "format": "yyyy-mm-dd",
  "sourceKey": "birthday"
}
```
```js
// formObj represents a form field object 
// doctor represents a doctor object
if (formObj.type === 'DATE') {
  const { formId, sourceKey, format } = formObj;
  const textField = pdfForm.getTextField(formId);
  const date = DateTime.fromISO(doctor[sourceKey]);
  textField.setText(date.toFormat(format));
}
```


While this approach has the advantage of avoiding the need to write a "fill function" for each specific application, its feasibilty is directly correlated with the complexity of the forms being handled. For complicated forms wither interdependent form fields, writing a "fill function" might be more legible and easier to implement.

### Typescript

It would be helpful to take advantage of Typescript as the project grows in size.

### TypeORM
TBD

### noSQL vs SQL
TBD
### Dedicated Backend

Our app doesn't really make use of Next.js's main advantages. In particular, working with a Next.js backend has a couple drawbacks regarding issues with serverless functions.
