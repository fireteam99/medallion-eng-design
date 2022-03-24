# medallion-eng-design

A simple web application to automatically fill out PDF forms [(more info)](https://github.com/fireteam99/medallion-eng-design/blob/main/Medallion_Engineering_Design_Problem.pdf). Demo hosted at: https://medallion-eng-design.herokuapp.com/.

## Getting Started

1. Clone and `cd` into the repository
2. Start up the database using docker `docker compose up db`
3. Install your dependencies `npm i`
4. Start up Next.js `npm run dev`
5. Navigate to `http://localhost:8080`

Note: you can also run `docker compose up` to run both Postgres and Next.js using Docker, but this can cause issues with hot reloading during development.

## Architecture

### Client

A client side rendered app bootstraped using [Next.js](https://nextjs.org/). Uses [Chakra UI](https://chakra-ui.com/) for styling.

### Server

Exposes a simple REST api using Next.js API routes. Uses Sequelize to connect and manage a Postgres database.

#### Endpoints

- `/doctors` - Fetches a list of all doctors.
- `/forms` - Fetches a list of all forms.
- `/doctors/{doctor_id}/forms/{form_id}` - Fills a form using a specified doctor's information.

### Database

A Postgres database with Doctors and Forms tables. The unfilled PDFs are stored in a bucket using Supabase.

### Deployment
This project is deployed using Heroku for the app and Supabase for the database. I used Heroku over Vercel due to issues getting Sequelize to play nice with serverless functions (more on that later). Alternatively, we can also build and publish our project as a Docker image and use GCP's Compute Engine or AWS ECS to deploy.

## Further Considerations
This project was hacked together within a couple hours. If I had the chance to do it again, there are a couple things I would change.
### Modularize Form Fields
To avoid having to write a different "fill script" (example: [fillCA.js](https://github.com/fireteam99/medallion-eng-design/blob/2fe65c44c49a7714a7eead6ddc53adea14c22b04/utils/forms/fillCA.js)) for each specific form, we can generalize each form element into a JSON object. Form elements would include Text Inputs, Checkboxes, and Dates. Each `form` database entry can contain a `formElements` field which stores a list of JSON form elements present in the PDF. Each form element would contain a `type` field which designates the type of element (e.g. Text Input), a `sourceKey` field which identifies the corresponding `doctor` field (e.g. `firstName`), and a `sourceKey` field which identifies the form element on the PDF to fill (e.g. `dhFormfield-123`).

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
      "sourceKey": "gender",
      "formId": "dhFormfield-123"
    },
    {
      "type": "CHECKBOX",
      "value": "female",
      "sourceKey": "gender",
      "formId": "dhFormfield-456"
    }
  ]
}
```

```js
// formObj represents a form field object 
// doctor represents a doctor object
if (formObj.type === 'CHECKBOX_GROUP') {
  formObj.checkBoxes.forEach(checkBoxObj => {
    const { value, sourceKey, formId } = checkBoxObj;
    if (value === doctor[sourceKey]) {
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

It would be helpful to take advantage of Typescript as the project grows in size. I went with Javascript for this demo to save time and to avoid any transpilation related issues.

### Sequelize vs TypeORM
Sequelize required several work arounds to play well with Next.js's API routes. It also seems to have poor support for Typescript. I originally chose to use Sequelize because I had prior experience - but in hind sight it probably would have been better to go with Typescript and TypeORM.

### noSQL vs SQL
Due to the non relational nature of the data we are handling for this demo, a noSQL database would have worked just as well as a SQL database. In fact, it might have been a better choice if we were to modularize the form fields - since each form field element is represented as a deeply nested JSON object.

### Next.js vs CRA + Dedicated Backend

I originally wanted to use Next.js as it effeciently bundles our forntend and backend into a single framework. Unfortunately, I encountered several issues with Next.js's API routes running on Vercel's serverless functions. Some dependencies such as `Sequelize`, `pg`, and `pg-hstore` seem to run into [module resolution issues](https://github.com/sequelize/sequelize/issues/7509#issuecomment-361032176) when running in a serverless environment. 

Another drawback is the lack of access to certain `fs` modules ([like no access to files](https://github.com/redwoodjs/redwood/issues/1664)) that would be availible in a traditional server environment. Server side rendering is a major advantage of Next.js but it doesn't really apply to our use case. 

Next.js's API routes also lack a centralized entry point i.e. `server.js` which makes certain things more difficult (such as setting up an database connection). While there are certainly advantages with Next.js, I would probably go with a dedicated backend using Express of Fastify in retrospect. 