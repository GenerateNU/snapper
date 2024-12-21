# Technical Stack

*The relative versions for these can be found in their respective package.json*

- Expo
- React-Native
- Nativewind CSS
- Express
- MongoDB
- SupaBase

# Architecture

*The systematic design of Snapper*

- Snapper is a monorepo built entirely off TypeScript. The frontend directory utilizes reusable components that build the pages which are routed through `Expo Router`
- The backend houses a multitude of endpoints via a *REST API*.
- Environment variables are pertinent to getting Snapper properly setup, for local development they are loaded at runtime through our configuration files.

## Setting Up

Ensure that you have `Node` v20 or greater, as well as `npm` and `task`

*The backend relies on two essential APIs: `MongoDB` and `SupaBase`*

Authorization is handled via `Supabase`, you can setup and configure each one by creating your own Supabase account and linking the necessary API_KEYS to the .env file

Sign up or login here : https://supabase.com

```env
SUPABASE_PASSWORD=<insert>
SUPABASE_URL=<insert>
SUPABASE_KEY=<insert>
```

Our backend talks to a NoSQL database called MongoDB, and we utilize Mongoose to develop structured Schema for our collections. To get started, create a MongoDB Atlas account or spin up a docker container to create a local database

Sign up or login here : https://www.mongodb.com/atlas

```env
MONGO_URL=<insert>
MONGO_USERNAME=<insert>
MONGO_PASSWORD=<insert>
```

Another service we utilize is Amazon S3 as well as ImageKit for image optimization. Since Snapper is a highly visual application, we need to be smart about fetching images of the right size. To get started, we need to create a S3 Bucket and generate the public and secret keys.

Sign up or login here : https://aws.amazon.com/s3/

```env 
S3BUCKETNAME=<insert>
S3BUCKETREGION=<insert>
PUBLIC_KEY_AWS=<insert>
SECRET_KEY_AWS=<insert>
```

Optionally, we can also include ImageKit to wrap every single AWS S3 URL in a more performant and mobile friendly view.

Sign up or login here : https://imagekit.io

```env
IMAGE_KIT_ID=<insert>
```

Finally we set our environment variables to development and specify a port number

```env 
NODE_ENV=development
SERVER_PORT=3000
```

### Software Archiecture and Design Choices
The structure of Snapper is based off a MVC or Model View Controller architecture. The view is our frontend directory which talks to our backend REST API.

The backend is structured into 3 specific layers
- Handlers which expose our API to 3rd parties.
- Controllers which deal with business logic and transactions with the Model and Database. 
- Models which are our internal data interpretations for Fish, Users, and DiveLogs. 

