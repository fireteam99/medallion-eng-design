# medallion-eng-design

A simple web application to automatically fill out PDF forms.

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
- `/doctors/{doctor_id}/forms/{form_id}` - Generates a pre-filled form with data belonging to a specified doctor.

### Database

A Postgres database with Doctors and Forms tables. The un-filled PDFs are stored in a bucket using Supabase.

## Further Improvements

### Modularize Form Fields

To avoid having to write a different "fill script" for every specific form, we can generalize each form element into a JSON object. Based on the sample doctor application forms provided, you could have Text Input, Check Box, and Date elements. The fill script simply has to iterate over a list of form elements for a particular for, and inspect the `type` field to determine how to interact with the pdf form element. This list of form elements can be stored in a JSON column under the reasons table.

#### Text Input

```
{
  type: "TEXT_INPUT",
  formId: "form-qwert",
  sourceValue: "firstName"
}
```

#### Check Box Group

{
type: "CHECKBOX_GROUP"
checkboxes: [
{
type: "CHECKBOX",
value: "male",
sourceValue: "gender"
formId: "form-asdf"
},
{
type: "CHECKBOX",
value: "female",
sourceValue: "gender"
formId: "form-zxcv"
}
]
}

#### Date

{
type: "DATE",
formId: "form-qwertyasdfzxcv",
format: "yyyy-mm-dd"
sourceValue: "birthday"
}

### Typescript

It would be helpful to take advantage of Typescript as the project grows in size.

### Dedicated Backend

Working with a Next.js backend has a couple drawbacks especially concerning the lack of file system access when running in serverless mode.
